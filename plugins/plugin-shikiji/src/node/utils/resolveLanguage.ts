const VUE_RE = /-vue$/

export function resolveLanguage(info: string): string {
  return info
    .match(/^([^ :[{]+)/)?.[1]
    ?.replace(VUE_RE, '')
    .toLowerCase() ?? ''
}
