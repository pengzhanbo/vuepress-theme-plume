import type { CanIUseMode } from '../shared/index.js'

export function resolveCanIUse(feature: string, mode: CanIUseMode, versions: string): string {
  if (!feature)
    return ''

  if (mode === 'image') {
    return `<picture>
      <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/${feature}.webp">
      <source type="image/png" srcset="https://caniuse.bitsofco.de/image/${feature}.png">
      <img src="https://caniuse.bitsofco.de/image/${feature}.jpg" alt="Data on support for the ${feature} feature across the major browsers from caniuse.com">
    </picture>`
  }

  const periods = resolveVersions(versions)
  const accessible = 'false'
  const image = 'none'
  const url = 'https://caniuse.bitsofco.de/embed/index.html'
  const src = `${url}?feat=${feature}&periods=${periods}&accessible-colours=${accessible}&image-base=${image}`

  return `<div class="ciu_embed" style="margin:16px 0" data-feature="${feature}"><iframe src="${src}" frameborder="0" width="100%" height="400px"></iframe></div>`
}

function resolveVersions(versions: string): string {
  if (!versions)
    return 'future_1,current,past_1,past_2'

  const list = versions
    .split(',')
    .map(v => Number(v.trim()))
    .filter(v => !Number.isNaN(v) && v >= -5 && v <= 3)

  list.push(0)

  const uniq = [...new Set(list)].sort((a, b) => b - a)
  const result: string[] = []
  uniq.forEach((v) => {
    if (v < 0)
      result.push(`past_${Math.abs(v)}`)
    if (v === 0)
      result.push('current')
    if (v > 0)
      result.push(`future_${v}`)
  })
  return result.join(',')
}
