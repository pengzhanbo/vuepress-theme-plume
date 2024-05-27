export function checkIsMobile(ua: string): boolean {
  return /\b(?:Android|iPhone)/i.test(ua)
}

export function checkIsSafari(ua: string): boolean {
  return /version\/[\w.]+ .*(?:mobile ?safari|safari)/i.test(ua)
}

export function checkIsiPad(ua: string): boolean {
  return [
    /\((ipad);[-\w),; ]+apple/i,
    /applecoremedia\/[\w.]+ \((ipad)/i,
    /\b(ipad)\d\d?,\d\d?[;\]].+ios/i,
  ].some(item => item.test(ua))
}
