import type { FileTreeOptions } from '../src/shared/fileTree.js'
import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { fileTreePlugin, parseFileTreeNodeInfo, parseFileTreeRawContent } from '../src/node/container/fileTree.js'

describe('fileTree > parseFileTreeRawContent', () => {
  it('should work', () => {
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
    const nodes = parseFileTreeRawContent(content)
    expect(nodes).toMatchSnapshot()
  })
})

describe('fileTree > parseFileTreeNodeInfo', () => {
  it('should work', () => {
    expect(parseFileTreeNodeInfo('README.md'))
      .toEqual({ filename: 'README.md', comment: '', focus: false, expanded: true, type: 'file' })

    expect(parseFileTreeNodeInfo('README.md # comment'))
      .toEqual({ filename: 'README.md', comment: '# comment', focus: false, expanded: true, type: 'file' })

    expect(parseFileTreeNodeInfo('**Navbar.vue**'))
      .toEqual({ filename: 'Navbar.vue', comment: '', focus: true, expanded: true, type: 'file' })

    expect(parseFileTreeNodeInfo('**Navbar.vue** # comment'))
      .toEqual({ filename: 'Navbar.vue', comment: '# comment', focus: true, expanded: true, type: 'file' })
  })

  it('should work with expanded', () => {
    expect(parseFileTreeNodeInfo('folder/'))
      .toEqual({ filename: 'folder', comment: '', focus: false, expanded: false, type: 'folder' })

    expect(parseFileTreeNodeInfo('folder/ # comment'))
      .toEqual({ filename: 'folder', comment: '# comment', focus: false, expanded: false, type: 'folder' })

    expect(parseFileTreeNodeInfo('**folder/**'))
      .toEqual({ filename: 'folder', comment: '', focus: true, expanded: false, type: 'folder' })

    expect(parseFileTreeNodeInfo('**folder/** # comment'))
      .toEqual({ filename: 'folder', comment: '# comment', focus: true, expanded: false, type: 'folder' })
  })
})

function createMarkdown(options?: FileTreeOptions) {
  return new MarkdownIt().use(fileTreePlugin, options)
}

describe('fileTreePlugin', () => {
  const code = `\
:::file-tree
- docs
  - README.md
  - foo.md
- src
  - client
    - components
      - **Navbar.vue**
    - index.ts \# comment
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
  it('should work with default options', () => {
    const md = createMarkdown()

    expect(md.render(code)).toMatchSnapshot()
  })
})
