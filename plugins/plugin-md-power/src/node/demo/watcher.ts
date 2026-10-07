import type { FSWatcher } from 'chokidar'
import type { App } from 'vuepress'
import fs from 'node:fs'
import path from 'node:path'
import { deleteKey, objectEntries, objectKeys } from '@pengzhanbo/utils'
import { watch } from 'chokidar'
import { logger } from '../utils/logger.js'
import { compileCode, parseEmbedCode } from './normal.js'
import { readFileSync } from './supports/file.js'

/**
 * Maximum time to wait for pending demo compilations, in milliseconds.
 * Once exceeded, the build continues instead of hanging forever.
 *
 * 等待挂起的 demo 编译完成的最长时间（毫秒）。超时后不再等待，避免构建被永久挂起。
 */
const WAIT_RENDER_TIMEOUT = 60_000

/**
 * 消除异步编译 demo 代码 与 markdown 同步 render 的时间差问题
 * 确保 在 vuepress onPrepared 阶段完成所有 demo 代码的编译与输出
 */
let renderDone: null | ((...args: any[]) => void) = null
let renderCount = 0
let renderPromise!: Promise<void>

export function createDemoRender(): void {
  renderPromise = new Promise((resolve) => {
    renderDone = resolve
  })
}

export async function waitDemoRender(): Promise<void> {
  if (renderCount === 0) {
    renderDone?.()
    renderDone = null
  }

  let timer: ReturnType<typeof setTimeout> | undefined
  // Last-resort guard: a stuck compilation must never hang the whole build.
  // 兜底保护：任何情况下都不允许卡住的编译让整个构建永久挂起。
  await Promise.race([
    renderPromise,
    new Promise<void>((resolve) => {
      timer = setTimeout(() => {
        logger.error(
          'demo-render',
          `Waiting for demo render timed out after ${WAIT_RENDER_TIMEOUT}ms, `
          + `${renderCount} demo(s) are still compiling. The build continues, but some demos may be incomplete.`,
        )
        resolve()
      }, WAIT_RENDER_TIMEOUT)
    }),
  ])
  clearTimeout(timer)
}

export function markDemoRender(): void {
  renderCount++
}

export function checkDemoRender(): void {
  if (renderCount > 0) {
    renderCount--
  }
  if (renderCount === 0) {
    renderDone?.()
    renderDone = null
  }
}

let watcher: FSWatcher | null = null
// path: runner
const tasks: Record<string, string> = {}
const target = 'md-power/demo/watcher.txt'

export function demoWatcher(app: App, watchers: any[]): void {
  // Listeners and the watcher wrapper are registered lazily and only once:
  // `onWatched` may be invoked more than once, and re-registering would handle the
  // same event repeatedly while leaking a wrapper object on every call.
  // 监听器与 watcher 包装对象只注册一次：`onWatched` 可能被多次调用，
  // 重复注册会导致同一事件被处理多次，并且每次调用都会泄漏一个包装对象。
  if (!watcher) {
    watcher = watch([], { ignoreInitial: true })

    watcher.on('change', (path) => {
      if (tasks[path]) {
        const code = readFileSync(path)
        if (code === false)
          return
        const source = parseEmbedCode(code)
        compileCode(source, tasks[path])
      }
    })

    watcher.on('unlink', (path) => {
      deleteKey(tasks, path)
      watcher?.unwatch(path)
    })

    watchers.push({
      close: () => {
        watcher?.close()
        watcher = null
      },
    })
  }

  watcher.add(objectKeys(tasks))

  const code = readFileSync(app.dir.temp(target))
  if (code) {
    let paths: Record<string, string> = {}
    try {
      paths = JSON.parse(code) as Record<string, string>
    }
    catch (error) {
      // 缓存文件损坏时不应中断构建，但必须可见，否则同步失效且无任何提示。
      // A corrupted cache file must not break the build, but it has to be visible,
      // otherwise the watcher silently stops tracking existing demos.
      logger.warn('demo-watcher', `Failed to parse ${target}, it has been ignored.`, error)
    }
    objectEntries(paths).forEach(([path, output]) => {
      watcher?.add(path)
      tasks[path] = output
    })
  }
  void updateWatchFiles(app)
}

export function addTask(app: App, path: string, output: string): void {
  if (tasks[path])
    return
  tasks[path] = output
  if (watcher) {
    watcher.add(path)
  }
  void updateWatchFiles(app)
}

async function updateWatchFiles(app: App) {
  // Called from synchronous markdown rendering paths that cannot await it, so the
  // error is handled here to avoid an unhandled rejection.
  // 该函数在无法 await 的同步 markdown 渲染路径中被调用，因此在此处处理错误，
  // 避免产生未处理的 rejection。
  try {
    await fs.promises.mkdir(app.dir.temp(path.dirname(target)), { recursive: true })
    await fs.promises.writeFile(app.dir.temp(target), JSON.stringify(tasks))
  }
  catch (error) {
    logger.warn('demo-watcher', `Failed to update ${target}.`, error)
  }
}
