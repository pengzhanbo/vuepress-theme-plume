export type Replacement = string | ((url: string) => string)

export interface ReplacementRule {
  find: RegExp | string
  replacement: Replacement
}

export interface ReplaceAssetsOptions {
  rules?: ReplacementRule | ReplacementRule[]
  all?: Replacement
  image?: Replacement
  media?: Replacement
}

export type ReplaceAssetsPluginOptions =
  | Replacement
  | ReplacementRule
  | ReplacementRule[]
  | ReplaceAssetsOptions
