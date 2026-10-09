import { afterEach, describe, expect, it, vi } from 'vitest'
import { shouldDeferHeroEffect } from '../src/client/utils/effect.js'

interface FakeEnvironment {
  reducedMotion?: boolean
  coarsePointer?: boolean
  saveData?: boolean
  cores?: number
}

function stubEnvironment(env: FakeEnvironment): void {
  const queries: Record<string, boolean> = {
    '(prefers-reduced-motion: reduce)': env.reducedMotion ?? false,
    '(pointer: coarse)': env.coarsePointer ?? false,
  }

  vi.stubGlobal('window', {
    matchMedia: (query: string) => ({ matches: queries[query] ?? false }),
  })
  vi.stubGlobal('navigator', {
    hardwareConcurrency: env.cores ?? 8,
    connection: { saveData: env.saveData ?? false },
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('shouldDeferHeroEffect', () => {
  it('keeps the effect on capable devices', () => {
    stubEnvironment({ cores: 8 })
    expect(shouldDeferHeroEffect()).toBe(false)
  })

  it('defers the effect when reduced motion is preferred', () => {
    stubEnvironment({ cores: 8, reducedMotion: true })
    expect(shouldDeferHeroEffect()).toBe(true)
  })

  it('defers the effect in data-saver mode', () => {
    stubEnvironment({ cores: 8, saveData: true })
    expect(shouldDeferHeroEffect()).toBe(true)
  })

  it('defers the effect on low-end touch devices', () => {
    stubEnvironment({ cores: 4, coarsePointer: true })
    expect(shouldDeferHeroEffect()).toBe(true)
  })

  it('keeps the effect on low-end devices with a fine pointer', () => {
    stubEnvironment({ cores: 4 })
    expect(shouldDeferHeroEffect()).toBe(false)
  })

  it('keeps the effect during server side rendering', () => {
    expect(shouldDeferHeroEffect()).toBe(false)
  })

  it('keeps the effect when matchMedia is unavailable', () => {
    vi.stubGlobal('window', {})
    expect(shouldDeferHeroEffect()).toBe(false)
  })
})
