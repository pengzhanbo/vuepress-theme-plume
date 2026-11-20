# `markdown` & `codeHighlighter` Reference

`markdown` is the theme's own option — **not** VuePress's `markdown` config. Do not put these keys in
`defineUserConfig({ markdown: ... })`. `markdown` and `codeHighlighter` are `plumeTheme()`-only.

```ts
plumeTheme({
  markdown: { /* ... */ },
  codeHighlighter: { /* ... */ },
})
```

## Feature switches (`markdown.*`) and defaults

Enabled by default (do not emit them unless changing something):

| Key | Type | Default |
| --- | --- | --- |
| `hint` | `boolean` | `true` (info/tip/warning/caution/details) |
| `alert` | `boolean` | `true` (GitHub alerts, rendered by obsidian callout while `obsidian` is on) |
| `fileTree` | `boolean \| FileTreeOptions` | `true` |
| `plot` | `boolean \| PlotOptions` | `true` |
| `icon` | `IconOptions` | `{ provider: 'iconify' }` |
| `math` | `false \| MarkdownMathPluginOptions` | `{ type: 'katex' }` |
| `include` | `false \| MarkdownIncludePluginOptions` | `true` |
| `obsidian` | `boolean \| ObsidianOptions` | enabled unless explicitly `false` |
| `mark` | `MarkOptions` | `'eager'` |
| `codeTabs` | `CodeTabsOptions` (`{ icon?: boolean }`) | `{ icon: true }` — container itself always available |
| `tabs` | — | no option; `::: tabs` is always available |

Disabled by default (must be enabled explicitly):

`annotation`, `abbr`, `encrypt`, `codeTree`, `npmTo`, `field`, `table`, `timeline`, `collapse`, `chat`, `demo`,
`pdf`, `acfun`, `bilibili`, `youtube`, `artPlayer`, `audioReader`, `codepen`, `codeSandbox`, `jsfiddle`,
`caniuse`, `qrcode`, `imageSize`, `image`, `chartjs`, `echarts`, `mermaid`, `markmap`, `plantuml`, `flowchart`.

Deprecated: `replit` (use `repl`), `icons` (use `icon`), `oldDemo` (use `demo`).

Others:

| Key | Type | Notes |
| --- | --- | --- |
| `env` | `MarkdownEnvPreset` | preset references / abbreviations / annotations for all files |
| `annotation` | `boolean \| Record<string, string \| string[]>` | `true` or preset map |
| `abbr` | `boolean \| Record<string, string>` | `true` or preset map |
| `repl` | `false \| ReplOptions` | `:::rust-repl` / `go-repl` / `kotlin-repl` / `python-repl` |
| `imageSize` | `boolean \| 'local' \| 'all'` | production build only |
| `obsidian` | `boolean \| { wikiLink?, embedLink?, callout?, comment? }` | all sub-options default `true` |
| `locales` | `LocaleConfig<MDPowerLocaleData>` | plugin UI strings |
| `DANGEROUS_ALLOW_SCRIPT_EXECUTION` | `boolean` | default `false` — chart scripts are not executed |
| `DANGEROUS_SCRIPT_EXECUTION_ALLOWLIST` | `string[] \| '*'` | only with the flag above |

Enabling a chart family: `markdown: { mermaid: true }`, `{ echarts: true }`, `{ chartjs: true }`,
`{ markmap: true }`, `{ flowchart: true }`, `{ plantuml: true }` (or
`plantuml: [{ server: 'https://your-plantuml-server/' }]`; default server is the public
`https://www.plantuml.com/plantuml`).

Syntax of each feature is documented in the `vuepress-plume-markdown` skill.

## `codeHighlighter`

Shiki-based. Default `{}` (enabled).

```ts
codeHighlighter: {
  themes: { light: 'vitesse-light', dark: 'vitesse-dark' },
  lineNumbers: true,          // global line numbers
  whitespace: false,
  collapsedLines: false,
  twoslash: true,             // or { compilerOptions: { paths: { '@/*': ['./src/*'] } } }
  langs: ['ts', 'vue'],       // extra languages
  renderIndentGuides: true,   // theme extension
  colorizedBrackets: true,    // theme extension
}
```

`false` disables highlighting entirely. Per-block toggles: `:line-numbers`, `:no-line-numbers`,
`:line-numbers=2`, `:whitespace`, `:no-whitespace`, `:collapsed-lines[=n]`, `:no-collapsed-lines`.

## `components`

Auto-import local Vue components via `unplugin-vue-components` (full option set minus `include`/`exclude`):

```ts
components: { dirs: [path.resolve(import.meta.dirname, 'components')] }
```

## Related top-level options

`copyCode` (`false | { showInMobile, ignoreSelector, inlineSelector, transform }`, enabled by default),
`readingTime` (`false | { wordPerMinute }`), `image`/`imageSize` under `markdown`, and the
`@vuepress/plugin-markdown-image` figure syntax.
