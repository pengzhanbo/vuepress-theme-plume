import type { CanIUseOptions } from './caniuse.js'
import type { PDFOptions } from './pdf.js'
import type { IconsOptions } from './icons.js'

export interface MarkdownPowerPluginOptions {
  caniuse?: boolean | CanIUseOptions
  pdf?: boolean | PDFOptions
  icons?: boolean | IconsOptions
  bilibili?: boolean
  youtube?: boolean
}
