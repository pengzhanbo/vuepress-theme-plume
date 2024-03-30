import type { CanIUseOptions } from './caniuse.js'
import type { PDFOptions } from './pdf.js'
import type { IconsOptions } from './icons.js'

export interface MarkdownPowerPluginOptions {
  pdf?: boolean | PDFOptions

  // new syntax
  icons?: boolean | IconsOptions

  // video embed
  bilibili?: boolean
  youtube?: boolean

  // code embed
  codepen?: boolean
  replit?: boolean

  caniuse?: boolean | CanIUseOptions
}
