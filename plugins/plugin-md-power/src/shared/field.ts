import type { LocaleData } from 'vuepress'

export interface FieldLocaleData extends LocaleData {
  required?: string
  optional?: string
  deprecated?: string
  experimental?: string
  default?: string
  enum?: string
  format?: string
  unit?: string
  constraint?: string
  since?: string
}
