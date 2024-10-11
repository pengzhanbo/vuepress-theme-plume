import type { CanIUseOptions } from '../src/shared/index.js'
import MarkdownIt from 'markdown-it'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { caniusePlugin, legacyCaniuse } from '../src/node/embed/caniuse.js'

beforeEach(() => {
  vi.mock('../src/node/utils/nanoid.js', () => ({
    nanoid: vi.fn(() => 'test-id'),
  }))
})

function createMarkdown(options?: CanIUseOptions) {
  return MarkdownIt().use((md) => {
    md.block.ruler.before('code', 'import_code', () => false)
    md.renderer.rules.import_code = () => ''
  }).use(caniusePlugin, options)
}

describe('caniusePlugin', () => {
  it('should work', () => {
    const md = createMarkdown()

    expect(md.render('@[caniuse](feature)')).toMatchSnapshot()
    expect(md.render('@[caniuse image](feature)')).toMatchSnapshot()
    expect(md.render('@[caniuse embed](feature)')).toMatchSnapshot()
    expect(md.render('@[caniuse {-2,4}](feature)')).toMatchSnapshot()
    expect(md.render(`\
@[caniuse {-2,4}](feature)
@[caniuse {-2,}](feature)
`)).toMatchSnapshot()
    expect(md.render('@[caniuse embed{-2,4}](feature)')).toMatchSnapshot()
  })

  it('should work with options', () => {
    const md = createMarkdown({ mode: 'image' })

    expect(md.render('@[caniuse](feature)')).toMatchSnapshot()
    expect(md.render('@[caniuse embed](feature)')).toMatchSnapshot()
    expect(md.render('@[caniuse embed{-2,4}](feature)')).toMatchSnapshot()
  })

  it('should not work', () => {
    const md = createMarkdown()

    expect(md.render('@[caniuse]()')).toMatchSnapshot()
    expect(md.render('@[caniuse]xxx')).toMatchSnapshot()
    expect(md.render('@[ caniuse]()')).toMatchSnapshot()
    expect(md.render('@[caniuse](xxx')).toMatchSnapshot()
    expect(md.render('@[caniuse](')).toMatchSnapshot()
    expect(md.render('@[caniuse')).toMatchSnapshot()
    expect(md.render('@[caniuse)]()')).toMatchSnapshot()
    expect(md.render('@[caniuseee)]()')).toMatchSnapshot()
  })
})

describe('legacyCaniuse', () => {
  it('should work', () => {
    const md = MarkdownIt()
    legacyCaniuse(md)

    expect(md.render(':::caniuse feature\n:::')).toMatchSnapshot()
    expect(md.render(':::caniuse feature{-2,4}\n:::')).toMatchSnapshot()
    expect(md.render(':::caniuse\n:::')).toMatchSnapshot()
  })

  it('should work with unknown mode', () => {
    const md = MarkdownIt()
    legacyCaniuse(md, { mode: 'unknown' as any })

    expect(md.render(':::caniuse feature\n:::')).toMatchSnapshot()
    expect(md.render(':::caniuse feature{-2,4}\n:::')).toMatchSnapshot()
  })
})
