import type { UserConfig } from '@vuepress/cli'
import type { BundlerConfig } from '@vuepress/core'
import type {
  PlumeThemeNotesItem,
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
  item: PlumeThemeNotesItem
): PlumeThemeNotesItem => item
