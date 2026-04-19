import type { App } from 'vuepress'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { findFirstPage, initPagePaths, updatePagePaths } from '../src/node/obsidian/findFirstPage.js'

const mockGlobSync = vi.fn()

vi.mock('vuepress/utils', () => ({
  tinyglobby: {
    globSync: (...args: unknown[]) => mockGlobSync(...args),
  },
  path: {
    dirname: vi.fn((p: string) => p.split('/').slice(0, -1).join('/') || '.'),
    extname: vi.fn((p: string) => {
      const i = p.lastIndexOf('.')
      return i > 0 ? p.slice(i) : ''
    }),
    join: vi.fn((...args: string[]) => args.join('/')),
  },
}))

vi.mock('@vuepress/helper', () => ({
  removeLeadingSlash: vi.fn((p: string) => p.replace(/^\//, '')),
}))

function createMockApp(pagePatterns = ['**/*.md']): App {
  return {
    pages: [],
    options: {
      pagePatterns,
    },
    dir: {
      source: () => '/source',
    },
  } as unknown as App
}

describe('findFirstPage', () => {
  beforeEach(() => {
    mockGlobSync.mockReset()
  })

  describe('initPagePaths', () => {
    it('should initialize page paths from glob pattern', () => {
      mockGlobSync.mockReturnValue([
        'README.md',
        'guide.md',
        'docs/api.md',
        'docs/guide/intro.md',
      ])

      const app = createMockApp()
      initPagePaths(app)

      expect(mockGlobSync).toHaveBeenCalledWith(['**/*.md'], {
        cwd: '/source',
        ignore: ['**/node_modules/**', '**/.vuepress/**'],
      })
    })

    it('should sort page paths by directory depth', () => {
      mockGlobSync.mockReturnValue([
        'docs/a/b/c.md',
        'a.md',
        'docs/a.md',
      ])

      const app = createMockApp()
      initPagePaths(app)

      // Should find a.md first because it's shortest
      expect(findFirstPage('a', 'any/path.md')).toBe('a.md')
    })
  })

  describe('updatePagePaths', () => {
    it('should add new page path on create', () => {
      mockGlobSync.mockReturnValue(['existing.md'])

      const app = createMockApp()
      initPagePaths(app)

      updatePagePaths('new-page.md', 'create')

      expect(findFirstPage('new-page', 'any/path.md')).toBe('new-page.md')
    })

    it('should remove page path on delete', () => {
      mockGlobSync.mockReturnValue(['existing.md', 'to-delete.md'])

      const app = createMockApp()
      initPagePaths(app)

      updatePagePaths('to-delete.md', 'delete')

      expect(findFirstPage('to-delete', 'any/path.md')).toBeUndefined()
      expect(findFirstPage('existing', 'any/path.md')).toBe('existing.md')
    })

    it('should not add empty filepath', () => {
      mockGlobSync.mockReturnValue(['existing.md'])

      const app = createMockApp()
      initPagePaths(app)

      const beforeUpdate = findFirstPage('existing', 'any/path.md')

      updatePagePaths('', 'create')

      expect(findFirstPage('existing', 'any/path.md')).toBe(beforeUpdate)
    })
  })

  describe('findFirstPage matching logic', () => {
    beforeEach(() => {
      mockGlobSync.mockReturnValue([
        'README.md',
        'guide.md',
        'docs/api.md',
        'docs/guide/intro.md',
        'docs/guide/advanced.md',
        'page.md',
      ])

      const app = createMockApp()
      initPagePaths(app)
    })

    it('should return exact match', () => {
      expect(findFirstPage('guide', 'any/path.md')).toBe('guide.md')
      expect(findFirstPage('api', 'any/path.md')).toBe('docs/api.md')
    })

    it('should return path that ends with the filename', () => {
      expect(findFirstPage('intro', 'any/path.md')).toBe('docs/guide/intro.md')
    })

    it('should add .md extension if no extension provided', () => {
      expect(findFirstPage('page', 'any/path.md')).toBe('page.md')
    })

    it('should not add .md if extension already present', () => {
      expect(findFirstPage('page.md', 'any/path.md')).toBe('page.md')
    })

    it('should find page via endsWith matching when given partial path', () => {
      // When searching for 'guide/advanced', it should find 'docs/guide/advanced.md'
      // because the pagePath ends with 'guide/advanced.md'
      expect(findFirstPage('guide/advanced', 'any/path.md')).toBe('docs/guide/advanced.md')
    })

    it('should return undefined when page not found', () => {
      expect(findFirstPage('nonexistent', 'any/path.md')).toBeUndefined()
      expect(findFirstPage('does-not-exist', 'any/path.md')).toBeUndefined()
    })
  })
})
