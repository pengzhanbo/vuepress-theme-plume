---
url: /en/config/theme/index.md
---
## Overview

Theme configuration is used to customize various features of the theme and control its behavior.
You can configure it in either `.vuepress/config.ts` or `.vuepress/plume.config.ts`.

When a field description includes the following statement, it indicates that the field is not supported for configuration in `.vuepress/plume.config.ts`:

::: warning This field is not supported for configuration in the [Theme Config File `plume.config.ts`](./intro.md#theme-configuration-file).
:::

For fields without the above declaration, you can configure them in either `.vuepress/config.ts`
or `.vuepress/plume.config.ts`. It is generally recommended to configure them in `.vuepress/plume.config.ts`.

::: warning Avoid reconfiguring a field that has already been configured in one configuration file within another configuration file.
:::

::: code-tabs#configs

@tab .vuepress/config.ts

```ts twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // Theme configuration
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  // Theme configuration
})
```

:::

## Basic Configuration

### configFile

* **Type:** `string`
* **Default:** `''`
* **Details:**

  Custom path to the theme configuration file.

  Refer to [Theme Config File `plume.config.ts`](./intro.md#theme-configuration-file) for more information.

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.ts`](./intro.md#theme-configuration-file).
  :::

### plugins

* **Type:** `ThemeBuiltinPlugins`
* **Default:** `{}`
* **Details:**

  Custom configuration for plugins used internally by the theme.

  The plugins used by the theme are configured by default. In most cases, modification is not required.
  For detailed customization, please refer to [this documentation](./plugins/README.md).

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.ts`](./intro.md#theme-configuration-file).
  :::

### encrypt

* **Type:** `EncryptOptions` (`{ global?: boolean; admin?: string | string[]; rules?: Record<string, string | string[]> }`)
* **Default:** `undefined`
* **Details:**

  Site encryption configuration, supporting full-site encryption and article-level encryption.

  When not configured, no encryption is enabled. When `global` is `true`, the whole site is encrypted;
  `admin` is the super-permission password; `rules` specifies article passwords keyed by the file relative path,
  page access path, or directory path, and when a key starts with `^`, it is matched as a regular expression.

  This field supports configuration and hot reload in the [Theme Config File `plume.config.ts`](./intro.md#theme-configuration-file).

### markdown&#x20;

* **Type:** `MarkdownOptions`
* **Default:** `{}`
* **Details:**

  Markdown feature configuration. Refer to [this documentation](./markdown.md).

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.ts`](./intro.md#theme-configuration-file).
  :::

### codeHighlighter&#x20;

* **Type:** `false | (ShikiPluginOptions & { renderIndentGuides?: boolean | object; colorizedBrackets?: boolean | object })`
* **Default:** `{}`
* **Details:**

  Code highlighting configuration. Refer to [this documentation](../guide/code/intro.md).

  In addition to the options of [@vuepress/plugin-shiki](https://ecosystem.vuejs.press/plugins/markdown/shiki.html),
  it also supports two theme-extension options: `renderIndentGuides` (indent guides) and `colorizedBrackets` (colorized brackets).

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.ts`](./intro.md#theme-configuration-file).
  :::

### components

* **Type:** `MarkdownPowerPluginOptions['components']`
* **Default:** `undefined`
* **Details:**

  Automatic component import configuration. The theme uses [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components)
  to implement automatic component import, inheriting all of its configuration options (except `include` and `exclude`).

  ```ts title=".vuepress/plume.config.ts"
  import path from 'node:path'
  import { defineThemeConfig } from 'vuepress-theme-plume'

  export default defineThemeConfig({
    components: {
      dirs: [path.resolve(import.meta.dirname, 'components')],
    },
  })
  ```

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.ts`](./intro.md#theme-configuration-file).
  :::

### search&#x20;

* **Type:** `boolean | SearchOptions`
* **Default:** `{ provider: 'local' }`
* **Details:**

  Search configuration. Refer to [this documentation](../guide/features/search.md).

  `true` is equivalent to `{ provider: 'local' }`; `false` disables search.

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.ts`](./intro.md#theme-configuration-file).
  :::

### comment&#x20;

* **Type:** `false | CommentPluginOptions`
* **Default:** `false`
* **Details:**

  Comment configuration. Refer to [this documentation](../guide/features/comments.md).

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.ts`](./intro.md#theme-configuration-file).
  :::

### watermark&#x20;

* **Type:** `boolean | (WatermarkPluginOptions & { fullPage?: boolean })`
* **Default:** `false`
* **Details:**

  Watermark configuration. Refer to [this documentation](../guide/features/watermark.md).

  In addition to the options of [@vuepress/plugin-watermark](https://ecosystem.vuejs.press/plugins/features/watermark.html),
  the theme additionally supports `fullPage` (default `true`): when `true`, the watermark covers the entire page; when `false`, it only covers the article content area.

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.ts`](./intro.md#theme-configuration-file).
  :::

### readingTime&#x20;

* **Type:** `false | ReadingTimePluginOptions`
* **Default:** `false`
* **Details:**

  Reading time configuration. Refer to [this documentation](./plugins/reading-time.md).

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.ts`](./intro.md#theme-configuration-file).
  :::

### copyCode&#x20;

* **Type:** `false | CopyCodePluginOptions`
* **Default:** `{}`
* **Details:**

  Copy code configuration. Refer to [this documentation](../guide/code/v-copy-code.md).

  ::: tip Enabled by default
  This feature is **on by default** and works without any configuration (the source checks
  `copyCode !== false`). Configure it only to customise behaviour, or set it to `false` to disable it
  entirely.
  :::

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.ts`](./intro.md#theme-configuration-file).
  :::

### replaceAssets&#x20;

* **Type:** `false | ReplaceAssetsPluginOptions`
* **Default:** `false`
* **Details:**

  Replace assets configuration. Refer to [this documentation](../guide/features/replace-assets.md).

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.ts`](./intro.md#theme-configuration-file).
  :::

### llmstxt

* **Type:** `boolean | LlmsPluginOptions`
* **Default:** `false`
* **Details:**

  Whether to generate `llms.txt` and `llms-full.txt` to provide site content to large language models.
  This feature only takes effect during a production build (`vuepress build`).

  Refer to [this documentation](./plugins/llms.md).

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.ts`](./intro.md#theme-configuration-file).
  :::

### hostname

* **Type:** `string`
* **Default:** `''`
* **Details:**

  Deployment site domain name.

  When `hostname` is configured to a valid domain, the theme will generate `sitemap` and SEO-related content.

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.ts`](./intro.md#theme-configuration-file).
  :::

### feed

* **Type:** `boolean | FeedOptions`
* **Default:** `false`
* **Details:**

  Generate RSS 2.0 / Atom 1.0 / JSON Feed 1.1 subscription files. This feature only takes effect during a production build (`vuepress build`).

  ::: warning
  `hostname` is required to generate absolute links; `base` must match the deployment path of the site
  (`/` by default), otherwise the subscription URLs will point to the wrong location.
  :::

  | Option | Type | Default | Description |
  | --- | --- | --- | --- |
  | `perCollection` | `boolean` | `false` | Generate a dedicated channel for every eligible collection |
  | `includeDocCollections` | `boolean` | `false` | Include `doc` collections in the global channel |
  | `content` | `'excerpt' \| 'full'` | `'excerpt'` | Entry content mode: summary or full content |
  | `limit` | `number` | `20` | Max entries per channel (1–200) |
  | `excerptLength` | `number` | `240` | Max summary length, `0` disables the summary |
  | `formats` | `FeedFormat[]` | `['rss']` | Output formats, `rss` / `atom` / `json` |
  | `filename` | `FeedFilenames` | see below | Output filenames |
  | `channel` | `FeedChannelOptions` | — | Channel metadata (title, description, author, icon…) |
  | `linkTag` | `boolean` | `true` | Inject `<link rel="alternate">` into page `<head>` |
  | `debug` | `boolean` | `false` | Print per-channel details in the build log |

  Default filenames: `feed.xml` (RSS), `atom.xml` (Atom), `feed.json` (JSON Feed).

  ```ts
  export default defineUserConfig({
    theme: plumeTheme({
      hostname: 'https://example.com',
      feed: {
        perCollection: true,
        formats: ['rss', 'atom', 'json'],
      },
    }),
  })
  ```

  See [Feed Subscription](../guide/features/feed.md)

### autoFrontmatter

* **Type:** `false | AutoFrontmatterOptions`
* **Default:** Enabled by default, equivalent to `{ title: true, createTime: true, permalink: true }`
* **Details:**

  Whether to automatically add frontmatter configuration to markdown files.
  The feature is disabled only when it is explicitly set to `false`.

  ```ts
  interface AutoFrontmatterOptions {
    /**
     * Whether to automatically generate permalink
     *
     * @default true
     * - true: auto generate permalink
     * - false: do not generate permalink
     * - 'filepath': generate permalink based on file path
     */
    permalink?: boolean | 'filepath'

    /**
     * Whether to automatically generate createTime
     *
     * Reads file creation time by default. `createTime` is more precise (to the second) than the default VuePress `date` field.
     */
    createTime?: boolean

    /**
     * Whether to automatically generate title
     *
     * Uses the filename as the title by default.
     */
    title?: boolean
  }
  ```

### cache

* **Type:** `false | 'memory' | 'filesystem'`
* **Default:** `filesystem`
* **Details:**

  Whether to enable compilation cache, or configure the caching method.

  This configuration item addresses the slow startup speed of VuePress.
  It caches the compilation results during the first service start.
  On subsequent starts, it reads the cache directly, skipping compilation to speed up startup.

  * `false`: Disable cache.
  * `'memory'`: Use memory cache. This method provides faster startup speed but increases memory usage
    as the number of project files grows. Suitable for projects with fewer articles.
  * `'filesystem'`: Use filesystem cache. This method provides a relatively fast and stable startup speed,
    more suitable for projects with substantial content.

  ::: warning
  This field is not supported for configuration in the [Theme Config File `plume.config.ts`](./intro.md#theme-configuration-file).

  For the cache to take effect, you should **remove** the `--clean-cache` parameter from the
  `vuepress dev` development server startup script in your `package.json`.
  :::

### docsRepo

* **Type:** `string`
* **Default:** `''`
* **Details:** Documentation repository configuration, used to generate the `Edit this page` link.

### docsBranch

* **Type:** `string`
* **Default:** `''`
* **Details:** Documentation repository branch configuration, used to generate the `Edit this page` link.

### docsDir

* **Type:** `string`
* **Default:** `''`
* **Details:** Documentation repository directory configuration, used to generate the `Edit this page` link.

### editLink

* **Type:** `boolean`
* **Default:** `true`
* **Details:** Whether to enable the edit link.

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.ts`](./intro.md#theme-configuration-file).
  :::

### lastUpdated

* **Type:** `false | LastUpdatedOptions`
* **Default:** `{ formatOptions: { dateStyle: 'short', timeStyle: 'short' } }`
* **Details:** Last updated time.

```ts
interface LastUpdatedOptions {

  /**
   * Options to set the format of the last updated time.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options
   *
   * @default
   * { dateStyle: 'short', timeStyle: 'short' }
   */
  formatOptions?: Intl.DateTimeFormatOptions & { forceLocale?: boolean }
}
```

::: warning This field is not supported for configuration in the [Theme Config File `plume.config.ts`](./intro.md#theme-configuration-file).
:::

### contributors

* **Type:** `boolean | (ContributorsOptions & { mode?: 'inline' | 'block' })`
* **Default:** `true`
* **Details:** Whether to display contributors.

  When passing an object, you can use the `ContributorsOptions` of [@vuepress/plugin-git](https://ecosystem.vuejs.press/plugins/development/git.html),
  as well as the theme extension `mode?: 'inline' | 'block'` (the display mode of contributors).

  For more configuration, please refer to [this documentation](../guide/features/contributors.md).

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.ts`](./intro.md#theme-configuration-file).
  :::

### changelog

* **Type:** `boolean | ChangelogOptions`
* **Default:** `false`
* **Details:** Whether to display page change history.

  For more configuration, please refer to [this documentation](../guide/features/changelog.md).

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.ts`](./intro.md#theme-configuration-file).
  :::

### locales

* **Type:** `Record<string, ThemeLocaleData>`
* **Default:** `{}`
* **Details:** Multi-language configuration.

  Text configuration for different languages. Refer to [this documentation](./locales.md).

  The multi-language configuration supports all configuration options under the following
  [Locale](#locale-configuration) to control theme behavior in different languages.

## Locale Configuration

::: tip All the following fields are also basic configuration fields and can be configured at the same level as fields like `locales`.
:::

### home

* **Type:** `false | string`
* **Default:** `/`
* **Details:**
  The path to the home page. It will be used for:
  * The logo link in the navbar;
  * The *Back to Home* link on the 404 page;

### logo

* **Type:** `false | string`
* **Default:** `false`
* **Details:** Logo in the navbar.

### logoDark

* **Type:** `false | string`
* **Default:** `false`
* **Details:** Logo in the navbar for Dark mode.

### appearance

* **Type:** `boolean | 'dark' | 'force-dark'`
* **Default:** `true`

Whether to enable dark mode.

* If this option is set to `true`, the default theme will be determined by the user's preferred color scheme.
* If this option is set to `dark`, the theme will be dark by default unless the user manually toggles it.
* If this option is set to `false`, the user will not be able to switch themes.
* If this option is set to `force-dark`, the user will not be able to switch themes, and the theme will be forced to dark.

This option injects an inline script that restores user settings from local storage.
This ensures `[data-theme="dark"]` is applied before the page is rendered to avoid flashing.

### profile

* **Type:** `ProfileOptions`
* **Default:** `undefined`

Configure the blogger's profile, displayed in the right sidebar of the blog.

```ts title=".vuepress/plume.config.ts"
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  profile: {
    avatar: '/avatar.png',
    name: 'Your Name',
    description: 'Your description',
    circle: true,
    location: 'Hangzhou, China',
    organization: 'Your Company',
    layout: 'right',
  },
})
```

### avatar

* **Type:** `string`
* **Default:** `undefined`

Avatar image link, supports local paths or network URLs.

#### name

* **Type:** `string`
* **Default:** `undefined`

Blogger name, displayed below the avatar.

#### description

* **Type:** `string`
* **Default:** `undefined`

Personal description or signature, displayed below the name.

#### circle

* **Type:** `boolean`
* **Default:** `false`

Whether to display the avatar with circular cropping.

#### location

* **Type:** `string`
* **Default:** `undefined`

Geographic location information, displayed in the profile.

#### organization

* **Type:** `string`
* **Default:** `undefined`

Organization or company information, displayed in the profile.

#### layout

* **Type:** `'left' | 'right'`
* **Default:** `'right'`

Layout position of the profile. `'right'` displays in the right sidebar, `'left'` displays in the left sidebar.

### social

* **Type:** `SocialLink[]`
* **Default:** `[]`

Configure social account links, displayed in the profile area. Supports 30+ built-in icons
(e.g., `github`, `twitter`, `discord`, `weibo`, `bilibili`, `zhihu`, etc.), and also supports custom SVG icons.

```ts title=".vuepress/plume.config.ts"
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  social: [
    { icon: 'github', link: 'https://github.com/your-username' },
    { icon: 'twitter', link: 'https://twitter.com/your-username' },
    { icon: 'weibo', link: 'https://weibo.com/your-username' },
    // Custom SVG icon
    { icon: { svg: '<svg>...</svg>', name: 'custom' }, link: 'https://example.com' },
  ],
})
```

#### icon

* **Type:** `string | { svg: string, name?: string }`
* Required

Social icon. Can be a built-in icon name
(e.g., `github`, `twitter`, `discord`, `facebook`, `instagram`, `linkedin`, `mastodon`, `npm`, `slack`,
`youtube`, `qq`, `weibo`, `bilibili`, `gitlab`, `docker`, `juejin`, `zhihu`, `douban`, `steam`,
`stackoverflow`, `xbox`, `tiktok`, `kuaishou`, `bytedance`, `xiaohongshu`, `bluesky`, `gmail`, etc.),
or a custom icon object containing `svg` and an optional `name`.

#### link

* **Type:** `string`
* Required

Social link URL.

#### ariaLabel

* **Type:** `string`
* **Default:** `undefined`

Accessibility label for screen readers. If not set, it will be automatically generated based on the icon name.

### navbarSocialInclude

* **Type:** `string[]`
* **Default:** `['github', 'twitter', 'discord', 'facebook']`

Controls which social links are also displayed in the navbar. Only social links configured in `social`
whose `icon` is in this list will be displayed on the right side of the navbar.

```ts title=".vuepress/plume.config.ts"
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  social: [
    { icon: 'github', link: 'https://github.com/your-username' },
    { icon: 'twitter', link: 'https://twitter.com/your-username' },
    { icon: 'weibo', link: 'https://weibo.com/your-username' },
  ],
  navbarSocialInclude: ['github', 'weibo'], // Only github and weibo are displayed in the navbar
})
```

### navbar

* **Type:** `NavItem[]`
* **Default:** `[]` (but a runtime fallback applies, see below)
* **Details:** Navbar configuration.

  ::: tip An empty navbar is not an empty navbar
  When `navbar` is empty, the theme injects a fallback with Home / Posts (or the first `post`
  collection) / Tags / Archives, derived from the current collection (see
  `theme/src/node/config/resolveThemeData.ts`). Pass an explicit array to fully override it.
  :::

  To configure navbar elements, you can set it to a navbar array, where each element is a `string` or a `NavItem` object.

  * A `NavItem` object should have a `text` field and a `link` field, with an optional `activeMatch` field.
  * A `string` represents a page file path or a page access path.

```ts
type NavItem = string | {
  text: string
  link: string

  /**
   * The page prefix for the current group.
   */
  prefix?: string
  /**
   * Navigation items under this group.
   */
  items?: NavItem[]
  /**
   * Supports iconify icons. Use the iconify name directly and it will be loaded automatically.
   *
   * @see https://icon-sets.iconify.design/
   */
  icon: string
  /**
   * Controls when the element is active.
   */
  activeMatch?: string
}
```

* Example 1:

  ```js
  export default defineUserConfig({
    theme: plumeTheme({
      navbar: [
        // NavbarItem
        { text: 'Foo', link: '/foo/' },
        // NavbarGroup
        {
          text: 'Group',
          prefix: '/group/',
          items: ['foo/', 'bar/'],
        },
        // String - page file path
        '/bar', // The `.md` extension can be omitted directly.
      ],
    }),
  })
  ```

* Example 2:

  ```js
  export default defineUserConfig({
    theme: plumeTheme({
      navbar: [
        // Nested Group - maximum depth is 2
        {
          text: 'Group',
          items: [
            {
              text: 'SubGroup',
              items: ['/group/sub/', '/group/sub/bar/'],
            },
          ],
        },
        // Control when the element is active
        {
          text: 'Group 2',
          items: [
            {
              text: 'Always active',
              link: '/',
              // This element will always be active
              activeMatch: '/',
            },
            {
              text: 'Active on /foo/',
              link: '/not-foo/',
              // This element is active when the current route path starts with /foo/
              // Supports regular expressions
              activeMatch: '^/foo/',
            },
          ],
        },
      ],
    }),
  })
  ```

### collections

* **Type:** `ThemeCollectionItem[]`

* **Default:** `[]`

* **Details:** Documentation collections configuration.

  [Check **Collections Guide**](../guide/quick-start/collection.md){.read-more}

  [Check **Collections Configuration** to learn more](./collections.md){.read-more}

### sidebar

* **Type:** `false | SidebarMulti`

* **Details:**

  Sidebar configuration. **The theme recommends configuring the sidebar in [collections configuration](./collections.md).**

  The `key` of the configuration object is the common access path prefix for the sidebar.

  For `value`:

  * `'auto'` means automatically generate the sidebar based on the directory structure.
  * `string` represents the page file path corresponding to the sidebar.
  * `SidebarItem` represents a single sidebar item configuration.

```ts
type ThemeIcon = string | { svg: string }

type SidebarMulti = Record<
  string,
  | 'auto'
  | (string | SidebarItem)[]
  | { items: 'auto' | (string | SidebarItem)[], prefix?: string }
>
interface SidebarItem {
  /**
   * Sidebar text.
   */
  text?: string

  /**
   * Sidebar link.
   */
  link?: string

  /**
   * Sidebar icon.
   */
  icon?: ThemeIcon

  /**
   * Nested sidebar group.
   */
  items?: 'auto' | (string | SidebarItem)[]

  /**
   * If not specified, the group is not collapsible.
   * If `true`, the group is collapsible and collapsed by default.
   * If `false`, the group is collapsible but expanded by default.
   */
  collapsed?: boolean

  /**
   * Link prefix for the current group.
   */
  prefix?: string

  rel?: string
  target?: string
}
```

### sidebarScrollbar

* **Type:** `boolean`
* **Default:** `true`
* **Details:** Whether to show the sidebar scrollbar.

  When set to `false`, only the scrollbar is hidden, but the scrolling behavior remains unchanged.

### aside

* **Type:** `boolean | 'left'`
* **Default:** `true`
* **Details:**

  Whether to display the aside (right sidebar).

  * `false` disables the right aside.
  * `true` enables the right aside.
  * `'left'` moves the right aside to the left side of the article content, to the right of the main sidebar.

  Each page can override this global configuration via [frontmatter aside](./frontmatter/basic.md#aside).

### outline

* **Type:** `false | number | [number, number] | 'deep'`
* **Default:** `[2, 3]`
* **Details:**

  The heading levels to display.

  A single number means only display headings of that level.

  If a tuple is passed, the first number is the minimum level and the second is the maximum level.

  `'deep'` is the same as `[2, 6]`, which displays all headings from `<h2>` to `<h6>`.

  When [aside](#aside) is disabled, `outline` is also disabled.

  Each page can override this global configuration via [frontmatter outline](./frontmatter/basic.md#outline).

### transition

* **Type:** `boolean | TransitionOptions`
* **Default:** `true`

Whether to enable transition animations. Set to `false` to completely disable all transition animations.
Pass an object to control each type of animation separately.

```ts title=".vuepress/plume.config.ts"
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  transition: {
    page: true,
    postList: true,
    appearance: 'fade',
  },
})
```

### page

* **Type:** `boolean`
* **Default:** `true`

Whether to enable page transition animations.

### postList

* **Type:** `boolean`
* **Default:** `true`

Whether to enable blog post list transition animations.

### appearance

* **Type:** `boolean | 'fade' | 'circle-clip' | 'horizontal-clip' | 'vertical-clip' | 'skew-clip' | 'blinds-vertical' | 'blinds-horizontal' | 'soft-blur-fade' | 'diamond-reveal'`
* **Default:** `'fade'`

Transition animation for dark/light mode switching. Set it to `false` to disable **only this animation**
without affecting `page` or `postList`.

Supports the following 9 animation effects:

* `fade`: Fade in/out (default)
* `circle-clip`: Circular clip
* `horizontal-clip`: Horizontal clip
* `vertical-clip`: Vertical clip
* `skew-clip`: Skew clip
* `blinds-vertical`: Vertical blinds
* `blinds-horizontal`: Horizontal blinds
* `soft-blur-fade`: Soft blur fade
* `diamond-reveal`: Diamond reveal

### readAid

::: warning Deprecated
The reading aid is part of [`readerPreferences.readAid`](#readerpreferences) now, and can be switched in the client panel.
This option still works, but only as the default when `readerPreferences.readAid` is not configured.
:::

* **Type:** `boolean | 'mask' | 'left' | 'right'`
* **Default:** `false`
* **Details:** Whether to show reading guide lines (the guide lines help users visually focus on the area where the mouse is located)
  * `false` - Do not show
  * `true` / `'left'` - Show left guide line
  * `'mask'` - Show mask
  * `'right'` - Show right guide line

### readerPreferences

* **Type:** `boolean | ReaderPreferencesOptions`
* **Default:** `false`
* **Details:** Configure the reader preferences: resume reading, content width, reading background, reading aid and focus mode.

  * `true` - enable every sub-feature with the default options
  * `false` - disable everything
  * `ReaderPreferencesOptions` - enable and toggle each sub-feature

  The option is **per locale**, so it can be configured separately in `locales`.

  | Option | Type | Default | Description |
  | --- | --- | --- | --- |
  | `width` | `false \| { presets }` | `true` | Content width presets, defaults to `['narrow', 'wide', 'full']` |
  | `theme` | `false \| { presets }` | `true` | Background palettes, defaults to `['default', 'warm', 'sepia']` |
  | `brand` | `false \| { presets }` | `false` | Brand palettes, applied to `--vp-c-brand-*` |
  | `readAid` | `false \| 'mask' \| 'left' \| 'right' \| { modes, default }` | `true` | Reading aid, off by default, switchable in the panel |
  | `focusMode` | `boolean` | `true` | Enable the focus mode |
  | `resume` | `false \| ReaderResumeOptions` | `true` | Continue reading |
  | `storagePrefix` | `string` | `'plume'` | `localStorage` key prefix |

  Width, reading aid and focus mode are **desktop-only**: below a `768px` viewport they are disabled and hidden
  from the panel (their defaults apply), while the reading background keeps working. See
  [Small screens](../guide/features/reader.md#small-screens).

  `ReaderResumeOptions`:

  | Option | Type | Default | Description |
  | --- | --- | --- | --- |
  | `prompt` | `boolean` | `true` | `false` only records the position without prompting |
  | `ttl` | `number` | `90` | Record TTL in days, clamped to 1–365 |
  | `max` | `number` | `300` | Max records kept, clamped to 10–1000 |
  | `minPercent` | `number` | `0.05` | Don't prompt below this progress, `0`–`1` |

  **The standard preset produces no CSS at all**: `standard` for `width` and `default` for `theme` both mean "write no attribute", so the default output is pixel-identical to the previous version.

  The actual widths are **narrow ≈ 640px**, **standard = whatever the theme already uses**, **wide ≈ 1000px**, **full = the viewport width**.
  `wide` is not just a released `max-width`: with a sidebar and an outline the page is capped by `--vp-layout-max-width` (1440px) and the text column can only reach about 864px, barely above the 788px of `standard`. The wide preset therefore trims the page paddings and the outline column, relaxes the shell to 1680px, and caps the column at 1000px. Override the `max-width` of `html[data-reader-width="wide"] .vp-doc-container .content-container` to customize it.

  **full** releases the shell cap entirely, so the text width follows the viewport: about 1344px on a 1920px screen with a sidebar and an outline, about 1616px on a plain article page. It targets large screens that accept long lines and behaves like `wide` on smaller ones. Drop it from `presets` to hide the option:

  ```ts
  export default defineUserConfig({
    theme: plumeTheme({
      readerPreferences: {
        width: { presets: ['narrow', 'wide'] },
      },
    }),
  })
  ```

  Both groups accept **custom palettes**: a palette is a group of CSS custom properties applied together,
  rendered as a solid swatch in the panel, where `default` (slashed swatch) means "keep the theme tokens".
  Keys of `tokens` may omit the `--` prefix:

  ```ts
  export default defineUserConfig({
    theme: plumeTheme({
      readerPreferences: {
        theme: {
          presets: [
            'default',
            'warm',
            {
              name: 'forest',
              label: 'Forest',
              tokens: {
                'vp-c-bg': '#eef5ec',
                'vp-c-bg-alt': '#e6efe3',
                'vp-c-text-1': '#2b3529',
              },
            },
          ],
        },
        brand: {
          presets: [
            {
              name: 'ocean',
              label: 'Ocean',
              tokens: {
                'vp-c-brand-1': '#0e7490',
                'vp-c-brand-2': '#0891b2',
                'vp-c-brand-3': '#06b6d4',
              },
            },
          ],
        },
      },
    }),
  })
  ```

  * `name` is limited to letters, digits, `-` and `_`, it becomes the `html[data-reader-theme="<name>"]` value;
  * `label` is the swatch tooltip and accessible name, `name` is used when omitted;
  * `color` is the swatch color, defaults to `--vp-c-bg` (background) or `--vp-c-brand-1` (brand) from `tokens`;
  * the reading background stays disabled in dark mode, brand palettes work in both modes;
  * custom palettes are inlined into `<head>` at build time (no first-paint flash); the dev server injects them on the client.

  **Localizing `label`**: there is no need to repeat the whole `tokens` in every locale. Locale level
  `presets` merge with the theme level by `name` — an entry with the same name only overrides the fields it
  declares (usually just `label`), while `tokens` are inherited; names that only exist in the locale are
  appended to the end of the list.

  ```ts
  export default defineUserConfig({
    theme: plumeTheme({
      // theme level: the colors live here, once
      readerPreferences: {
        theme: {
          presets: [
            {
              name: 'forest',
              tokens: { 'vp-c-bg': '#eef5ec', 'vp-c-bg-alt': '#e6efe3' },
            },
          ],
        },
      },
      locales: {
        '/en/': {
          // locale level: just the label
          readerPreferences: {
            theme: { presets: [{ name: 'forest', label: 'Forest' }] },
          },
        },
      },
    }),
  })
  ```

  ::: tip
  Locale level `presets` only override, they cannot remove presets; adjust the theme level list to narrow it.
  :::

  The **reading aid** highlights the block under the mouse: `mask` draws a mask, `left` / `right` draw a guide line.
  It is **off by default** and only takes effect once the reader picks it in the panel; passing a bare mode string (e.g. `'left'`) makes that mode the default. Use the object form to restrict the offered modes:

  ```ts
  export default defineUserConfig({
    theme: plumeTheme({
      readerPreferences: {
        readAid: { modes: ['mask', 'left'], default: 'mask' },
      },
    }),
  })
  ```

  The legacy theme / collection level `readAid` still works, as the default when `readerPreferences.readAid` is not configured.

  Example: enable everything

  ```ts
  export default defineUserConfig({
    theme: plumeTheme({
      readerPreferences: true,
    }),
  })
  ```

  Example: only width and background

  ```ts
  export default defineUserConfig({
    theme: plumeTheme({
      readerPreferences: {
        width: { presets: ['wide'] },
        theme: true,
        focusMode: false,
        resume: false,
      },
    }),
  })
  ```

  Example: only continue reading

  ```ts
  export default defineUserConfig({
    theme: plumeTheme({
      readerPreferences: {
        width: false,
        theme: false,
        readAid: false,
        focusMode: false,
        resume: { ttl: 30, minPercent: 0.1 },
      },
    }),
  })
  ```

  See [Reader](../guide/features/reader.md) for more.

### relatedPosts

* **Type:** `boolean | RelatedPostsOptions`
* **Default:** `false`
* **Details:** Whether to show related posts at the bottom of article and doc pages.

  * `true` - Enable it with the default configuration (same as `{}`)
  * `false` - Disable it
  * `RelatedPostsOptions` - Enable it with a custom configuration

  Collection level options (`collections[].relatedPosts`) take precedence over this one.

  The result is computed at **build time** (TF-IDF + cosine similarity) and written into
  the page data, so there is no runtime cost on the client. Pages are only recommended
  within the same collection and the same locale by default.

  | Option | Type | Default | Description |
  | --- | --- | --- | --- |
  | `limit` | `number` | `4` | Max number of related posts (1–12) |
  | `minScore` | `number` | `0.12` | Similarity threshold, lower candidates are dropped |
  | `weights` | `object` | see below | Weight of each signal |
  | `recency` | `number` | `0` | Recency decay half-life in years: the score halves after `recency` years, `0` disables it |
  | `diversity` | `number` | `0.3` | Diversity of the result (0–1), `0` keeps the pure relevance order |
  | `scope` | `'collection' \| 'locale'` | `'collection'` | Candidate scope |
  | `contentLimit` | `number` | `2000` | Max characters of the body used for scoring, `0` disables it |
  | `cjk` | `'segmenter' \| 'bigram'` | `'segmenter'` | CJK tokenizer strategy |
  | `showExcerpt` | `boolean` | `false` | Whether to show an excerpt in each item |
  | `excerptLength` | `number` | `80` | Max length of the excerpt |
  | `title` | `string` | theme locale text | Title of the block |
  | `exclude` | `string[]` | `[]` | Paths to exclude, glob supported |
  | `seriesBoost` | `number` | `1` | Score multiplier of the same series pages, `0` drops them and values above `1` prefer them |
  | `seriesNextBoost` | `number` | `0` | Score multiplier of the next chapter, `0` stops repeating the block already shown above |
  | `debug` | `boolean` | `false` | Print scores in the build log |

  The default `weights` is `{ tags: 3, category: 2, title: 2, headings: 1.5, content: 1 }`.

  When a page joins a series through `frontmatter.series`, the series relation becomes an
  extra signal: `seriesBoost` multiplies the score of the same series pages and
  `seriesNextBoost` the one of the next chapter. Both apply to the final score, so
  `minScore` is a threshold on the adjusted score. See
  [Related Posts - Series integration](../guide/features/related-posts.md#series-integration).

:::: code-tabs#configs

@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    relatedPosts: {
      limit: 4,
      minScore: 0.12,
      weights: { tags: 3, category: 2, title: 2, content: 1 },
    },
  }),
})
```

@tab .vuepress/plume.config.ts

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  relatedPosts: {
    limit: 4,
    diversity: 0.3,
  },
})
```

::::

See [Related Posts](../guide/features/related-posts.md) for more details.

### series

* **Type:** `boolean | SeriesOptions`
* **Default:** `false`
* **Details:** Whether to enable series.

  * `true` - Enable it with the default configuration
  * `false` - Disable it
  * `SeriesOptions` - Enable it with a custom configuration

  A series is a **cross-collection** content dimension: it does not change URLs or routes and
  does not add a collection type. Pages join a series with the `series` frontmatter field; the
  order and numbering are resolved at build time, and two links are rendered above and below the
  content ("This post is part of …" and "Next: …").

  A series **never takes over** the "Previous / Next page" pager of a doc page.

  | Option | Type | Default | Description |
  | --- | --- | --- | --- |
  | `page` | `boolean` | `true` | Generate the landing page |
  | `linkPrefix` | `string` | `'/series/'` | Path prefix of landing pages (the locale prefix is always prepended) |
  | `index` | `boolean` | `false` | Generate the series overview page at the root of `linkPrefix` (e.g. `/series/`) |
  | `autoCreate` | `boolean` | `true` | Create a series automatically when its id is not declared |
  | `order` | `'auto' \| 'order' \| 'time'` | `'auto'` | Sorting strategy |
  | `nav` | `boolean` | `true` | Render the in-page links |
  | `items` | `Record<string, SeriesItemOptions>` | `{}` | Series definitions keyed by id |

  `SeriesItemOptions`:

  | Option | Type | Default | Description |
  | --- | --- | --- | --- |
  | `title` | `string` | series id | Series title |
  | `description` | `string` | - | Series description, used by the landing page and the SEO description |
  | `cover` | `string` | - | Cover image of the landing page |
  | `link` | `string` | `linkPrefix + id` | Landing page path, can point at a page you maintain |
  | `page` | `boolean` | `true` | Generate the landing page |
  | `order` | `'auto' \| 'order' \| 'time'` | global `order` | Sorting strategy of this series |
  | `nav` | `boolean` | global `nav` | Whether to render the in-page links |

  `order` semantics:

  * `'auto'`: sort by `seriesOrder` when every chapter declares it, otherwise sort by create time
    (and warn)
  * `'order'`: always sort by `seriesOrder`, chapters without one go last (and warn)
  * `'time'`: sort by create time

  `index: true` generates a **series overview page** at the root of `linkPrefix` (e.g. `/series/`,
  `/en/series/`) listing every series of the locale. It is independent of the landing pages: with
  `page: false` you can keep the overview and point `items[id].link` at pages you maintain.

::::: code-tabs#configs

@tab .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    series: {
      linkPrefix: '/collections/',
      items: {
        'vue3-in-depth': {
          title: 'Vue 3 in depth',
          description: 'From reactivity to the compiler in 12 posts',
          order: 'order',
        },
      },
    },
  }),
})
```

@tab .vuepress/plume.config.ts

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  series: true,
})
```

:::::

See [Series](../guide/features/series.md) for more details.

### linkPreview

* **Type:** `boolean | LinkPreviewOptions`
* **Default:** `false`
* **Details:** Whether to enable hover previews for internal links in the content. Hovering a link shows the title, excerpt, tags and last updated date of the target page.

  * `true` - Enable it with the default configuration.
  * `false` - Disable it
  * `LinkPreviewOptions` - Enable it with a custom configuration

  Preview data is generated at **build time** and written into the page data.

  | Option | Type | Default | Description |
  | --- | --- | --- | --- |
  | `delay` | `number` | `150` | Hover-intent delay in ms |
  | `focusDelay` | `number` | `0` | Delay after keyboard focus, in ms |
  | `selector` | `string` | `'.vp-doc a[href]'` | Selector of the trigger links |
  | `showExcerpt` | `boolean` | `true` | Whether to show the excerpt |
  | `excerptLength` | `number` | `120` | Max excerpt length, `0` means unlimited |
  | `showHeadings` | `boolean` | `false` | Whether to show the first headings of the target page |
  | `headingsLimit` | `number` | `3` | Max headings (1–6) |
  | `showTags` | `boolean` | `true` | Whether to show the tags |
  | `showUpdatedTime` | `boolean` | `true` | Whether to show the last updated date (requires the git plugin) |
  | `maxWidth` | `number` | `360` | Max card width in px |
  | `exclude` | `string[]` | `[]` | Excluded target paths, glob supported |

  The option is resolved **per locale**, so it can be disabled for one language in
  `locales`. A single page can opt out with `linkPreview: false` in its frontmatter.

  See [Link Preview](../guide/features/link-preview.md) for more details.

### footer

* **Type:** `false | { message: string; copyright?: string }`
* **Default:** `{ message: 'Powered by VuePress & vuepress-theme-plume' }`
* **Details:** Footer configuration.

  ::: warning The default is not "hidden"
  Even without configuring `footer`, the theme renders a default footer linking to the VuePress and
  theme websites (see the default above). To hide it completely, set it to `false` explicitly:

  ```ts
  theme: plumeTheme({
    footer: false
  })
  ```

  :::

### bulletin

* **Type:** `boolean | BulletinOptions`
* **Default:** `false`
* **Details:** Bulletin board configuration.

  For details, please refer to [Bulletin Board](../guide/features/bulletin.md).

### editLinkPattern

* **Type:** `string`
* **Default:** `''`
* **Details:** Regular expression for the edit link.

  Example: `':repo/edit/:branch/:path'`

### externalLinkIcon

* **Type:** `boolean`
* **Default:** `true`
* **Details:** Whether to display an external link icon after external links.

### copyright

* **Type:** `boolean | CopyrightLicense | CopyrightOptions`
* **Default:** `false`
* **Details:** Copyright configuration.

  For details, please refer to [Copyright](../guide/features/copyright.md).

### prevPage

* **Type:** `boolean`
* **Default:** `true`
* **Details:** Whether to show the previous page link.

### nextPage

* **Type:** `boolean`
* **Default:** `true`
* **Details:** Whether to show the next page link.

### createTime

* **Type:** `boolean | 'only-posts'`
* **Default:** `true`
* **Details:** Whether to display the creation time.

  * `false` - Do not display.
  * `'only-posts'` - Only display on blog post list pages.
  * `true` - Display on all article pages.
