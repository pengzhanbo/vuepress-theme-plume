import type { FileTreeOptions } from '../src/shared/fileTree.js'
import MarkdownIt from 'markdown-it'
import { describe, expect, it } from 'vitest'
import { fileTreePlugin } from '../src/node/container/fileTree.js'

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
:::
`
  it('should work with default options', () => {
    const md = createMarkdown()

    expect(md.render(code)).toMatchSnapshot()
  })
})
