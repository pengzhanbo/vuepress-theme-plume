const colorList = [
  'var(--vp-c-brand-1)',
  'var(--vp-c-brand-2)',
  'var(--vp-c-green-1)',
  'var(--vp-c-green-2)',
  'var(--vp-c-green-3)',
  'var(--vp-c-yellow-1)',
  'var(--vp-c-yellow-2)',
  'var(--vp-c-yellow-3)',
  'var(--vp-c-red-1)',
  'var(--vp-c-red-2)',
  'var(--vp-c-red-3)',
]

export function getRandomColor() {
  return colorList[Math.floor(Math.random() * colorList.length)]
}
