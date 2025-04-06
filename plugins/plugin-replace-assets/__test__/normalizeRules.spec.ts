import { describe, expect, it, vi } from 'vitest'
import { KNOWN_ASSET_EXTENSIONS, KNOWN_IMAGE_EXTENSIONS, KNOWN_MEDIA_EXTENSIONS } from '../src/constants.js'
import { createFindPattern, normalizeRules } from '../src/normalizeRules.js'

describe('plugin-replace-assets > normalizeRules', () => {
  it('should work with empty options', () => {
    expect(normalizeRules('')).toEqual([])
    expect(normalizeRules([])).toEqual([])
    expect(normalizeRules({})).toEqual([])
    expect(normalizeRules({ rules: [] })).toEqual([])
  })

  it('should work with string', () => {
    const rules = normalizeRules('https://example.com/assets/')

    expect(rules).toEqual([{
      find: createFindPattern(KNOWN_ASSET_EXTENSIONS),
      replacement: 'https://example.com/assets/',
    }])
  })

  it('should work with function', () => {
    const replacement = vi.fn((url: string) => `https://example.com/assets/${url}`)
    const rules = normalizeRules(replacement)

    expect(rules).toEqual([{
      find: createFindPattern(KNOWN_ASSET_EXTENSIONS),
      replacement,
    }])
  })

  it('should work with single rule', () => {
    const rules = normalizeRules({
      find: '^/images/.*\.(jpe?g|png|gif|svg)$',
      replacement: 'https://example.com/images/',
    })

    expect(rules).toEqual([{
      find: '^/images/.*\.(jpe?g|png|gif|svg)$',
      replacement: 'https://example.com/images/',
    }])
  })

  it('should work with multiple rules', () => {
    const rules = normalizeRules([
      {
        find: '^/images/.*\.(jpe?g|png|gif|svg)$',
        replacement: 'https://example.com/images/',
      },
      {
        find: '^/medias/.*\.(mp4|ogg|ogv|webm)$',
        replacement: 'https://example.com/medias/',
      },
    ])

    expect(rules).toEqual([
      {
        find: '^/images/.*\.(jpe?g|png|gif|svg)$',
        replacement: 'https://example.com/images/',
      },
      {
        find: '^/medias/.*\.(mp4|ogg|ogv|webm)$',
        replacement: 'https://example.com/medias/',
      },
    ])
  })

  it('should work with presets', () => {
    const media = vi.fn((url: string) => `https://example.com/medias/${url}`)
    const rules = normalizeRules({
      image: 'https://example.com/images/',
      media,
      all: 'https://example.com/assets/',
    })

    expect(rules).toEqual([
      {
        find: createFindPattern(KNOWN_IMAGE_EXTENSIONS),
        replacement: 'https://example.com/images/',
      },
      {
        find: createFindPattern(KNOWN_MEDIA_EXTENSIONS),
        replacement: media,
      },
      {
        find: createFindPattern(KNOWN_ASSET_EXTENSIONS),
        replacement: 'https://example.com/assets/',
      },
    ])
  })

  it('should work with custom single rule', () => {
    const rules = normalizeRules({
      rules: {
        find: '^/images/.*\.(jpe?g|png|gif|svg)$',
        replacement: 'https://example.com/images/',
      },
    })

    expect(rules).toEqual([{
      find: '^/images/.*\.(jpe?g|png|gif|svg)$',
      replacement: 'https://example.com/images/',
    }])
  })

  it('should work with custom multiple rules', () => {
    const rules = normalizeRules({
      rules: [
        {
          find: '^/images/.*\.(jpe?g|png|gif|svg)$',
          replacement: 'https://example.com/images/',
        },
        {
          find: '^/medias/.*\.(mp4|ogg|ogv|webm)$',
          replacement: 'https://example.com/medias/',
        },
      ],
    })

    expect(rules).toEqual([
      {
        find: '^/images/.*\.(jpe?g|png|gif|svg)$',
        replacement: 'https://example.com/images/',
      },
      {
        find: '^/medias/.*\.(mp4|ogg|ogv|webm)$',
        replacement: 'https://example.com/medias/',
      },
    ])
  })
})
