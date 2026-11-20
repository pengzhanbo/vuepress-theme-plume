# Built-in Features Reference

Each feature is exposed as a **top-level theme option** (hot-reloadable, wins over `plugins.*`) unless noted.

## search

```ts
search: { provider: 'local' }        // default
search: false                        // disable; navbar search box disappears
search: { provider: 'algolia', appId: 'APP_ID', apiKey: 'API_KEY', indexName: 'INDEX' }
```

`provider: 'algolia'` without `appId`/`apiKey` registers **no** search plugin (console error). Underlying entries:
`plugins.search`, `plugins.docsearch` (no hot reload). Encrypted pages are never indexed.

## comment (default `false`, global only)

```ts
comment: {
  provider: 'Giscus', // 'Giscus' | 'Waline' | 'Twikoo' | 'Artalk'
  repo: 'owner/repo', repoId: '...', category: 'Announcements', categoryId: '...',
  // lightTheme / darkTheme also accepted
}
comment: { provider: 'Waline', serverURL: 'https://waline.example.com' } // needs @waline/client
comment: { provider: 'Twikoo', envId: 'env-id' }
comment: { provider: 'Artalk', server: 'https://artalk.example.com' }
```

Giscus/Twikoo are bundled; Waline/Artalk clients must be installed by the user. Per-page: frontmatter
`comments: false`.

## watermark (default off)

```ts
watermark: true
watermark: {
  enabled: (page) => page.path.includes('/article/'), // boolean | function
  fullPage: true, // theme extension: false = content area only
  watermarkOptions: { content: 'name', fontColor: '#fff' },
}
```

Client-side only, never written into the build output — use `encrypt` when content must be protected.
Per-page: `watermark: true | { content, globalAlpha, rotate, fullPage, contentType, ... }`.

## encrypt (site & page, default off)

```ts
encrypt: { global: true, admin: ['123456'] } // whole site; `admin` = super password
encrypt: {
  rules: {
    'blog/secret.md': '123456',        // file path relative to sourceDir
    '/notes/private/': '123456',       // directory
    '/article/f8dnci3/': '123456',     // route
    '^/(a|b)/': '123456',              // regex when starting with ^
  },
}
```

Per-page: `password: '123456'`, `passwordHint: '...'`. Partial (page/content) encryption requires **HTTPS**.
`markdown.encrypt` (in `markdown`) enables the `::: encrypt` snippet container — see the markdown skill.

## llmstxt (default off, build only)

```ts
llmstxt: true
llmstxt: { locale: '/', /* @vuepress/plugin-llms options */ }
```

Emits `/llms.txt`, `/llms-full.txt` and per-page markdown. Pages use `<llm-only>` / `<llm-exclude>` markers.

## feed (default off, build only, needs `hostname`)

```ts
hostname: 'https://example.com',
feed: {
  perCollection: true,     // dedicated channel per qualifying collection
  perSeries: true,         // /series/<id>/feed.xml
  includeDocCollections: false,
  content: 'excerpt',      // | 'full'
  limit: 20,               // 1–200
  excerptLength: 240,
  formats: ['rss'],        // rss | atom | json
  filename: { rss: 'feed.xml', atom: 'atom.xml', json: 'feed.json' },
  channel: { title: '...', description: '...', link: '/', author: { name, email }, icon, ttl },
  linkTag: true,           // inject <link rel="alternate">
  debug: false,
}
```

Opt-out per page: `feed: false`; override entry: `feed: { title, summary, guid, description }`.
Collection level: `collections[].feed`; series level: `series.items[id].feed`.
Encrypted pages, drafts, `article: false` and non-content layouts never enter a feed.

## series (default off)

```ts
series: true
series: {
  page: true,                 // generate landing pages
  linkPrefix: '/series/',
  index: false,               // overview page at linkPrefix root
  autoCreate: true,
  order: 'auto',              // 'auto' | 'order' | 'time'
  nav: true,                  // in-article cross links
  items: {
    'vue3-in-depth': { title: 'Vue 3 深入浅出', description: '...', cover: '/x.png', order: 'order', nav: true },
  },
}
```

Cross-collection grouping; does not change URLs or prev/next semantics. Pages declare `series: '<id>'`,
`seriesOrder: 1`, `seriesNav: false`. Series entries are not auto-added to `navbar`.

## relatedPosts (default off, computed at build time)

```ts
relatedPosts: true
relatedPosts: {
  limit: 4, minScore: 0.12, diversity: 0.3, recency: 0,
  weights: { tags: 3, category: 2, title: 2, headings: 1.5, content: 1 },
  scope: 'collection', // | 'locale'
  contentLimit: 2000, cjk: 'segmenter', // | 'bigram'
  showExcerpt: false, excerptLength: 80,
  exclude: ['/changelog/**'], seriesBoost: 1, seriesNextBoost: 0, debug: false,
}
```

