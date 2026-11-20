---
name: vuepress-plume-config
description: Writes and maintains configuration for the VuePress Plume theme (vuepress-theme-plume 1.0.0-rc.218+). Should be used when initializing a Plume site or editing `.vuepress/config.ts` / `.vuepress/plume.config.ts` — collections (post/doc), navbar, sidebar, locales/i18n, frontmatter, built-in plugins, and theme features such as search, comments, watermark, encrypt, feed, series, related posts, link preview, reader preferences, llmstxt, bulletin, copyright, markdown and codeHighlighter.
---

# VuePress Plume Config

Generate, edit and validate Plume theme configuration against the current theme version. Every option referenced here exists in `vuepress-theme-plume@1.0.0-rc.218`; anything not listed must be treated as non-existent.

## When to Invoke

- Initialize theme config for a new Plume site, or migrate an old one.
- Add/modify `collections` (post/doc), `navbar`, `sidebar`, `locales`, `profile`, `social`.
- Enable or tune built-in features: search, comment, watermark, encrypt, feed, series, relatedPosts, linkPreview, readerPreferences, llmstxt, bulletin, copyright, replaceAssets, changelog, contributors.
- Configure `markdown` / `codeHighlighter` / `plugins` switches.
- Write or review page frontmatter.

## Golden Rules

1. **One option, one place.** Never configure the same field in both `.vuepress/config.ts` and `.vuepress/plume.config.ts`.
2. **Prefer `plume.config.ts`** for anything it supports (hot reload, no dev-server restart). Use `config.ts` for the rest.
3. **`plugins.*` vs top-level keys.** When both exist, the top-level key (`search`, `comment`, `watermark`, `markdown`, `codeHighlighter`, `readingTime`, `copyCode`, `replaceAssets`, `llmstxt`, `cache`) wins over `plugins.<key>` — prefer the top-level key and keep `plugins.*` for options without one (`seo`, `sitemap`, `photoSwipe`, `nprogress`, `git`). Neither form is allowed in `plume.config.ts`.
4. **Collections are the content model.** Blogs/series → `post`; docs/notes/knowledge bases → `doc`. `sidebar` / `profile` / `social` can be set per collection; `navbar` is per locale only.
5. **Omit defaults.** Only emit a field when the user's intent differs from the documented default (see `references/`).
6. **Never emit deprecated keys**: `blog`, `notes`, `note`, `profile.url`, locale-level `avatar`, `sidebar[].path`, frontmatter `home`, `friends`, `externalLink`, `pageLayout: 'blog'`, hero `background`/`backgroundConfig`.
7. **`hostname` is required** for `feed`, `seo` and `sitemap`; without it they silently skip.
8. **Verify before finishing**: run `pnpm vuepress build` (or `pnpm docs:build`) when the project is available, otherwise re-read the written file and check against `references/`.

## Two Config Surfaces

```ts
// .vuepress/config.ts — full control, editing restarts the dev server
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  lang: 'zh-CN',
  title: 'My Site',
  description: '...',
  bundler: viteBundler(),
  theme: plumeTheme({
    hostname: 'https://example.com',
  }),
})
```

```ts
// .vuepress/plume.config.ts — hot-reloadable subset, `defineThemeConfig`
import navbar from './navbar'
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  navbar,
  collections: [{ type: 'post', dir: 'blog', title: '博客' }],
})
```

**Not supported in `plume.config.ts`** (put them in `plumeTheme()`):

`configFile`, `plugins`, `markdown`, `codeHighlighter`, `components`, `search`, `comment`, `watermark`, `readingTime`, `copyCode`, `replaceAssets`, `llmstxt`, `hostname`, `cache`, `editLink`, `lastUpdated`, `contributors`, `changelog`.

`docsRepo` / `docsBranch` / `docsDir` are documented as global options but are absent from the `ThemeConfig` type used by `defineThemeConfig` — write them in `plumeTheme()` to keep type checking clean.

Everything under `locales` (and every locale-level option, e.g. `profile`, `navbar`, `collections`, `sidebar`, `outline`, `footer`, `feed`, `series`, `relatedPosts`, `linkPreview`, `readerPreferences`, `encrypt`, `autoFrontmatter`) is also a top-level option, and is hot-reloadable.

## Workflow

1. **Inspect** the project: `package.json` (theme/VuePress versions, scripts), `.vuepress/config.ts`, `.vuepress/plume.config.ts`, source dir layout (which folders are `post`, which are `doc`), `public/` assets.
2. **Pick the surface** with the table above; edit the existing file in place instead of rewriting it, and preserve comments/ordering.
3. **Compose** the smallest config that satisfies the request. Load only the references you need (`references/*.md`) and copy option names verbatim.
4. **Write** the file (TypeScript, ESM, no `require`, `import type` for types).
5. **Report**: file path, fields written, ignored fields with reason, and any follow-up the feature requires (e.g. `--clean-cache` removal for `cache`, HTTPS for encryption, `fetch-depth: 0` for changelog).

## Reference Index

| File | Read when |
| --- | --- |
| `references/theme-options.md` | Any global / locale-level option, defaults, deprecations |
| `references/collections.md` | `collections`, post/doc specifics, cover styles, badges |
| `references/navigation.md` | `navbar`, `sidebar`, icons, `defineNavbarConfig`, `defineCollection` |
| `references/locales.md` | Multi-language sites, locale path mapping, text keys |
| `references/features.md` | search, comment, watermark, encrypt, feed, series, relatedPosts, linkPreview, readerPreferences, llmstxt, bulletin, copyright, replaceAssets, changelog, contributors, SEO/sitemap |
| `references/plugins.md` | `plugins.*` built-in plugin keys and precedence |
| `references/markdown.md` | `markdown.*` feature switches, `codeHighlighter`, auto-imported components |
| `references/frontmatter.md` | Page frontmatter: common, post, home, friends |

## Minimal Recipes

Blog only:

```ts
plumeTheme({
  hostname: 'https://example.com',
  collections: [{ type: 'post', dir: 'blog', title: '博客' }],
  profile: { name: 'Name', avatar: '/avatar.png' },
  social: [{ icon: 'github', link: 'https://github.com/name' }],
})
```

Docs site:

```ts
plumeTheme({
  hostname: 'https://example.com',
  collections: [{ type: 'doc', dir: 'guide', title: '指南', sidebar: 'auto' }],
  navbar: [{ text: '指南', link: '/guide/', icon: 'mdi:book-open-outline' }],
  outline: 'deep',
  search: { provider: 'local' },
})
```

Feature-rich blog (hot-reloadable part belongs in `plume.config.ts`):

```ts
defineThemeConfig({
  collections: [{ type: 'post', dir: 'blog', title: '博客', feed: true }],
  feed: { perCollection: true, formats: ['rss', 'atom'] },
  series: { index: true },
  relatedPosts: { limit: 4 },
  linkPreview: true,
  readerPreferences: true,
})
```

## Documentation

- <https://theme-plume.vuejs.press/config/intro/>
- <https://theme-plume.vuejs.press/config/theme/>
- <https://theme-plume.vuejs.press/config/collections/>
- <https://theme-plume.vuejs.press/config/frontmatter/basic/>
- <https://theme-plume.vuejs.press/guide/features/>
