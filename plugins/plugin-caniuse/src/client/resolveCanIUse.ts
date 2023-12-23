let isBind = false
export const resolveCanIUse = (): void => {
  if (isBind) return
  isBind = true

  window.addEventListener('message', (message) => {
    const data = message.data

    if (typeof data === 'string' && data.indexOf('ciu_embed') > -1) {
      const [, feature, height] = data.split(':')
      const el = document.querySelector(`.ciu_embed[data-feature="${feature}"]`)
      if (el) {
        const h = parseInt(height) + 30
        ;(el.childNodes[0] as any).height = h + 'px'
      }
    }
  })
}
