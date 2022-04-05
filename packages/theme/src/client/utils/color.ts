export const colorList = [
  '#CC9999',
  '#FF9900',
  '#0099CC',
  '#FF6666',
  '#009966',
  '#CC0066',
  '#666699',
  '#99CC33',
  '#336699',
  '#33CC99',
  '#FF99CC',
  '#FF6666',
  '#CC6699',
]

let uuid = 0
export const getColor = (): string => {
  const len = colorList.length
  if (uuid > len - 1) {
    uuid = 0
  }
  return colorList[uuid++]
}
