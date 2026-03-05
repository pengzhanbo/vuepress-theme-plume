# Code Block Features

VuePress Plume theme provides rich code block features via Shiki highlighter.

## Line Numbers

````md
```ts:line-numbers
// Enable line numbers (default)
```

```ts:no-line-numbers
// Disable line numbers
```

```ts:line-numbers=2
// Start from line 2
```
````

## Line Highlighting

### Bracket Syntax

````md
```ts{1,3,5-7}
// Line 1 highlighted
// Line 2 normal
// Line 3 highlighted
// Line 4 normal
// Line 5-7 highlighted
```
````

### Comment Syntax

````md
```ts
const a = 1
const b = 2 // [!code highlight]
const c = 3
```
````

## Line Focus

Focus a line and dim others:

````md
```ts
const a = 1
const b = 2 // [!code focus]
const c = 3
```
````

Focus multiple lines:

````md
```ts
const a = 1 // [!code focus:3]
const b = 2
const c = 3
const d = 4
```
````

## Diff Highlighting

Show code changes:

````md
```ts
const oldVal = 'value' // [!code --]
const newVal = 'value' // [!code ++]
```
````

## Warning and Error

````md
```ts
const warning = 'caution' // [!code warning]
const error = 'failed' // [!code error]
```
````

## Word Highlight

Highlight specific words:

````md
```ts
// [!code word:config]
const config = {}
console.log(config)
```
````

Highlight with count limit:

````md
```ts
// [!code word:api:2]
const api = {}
const apiClient = {}
const apiKey = {} // Not highlighted
```
````

## Whitespace Visibility

Show tabs and spaces:

````md
```ts:whitespace
const a = 1
```
````

## Collapsed Lines

Collapse long code blocks:

````md
```ts:collapsed-lines
// Lines after 15th will be collapsed
```

```ts:collapsed-lines=10
// Lines after 10th will be collapsed
```
````

## Code Title

Add filename to code block:

````md
```ts title="config.ts"
const config = {}
```

```ts title="/path/to/file.ts"
const code = {}
```
````

## Combining Features

Multiple features can be combined:

````md
```ts:title="example.ts":line-numbers {2,4} // [!code highlight]
const a = 1
const b = 2 // [!code ++]
const c = 3
const d = 4 // [!code focus]
```
````

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

Enable features globally in `.vuepress/config.ts`:

```ts
export default defineUserConfig({
  theme: plumeTheme({
    codeHighlighter: {
      lineNumbers: true, // Enable line numbers globally
      whitespace: true, // Show whitespace globally
      collapsedLines: true, // Collapse lines globally
    }
  })
})
```

When enabled globally, use `:no-line-numbers`, `:no-whitespace`, `:no-collapsed-lines` to disable per block.
