import type { RenderRule } from 'markdown-it/lib/renderer.mjs'

export interface ObsidianOptions {
  wikiLink?: boolean
  embedLink?: boolean
  comment?: boolean
  callout?: boolean | ObsidianCalloutOptions
}

export interface ObsidianCalloutOptions {
  locales?: Record<string, ObsidianLocaleData>
  openRender?: RenderRule
  closeRender?: RenderRule
  titleRender?: RenderRule
}

export interface ObsidianLocaleData {
  note?: string
  quote?: string
  cite?: string
  tip?: string
  hint?: string
  info?: string
  todo?: string
  success?: string
  check?: string
  done?: string
  warning?: string
  question?: string
  help?: string
  faq?: string
  caution?: string
  attention?: string
  failure?: string
  fail?: string
  missing?: string
  danger?: string
  error?: string
  bug?: string
  important?: string
  example?: string
  details?: string
  abstract?: string
  summary?: string
  tldr?: string
}
