import type { FileTreeOptions } from '../src/shared/fileTree.js'
import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import {
  fileTreePlugin,
  parseFileTreeContentWithContainer,
  parseFileTreeContentWithFence,
  parseFileTreeNodeInfo,
} from '../src/node/container/fileTree.js'

// ─── parseFileTreeNodeInfo ───────────────────────────────────────────────────

describe('parseFileTreeNodeInfo', () => {
  it('should parse a simple filename', () => {
    expect(parseFileTreeNodeInfo('README.md'))
      .toEqual({ filename: 'README.md', comment: '', focus: false, expanded: true, type: 'file' })
  })

  it('should parse filename with comment', () => {
    expect(parseFileTreeNodeInfo('README.md # comment'))
      .toEqual({ filename: 'README.md', comment: '# comment', focus: false, expanded: true, type: 'file' })
  })

  it('should parse focused filename', () => {
    expect(parseFileTreeNodeInfo('**Navbar.vue**'))
      .toEqual({ filename: 'Navbar.vue', comment: '', focus: true, expanded: true, type: 'file' })
  })

  it('should parse focused filename with comment', () => {
    expect(parseFileTreeNodeInfo('**Navbar.vue** # comment'))
      .toEqual({ filename: 'Navbar.vue', comment: '# comment', focus: true, expanded: true, type: 'file' })
  })

  it('should parse folder with trailing slash', () => {
    expect(parseFileTreeNodeInfo('folder/'))
      .toEqual({ filename: 'folder', comment: '', focus: false, expanded: false, type: 'folder' })
  })

  it('should parse folder with trailing slash and comment', () => {
    expect(parseFileTreeNodeInfo('folder/ # comment'))
      .toEqual({ filename: 'folder', comment: '# comment', focus: false, expanded: false, type: 'folder' })
  })

  it('should parse focused folder', () => {
    expect(parseFileTreeNodeInfo('**folder/**'))
      .toEqual({ filename: 'folder', comment: '', focus: true, expanded: false, type: 'folder' })
  })

  it('should parse focused folder with comment', () => {
    expect(parseFileTreeNodeInfo('**folder/** # comment'))
      .toEqual({ filename: 'folder', comment: '# comment', focus: true, expanded: false, type: 'folder' })
  })

  it('should parse ++ diff marker (add)', () => {
    expect(parseFileTreeNodeInfo('++ added.ts'))
      .toEqual({ filename: 'added.ts', comment: '', focus: false, expanded: true, type: 'file', diff: 'add' })
  })

  it('should parse -- diff marker (remove)', () => {
    expect(parseFileTreeNodeInfo('-- removed.ts'))
      .toEqual({ filename: 'removed.ts', comment: '', focus: false, expanded: true, type: 'file', diff: 'remove' })
  })

  it('should parse ++ diff with comment', () => {
    expect(parseFileTreeNodeInfo('++ added.ts # new file'))
      .toEqual({ filename: 'added.ts', comment: '# new file', focus: false, expanded: true, type: 'file', diff: 'add' })
  })

  it('should parse -- diff with comment', () => {
    expect(parseFileTreeNodeInfo('-- removed.ts # old file'))
      .toEqual({ filename: 'removed.ts', comment: '# old file', focus: false, expanded: true, type: 'file', diff: 'remove' })
  })

  it('should parse ++ diff with folder', () => {
    expect(parseFileTreeNodeInfo('++ src/'))
      .toEqual({ filename: 'src', comment: '', focus: false, expanded: false, type: 'folder', diff: 'add' })
  })

  it('should parse -- diff with folder', () => {
    expect(parseFileTreeNodeInfo('-- dist/'))
      .toEqual({ filename: 'dist', comment: '', focus: false, expanded: false, type: 'folder', diff: 'remove' })
  })

  it('should parse ++ diff with focus', () => {
    expect(parseFileTreeNodeInfo('++ **important.ts**'))
      .toEqual({ filename: 'important.ts', comment: '', focus: true, expanded: true, type: 'file', diff: 'add' })
  })

  it('should parse -- diff with focus', () => {
    expect(parseFileTreeNodeInfo('-- **deprecated.ts**'))
      .toEqual({ filename: 'deprecated.ts', comment: '', focus: true, expanded: true, type: 'file', diff: 'remove' })
  })

  it('should parse ++ diff with focus and comment', () => {
    expect(parseFileTreeNodeInfo('++ **important.ts** # must add'))
      .toEqual({ filename: 'important.ts', comment: '# must add', focus: true, expanded: true, type: 'file', diff: 'add' })
  })

  it('should parse ellipsis filename', () => {
    expect(parseFileTreeNodeInfo('…'))
      .toEqual({ filename: '…', comment: '', focus: false, expanded: true, type: 'file' })
  })

  it('should parse ellipsis fallback filename', () => {
    expect(parseFileTreeNodeInfo('...'))
      .toEqual({ filename: '...', comment: '', focus: false, expanded: true, type: 'file' })
  })

  it('should parse empty string', () => {
    expect(parseFileTreeNodeInfo(''))
      .toEqual({ filename: '', comment: '', focus: false, expanded: true, type: 'file' })
  })

  it('should parse filename with multiple # in comment', () => {
    expect(parseFileTreeNodeInfo('file.ts # comment # more'))
      .toEqual({ filename: 'file.ts', comment: '# comment # more', focus: false, expanded: true, type: 'file' })
  })

  it('should parse focused filename with trailing text after **', () => {
    expect(parseFileTreeNodeInfo('**file.ts** extra'))
      .toEqual({ filename: 'file.ts', comment: 'extra', focus: true, expanded: true, type: 'file' })
  })
})

