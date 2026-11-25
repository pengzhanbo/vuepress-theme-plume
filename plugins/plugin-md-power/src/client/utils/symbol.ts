const VUEPRESS_SYMBOL_KEY = '__VUEPRESS_GLOBAL_SYMBOL_MAP__'

export function createSymbol(name: string): symbol {
  // 开发环境下，全局缓存 symbol，避免重复创建
  if (__VUEPRESS_DEV__) {
    const globalSymbolMap = (globalThis[VUEPRESS_SYMBOL_KEY] ??= {}) as Record<string, symbol>
    globalSymbolMap[name] ??= Symbol(name)
    return globalSymbolMap[name]
  }

  return Symbol('')
}
