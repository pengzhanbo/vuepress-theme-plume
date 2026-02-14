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
  page?: number
  /**
   * Whether to hide toolbar
   *
   * 是否隐藏工具栏
   */
  noToolbar?: boolean
  /**
   * Zoom level
   *
   * 缩放级别
   */
  zoom?: number
  /**
   * PDF source URL
   *
   * PDF 源 URL
   */
  src?: string
  /**
   * Title of the PDF
   *
   * PDF 标题
   */
  title?: string
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
