import type { FSWatcher } from 'chokidar'
import type { App } from 'vuepress'
import fs from 'node:fs'
import path from 'node:path'
import { watch } from 'chokidar'
import { compileCode, parseEmbedCode } from './normal.js'
import { readFileSync } from './supports/file.js'

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
  await renderPromise
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
  if (!watcher) {
    watcher = watch([], { ignoreInitial: true })
  }

  Object.keys(tasks).forEach((path) => {
    watcher!.add(path)
  })

  const code = readFileSync(app.dir.temp(target))
  if (code) {
    const paths = JSON.parse(code || '{}') as Record<string, string>
    Object.entries(paths).forEach(([path, output]) => {
      watcher!.add(path)
      tasks[path] = output
    })
  }
  updateWatchFiles(app)

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
    delete tasks[path]
    watcher!.unwatch(path)
  })

  watchers.push({
    close: () => {
      watcher!.close()
      watcher = null
    },
  })
}

export function addTask(app: App, path: string, output: string): void {
  if (tasks[path])
    return
  tasks[path] = output
  if (watcher) {
    watcher.add(path)
  }
  updateWatchFiles(app)
}

async function updateWatchFiles(app: App) {
  await fs.promises.mkdir(app.dir.temp(path.dirname(target)), { recursive: true })
  await fs.promises.writeFile(app.dir.temp(target), JSON.stringify(tasks))
}
