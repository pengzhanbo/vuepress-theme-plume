export function resolveCanIUse(feature: string, mode: string, versions: string): string {
  if (!feature)
    return ''

  if (mode === 'image') {
    const link = 'https://caniuse.bitsofco.de/image/'
    const alt = `Data on support for the ${feature} feature across the major browsers from caniuse.com`
    return `<p><picture>
      <source type="image/webp" srcset="${link}${feature}.webp">
      <source type="image/png" srcset="${link}${feature}.png">
      <img src="${link}${feature}.jpg" alt="${alt}" width="100%">
    </picture></p>`
  }

  const periods = resolveVersions(versions)
  const accessible = 'false'
  const image = 'none'
  const url = 'https://caniuse.bitsofco.de/embed/index.html'
  const src = `${url}?feat=${feature}&periods=${periods}&accessible-colours=${accessible}&image-base=${image}`

  return `<div class="ciu_embed" style="margin:16px 0" data-feature="${feature}"><iframe src="${src}" frameborder="0" width="100%" height="400px" title="Can I use ${feature}"></iframe></div>`
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
