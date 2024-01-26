import type { App } from 'vuepress/core'
import { path } from 'vuepress/utils'
import * as chokidar from 'chokidar'
import esbuild from 'esbuild'
import type { NetlifyFunctionsPluginOptions } from '../../shared/index.js'
import { readFileList } from '../utils/index.js'

export async function generateFunctions(app: App, options: NetlifyFunctionsPluginOptions): Promise<void> {
  const { directory } = options
  const { source, dest } = directory
  const userSource = source[0]
  const files = readFileList(userSource)

  if (files.length > 0) {
    await esbuild.build({
      entryPoints: files,
      outbase: userSource,
      outdir: dest,
      platform: 'node',
      format: 'cjs',
    })
  }
}

export async function initialFunctions(app: App, options: NetlifyFunctionsPluginOptions): Promise<void> {
  if (!app.env.isDev)
    return
  const { directory } = options
  const { source, temp } = directory
  const userSource = source[0]
  const files = readFileList(userSource)

  if (files.length > 0) {
    await esbuild.build({
      entryPoints: files,
      outbase: userSource,
      outdir: temp,
      platform: 'node',
      format: 'cjs',
    })
  }
  watchFunctions(app, options)
}

export function watchFunctions(app: App, { directory }: NetlifyFunctionsPluginOptions): void {
  const { source, temp } = directory
  const userSource = source[0]
  const watcher = chokidar.watch('**/*.ts', {
    cwd: userSource,
    ignoreInitial: true,
  })

  watcher.on('add', async (file: string) => {
    await esbuild.build({
      entryPoints: [path.join(userSource, file)],
      outbase: userSource,
      outdir: temp,
      platform: 'node',
      format: 'cjs',
    })
  })

  watcher.on('change', async (file: string) => {
    await esbuild.build({
      entryPoints: [path.join(userSource, file)],
      outbase: userSource,
      outdir: temp,
      platform: 'node',
      format: 'cjs',
    })
  })
}
