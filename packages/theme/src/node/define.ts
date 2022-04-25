import type { UserConfig } from '@vuepress/cli'
import type { BundlerConfig } from '@vuepress/core'
import type {
  PlumeThemeNotesConfigItem,
  PlumeThemeNotesOptions,
  PlumeThemeOptions,
} from '../shared'

type DefinePlumeConfig = UserConfig<PlumeThemeOptions, BundlerConfig>

export const definePlumeConfig = (
  config: DefinePlumeConfig
): DefinePlumeConfig => config

export const definePlumeNotesConfig = (
  notes: PlumeThemeNotesOptions
): PlumeThemeNotesOptions => notes

export const definePlumeNotesItemConfig = (
  item: PlumeThemeNotesConfigItem
): PlumeThemeNotesConfigItem => item
