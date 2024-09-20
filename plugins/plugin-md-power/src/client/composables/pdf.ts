/**
 * Fork for https://github.com/vuepress-theme-hope/vuepress-theme-hope/blob/main/packages/components/src/client/utils/viewPDF.ts
 *
 * The MIT License (MIT)
 * Copyright (C) 2021 - PRESENT by Mr.Hope<mister-hope@outlook.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import type { PDFEmbedType, PDFTokenMeta } from '../../shared/index.js'
import { withBase } from 'vuepress/client'
import { ensureEndingSlash, isLinkHttp } from 'vuepress/shared'
import { pluginOptions } from '../options.js'
import { checkIsiPad, checkIsMobile, checkIsSafari } from '../utils/is.js'

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
  url = isLinkHttp(url)
    ? url
    : new URL(withBase(url), typeof location !== 'undefined' ? location.href : '').toString()

  const pdfOptions = pluginOptions.pdf === true ? {} : pluginOptions.pdf
  pdfOptions.pdfjsUrl ??= 'https://static.pengzhanbo.cn/pdfjs/'
  const pdfjsUrl = `${ensureEndingSlash(withBase(pdfOptions.pdfjsUrl))}web/viewer.html`

  const queryString = queryStringify(options)

  const source = embedType === 'pdfjs'
    ? `${pdfjsUrl}?file=${url}${queryString}`
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

  return renderPDF(el, url, 'pdfjs', options)
}