// ─── parseFileTreeContentWithContainer ───────────────────────────────────────

describe('parseFileTreeContentWithContainer', () => {
  it('should parse basic file tree', () => {
    const content = `\
- docs
  - README.md
  - foo.md

- src
  - client
    - components
      - **Navbar.vue**
    - index.ts # comment
  - node
    - index.ts
- .gitignore
- package.json
`
    const nodes = parseFileTreeContentWithContainer(content)
    expect(nodes).toMatchSnapshot()
  })

  it('should handle empty content', () => {
    const nodes = parseFileTreeContentWithContainer('')
    expect(nodes).toEqual([])
  })

  it('should handle content with only non-matching lines', () => {
    const content = `\
not a list item
  also not a list
`
    const nodes = parseFileTreeContentWithContainer(content)
    expect(nodes).toEqual([])
  })

  it('should handle single item', () => {
    const nodes = parseFileTreeContentWithContainer('- README.md')
    expect(nodes).toHaveLength(1)
    expect(nodes[0].filename).toBe('README.md')
  })

  it('should handle items with diff markers', () => {
    const content = `\
- docs
  - ++ added.md
  - -- remove.md
- ++ src
- -- source
`
    const nodes = parseFileTreeContentWithContainer(content)
    expect(nodes[0].children[0].diff).toBe('add')
    expect(nodes[0].children[1].diff).toBe('remove')
    expect(nodes[1].diff).toBe('add')
    expect(nodes[2].diff).toBe('remove')
  })

  it('should handle folder with trailing slash', () => {
    const content = `\
- src/
  - index.ts
`
    const nodes = parseFileTreeContentWithContainer(content)
    expect(nodes[0].filename).toBe('src')
    expect(nodes[0].type).toBe('folder')
    expect(nodes[0].expanded).toBe(false)
  })

  it('should handle indented content with leading spaces', () => {
    const content = `\
    - docs
      - README.md
    - src
`
    const nodes = parseFileTreeContentWithContainer(content)
    expect(nodes).toHaveLength(2)
    expect(nodes[0].filename).toBe('docs')
    expect(nodes[0].children[0].filename).toBe('README.md')
  })
})

