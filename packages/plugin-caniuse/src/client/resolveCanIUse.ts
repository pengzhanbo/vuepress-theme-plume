export const resolveCanIUse = (): void => {
  const canIUseEls = document.getElementsByClassName('ciu_embed')
  for (let t = 0; t < canIUseEls.length; t++) {
    const el = canIUseEls[t]
    const feature = el.getAttribute('data-feature')
    const periods = el.getAttribute('data-periods')
    const accessible = el.getAttribute('data-accessible-colours') || 'false'
    const image = el.getAttribute('data-image-base') || 'none'
    if (feature) {
      const url = 'https://caniuse.bitsofco.de/embed/index.html'
      const d = `<iframe src="${url}?feat=${feature}&periods=${periods}&accessible-colours=${accessible}&image-base=${image}" frameborder="0" width="100%" height="400px"></iframe>`
      el.innerHTML = d
    } else
      el.innerHTML =
        "A feature was not included. Go to <a href='https://caniuse.bitsofco.de/#how-to-use'>https://caniuse.bitsofco.de/#how-to-use</a> to generate an embed."
  }
  window.addEventListener('message', (message) => {
    const data = message.data
    if (typeof data === 'string' && data.indexOf('ciu_embed') > -1) {
      const [, feature, height] = data.split(':')
      for (let i = 0; i < canIUseEls.length; i++) {
        const el = canIUseEls[i]
        if (el.getAttribute('data-feature') === feature) {
          const h = parseInt(height) + 30
          ;(el.childNodes[0] as any).height = h + 'px'
          break
        }
      }
    }
  })
}
