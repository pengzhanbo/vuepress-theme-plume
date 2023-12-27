import type { CanIUseMode } from '../shared/index.js'

export function resolveCanIUse(feature: string, mode: CanIUseMode): string {
  if (!feature)
    return ''

  if (mode === 'image') {
    return `<picture>
      <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/${feature}.webp">
      <source type="image/png" srcset="https://caniuse.bitsofco.de/image/${feature}.png">
      <img src="https://caniuse.bitsofco.de/image/${feature}.jpg" alt="Data on support for the ${feature} feature across the major browsers from caniuse.com">
    </picture>`
  }

  const periods = 'future_2,future_1,current,past_1,past_2'
  const accessible = 'false'
  const image = 'none'
  const url = 'https://caniuse.bitsofco.de/embed/index.html'
  const src = `${url}?feat=${feature}&periods=${periods}&accessible-colours=${accessible}&image-base=${image}`

  return `<div class="ciu_embed" style="margin:16px 0" data-feature="${feature}"><iframe src="${src}" frameborder="0" width="100%" height="400px"></iframe></div>`
}
