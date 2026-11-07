import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * `getHeaders` / `resolveHeaders` operate on real DOM nodes, but the test does not
 * need a DOM implementation: a tiny node double exposes exactly the members used by
 * the serialization and filtering logic.
 *
 * `getHeaders` / `resolveHeaders` 依赖真实 DOM 节点的少量成员。这里用一个轻量节点替身
 * 实现序列化与过滤所需的属性，避免引入完整的 DOM 实现。
 */
const hoisted = vi.hoisted(() => ({
  getAbsoluteTop: vi.fn(() => Number.NaN),
}))

vi.mock('vuepress/client', () => ({
  onContentUpdated: vi.fn(),
  useRouter: () => ({
    currentRoute: { value: { path: '/', query: {}, hash: '' } },
    options: {},
    replace: vi.fn(),
  }),
}))

vi.mock('../composables/data.js', () => ({
  useData: () => ({ frontmatter: { value: {} }, theme: { value: {} } }),
}))

vi.mock('../composables/layout.js', () => ({
  useLayout: () => ({ isAsideEnabled: { value: true } }),
}))

vi.mock('../utils/index.js', () => ({
  getAbsoluteTop: hoisted.getAbsoluteTop,
}))

const { getHeaders } = await import('../composables/outline.js')

interface FakeNodeOptions {
  nodeType?: number
  tagName?: string
  id?: string
  text?: string
  attrs?: Record<string, string>
  classes?: string[]
  children?: FakeNode[]
}

/** Minimal DOM node double with the members used by the outline logic. */
class FakeNode {
  nodeType: number
  tagName: string
  id: string
  parent: FakeNode | null = null
  childNodes: FakeNode[] = []
  classList: { contains: (name: string) => boolean, add: (name: string) => void, remove: (name: string) => void }

  private text: string
  private classes: string[]
  private attrs: Record<string, string>

  constructor(options: FakeNodeOptions = {}) {
    this.nodeType = options.nodeType ?? 1
    this.tagName = options.tagName ?? 'DIV'
    this.id = options.id ?? ''
    this.text = options.text ?? ''
    this.classes = options.classes ?? []
    this.attrs = options.attrs ?? {}

    this.classList = {
      contains: name => this.classes.includes(name),
      add: (name) => {
        if (!this.classes.includes(name))
          this.classes.push(name)
      },
      remove: (name) => {
        const index = this.classes.indexOf(name)
        if (index !== -1)
          this.classes.splice(index, 1)
      },
    }

    for (const child of options.children ?? [])
      this.appendChild(child)
  }

  get textContent(): string {
    return this.text + this.childNodes.map(node => node.textContent).join('')
  }

  set textContent(value: string) {
    this.text = value
    this.childNodes = []
  }

  get firstChild(): FakeNode | null {
    return this.childNodes[0] ?? null
  }

  get nextSibling(): FakeNode | null {
    if (!this.parent)
      return null
    const index = this.parent.childNodes.indexOf(this)
    return this.parent.childNodes[index + 1] ?? null
  }

  hasChildNodes(): boolean {
    return this.childNodes.length > 0
  }

  appendChild(node: FakeNode): FakeNode {
    node.parent = this
    this.childNodes.push(node)
    return node
  }

  hasAttribute(name: string): boolean {
    return name in this.attrs
  }

  getAttribute(name: string): string | null {
    return this.attrs[name] ?? null
  }

  cloneNode(deep = false): FakeNode {
    const clone = new FakeNode({
      nodeType: this.nodeType,
      tagName: this.tagName,
      id: this.id,
      text: this.text,
      attrs: { ...this.attrs },
      classes: [...this.classes],
    })
    if (deep) {
      for (const child of this.childNodes)
        clone.appendChild(child.cloneNode(true))
    }
    return clone
  }

  remove(): void {
    if (!this.parent)
      return
    const index = this.parent.childNodes.indexOf(this)
    if (index !== -1)
      this.parent.childNodes.splice(index, 1)
    this.parent = null
  }
}

function textNode(text: string): FakeNode {
  return new FakeNode({ nodeType: 3, text })
}

/**
 * Build an `<hN><a href="#id"><span>title…</span></a>…</hN>` structure.
 *
 * 构造 `<hN><a href="#id"><span>title…</span></a>…</hN>` 结构。
 */
function createHeader(
  level: number,
  id: string,
  options: {
    title?: string
    attrs?: Record<string, string>
    labelChildren?: FakeNode[]
    after?: FakeNode[]
    empty?: boolean
  } = {},
): FakeNode {
  const label = new FakeNode({
    tagName: 'SPAN',
    children: options.labelChildren ?? [textNode(options.title ?? id)],
  })
  const anchor = new FakeNode({
    tagName: 'A',
    attrs: { href: `#${id}` },
    children: [label],
  })

  return new FakeNode({
    tagName: `H${level}`,
    id,
    attrs: options.attrs,
    children: options.empty ? [] : [anchor, ...(options.after ?? [])],
  })
}

