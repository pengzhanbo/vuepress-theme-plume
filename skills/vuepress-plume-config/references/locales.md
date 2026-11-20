# Locales / i18n Reference

Locale keys are **route prefixes**: `'/'` → `sourceDir` root, `'/en/'` → `sourceDir/en/`.
`.vuepress/` is shared; do not duplicate it per language.

Built-in languages:

| lang | prefix | lang | prefix |
| --- | --- | --- | --- |
| `zh-CN` | `/zh/` | `fr-FR` | `/fr/` |
| `zh-TW` | `/zh-tw/` | `de-DE` | `/de/` |
| `en-US` | `/en/` | `ru-RU` | `/ru/` |
| `ja-JP` | `/ja/` | `ko-KR` | `/ko/` |

The default locale usually uses `'/'` and needs no `lang` (VuePress site `lang` covers it).

```ts
plumeTheme({
  locales: {
    '/': {
      selectLanguageName: '简体中文',
      collections: [{ type: 'post', dir: 'blog', title: '博客' }],
      navbar: [{ text: '首页', link: '/' }],
    },
    '/en/': {
      selectLanguageName: 'English',
      collections: [{ type: 'post', dir: 'blog', title: 'Blog' }],
      navbar: [{ text: 'Home', link: '/en/' }],
    },
  },
})
```

Every locale-level option from `theme-options.md` may appear inside a locale, notably `collections`,
`navbar`, `profile`, `social`, `sidebar`, `outline`, `footer`, `feed`, `series`, `relatedPosts`, `linkPreview`,
`readerPreferences`, `encrypt`, `autoFrontmatter`.

Options that are **global only** and are silently ignored inside `locales`: `plugins`, `markdown`,
`codeHighlighter`, `components`, `search`, `comment`, `watermark`, `readingTime`, `copyCode`, `replaceAssets`,
`llmstxt`, `hostname`, `cache`, `editLink`, `lastUpdated`, `contributors`, `changelog`, `configFile`.

## Text keys (`ThemeLocaleText`)

Grouped by area; all values are `string` unless noted. Only set keys you translate.

**Navigation / lists**
`appearanceText`, `lightModeSwitchTitle`, `darkModeSwitchTitle`, `selectLanguageName`, `selectLanguageText`,
`homeText`, `postsText`, `postsExtractLabel`, `tagText`, `categoryText`, `archiveText`, `archiveTotalText`,
`prevPageLabel`, `nextPageLabel`, `openNewWindowText`.

**Accessibility / layout**
`sidebarMenuLabel`, `sidebarNavigationLabel`, `toggleSidebarLabel`, `returnToTopLabel`, `closeLabel`,
`skipToContentLabel`, `mobileNavLabel`, `printLabel`, `scrollDownLabel`, `outlineLabel`.

**Page meta**
`editLinkText`, `lastUpdatedText`, `contributorsText`, `changelogText`, `changelogOnText`, `changelogButtonText`,
`relatedPostsText`, `relatedPostsLabel`.

**Copyright**
`copyrightText`, `copyrightAuthorText`, `copyrightLicenseText`,
`copyrightCreationOriginalText`, `copyrightCreationTranslateText`, `copyrightCreationReprintText`.

**404** — `notFound: { code?, title?, quote?, linkLabel?, linkText? }`.

**Reader panel** (`readerPreferences`)
`readerPreferencesText`, `readerPanelLabel`, `readerWidthText`, `readerWidthNarrowText`,
`readerWidthStandardText`, `readerWidthWideText`, `readerWidthFullText`, `readerThemeText`,
`readerThemeDefaultText`, `readerThemeWarmText`, `readerThemeSepiaText`, `readerThemeDarkDisabledText`,
`readerBrandText`, `readerBrandDefaultText`, `readerAidText`, `readerAidOffText`, `readerAidMaskText`,
`readerAidLeftText`, `readerAidRightText`, `readerResetText`, `readerResumeText` (supports `{percent}`),
`readerResumeActionText`, `readerResumeRestartText`, `readerFocusModeText`, `readerFocusModeExitLabel`,
`readerFocusModeEnterText`, `readerProgressLabel`.

**Page context menu** (search / copy / AI links)
`pageContextMenuLabel`, `copyPageText`, `copiedPageText`, `copingPageText`, `copyTagline`, `viewMarkdown`,
`viewMarkdownTagline`, `askAIText`, `askAITagline`, `askAIMessage`.

**Encryption**
`encryptGlobalText`, `encryptPageText`, `encryptButtonText`, `encryptPlaceholder`, `encryptErrorText`.

Locale-object keys must be plain strings (no functions) — they are serialized into the client bundle.
