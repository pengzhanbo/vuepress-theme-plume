# Code Block Features

VuePress Plume theme provides rich code block features via Shiki highlighter.

## Code Title

Add `title="filename.ext"` after the language:

```markdown
```json title="package.json"
{
  "name": "vuepress-theme-plume"
}
```
```

## Line Numbers

Theme shows line numbers by default. Control via `codeHighlighter.lineNumbers`:

```typescript title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    codeHighlighter: {
      lineNumbers: true, // [!code ++]
    },
  }),
})
```

Per-block control:
- `:line-numbers` - Enable line numbers
- `:no-line-numbers` - Disable line numbers
- `:line-numbers=2` - Start from line 2

```markdown
```ts:line-numbers
// Line numbers enabled
const line2 = 'This is line 2'
```

```ts:no-line-numbers
// Line numbers disabled
const line3 = 'This is line 3'
```

```ts:line-numbers=2
// Line numbers start from 2
const line3 = 'This is line 3'
```
```

## Line Highlighting

### Bracket Syntax

```markdown
```ts{1,3,5-7}
// Line 1 highlighted
// Line 2 normal
// Line 3 highlighted
// Line 4 normal
// Line 5-7 highlighted
```
```

Formats:
- Single line: `{4}`
- Multiple lines: `{5-8}`, `{3-10}`
- Multiple single lines: `{4,7,9}`
- Combined: `{4,7-13,16,23-27,40}`

### Comment Syntax

```markdown
```ts
const a = 1
const b = 2 // [!code highlight]
const c = 3
```
```

## Line Focus

Focus a line and dim others:

```markdown
```ts
const a = 1
const b = 2 // [!code focus]
const c = 3
```
```

Focus multiple lines:

```markdown
```ts
const a = 1 // [!code focus:3]
const b = 2
const c = 3
const d = 4
```
```

## Diff Highlighting

Show code changes:

```markdown
```ts
const oldVal = 'value' // [!code --]
const newVal = 'value' // [!code ++]
```
```

## Warning and Error

```markdown
```ts
const warning = 'caution' // [!code warning]
const error = 'failed' // [!code error]
```
```

## Word Highlight

Highlight specific words:

```markdown
```ts
// [!code word:config]
const config = {}
console.log(config)
```
```

Highlight with count limit:

```markdown
```ts
// [!code word:api:2]
const api = {}
const apiClient = {}
const apiKey = {} // Not highlighted
```
```

## Whitespace Visibility

Show tabs and spaces:

```markdown
```ts:whitespace
const a = 1
```
```

Global enable:

```typescript title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    codeHighlighter: {
      whitespace: true, // [!code ++]
    },
  }),
})
```

When enabled globally, use `:no-whitespace` to disable per block.

## Collapsed Lines

Collapse long code blocks (default from line 15):

```markdown
```ts:collapsed-lines
// Lines after 15th will be collapsed
```

```ts:collapsed-lines=10
// Lines after 10th will be collapsed
```
```

Global enable:

```typescript title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    codeHighlighter: {
      collapsedLines: true, // [!code ++]
    },
  }),
})
```

When enabled globally, use `:no-collapsed-lines` to disable per block.

## Combining Features

Multiple features can be combined:

```markdown
```ts:title="example.ts":line-numbers {2,4}
const a = 1
const b = 2 // [!code ++]
const c = 3
const d = 4 // [!code focus]
```
```

## Language-Specific Comments

Different languages use different comment syntax:

| Language | Highlight | Focus | Diff Add | Diff Remove |
|----------|-----------|-------|----------|-------------|
| JS/TS/JSX/TSX | `// [!code highlight]` | `// [!code focus]` | `// [!code ++]` | `// [!code --]` |
| Python/Ruby/YAML | `# [!code highlight]` | `# [!code focus]` | `# [!code ++]` | `# [!code --]` |
| CSS/SCSS | `/* [!code highlight] */` | `/* [!code focus] */` | `/* [!code ++] */` | `/* [!code --] */` |
| HTML/XML | `<!-- [!code highlight] -->` | `<!-- [!code focus] -->` | `<!-- [!code ++] -->` | `<!-- [!code --] -->` |
| Bash/Shell | `# [!code highlight]` | `# [!code focus]` | `# [!code ++]` | `# [!code --]` |
| SQL | `-- [!code highlight]` | `-- [!code focus]` | `-- [!code ++]` | `-- [!code --]` |
| Rust | `// [!code highlight]` | `// [!code focus]` | `// [!code ++]` | `// [!code --]` |
| Go | `// [!code highlight]` | `// [!code focus]` | `// [!code ++]` | `// [!code --]` |

## Global Configuration

```typescript title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    codeHighlighter: {
      lineNumbers: true, // Enable line numbers globally
      whitespace: false, // Show whitespace globally
      collapsedLines: false, // Collapse lines globally
      theme: { light: 'github-light', dark: 'github-dark' },
      languages: ['js', 'ts', 'vue', 'bash', 'json'],
      twoslash: false, // TypeScript twoslash
    },
  }),
})
```
