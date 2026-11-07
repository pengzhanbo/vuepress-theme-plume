import type { App, Page } from 'vuepress'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const hoisted = vi.hoisted(() => ({
  installed: new Set<string>(),
}))

vi.mock('local-pkg', () => ({
  isPackageExists: (name: string) => hoisted.installed.has(name),
}))

const { getEffectsByFrontmatter, getMissingDeps } = await import('../features/home-hero-effects.js')

function createApp(pages: Partial<Page>[]): App {
  return { pages } as unknown as App
}

beforeEach(() => {
  hoisted.installed = new Set()
})

describe('getEffectsByFrontmatter', () => {
  it('collects hero effects from home pages and de-duplicates them', () => {
    const app = createApp([
      { frontmatter: { home: true, config: [{ type: 'hero', effect: 'prism' } as any] } },
      { frontmatter: { pageLayout: 'home', config: [{ type: 'hero', effect: 'prism' } as any] } },
      { frontmatter: { home: true, config: [{ type: 'hero', effect: 'beams' } as any] } },
    ])

    expect(getEffectsByFrontmatter(app)).toEqual({ effects: ['prism', 'beams'], unknownEffects: [] })
  })

  it('reports unknown effects instead of passing them to the build pipeline', () => {
    const app = createApp([
      {
        frontmatter: {
          home: true,
          config: [{ type: 'hero', effect: 'not-an-effect' } as any],
        },
      },
    ])

    expect(getEffectsByFrontmatter(app)).toEqual({ effects: [], unknownEffects: ['not-an-effect'] })
  })

  it('supports the deprecated `background` field of the hero', () => {
    const app = createApp([
      {
        frontmatter: {
          home: true,
          config: [{ type: 'hero', effect: 'prism', background: 'lightning' } as any],
        },
      },
    ])

    expect(getEffectsByFrontmatter(app).effects).toEqual(['prism', 'lightning'])
  })

  it('ignores pages that are not the home page', () => {
    const app = createApp([
      { frontmatter: { config: [{ type: 'hero', effect: 'prism' } as any] } },
      { frontmatter: { home: true } },
      { frontmatter: {} },
    ])

    expect(getEffectsByFrontmatter(app)).toEqual({ effects: [], unknownEffects: [] })
  })
})

describe('getMissingDeps', () => {
  it('reports the effect dependencies that are not installed', () => {
    expect(getMissingDeps(['prism', 'pixel-blast', 'beams'])).toEqual({
      'prism': ['ogl'],
      'pixel-blast': ['three', 'postprocessing'],
      'beams': ['three'],
    })
  })

  it('only lists the missing dependencies of an effect', () => {
    hoisted.installed = new Set(['three'])

    expect(getMissingDeps(['pixel-blast'])).toEqual({ 'pixel-blast': ['postprocessing'] })
  })

  it('returns nothing when all dependencies are installed', () => {
    hoisted.installed = new Set(['ogl', 'three', 'postprocessing', 'gsap'])

    expect(getMissingDeps(['prism', 'pixel-blast', 'dot-grid', 'iridescence'])).toEqual({})
  })

  it('ignores effects that do not need extra dependencies', () => {
    expect(getMissingDeps(['tint-plate', 'lightning', 'unknown'])).toEqual({})
  })
})
