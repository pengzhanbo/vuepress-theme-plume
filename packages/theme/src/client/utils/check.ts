export const hasOwn = (val: object, key: string): key is never => {
  return Object.prototype.hasOwnProperty.call(val, key)
}
