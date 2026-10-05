import { describe, expect, it } from 'vitest'
import { locales } from '../src/locales/index.js'
import { setLang, t } from '../src/translate.js'

describe('translate', () => {
  it('should translate with english by default', () => {
    expect(setLang('en-US')).toBe('en-US')
    expect(t('question.site.name')).toBe(locales['en-US']['question.site.name'])
  })

  it('should translate after switching the language', () => {
    expect(setLang('zh-CN')).toBe('zh-CN')
    expect(t('question.site.name')).toBe(locales['zh-CN']['question.site.name'])

    // 恢复默认语言，避免影响其它用例。
    setLang('en-US')
    expect(t('question.root')).toBe(locales['en-US']['question.root'])
  })
})
