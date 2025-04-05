import { describe, expect, it } from 'vitest'
import { createAssetPattern, isHTMLRequest, isNonJsRequest, normalizeUrl } from '../src/unplugin/utils.js'

describe('plugin-replace-assets > utils', () => {
  it('createAssetPattern', () => {
    expect(createAssetPattern('/[^/]').test(`'/images/foo.jpg'`)).toBe(true)
    expect(createAssetPattern('/[^/]').test(`"/images/foo.jpg"`)).toBe(true)
    expect(createAssetPattern('/[^/]').test(`(/images/foo.jpg)`)).toBe(true)
    expect(createAssetPattern('/[^/]').test(`('/images/foo.jpg')`)).toBe(true)
    expect(createAssetPattern('/[^/]').test(`("/images/foo.jpg")`)).toBe(true)
    expect(createAssetPattern('/[^/]').test(`"/images/foo.jpg?a=1"`)).toBe(true)

    expect(createAssetPattern('/[^/]').test(`'https://example.com/images/foo.jpg'`)).toBe(false)
    expect(createAssetPattern('/[^/]').test(`"./images/foo.jpg"`)).toBe(false)
    expect(createAssetPattern('/[^/]').test(`"images/foo.jpg"`)).toBe(false)
  })

  it('isHTMLRequest', () => {
    expect(isHTMLRequest('.html')).toBe(true)
    expect(isHTMLRequest('.htm')).toBe(true)
    expect(isHTMLRequest('.svg')).toBe(false)
    expect(isHTMLRequest('.png')).toBe(false)
    expect(isHTMLRequest('')).toBe(false)
  })

  it('isNonJsRequest', () => {
    // everything request is js, but json is not
    expect(isNonJsRequest('.json')).toBe(true)
    expect(isNonJsRequest('.html')).toBe(false)
    expect(isNonJsRequest('.htm')).toBe(false)
    expect(isNonJsRequest('.svg')).toBe(false)
    expect(isNonJsRequest('.png')).toBe(false)
    expect(isNonJsRequest('')).toBe(false)
  })

  it('normalizeUrl', () => {
    expect(normalizeUrl('')).toBe('')
    expect(normalizeUrl('/images/foo.jpg')).toBe('/images/foo.jpg')
    expect(normalizeUrl('/images/foo.jpg?a=1')).toBe('/images/foo.jpg?a=1')
    expect(normalizeUrl('/images/foo.jpg', 'https://example.com/')).toBe('https://example.com/images/foo.jpg')
    expect(normalizeUrl('/images/foo.jpg?a=1', 'https://example.com/')).toBe('https://example.com/images/foo.jpg?a=1')
  })
})
