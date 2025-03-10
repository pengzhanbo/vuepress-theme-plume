import type { FSWatcher } from 'chokidar'
import type { App } from 'vuepress'
import type { ThemeConfig, ThemeOptions } from '../../shared/index.js'
import process from 'node:process'
import { deepMerge } from '@pengzhanbo/utils'
import { watch } from 'chokidar'
import { initThemeOptions } from '../config/initThemeOptions.js'
import { perfLog, perfMark } from '../utils/index.js'
import { compiler } from './compiler.js'
import { findConfigPath } from './findConfigPath.js'

export interface InitConfigLoaderOptions {
  configFile?: string
  defaultConfig: ThemeOptions
  onChange?: ChangeEvent
}

export type ChangeEvent = (config: ThemeConfig) => void | Promise<void>

export interface Loader {
  configFile: string | undefined
  dependencies: string[]
  load: () => Promise<{ config: ThemeConfig, dependencies: string[] }>
  loaded: boolean
  changeEvents: ChangeEvent[]
  whenLoaded: ChangeEvent[]
  defaultConfig: ThemeOptions
  config: ThemeOptions
}

let loader: Loader | null = null

export async function initConfigLoader(
  app: App,
  { configFile, onChange, defaultConfig }: InitConfigLoaderOptions,
) {
  perfMark('load-config')
  loader = {
    configFile,
    dependencies: [],
    load: () => compiler(loader!.configFile),
    loaded: false,
    changeEvents: [],
    whenLoaded: [],
    defaultConfig,
    config: initThemeOptions(app, defaultConfig),
  }

  perfMark('load-config:find')
  loader.configFile = await findConfigPath(app, configFile)
  perfLog('load-config:find', app.env.isDebug)

  if (onChange) {
    loader.changeEvents.push(onChange)
  }

  perfMark('load-config:loaded')
  const { config, dependencies = [] } = await loader.load()
  perfLog('load-config:loaded', app.env.isDebug)

  loader.loaded = true
  loader.dependencies = [...dependencies]
  updateResolvedConfig(app, config)

  loader.whenLoaded.forEach(fn => fn(loader!.config))
  loader.whenLoaded = []

  perfLog('load-config', app.env.isDebug)
}

export function watchConfigFile(app: App, watchers: any[], onChange: ChangeEvent) {
  if (!loader || !loader.configFile)
    return

  const watcher = watch(loader.configFile, {
    ignoreInitial: true,
    cwd: process.cwd(),
  })

  addDependencies(watcher)

  onConfigChange(onChange)

  watcher.on('change', async () => {
    if (loader) {
      loader.loaded = false
      const { config, dependencies = [] } = await loader.load()
      loader.loaded = true
      addDependencies(watcher, dependencies)
      updateResolvedConfig(app, config)
      runChangeEvents()
    }
  })

  watcher.on('unlink', async () => {
    updateResolvedConfig(app)
    runChangeEvents()
  })

  watchers.push(watcher)
}

export async function onConfigChange(onChange: ChangeEvent) {
  if (loader && !loader.changeEvents.includes(onChange)) {
    loader.changeEvents.push(onChange)
    if (loader.loaded) {
      await onChange(loader.config)
    }
  }
}

export function waitForConfigLoaded() {
  return new Promise<ThemeOptions>((resolve) => {
    if (loader?.loaded) {
      resolve(loader.config)
    }
    else {
      loader?.whenLoaded.push(resolve)
    }
  })
}

export function getThemeConfig() {
  return loader!.config
}

function updateResolvedConfig(app: App, userConfig: ThemeConfig = {}) {
  if (loader) {
    const config = deepMerge({}, loader.defaultConfig, userConfig) as ThemeOptions
    loader.config = initThemeOptions(app, config)
  }
}

async function runChangeEvents() {
  if (loader) {
    await Promise.all(loader.changeEvents.map(fn => fn(loader!.config)))
  }
}

function addDependencies(watcher: FSWatcher, dependencies?: string[]) {
  if (!loader)
    return

  if (dependencies?.length) {
    const deps = dependencies
      .filter(dep => !loader!.dependencies.includes(dep) && dep[0] === '.')
    loader.dependencies.push(...deps)
    watcher.add(deps)
  }
  else {
    watcher.add(loader.dependencies)
  }
}
