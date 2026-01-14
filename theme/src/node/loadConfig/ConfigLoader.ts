import type { FSWatcher } from 'chokidar'
import type { App } from 'vuepress'
import type { ThemeOptions } from '../../shared/index.js'
import EventEmitter from 'node:events'
import process from 'node:process'
import { deepMerge, difference } from '@pengzhanbo/utils'
import { watch } from 'chokidar'
import { colors } from 'vuepress/utils'
import { initThemeOptions } from '../config/index.js'
import { logger, normalizePath, perf } from '../utils/index.js'
import { compiler } from './compiler.js'
import { findConfigPath } from './findConfigPath.js'

export class ConfigLoader extends EventEmitter {
  app!: App

  private dependencies: string[] = []
  private loaded = false
  private configFile?: string
  private defaultConfig!: ThemeOptions

  config: ThemeOptions = {}

  async init(app: App, defaultConfig: ThemeOptions, configFile?: string): Promise<void> {
    this.removeAllListeners('change')

    this.app = app
    this.defaultConfig = defaultConfig

    this.config = initThemeOptions(app, defaultConfig)

    perf.mark('config-loader:find-config')
    this.configFile = await findConfigPath(app, configFile)
    perf.log('config-loader:find-config')

    perf.mark('config-loader:loaded')
    const dependencies = await this.load()
    this.dependencies = [...dependencies]
    perf.log('config-loader:loaded')

    this.emit('loaded', this.config)
    this.removeAllListeners('loaded')
  }

  watch(watchers: FSWatcher[]): void {
    if (!this.configFile)
      return

    const cwd = process.cwd()
    const watcher = watch([this.configFile, ...this.dependencies], {
      ignoreInitial: true,
      cwd,
      ignored: (filepath, stats) => {
        const isFile = Boolean(stats?.isFile())
        return isFile && filepath.includes('node_modules')
      },
    })

    watcher.on('change', async (filepath) => {
      const dependencies = await this.load()
      watcher.add(difference(dependencies, this.dependencies))
      this.dependencies = [...dependencies]
      this.emit('change', this.config)

      logger.info(`${colors.gray('theme config')} ${colors.magenta(normalizePath(filepath))} ${colors.gray('is modified.')}`)
    })

    watchers.push(watcher)
  }

  async waiting(): Promise<void> {
    if (this.loaded)
      return

    return new Promise<void>((resolve) => {
      this.once('loaded', resolve)
    })
  }

  private async load(): Promise<string[]> {
    this.loaded = false
    const { config, dependencies = [] } = await compiler(this.configFile)
    this.updateConfig(config)
    this.loaded = true
    return dependencies
  }

  private updateConfig(userConfig: ThemeOptions): void {
    const config = deepMerge({}, this.defaultConfig, userConfig) as ThemeOptions
    this.config = initThemeOptions(this.app, config)
  }
}

export const configLoader: ConfigLoader = new ConfigLoader()

export function getThemeConfig(): ThemeOptions {
  return configLoader.config
}
