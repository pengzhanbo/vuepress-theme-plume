# Theme Options Reference

Source of truth: `theme/src/shared/options.ts` (`ThemeFeatureOptions` + `ThemeConfig` + `ThemeData`) for
`vuepress-theme-plume@1.0.0-rc.218`. `plumeTheme()` accepts `ThemeOptions`; `defineThemeConfig()` accepts
`ThemeConfig` (hot-reloadable subset).

## 1. Global options (`plumeTheme()` only where marked)

| Option | Type | Default | `plume.config.ts` |
| --- | --- | --- | --- |
| `configFile` | `string` | `''` | no |
| `plugins` | `ThemeBuiltinPlugins` | `{}` | no |
| `markdown` | `MarkdownOptions` | `{}` | no |
| `codeHighlighter` | `false \| ShikiPluginOptions & { renderIndentGuides?, colorizedBrackets? }` | `{}` | no |
| `components` | `unplugin-vue-components` options (minus `include`/`exclude`) | `undefined` | no |
| `search` | `boolean \| SearchOptions` | `{ provider: 'local' }` | no |
| `comment` | `false \| CommentPluginOptions` | `false` | no |
| `watermark` | `boolean \| WatermarkPluginOptions & { fullPage? }` | `false` | no |
| `readingTime` | `false \| ReadingTimePluginOptions` | enabled (`wordPerMinute: 300`); set `false` to disable | no |
| `copyCode` | `false \| CopyCodePluginOptions` | `{}` (enabled) | no |
| `replaceAssets` | `false \| ReplaceAssetsPluginOptions` | `false` | no |
| `llmstxt` | `boolean \| LlmsPluginOptions` | `false` | no |
| `hostname` | `string` | `''` | no |
| `cache` | `false \| 'memory' \| 'filesystem'` | `'filesystem'` | no |
| `editLink` | `boolean` | `true` | no |
| `lastUpdated` | `false \| { formatOptions }` | `{ formatOptions: { dateStyle: 'short', timeStyle: 'short' } }` | no |
| `contributors` | `boolean \| ContributorsOptions & { mode?: 'inline' \| 'block' }` | `true` | no |
| `changelog` | `boolean \| ChangelogOptions` | `false` | no |
| `autoFrontmatter` | `false \| { title?, createTime?, permalink? }` | `{ title: true, createTime: true, permalink: true }` | yes |
| `encrypt` | `EncryptOptions` | `undefined` | yes |
| `feed` | `boolean \| FeedOptions` | `false` | yes |
| `series` | `boolean \| SeriesOptions` | `false` | yes |
| `relatedPosts` | `boolean \| RelatedPostsOptions` | `false` | yes |
| `linkPreview` | `boolean \| LinkPreviewOptions` | `false` | yes |
| `readerPreferences` | `boolean \| ReaderPreferencesOptions` | `false` | yes |
| `bulletin` | `boolean \| BulletinOptions` | `false` | yes |
| `copyright` | `boolean \| CopyrightLicense \| CopyrightOptions` | `false` | yes |
| `footer` | `false \| { message, copyright? }` | `{ message: 'Powered by VuePress & vuepress-theme-plume' }` | yes |
| `transition` | `boolean \| TransitionOptions` | `true` | yes |
| `locales` | `Record<string, ThemeLocaleData>` | `{}` | yes |

`autoFrontmatter.permalink` accepts `true | false | 'filepath'`; `createTime`/`title` are booleans.
Set `autoFrontmatter: false` to disable — an object never disables it.

## 2. Locale-level options

All of the following work both as top-level options and inside `locales['/xx/']`:

| Option | Type | Default |
| --- | --- | --- |
| `home` | `false \| string` | `'/'` |
| `logo` / `logoDark` | `false \| string` | `false` |
| `appearance` | `boolean \| 'dark' \| 'force-dark'` | `true` |
| `profile` | `ProfileOptions` | `undefined` |
| `social` | `SocialLink[]` | `[]` |
| `navbarSocialInclude` | `string[]` | `['github', 'twitter', 'discord', 'facebook']` |
| `navbar` | `ThemeNavItem[]` | `[]` → runtime fallback (首页 / 博客 / 标签 / 归档) |
| `collections` | `ThemeCollectionItem[]` | `[]` |
| `sidebar` | `false \| SidebarMulti` | — (prefer `collections[].sidebar`) |
| `sidebarScrollbar` | `boolean` | `true` |
| `aside` | `boolean \| 'left'` | `true` |
| `outline` | `false \| number \| [number, number] \| 'deep'` | `[2, 3]` |
| `transition` | `boolean \| { page?, postList?, appearance? }` | `true` |
| `readerPreferences` | `boolean \| ReaderPreferencesOptions` | `false` |
| `relatedPosts` | `boolean \| RelatedPostsOptions` | `false` |
| `series` | `boolean \| SeriesOptions` | `false` |
| `linkPreview` | `boolean \| LinkPreviewOptions` | `false` |
| `feed` | `boolean \| FeedOptions` | `false` |
| `footer` | `false \| { message, copyright? }` | default footer message |
| `editLinkPattern` | `string` | `''` (`':repo/edit/:branch/:path'`) |
| `externalLinkIcon` | `boolean` | `true` |
| `copyright` | see above | `false` |
| `prevPage` / `nextPage` | `boolean` | `true` |
| `createTime` | `boolean \| 'only-posts'` | `true` |
| `docsRepo` / `docsBranch` / `docsDir` | `string` | `''` (typed on `ThemeOptions` only) |

`transition.appearance` accepts `'fade' | 'circle-clip' | 'horizontal-clip' | 'vertical-clip' | 'skew-clip' | 'blinds-vertical' | 'blinds-horizontal' | 'soft-blur-fade' | 'diamond-reveal' | false`.

## 3. Deprecated — do not emit

| Deprecated | Replacement |
| --- | --- |
| `blog` | `collections` |
| `notes` / `note` | `collections` |
| `readAid` (theme & collection level) | `readerPreferences.readAid` |
| `profile.url` | `profile.avatar` |
| locale-level `avatar` | `profile` |
| `sidebar[].path` | `sidebar[].prefix` |
| collection/frontmatter `externalLink` | `externalLinkIcon` |
| frontmatter `home: true` | `pageLayout: 'home'` |
| frontmatter `friends: true` | `pageLayout: 'friends'` |
| frontmatter `pageLayout: 'blog'` | `pageLayout: 'posts'` |
| hero `background` / `backgroundConfig` | hero `effect` / `effectConfig` |
| `plugins.markdownEnhance` | `markdown` |

## 4. Sidebar type

```ts
type SidebarMulti = Record<
  string, // 访问路径前缀，如 '/guide/'
  | 'auto'
  | (string | ThemeSidebarItem)[]
  | { items: 'auto' | (string | ThemeSidebarItem)[]; prefix?: string }
>
```

## 5. Notes

- `outline` is ignored when `aside: false`; both can be overridden per page via frontmatter.
- `footer: false` is the only way to hide the footer.
- `cache` only works after removing `--clean-cache` from the dev script.
- `contributors` / `changelog` / `lastUpdated` need the git plugin (production only by default).
