import type { CanIUseMode } from '../shared/index.js'
export const resolveCanIUse = (feature: string, mode: CanIUseMode): string => {
  const before =
    mode === 'embed'
      ? `<p class="ciu_embed" data-feature="${feature}" data-periods="future_2,future_1,current,past_1,past_2" data-accessible-colours="false">`
      : ''
  const after = mode === 'embed' ? '</p>' : ''
  return `
${before}
  <picture>
    <source type="image/webp" srcset="https://caniuse.bitsofco.de/image/${feature}.webp">
    <source type="image/png" srcset="https://caniuse.bitsofco.de/image/${feature}.png">
    <img src="https://caniuse.bitsofco.de/image/${feature}.jpg" alt="Data on support for the ${feature} feature across the major browsers from caniuse.com">
  </picture>
${after}
    `
}
