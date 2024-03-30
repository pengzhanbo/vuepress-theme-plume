import type { SizeOptions } from './size'

export type PDFEmbedType = 'iframe' | 'embed' | 'pdfjs'

export interface PDFTokenMeta extends SizeOptions {
  page?: number
  noToolbar?: boolean
  zoom?: number
  src?: string
  title?: string
}

export interface PDFOptions {
  /**
   * pdfjs url
   */
  pdfjsUrl?: string
}
