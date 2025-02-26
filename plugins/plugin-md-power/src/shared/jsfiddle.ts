import type { SizeOptions } from './size'

export interface JSFiddleTokenMeta extends SizeOptions {
  source: string
  title?: string
  theme?: string
  tab?: string
}
