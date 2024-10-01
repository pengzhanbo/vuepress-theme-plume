import type { FSWatcher } from 'chokidar'
import type { App } from 'vuepress'
import type { AutoFrontmatter, PlumeThemeEncrypt, PlumeThemeLocaleOptions, ThemeConfig } from '../../shared/index.js'
import { deepMerge } from '@pengzhanbo/utils'
import { watch } from 'chokidar'
import { path } from 'vuepress/utils'
import { resolveLocaleOptions } from '../config/resolveLocaleOptions.js'
import { logger } from '../utils/index.js'
import { compiler } from './compiler.js'
import { findConfigPath } from './findConfigPath.js'

export interface ResolvedConfig {
  localeOptions: PlumeThemeLocaleOptions
  encrypt?: PlumeThemeEncrypt
  autoFrontmatter?: false | Omit<AutoFrontmatter, 'frontmatter'>
}

export interface InitConfigLoaderOptions {
  configFile?: string
  onChange?: ChangeEvent
}

export type ChangeEvent = (config: ResolvedConfig) => void | Promise<void>

export interface Loader {
  configFile: string | undefined
  dependencies: string[]
  load: () => Promise<{ config: ThemeConfig, dependencies: string[] }>
  loaded: boolean
  changeEvents: ChangeEvent[]
  whenLoaded: ChangeEvent[]
  defaultConfig: ThemeConfig
  resolvedConfig: ResolvedConfig
}

let loader: Loader | null = null

export async function initConfigLoader(
  app: App,
  defaultConfig: ThemeConfig,
  { configFile, onChange }: InitConfigLoaderOptions = {},
) {
  const start = performance.now()
  const { encrypt, autoFrontmatter, ...localeOptions } = defaultConfig
  loader = {
    configFile,
    dependencies: [],
    load: () => compiler(loader!.configFile),
    loaded: false,
    changeEvents: [],
    whenLoaded: [],
    defaultConfig,
    resolvedConfig: {
      localeOptions: resolveLocaleOptions(app, localeOptions),
      encrypt,
      autoFrontmatter,
    },
  }

  const findStart = performance.now()
  loader.configFile = await findConfigPath(app, configFile)
  if (app.env.isDebug) {
    logger.info(`Find config path: ${(performance.now() - findStart).toFixed(2)}ms`)
  }

  if (onChange) {
    loader.changeEvents.push(onChange)
  }

  const loadStart = performance.now()
  const { config, dependencies = [] } = await loader.load()
  if (app.env.isDebug) {
    logger.info(`theme config call load: ${(performance.now() - loadStart).toFixed(2)}ms`)
  }
  loader.loaded = true
  loader.dependencies = [...dependencies]
  updateResolvedConfig(app, config)

  loader.whenLoaded.forEach(fn => fn(loader!.resolvedConfig))
  loader.whenLoaded = []

  if (app.env.isDebug) {
    logger.info(`Load config: ${(performance.now() - start).toFixed(2)}ms`)
  }
}

export function watchConfigFile(app: App, watchers: any[], onChange: ChangeEvent) {
  if (!loader || !loader.configFile)
    return

  const watcher = watch(loader.configFile, {
    ignoreInitial: true,
    cwd: path.join(path.dirname(loader.configFile), '../'),
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
      await onChange(loader.resolvedConfig)
    }
  }
}

export function waitForConfigLoaded() {
  return new Promise<ResolvedConfig>((resolve) => {
    if (loader?.loaded) {
      resolve(loader.resolvedConfig)
    }
    else {
      loader?.whenLoaded.push(resolve)
    }
  })
}

export function getThemeConfig() {
  return loader!.resolvedConfig
}

export function isConfigLoaded() {
  return loader?.loaded ?? false
}

function updateResolvedConfig(app: App, userConfig: ThemeConfig = {}) {
  if (loader) {
    const { encrypt, autoFrontmatter, ...localeOptions } = deepMerge({}, loader.defaultConfig, userConfig)
    loader.resolvedConfig = {
      localeOptions: resolveLocaleOptions(app, localeOptions),
      encrypt,
      autoFrontmatter,
    }
  }
}

async function runChangeEvents() {
  if (loader) {
    await Promise.all(loader.changeEvents.map(fn => fn(loader!.resolvedConfig)))
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
