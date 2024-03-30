import { ensureEndingSlash } from 'vuepress/shared'
import { withBase } from 'vuepress/client'
import type { PDFEmbedType, PDFTokenMeta } from '../../shared/pdf.js'
import { normalizeLink } from '../utils/link.js'
import { pluginOptions } from '../options.js'
import { checkIsMobile, checkIsSafari, checkIsiPad } from '../utils/is.js'

function queryStringify(options: PDFTokenMeta): string {
  const { page, noToolbar, zoom } = options
  const params = [
    `page=${page}`,
    `toolbar=${noToolbar ? 0 : 1}`,
    `zoom=${zoom}`,
  ]

  let queryString = params.join('&')
  if (queryString)
    queryString = `#${queryString}`

  return queryString
}

export function renderPDF(
  el: HTMLElement,
  url: string,
  embedType: PDFEmbedType,
  options: PDFTokenMeta,
): void {
  if (!pluginOptions.pdf)
    return
  url = normalizeLink(url)
  const pdfOptions = pluginOptions.pdf === true ? {} : pluginOptions.pdf
  const pdfjsUrl = pdfOptions.pdfjsUrl
    ? `${ensureEndingSlash(withBase(pdfOptions.pdfjsUrl))}web/viewer.html`
    : ''
  const queryString = queryStringify(options)

  const source = embedType === 'pdfjs'
    ? `${pdfjsUrl}?file=${encodeURIComponent(url)}${queryString}`
    : `${url}${queryString}`

  const tagName = embedType === 'pdfjs' || embedType === 'iframe'
    ? 'iframe'
    : 'embed'

  el.innerHTML = ''
  const pdf = document.createElement(tagName)

  pdf.className = 'pdf-viewer';
  (pdf as any).type = 'application/pdf'
  pdf.title = options.title || 'PDF Viewer'
  pdf.src = source

  if (pdf instanceof HTMLIFrameElement)
    pdf.allow = 'fullscreen'

  el.appendChild(pdf)
}

export function usePDF(
  el: HTMLElement,
  url: string,
  options: PDFTokenMeta,
): void {
  if (typeof window === 'undefined' || !window?.navigator?.userAgent)
    return

  const { navigator } = window
  const { userAgent } = navigator

  const isModernBrowser = typeof window.Promise === 'function'

  // Quick test for mobile devices.
  const isMobileDevice = checkIsiPad(userAgent) || checkIsMobile(userAgent)

  // Safari desktop requires special handling
  const isSafariDesktop = !isMobileDevice && checkIsSafari(userAgent)

  const isFirefoxWithPDFJS
    = !isMobileDevice
    && /firefox/iu.test(userAgent)
    && userAgent.split('rv:').length > 1
      ? Number.parseInt(userAgent.split('rv:')[1].split('.')[0], 10) > 18
      : false

  // Determines whether PDF support is available
  const supportsPDFs
    // As of Sept 2020 no mobile browsers properly support PDF embeds
    = !isMobileDevice
    // We're moving into the age of MIME-less browsers. They mostly all support PDF rendering without plugins.
    && (isModernBrowser
    // Modern versions of Firefox come bundled with PDFJS
    || isFirefoxWithPDFJS)

  if (!url)
    return

  if (supportsPDFs || !isMobileDevice) {
    const embedType = isSafariDesktop ? 'iframe' : 'embed'
    return renderPDF(el, url, embedType, options)
  }

  if (typeof pluginOptions.pdf === 'object' && pluginOptions.pdf.pdfjsUrl)
    return renderPDF(el, url, 'pdfjs', options)

  el.innerHTML = `<p>This browser does not support embedding PDFs. Please download the PDF to view it: <a href='${url}' target='_blank'>Download PDF</a></p>`
}