/** Stub `document.querySelectorAll`, routing the content and ignore selectors. */
function stubDocument(headers: FakeNode[], ignored: FakeNode[] = []) {
  const querySelectorAll = vi.fn((selector: string) =>
    selector.includes('.vp-doc') ? headers : ignored,
  )
  vi.stubGlobal('document', { querySelectorAll })
  return querySelectorAll
}

beforeEach(() => {
  hoisted.getAbsoluteTop.mockClear()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('getHeaders', () => {
  it('uses level 2 as the default outline range and drops deeper levels', () => {
    const header = createHeader(2, 'intro', { title: 'Intro' })
    const child = createHeader(3, 'child', { title: 'Child' })
    stubDocument([createHeader(1, 'title', { title: 'Title' }), header, child])

    const result = getHeaders()

    expect(result.map(item => item.link)).toEqual(['#intro'])
    expect(result[0].title).toBe('Intro')
    expect(result[0].level).toBe(2)
    // 默认范围 `[2, 2]` 会过滤掉 h3 子标题。
    expect(result[0].children).toEqual([])
  })

  it('returns an empty outline when the outline is disabled', () => {
    stubDocument([createHeader(2, 'a', { title: 'A' })])

    expect(getHeaders(false)).toEqual([])
  })

  it('builds a nested hierarchy for the `deep` range', () => {
    const h2 = createHeader(2, 'a', { title: 'A' })
    const h3 = createHeader(3, 'b', { title: 'B' })
    const h4 = createHeader(4, 'c', { title: 'C' })
    const otherH2 = createHeader(2, 'd', { title: 'D' })
    const otherH3 = createHeader(3, 'e', { title: 'E' })
    stubDocument([h2, h3, h4, otherH2, otherH3])

    const result = getHeaders('deep')

    expect(result.map(item => item.link)).toEqual(['#a', '#d'])
    expect(result[0].children).toMatchObject([
      { link: '#b', level: 3, children: [{ link: '#c', level: 4 }] },
    ])
    expect(result[1].children).toMatchObject([{ link: '#e', level: 3 }])
  })

  it('filters nested headers by the lowest level of an explicit range', () => {
    const h2 = createHeader(2, 'a', { title: 'A' })
    const h3 = createHeader(3, 'b', { title: 'B' })
    const h4 = createHeader(4, 'c', { title: 'C' })
    stubDocument([h2, h3, h4])

    const result = getHeaders([2, 3])

    expect(result[0].children).toMatchObject([{ link: '#b' }])
    // h4 超出了 `[2, 3]` 的下限，不再作为 h3 的子标题出现。
    expect(result[0].children![0].children).toEqual([])
  })

  it('lets a header narrow the outline of its own subtree', () => {
    const h2 = createHeader(2, 'a', { title: 'A', attrs: { 'data-outline': '3' } })
    const h3 = createHeader(3, 'b', { title: 'B' })
    const h4 = createHeader(4, 'c', { title: 'C' })
    stubDocument([h2, h3, h4])

    const result = getHeaders('deep')

    // `data-outline="3"` 表示该标题下只展开到 h3。
    expect(result[0].children).toMatchObject([
      { link: '#b', children: [] },
    ])
  })

  it('ignores invalid or too-small `data-outline` values', () => {
    const h2 = createHeader(2, 'a', { title: 'A', attrs: { 'data-outline': '1' } })
    const h3 = createHeader(3, 'b', { title: 'B' })
    const h4 = createHeader(4, 'c', { title: 'C' })
    stubDocument([h2, h3, h4])

    expect(getHeaders('deep')[0].children[0].children)
      .toMatchObject([{ link: '#c' }])
  })

  it('skips headers inside ignored wrappers or without usable content', () => {
    const valid = createHeader(2, 'valid', { title: 'Valid' })
    const ignored = createHeader(2, 'ignored', { title: 'Ignored' })
    stubDocument(
      [valid, ignored, createHeader(2, '', { title: 'No id' }), createHeader(2, 'empty', { empty: true })],
      [ignored],
    )

    expect(getHeaders().map(item => item.link)).toEqual(['#valid'])
  })

  it('serializes the header text without badges and ignored fragments', () => {
    const badge = new FakeNode({
      tagName: 'SPAN',
      classes: ['vp-badge'],
      children: [textNode('badge')],
    })
    const ignoredInner = new FakeNode({
      tagName: 'SPAN',
      classes: ['ignore-header'],
      children: [textNode('hidden')],
    })
    const nested = new FakeNode({
      tagName: 'SPAN',
      children: [textNode('Keep'), ignoredInner],
    })
    const header = createHeader(2, 'title', {
      labelChildren: [textNode('Hello '), badge, textNode('World '), nested],
      after: [
        new FakeNode({ tagName: 'A', attrs: { href: '/x' }, children: [textNode(' Extra')] }),
        textNode(' tail'),
      ],
    })
    stubDocument([header])

    expect(getHeaders()[0].title).toBe('Hello World Keep Extra tail')
  })
})