Collection-level `relatedPosts` overrides the theme value. Page: `relatedPosts: false | ['/a/', '/b/']`.

## linkPreview (default off, build-time data)

```ts
linkPreview: true
linkPreview: {
  delay: 150, focusDelay: 0, selector: '.vp-doc a[href]',
  showExcerpt: true, excerptLength: 120,
  showHeadings: false, headingsLimit: 3,
  showTags: true, showUpdatedTime: true,
  maxWidth: 360, exclude: ['/changelog/**'],
}
```

Locale-scoped (`locales['/en/'].linkPreview`). Page: `linkPreview: false`; link-level
`<a data-no-link-preview>` or `{.no-link-preview}`.

## readerPreferences (default off)

```ts
readerPreferences: true
readerPreferences: {
  width: { presets: ['narrow', 'wide', 'full'] }, // default ['narrow','wide','full']
  theme: { presets: ['default', 'warm', 'sepia'] },
  brand: false,                                   // brand palette presets
  readAid: true,                                  // false | 'mask' | 'left' | 'right' | { modes, default }
  focusMode: true,
  resume: { prompt: true, ttl: 90, max: 300, minPercent: 0.05 },
  storagePrefix: 'plume',
}
```

Custom palettes: `{ name, label?, color?, tokens: { 'vp-c-bg': '#...' } }`; locale-level presets merge by `name`.
`width` / `readAid` / `focusMode` are desktop-only (disabled ≤ 768px). Page: `reader: false`.

## bulletin (default off)

```ts
bulletin: {
  layout: 'top-right', // top-left | top-right | bottom-left | bottom-right | center
  border: true,
  enablePage: (page) => page.path === '/', // boolean | function
  lifetime: 'always',  // 'session' | 'once' | 'always'
  id: 'my-bulletin',
  title: '...',
  contentType: 'text', // | 'markdown'
  content: '...',
  contentFile: path.join(__dirname, '_bulletin.md'), // hot-watched
}
```

## copyright (default off)

```ts
copyright: 'CC-BY-4.0'
copyright: {
  license: { name: 'MIT', url: 'https://...' },
  author: { name: 'Name', url: 'https://...' },
  creation: 'original', // 'translate' | 'reprint'
}
```

Built-in licenses: `CC0`, `CC-BY-4.0`, `CC-BY-SA-4.0`, `CC-BY-NC-4.0`, `CC-BY-ND-4.0`,
`CC-BY-NC-SA-4.0`, `CC-BY-NC-ND-4.0` (any string accepted). Page: `copyright: false | 'CC-BY-4.0' |
{ creation, license, source, author }`.

## replaceAssets (default off)

```ts
replaceAssets: 'https://cdn.example.com'                        // prefix, built-in `all` rule set
replaceAssets: { image: 'https://img.cdn/', media: 'https://media.cdn/' }
replaceAssets: { find: /^\/images\/.*\.(jpg|png)$/, replacement: (url) => `https://cdn${url}` }
replaceAssets: [{ find: '/images/', replacement: 'https://cdn/images/' }]
```

Built-in rule sets: `image` (apng/bmp/png/jpeg/jpg/gif/svg/ico/webp/avif/cur/jxl), `media`
(mp4/webm/ogg/mp3/wav/flac/aac/opus/mov/m4a/vtt/pdf), `all`. String `find` starting with `^`/ending with `$`
becomes a regex. Only rewrite URLs of files placed in `public/`. Recommended: enable in production only.

## changelog (default off, needs git plugin)

```ts
changelog: { maxCount: 10, repoUrl: 'https://github.com/o/r', commitUrlPattern: ':repo/commit/:hash' }
```

Requires full git history (CI: `fetch-depth: 0`). Page: `changelog: true`.

## contributors (default `true`, needs git data)

```ts
contributors: {
  mode: 'block', // 'inline' (default) | 'block'
  info: [{ username: 'x', name: 'X', alias: ['y'], avatar: '...', url: '...' }],
  avatar: true, avatarPattern: 'https://github.com/:username.png',
}
plugins: { git: true } // git plugin is production-only by default
```

Page: `contributors: false | ['name']`.

## SEO / sitemap (enabled, need `hostname`, production only)

```ts
hostname: 'https://example.com',
plugins: { seo: { /* @vuepress/plugin-seo */ }, sitemap: { /* ... */ } }
```

`plugins.seo: false` / `plugins.sitemap: false` disable them. Injects OGP, JSON-LD.

## Image preview (`plugins.photoSwipe`, enabled)

```ts
plugins: { photoSwipe: { selector: '.vp-doc :not(a) > img:not([no-view],.no-view,.ignore)', download: true } }
```

Skip an image with `{.no-view}` / `{.ignore}` or the `no-view` attribute.
