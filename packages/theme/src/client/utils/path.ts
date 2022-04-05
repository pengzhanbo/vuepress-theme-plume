export const normalizePath = (url: string): string => {
  return url.trim().replace(/\s+/g, '-')
}
