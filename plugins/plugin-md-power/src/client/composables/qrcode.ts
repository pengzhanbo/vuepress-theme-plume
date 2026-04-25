import type { Prettify } from '@pengzhanbo/utils'
import type { QRCodeByteSegment, QRCodeErrorCorrectionLevel, QRCodeRenderersOptions, QRCodeToDataURLOptions, QRCodeToStringOptions } from 'qrcode'

export interface GenerateQRCodeConfig {
  text: string
  logo?: string
  logoSize?: string
}

interface QRCodeInstance {
  toCanvas: (str: string | QRCodeByteSegment[], options: QRCodeRenderersOptions) => Promise<HTMLCanvasElement>
  toPNG: (str: string | QRCodeByteSegment[], options: QRCodeToDataURLOptions) => Promise<string>
}

let qr: QRCodeInstance | null = null

async function initQRCodeInstance() {
  if (qr)
    return qr

  const qrcode = (await import(/* webpackChunkName: "qrcode" */ 'qrcode')).default
  qr = {
    toCanvas: (text: string | QRCodeByteSegment[], options: QRCodeRenderersOptions) => {
      return new Promise((resolve, reject) =>
        qrcode.toCanvas(text, options, (error, canvas) => error ? reject(error) : resolve(canvas)),
      )
    },
    toPNG: (text, options) => qrcode.toDataURL(text, { type: 'image/png', ...options }),
  }
  return qr
}

export async function generateQRCode(
  { text, logo, logoSize = '0.2' }: GenerateQRCodeConfig,
  options: Prettify<QRCodeToDataURLOptions & QRCodeToStringOptions & QRCodeRenderersOptions>,
): Promise<string> {
  const { toCanvas, toPNG } = await initQRCodeInstance()
  const segments: QRCodeByteSegment[] = [{ data: new TextEncoder().encode(text), mode: 'byte' }]

  const qrWidth = options.width!
  if (logo) {
    // 有 logo 时，需要设置 errorCorrectionLevel 为 H
    // 因为 logo 会占用二维码的一部分空间，导致二维码的纠错能力下降
    // 所以需要增加纠错能力
    const level = options.errorCorrectionLevel ?? 'H'
    options.errorCorrectionLevel = (level.length === 1 ? level.toUpperCase() : `${level[0].toUpperCase()}${level[1].toLowerCase()}`) as unknown as QRCodeErrorCorrectionLevel
    const logoImg = await loadImage(logo)
    const actualWith = Number.parseFloat(logoSize) * qrWidth
    const actualHeight = actualWith / logoImg.width * logoImg.height
    const dx = (qrWidth - actualWith) / 2
    const dy = (qrWidth - actualHeight) / 2
    const canvas = await toCanvas(segments, options)
    const ctx = canvas.getContext('2d')!
    // 绘制 logo 背景
    ctx.fillStyle = options.color?.light || '#fff'
    ctx.roundRect(dx, dy, actualWith, actualHeight, actualWith / 20)
    ctx.fill()
    // 绘制 logo 图片
    ctx.drawImage(logoImg, dx, dy, actualWith, actualHeight)
    return canvas.toDataURL()
  }
  const level = options.errorCorrectionLevel ?? 'M'
  options.errorCorrectionLevel = (level.length === 1 ? level.toUpperCase() : `${level[0].toUpperCase()}${level[1].toLowerCase()}`) as unknown as QRCodeErrorCorrectionLevel
  return await toPNG(segments, options)
}

export async function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image'))
  })
}

export async function attemptLoadLogo(text: string, logo: string | undefined, isInternalLink: boolean): Promise<string> {
  if (logo)
    return logo
  if (isInternalLink)
    return (document.querySelector('link[rel="icon"]') as HTMLLinkElement)?.href
  return ''
}
