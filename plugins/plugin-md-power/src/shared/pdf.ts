import type { SizeOptions } from './size'

/**
 * PDF embed type
 *
 * PDF 嵌入类型
 */
export type PDFEmbedType = 'iframe' | 'embed' | 'pdfjs'

/**
 * PDF token metadata
 *
 * PDF 令牌元数据
 */
export interface PDFTokenMeta extends SizeOptions {
  /**
   * Page number to display
   *
   * 要显示的页码
   */
  page?: number | string
  /**
   * PDF source URL
   *
   * PDF 源 URL
   */
  src?: string
}

/**
 * PDF options
 *
 * PDF 配置选项
 */
export interface PDFOptions {
  /**
   * PDF.js library URL
   *
   * PDF.js 库 URL
   */
  pdfjsUrl?: string
}
