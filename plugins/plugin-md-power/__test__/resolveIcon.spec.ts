import type { IconOptions } from '../src/shared/index.js'
import { describe, expect, it } from 'vitest'
import { resolveIcon } from '../src/node/icon/resolveIcon.js'

describe('resolveIcon', () => {
  const defaultOptions: IconOptions = {
    provider: 'iconify',
  }

  it('should resolve basic icon name', () => {
    const result = resolveIcon('mdi:home', defaultOptions)
    expect(result).toEqual({
      provider: 'iconify',
      name: 'mdi:home',
    })
  })

  it('should resolve icon with size', () => {
    const result = resolveIcon('mdi:home =24', defaultOptions)
    expect(result).toEqual({
      provider: 'iconify',
      name: 'mdi:home',
      size: '24',
    })
  })

  it('should resolve icon with color', () => {
    const result = resolveIcon('mdi:home /red', defaultOptions)
    expect(result).toEqual({
      provider: 'iconify',
      name: 'mdi:home',
      color: 'red',
    })
  })

  it('should resolve icon with size and color', () => {
    const result = resolveIcon('mdi:home =24 /blue', defaultOptions)
    expect(result).toEqual({
      provider: 'iconify',
      name: 'mdi:home',
      size: '24',
      color: 'blue',
    })
  })

  it('should resolve icon with different providers', () => {
    expect(resolveIcon('iconfont icon-home', defaultOptions)).toEqual({
      provider: 'iconfont',
      name: 'icon-home',
    })

    expect(resolveIcon('fontawesome fa-home', defaultOptions)).toEqual({
      provider: 'fontawesome',
      name: 'fa-home',
    })

    expect(resolveIcon('iconify mdi:home', defaultOptions)).toEqual({
      provider: 'iconify',
      name: 'mdi:home',
    })
  })

  it('should use options provider as default', () => {
    const result = resolveIcon('mdi:home', { provider: 'iconfont' })
    expect(result.provider).toBe('iconfont')
  })

  it('should use options size as default', () => {
    const result = resolveIcon('mdi:home', { provider: 'iconify', size: '32' })
    expect(result.size).toBe('32')
  })

  it('should override options size with inline size', () => {
    const result = resolveIcon('mdi:home =24', { provider: 'iconify', size: '32' })
    expect(result.size).toBe('24')
  })

  it('should use options color as default', () => {
    const result = resolveIcon('mdi:home', { provider: 'iconify', color: 'red' })
    expect(result.color).toBe('red')
  })

  it('should override options color with inline color', () => {
    const result = resolveIcon('mdi:home /blue', { provider: 'iconify', color: 'red' })
    expect(result.color).toBe('blue')
  })

  it('should resolve icon with extra attributes', () => {
    const result = resolveIcon('mdi:home class="icon" id="home-icon"', defaultOptions)
    expect(result.name).toBe('mdi:home')
    expect(result).toHaveProperty('class', 'icon')
    expect(result).toHaveProperty('id', 'home-icon')
  })

  it('should resolve icon with boolean extra attributes', () => {
    const result = resolveIcon('mdi:home spin', defaultOptions)
    expect(result.name).toBe('mdi:home')
    expect(result.extra).toBe('spin')
  })

  it('should resolve icon with hex color', () => {
    const result = resolveIcon('mdi:home /#ff0000', defaultOptions)
    expect(result.color).toBe('#ff0000')
  })

  it('should resolve icon with rgb color', () => {
    const result = resolveIcon('mdi:home /rgb(255,0,0)', defaultOptions)
    expect(result.color).toBe('rgb(255,0,0)')
  })

  it('should handle empty content', () => {
    const result = resolveIcon('', defaultOptions)
    expect(result.name).toBe('')
  })

  it('should handle complex size values', () => {
    expect(resolveIcon('mdi:home =2rem', defaultOptions).size).toBe('2rem')
    expect(resolveIcon('mdi:home =1.5em', defaultOptions).size).toBe('1.5em')
    expect(resolveIcon('mdi:home =100%', defaultOptions).size).toBe('100%')
  })
})