// ─── parseFileTreeContentWithFence ───────────────────────────────────────────

describe('parseFileTreeContentWithFence', () => {
  it('should parse basic tree command output', () => {
    const content = `\
.
├── src
│   ├── index.ts
│   └── utils.ts
└── package.json
`
    const nodes = parseFileTreeContentWithFence(content)
    expect(nodes).toHaveLength(2)
    expect(nodes[0].filename).toBe('src')
    expect(nodes[0].type).toBe('folder')
    expect(nodes[0].children).toHaveLength(2)
    expect(nodes[0].children[0].filename).toBe('index.ts')
    expect(nodes[0].children[1].filename).toBe('utils.ts')
    expect(nodes[1].filename).toBe('package.json')
  })

  it('should parse tree output without root marker "."', () => {
    const content = `\
├── src
│   └── index.ts
└── package.json
`
    const nodes = parseFileTreeContentWithFence(content)
    expect(nodes).toHaveLength(2)
    expect(nodes[0].filename).toBe('src')
  })

  it('should parse tree output with comments', () => {
    const content = `\
.
├── src # source folder
│   └── index.ts # entry file
└── package.json  # project config
`
    const nodes = parseFileTreeContentWithFence(content)
    expect(nodes[0].comment).toBe('# source folder')
    expect(nodes[0].children[0].comment).toBe('# entry file')
    expect(nodes[1].comment).toBe('# project config')
  })

  it('should parse tree output with focused items', () => {
    const content = `\
.
├── src
│   └── **index.ts**
└── package.json
`
    const nodes = parseFileTreeContentWithFence(content)
    expect(nodes[0].children[0].filename).toBe('index.ts')
    expect(nodes[0].children[0].focus).toBe(true)
  })

  it('should parse tree output with diff markers', () => {
    const content = `\
.
├── src
│   ├── ++ new-file.ts
│   └── -- old-file.ts
└── package.json
`
    const nodes = parseFileTreeContentWithFence(content)
    expect(nodes[0].children[0].diff).toBe('add')
    expect(nodes[0].children[0].filename).toBe('new-file.ts')
    expect(nodes[0].children[1].diff).toBe('remove')
    expect(nodes[0].children[1].filename).toBe('old-file.ts')
  })

  it('should parse tree output with folder trailing slash', () => {
    const content = `\
.
├── src/
│   └── index.ts
└── package.json
`
    const nodes = parseFileTreeContentWithFence(content)
    expect(nodes[0].filename).toBe('src')
    expect(nodes[0].type).toBe('folder')
    expect(nodes[0].expanded).toBe(false)
  })

  it('should auto-detect folder type when a node has children', () => {
    const content = `\
.
├── src
│   └── index.ts
└── package.json
`
    const nodes = parseFileTreeContentWithFence(content)
    // "src" has children, so it should be auto-detected as folder
    expect(nodes[0].type).toBe('folder')
  })

  it('should handle empty content', () => {
    const nodes = parseFileTreeContentWithFence('')
    expect(nodes).toEqual([])
  })

  it('should handle content with only non-matching lines', () => {
    const content = `\
not a tree line
  also not a tree line
`
    const nodes = parseFileTreeContentWithFence(content)
    expect(nodes).toEqual([])
  })

  it('should handle deeply nested tree', () => {
    const content = `\
.
├── src
│   ├── components
│   │   ├── layout
│   │   │   └── Header.vue
│   │   └── Button.vue
│   └── index.ts
└── package.json
`
    const nodes = parseFileTreeContentWithFence(content)
    expect(nodes[0].filename).toBe('src')
    expect(nodes[0].type).toBe('folder')
    const components = nodes[0].children[0]
    expect(components.filename).toBe('components')
    expect(components.type).toBe('folder')
    const layout = components.children[0]
    expect(layout.filename).toBe('layout')
    expect(layout.type).toBe('folder')
    expect(layout.children[0].filename).toBe('Header.vue')
  })

  it('should handle tree with only root marker "."', () => {
    const content = `\
.
`
    const nodes = parseFileTreeContentWithFence(content)
    expect(nodes).toEqual([])
  })

  it('should handle tree output using spaces for prefix (last sibling)', () => {
    const content = `\
.
├── a
└── b
    └── c
`
    const nodes = parseFileTreeContentWithFence(content)
    expect(nodes).toHaveLength(2)
    expect(nodes[1].filename).toBe('b')
    expect(nodes[1].type).toBe('folder')
    expect(nodes[1].children[0].filename).toBe('c')
  })

  it('should handle tree output with multiple root-level items', () => {
    const content = `\
.
├── a
├── b
└── c
`
    const nodes = parseFileTreeContentWithFence(content)
    expect(nodes).toHaveLength(3)
    expect(nodes.map(n => n.filename)).toEqual(['a', 'b', 'c'])
  })

  it('should handle tree output with ellipsis', () => {
    const content = `\
.
├── src
│   └── …
└── package.json
`
    const nodes = parseFileTreeContentWithFence(content)
    expect(nodes[0].children[0].filename).toBe('…')
  })
})

