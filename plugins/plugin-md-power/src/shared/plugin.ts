import type { CanIUseOptions } from './caniuse.js'
import type { PDFOptions } from './pdf.js'
import type { IconsOptions } from './icons.js'

export interface MarkdownPowerPluginOptions {

  pdf?: boolean | PDFOptions
  icons?: boolean | IconsOptions

  // video
  bilibili?: boolean
  youtube?: boolean

  // code
  codepen?: boolean

  caniuse?: boolean | CanIUseOptions
}
