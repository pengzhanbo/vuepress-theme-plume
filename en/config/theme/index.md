---
url: /en/config/theme/index.md
---
## Overview

Theme configuration is used to customize various features of the theme and control its behavior.
You can configure it in either `.vuepress/config.ts` or `.vuepress/plume.config.ts`.

When a field description includes the following statement, it indicates that the field is not supported for configuration in `.vuepress/plume.config.ts`:

::: warning This field is not supported for configuration in the [Theme Config File `plume.config.js`](./intro.md#theme-config-file).
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

  Refer to [Theme Config File `plume.config.js`](./intro.md#theme-config-file) for more information.

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.js`](./intro.md#theme-config-file).
  :::

### plugins

* **Type:** `PlumeThemePluginOptions`
* **Default:** `{}`
* **Details:**

  Custom configuration for plugins used internally by the theme.

  The plugins used by the theme are configured by default. In most cases, modification is not required.
  For detailed customization, please refer to [this documentation](./plugins/README.md).

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.js`](./intro.md#theme-config-file).
  :::

### markdown&#x20;

* **Type:** `MarkdownOptions`
* **Default:** `{}`
* **Details:**

  Markdown feature configuration. Refer to [this documentation](./markdown.md).

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.js`](./intro.md#theme-config-file).
  :::

### codeHighlighter&#x20;

* **Type:** `false | ShikiPluginOptions`
* **Default:** `{}`
* **Details:**

  Code highlighting configuration. Refer to [this documentation](../guide/code/intro.md).

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.js`](./intro.md#theme-config-file).
  :::

### search&#x20;

* **Type:** `false | SearchOptions`
* **Default:** `{ provider: 'local' }`
* **Details:**

  Search configuration. Refer to [this documentation](../guide/features/search.md).

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.js`](./intro.md#theme-config-file).
  :::

### comment&#x20;

* **Type:** `false | CommentPluginOptions`
* **Default:** `false`
* **Details:**

  Comment configuration. Refer to [this documentation](../guide/features/comments.md).

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.js`](./intro.md#theme-config-file).
  :::

### watermark&#x20;

* **Type:** `false | WatermarkPluginOptions`
* **Default:** `false`
* **Details:**

  Watermark configuration. Refer to [this documentation](../guide/features/watermark.md).

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.js`](./intro.md#theme-config-file).
  :::

### readingTime&#x20;

* **Type:** `false | ReadingTimePluginOptions`
* **Default:** `false`
* **Details:**

  Reading time configuration. Refer to [this documentation](./plugins/reading-time.md).

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.js`](./intro.md#theme-config-file).
  :::

### copyCode&#x20;

* **Type:** `false | CopyCodePluginOptions`
* **Default:** `{}`
* **Details:**

  Copy code configuration. Refer to [this documentation](../guide/code/copy-code.md).

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.js`](./intro.md#theme-config-file).
  :::

### replaceAssets&#x20;

* **Type:** `false | ReplaceAssetsPluginOptions`
* **Default:** `false`
* **Details:**

  Replace assets configuration. Refer to [this documentation](../guide/features/replace-assets.md).

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.js`](./intro.md#theme-config-file).
  :::

### hostname

* **Type:** `string`
* **Default:** `''`
* **Details:**

  Deployment site domain name.

  When `hostname` is configured to a valid domain, the theme will generate `sitemap` and SEO-related content.

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.js`](./intro.md#theme-config-file).
  :::

### autoFrontmatter

* **Type:** `false | AutoFrontmatterOptions`
* **Details:**

  Whether to automatically add frontmatter configuration to markdown files.

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
  This field is not supported for configuration in the [Theme Config File `plume.config.js`](./intro.md#theme-config-file).

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

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.js`](./intro.md#theme-config-file).
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

::: warning This field is not supported for configuration in the [Theme Config File `plume.config.js`](./intro.md#theme-config-file).
:::

### contributors

* **Type:** `boolean | ContributorsOptions`
* **Default:** `true`
* **Details:** Whether to display contributors.

  For more configuration, please refer to [this documentation](../guide/features/contributors.md).

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.js`](./intro.md#theme-config-file).
  :::

### changelog

* **Type:** `boolean | ChangelogOptions`
* **Default:** `false`
* **Details:** Whether to display page change history.

  For more configuration, please refer to [this documentation](../guide/features/changelog.md).

  ::: warning This field is not supported for configuration in the [Theme Config File `plume.config.js`](./intro.md#theme-config-file).
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
import { definePlumeThemeConfig } from 'vuepress-theme-plume'

export default definePlumeThemeConfig({
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
import { definePlumeThemeConfig } from 'vuepress-theme-plume'

export default definePlumeThemeConfig({
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
import { definePlumeThemeConfig } from 'vuepress-theme-plume'

export default definePlumeThemeConfig({
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
* **Default:** `[]`
* **Details:** Navbar configuration.

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
import { definePlumeThemeConfig } from 'vuepress-theme-plume'

export default definePlumeThemeConfig({
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

* **Type:** `'fade' | 'circle-clip' | 'horizontal-clip' | 'vertical-clip' | 'skew-clip' | 'blinds-vertical' | 'blinds-horizontal' | 'soft-blur-fade' | 'diamond-reveal'`
* **Default:** `'fade'`

Transition animation type for dark/light mode switching. Supports the following 9 animation effects:

* `fade`: Fade in/out (default)
* `circle-clip`: Circular clip
* `horizontal-clip`: Horizontal clip
* `vertical-clip`: Vertical clip
* `skew-clip`: Skew clip
* `blinds-vertical`: Vertical blinds
* `blinds-horizontal`: Horizontal blinds
* `soft-blur-fade`: Soft blur fade
* `diamond-reveal`: Diamond reveal

### footer

* **Type:** `false | { message: string; copyright: string }`
* **Default:** `false`
* **Details:** Footer configuration.

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
