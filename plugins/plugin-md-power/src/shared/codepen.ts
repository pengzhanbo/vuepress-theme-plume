import type { SizeOptions } from './size'

export interface CodepenTokenMeta extends SizeOptions {
  title?: string
  user?: string
  slash?: string
  tab?: string
  theme?: string
  preview?: boolean
  editable?: boolean
}