// ─── fileTreePlugin ──────────────────────────────────────────────────────────

function createMarkdown(options?: FileTreeOptions, locales?: Record<string, any>) {
  const md = new MarkdownIt()
  fileTreePlugin(md, options, locales || {})
  return md
}

describe('fileTreePlugin', () => {
  it('should work with default options', () => {
    const code = `\
:::file-tree
- docs
  - README.md
  - foo.md
- src
  - client
    - components
      - **Navbar.vue**
    - index.ts # comment
  - node
    - index.ts
- .gitignore
- package.json
:::

::: file-tree title="files"
- src
  - js
    - …
  - vue/
  - css/
- README.md
:::

::: file-tree icon="simple"
- docs
- src
  - a.js
  - b.ts
- README.md
:::

::: file-tree
-
-
  -
:::

::: file-tree
- docs
  - ++ added.md
  - -- remove.md
- ++ src
- -- source
:::

::: file-tree
:::
`
    const md = createMarkdown()

    expect(md.render(code)).toMatchSnapshot()
  })

  // fix #795
  it('should work with nesting content', () => {
    const code = `\
- item1

  ::: file-tree
  - docs/
  - src
    - a.js
    - b.ts
  - README.md
  :::

- item2
`

    const md = createMarkdown()

    expect(md.render(code)).toMatchSnapshot()
  })

  it('should render fence with tree syntax', () => {
    const md = createMarkdown()
    const code = `\
\`\`\`tree
.
├── src
│   ├── index.ts
│   └── utils.ts
└── package.json
\`\`\`
`
    const html = md.render(code)
    expect(html).toContain('vp-file-tree')
    expect(html).toContain('src')
    expect(html).toContain('index.ts')
    expect(html).toContain('utils.ts')
    expect(html).toContain('package.json')
  })

  it('should render fence with file-tree syntax', () => {
    const md = createMarkdown()
    const code = `\
\`\`\`file-tree
.
├── src
│   └── index.ts
└── package.json
\`\`\`
`
    const html = md.render(code)
    expect(html).toContain('vp-file-tree')
    expect(html).toContain('src')
    expect(html).toContain('index.ts')
  })

  it('should render fence with file-tree title attribute', () => {
    const md = createMarkdown()
    const code = `\
\`\`\`file-tree title="Project Files"
.
├── src
│   └── index.ts
└── package.json
\`\`\`
`
    const html = md.render(code)
    expect(html).toContain('vp-file-tree-title')
    expect(html).toContain('Project Files')
  })

  it('should render fence with file-tree icon="simple"', () => {
    const md = createMarkdown()
    const code = `\
\`\`\`file-tree icon="simple"
.
├── src
│   └── index.ts
└── package.json
\`\`\`
`
    const html = md.render(code)
    expect(html).toContain('vp-file-tree')
    expect(html).toContain('default-folder')
    expect(html).toContain('default-file')
  })

  it('should pass through non-file-tree fence blocks', () => {
    const md = createMarkdown()
    const code = `\
\`\`\`typescript
const x = 1
\`\`\`
`
    const html = md.render(code)
    expect(html).not.toContain('vp-file-tree')
    expect(html).toContain('const x = 1')
  })

  it('should render fence with locale data', () => {
    const md = createMarkdown({}, { '/': { copy: 'Kopieren', copied: 'Kopiert' } })
    const code = `\
\`\`\`tree
.
├── src
└── package.json
\`\`\`
`
    const html = md.render(code, { filePathRelative: '/index.md' })
    expect(html).toContain('Kopieren')
    expect(html).toContain('Kopiert')
  })

  it('should render container with locale data', () => {
    const md = createMarkdown({}, { '/': { copy: 'Kopieren', copied: 'Kopiert' } })
    const code = `\
::: file-tree
- src
  - index.ts
:::
`
    const html = md.render(code, { filePathRelative: '/index.md' })
    expect(html).toContain('Kopieren')
    expect(html).toContain('Kopiert')
  })

  it('should render fence without root marker "."', () => {
    const md = createMarkdown()
    const code = `\
\`\`\`tree
├── src
│   └── index.ts
└── package.json
\`\`\`
`
    const html = md.render(code)
    expect(html).toContain('vp-file-tree')
    expect(html).toContain('src')
  })

  it('should render fence with diff markers', () => {
    const md = createMarkdown()
    const code = `\
\`\`\`tree
.
├── src
│   ├── ++ new-file.ts
│   └── -- old-file.ts
└── package.json
\`\`\`
`
    const html = md.render(code)
    expect(html).toContain('diff="add"')
    expect(html).toContain('diff="remove"')
  })

  it('should render fence with focused items', () => {
    const md = createMarkdown()
    const code = `\
\`\`\`tree
.
├── src
│   └── **index.ts**
└── package.json
\`\`\`
`
    const html = md.render(code)
    expect(html).toContain('focus')
    expect(html).toContain('index.ts')
  })

  it('should render fence with folder trailing slash', () => {
    const md = createMarkdown()
    const code = `\
\`\`\`tree
.
├── src/
│   └── index.ts
└── package.json
\`\`\`
`
    const html = md.render(code)
    expect(html).toContain('filename="src"')
    expect(html).toContain('type="folder"')
  })

  it('should render container with title', () => {
    const md = createMarkdown()
    const code = `\
::: file-tree title="My Files"
- src
  - index.ts
:::
`
    const html = md.render(code)
    expect(html).toContain('vp-file-tree-title')
    expect(html).toContain('My Files')
  })

  it('should render container with icon="simple"', () => {
    const md = createMarkdown()
    const code = `\
::: file-tree icon="simple"
- src
  - index.ts
:::
`
    const html = md.render(code)
    expect(html).toContain('default-folder')
    expect(html).toContain('default-file')
  })

  it('should render container with global icon option', () => {
    const md = createMarkdown({ icon: 'simple' })
    const code = `\
::: file-tree
- src
  - index.ts
:::
`
    const html = md.render(code)
    expect(html).toContain('default-folder')
    expect(html).toContain('default-file')
  })

  it('should render container with comment containing #', () => {
    const md = createMarkdown()
    const code = `\
::: file-tree
- index.ts # entry file
:::
`
    const html = md.render(code)
    expect(html).toContain('#comment')
    expect(html).toContain('entry file')
  })

  it('should render ellipsis without icon', () => {
    const md = createMarkdown()
    const code = `\
::: file-tree
- src
  - …
:::
`
    const html = md.render(code)
    expect(html).toContain('filename="…"')
    // Ellipsis should NOT have an icon template
    const match = html.match(/filename="…"[^>]*>([\s\S]*?)<\/FileTreeNode>/)
    expect(match?.[1]).not.toContain('#icon')
  })

  it('should render ellipsis fallback without icon', () => {
    const md = createMarkdown()
    const code = `\
::: file-tree
- src
  - ...
:::
`
    const html = md.render(code)
    expect(html).toContain('filename="..."')
    const match = html.match(/filename="\.\.\."[^^>]*>([\s\S]*?)<\/FileTreeNode>/)
    expect(match?.[1]).not.toContain('#icon')
  })

  it('should auto-add ellipsis child for folder without children', () => {
    const md = createMarkdown()
    const code = `\
::: file-tree
- docs/
:::
`
    const html = md.render(code)
    expect(html).toContain('filename="…"')
  })

  it('should render fence with comment containing #', () => {
    const md = createMarkdown()
    const code = `\
\`\`\`tree
.
├── index.ts # entry file
└── package.json
\`\`\`
`
    const html = md.render(code)
    expect(html).toContain('#comment')
    expect(html).toContain('entry file')
  })

  it('should render fence with ellipsis', () => {
    const md = createMarkdown()
    const code = `\
\`\`\`tree
.
├── src
│   └── …
└── package.json
\`\`\`
`
    const html = md.render(code)
    expect(html).toContain('filename="…"')
  })

  it('should render fence with empty content', () => {
    const md = createMarkdown()
    const code = `\
\`\`\`tree
\`\`\`
`
    const html = md.render(code)
    expect(html).toContain('vp-file-tree')
  })

  it('should render container with empty content', () => {
    const md = createMarkdown()
    const code = `\
::: file-tree
:::
`
    const html = md.render(code)
    expect(html).toContain('vp-file-tree')
  })

  it('should use default locale strings when locale data is missing', () => {
    const md = createMarkdown({}, {})
    const code = `\
\`\`\`tree
.
├── src
└── package.json
\`\`\`
`
    const html = md.render(code, { filePathRelative: '/index.md' })
    expect(html).toContain('aria-label="Copy"')
    expect(html).toContain('data-copied="Copied"')
  })

  it('should render container with default locale strings', () => {
    const md = createMarkdown({}, {})
    const code = `\
::: file-tree
- src
:::
`
    const html = md.render(code, { filePathRelative: '/index.md' })
    expect(html).toContain('aria-label="Copy"')
    expect(html).toContain('data-copied="Copied"')
  })

  it('should render container with multiple root-level items', () => {
    const md = createMarkdown()
    const code = `\
::: file-tree
- a
- b
- c
:::
`
    const html = md.render(code)
    expect(html).toContain('filename="a"')
    expect(html).toContain('filename="b"')
    expect(html).toContain('filename="c"')
  })

  it('should render fence with deeply nested structure', () => {
    const md = createMarkdown()
    const code = `\
\`\`\`tree
.
├── src
│   ├── components
│   │   └── Header.vue
│   └── utils
│       └── helpers.ts
└── package.json
\`\`\`
`
    const html = md.render(code)
    expect(html).toContain('Header.vue')
    expect(html).toContain('helpers.ts')
  })

  it('should render container with diff markers', () => {
    const md = createMarkdown()
    const code = `\
::: file-tree
- docs
  - ++ added.md
  - -- remove.md
- ++ src
- -- source
:::
`
    const html = md.render(code)
    expect(html).toContain('diff="add"')
    expect(html).toContain('diff="remove"')
  })

  it('should handle tree syntax with title attribute', () => {
    const md = createMarkdown()
    const code = `\
\`\`\`tree title="Project"
.
├── src
└── package.json
\`\`\`
`
    const html = md.render(code)
    expect(html).toContain('vp-file-tree-title')
    expect(html).toContain('Project')
  })
})
