export const upperCase = (str: string): string => {
  return str.split(/-|\s+/).filter(Boolean).map((s: string) => {
    return s[0].toUpperCase() + s.slice(1)
  }).join('')
}

export const lowerCase = (str: string): string => {
  str = upperCase(str)
  return str[0].toLowerCase() + str.slice(1)
}

export const packageName = (name: string): string => {
  return 'plugin-' + name.trim().split(/-|\s+/).filter(Boolean).join('-')
}
