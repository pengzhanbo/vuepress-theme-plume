import type { MDPowerLocaleData } from '../src/shared/index.js'
import { describe, expect, it } from 'vitest'
import { findLocales } from '../src/node/utils/findLocales.js'

describe('findLocales', () => {
  interface TestLocaleData extends MDPowerLocaleData {
    hint?: string
    label?: string
  }

  it('should find locales for a key', () => {
    const locales = {
      '/': { hint: 'Hint', label: 'Label' },
      '/zh/': { hint: '提示', label: '标签' },
    }

    expect(findLocales<TestLocaleData, 'hint'>(locales, 'hint')).toEqual({
      '/': 'Hint',
      '/zh/': '提示',
    })
  })

  it('should return empty object for missing key', () => {
    const locales = {
      '/': { hint: 'Hint' },
      '/zh/': { hint: '提示' },
    }

    expect(findLocales<TestLocaleData, 'label'>(locales, 'label')).toEqual({
      '/': {},
      '/zh/': {},
    })
  })

  it('should handle empty locales', () => {
    expect(findLocales({}, 'hint' as any)).toEqual({})
  })

  it('should handle partial locale data', () => {
    const locales = {
      '/': { hint: 'Hint', label: 'Label' },
      '/zh/': { hint: '提示' },
      '/en/': {},
    }

    expect(findLocales<TestLocaleData, 'label'>(locales, 'label')).toEqual({
      '/': 'Label',
      '/zh/': {},
      '/en/': {},
    })
  })

  it('should handle nested locale paths', () => {
    const locales = {
      '/': { hint: 'Root' },
      '/zh/': { hint: 'Chinese' },
      '/zh-tw/': { hint: 'Traditional Chinese' },
      '/en-US/': { hint: 'US English' },
    }

    expect(findLocales<TestLocaleData, 'hint'>(locales, 'hint')).toEqual({
      '/': 'Root',
      '/zh/': 'Chinese',
      '/zh-tw/': 'Traditional Chinese',
      '/en-US/': 'US English',
    })
  })
})
