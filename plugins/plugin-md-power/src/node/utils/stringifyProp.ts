// Single quote will break @vue/compiler-sfc
export function stringifyProp(data: unknown): string {
  return JSON.stringify(data).replace(/'/g, '&#39')
}
