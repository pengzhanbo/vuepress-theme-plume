---
url: /en/config/locales/index.md
---
These options are used to configure language-related text.

If your site is served in languages other than the built-in supported languages, you should set these options for each language to provide translations.

## Built-in Language Support

The theme has built-in support for the following languages:

* Simplified Chinese (`zh-CN`) - `/zh/`
* Traditional Chinese (`zh-TW`) - `/zh-tw/`
* English (`en-US`) - `/en/`
* French (`fr-FR`) - `/fr/`
* German (`de-DE`) - `/de/`
* Russian (`ru-RU`) - `/ru/`
* Japanese (`ja-JP`) - `/ja/`
* Korean (`ko-KR`) - `/ko/`

## Configuration

You should write the configuration in `theme.locales`.

You can configure it in `.vuepress/config.ts`, or in `.vuepress/plume.config.ts`:

::: code-tabs#configs

@tab .vuepress/config.ts

```ts twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    locales: {
      // Language code for non-built-in languages
      '/xxx/': {
        // Language configuration
      }
    }
  })
})
```

@tab .vuepress/plume.config.ts

```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  locales: {
    // Language code for non-built-in languages
    '/xxx/': {
      // Language configuration
    }
  }
})
```

:::

For detailed configuration methods, please refer to: [Internationalization](../guide/quick-start/locales.md)

## Path Mapping

The following is an example of the directory structure and URL path mapping for a multilingual site:

Assume the following configuration:

```ts title=".vuepress/config.ts" twoslash
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    locales: {
      '/': {
        selectLanguageName: 'Simplified Chinese',
      },
      '/en/': {
        selectLanguageName: 'English',
      },
    },
  }),
})
```

The corresponding directory structure and URL mapping are as follows:

::: file-tree

* docs/
  * README.md  <-- Visit `/`  (Chinese homepage)
  * guide/
    * intro.md  <-- Visit `/guide/intro.html`
  * en/
    * README.md  <-- Visit `/en/`  (English homepage)
    * guide/
      * intro.md  <-- Visit `/en/guide/intro.html`
  * .vuepress/
    * config.ts
    * plume.config.ts

:::

**Key Points:**

* The `key` of the `locales` object (e.g., `/` and `/en/`) determines the URL path prefix
* Chinese (default language) uses `/` as the prefix, corresponding to files under the `docs/` root directory
* English uses `/en/` as the prefix, corresponding to files under the `docs/en/` directory
* The Markdown file structure for each language remains consistent within its language directory
* The `.vuepress/` directory is a shared configuration directory and does not need to be configured separately for each language

### appearanceText

* Type: `string`
* Default: `'Appearance'`
* Details: The text for the theme toggle button in the navigation bar.

### selectLanguageName

* Type: `string`
* Default: `''`
* Details:

  The language name for the locale.

  This configuration item **only takes effect inside the [locales](./theme.md#locales) of the theme configuration**.
  It will be used as the language name for the locale, displayed in the *Select Language Menu*.

### selectLanguageText

* Type: `string`
* Default: `''`
* Details:

  The text for the *Select Language Menu*.

  If you set multiple [locales](./theme.md#locales) in the site configuration,
  the *Select Language Menu* will be displayed next to the repository button in the navigation bar.

### selectLanguageAriaLabel

* Type: `string`
* Default: `''`
* Details:

  The `aria-label` attribute for the *Select language menu*.

  It is primarily for site accessibility (a11y).

### homeText

* Type: `string`
* Default: `'Home'`
* Details: The text for the home link.

  * The text for the home link in the theme's default navigation bar.
  * The text for the home link in breadcrumb navigation.

### postsText

* Type: `string`
* Default: `'Posts'`
* Details: The text for the posts list page link.

  * The text for the posts list page link in the theme's default navigation bar.
  * The text for the posts list page link in breadcrumb navigation.

### tagText

* Type: `string`
* Default: `'Tags'`
* Details: The text for the tags link.

  * The text for the tags link in the theme's default navigation bar.
  * The text for the tags link on blog pages.
  * The title on the blog tags page.

### categoryText

* Type: `string`
* Default: `'Categories'`
* Details: The text for the categories link.

  * The text for the categories link in the theme's default navigation bar.
  * The text for the categories link on blog pages.
  * The title on the blog categories page.

### archiveText

* Type: `string`
* Default: `'Archives'`
* Details: The text for the archives link.

  * The text for the archives link in the theme's default navigation bar.
  * The text for the archives link on blog pages.
  * The title on the blog archives page.

### archiveTotalText

* Type: `string`
* Default: `'{count} articles'`
* Details: The text for the total article count on the archives page.

### sidebarMenuLabel

* Type: `string`
* Default: `'Menu'`
* Details:

  The text for the menu option in the navigation bar on mobile devices.

### returnToTopLabel

* Type: `string`
* Default: `'return to top'`
* Details:

  The text for returning to the top in the navigation bar on mobile devices.

### outlineLabel

* Type: `string`
* Default: `'On this page'`
* Details:

  The text for the outline title in the navigation bar on mobile devices.

### editLinkText

* Type: `string`
* Default: `'Edit this page'`
* Details: The edit link text.

### latestUpdatedText

* Type: `string`
* Default: `'Latest Updated'`
* Details: The text for "Latest Updated".

### contributorsText

* Type: `string`
* Default: `'Contributors'`
* Details: The text for contributors.

### changelogText

* Type: `string`
* Default: `'Changelog'`
* Details: The text for changelog.

### changelogOnText

* Type: `string`
* Default: `'On'`
* Details: The time text for a single changelog entry.

### changelogButtonText

* Type: `string`
* Default: `'View All Changelog'`
* Details: The button text for changelog.

### copyrightText

* Type: `string`
* Default: `'Copyright'`
* Details: The text for copyright.

### copyrightAuthorText

* Type: `string`
* Default: `'Copyright Ownership:'`
* Details: The text for copyright owner.

### copyrightCreationOriginalText

* Type: `string`
* Default: `'This article link:'`
* Details: The text for "This article link".

### copyrightCreationTranslateText

* Type: `string`
* Default: `'This article translated from:'`
* Details: The text for "This article translated from".

### copyrightCreationReprintText

* Type: `string`
* Default: `'This article reprint from:'`
* Details: The text for "This article reprint from".

### copyrightLicenseText

* Type: `string`
* Default: `'License under:'`
* Details: The text for copyright license.

### prevPageLabel

* Type: `string`
* Default: `'Previous Page'`
* Details: The text for previous page.

### nextPageLabel

* Type: `string`
* Default: `'Next Page'`
* Details: The text for next page.

### notFound

* Type: `NotFound | undefined`
* Default: `undefined`
* Details: 404 page configuration.

```ts
interface NotFound {
  code?: string
  title?: string
  quote?: string
  linkLabel?: string
  linkText?: string
}
```

## Encryption-related Text

The following options are used to customize the text displayed in the encryption feature and should be configured in `theme.locales`.
For details, see [Encryption Feature](../guide/features/encryption.md).

### encryptGlobalText

* Type: `string`
* Default: `'Only password can access this site'`
* Details:

  The prompt message when the entire site is encrypted. Supports HTML.
  You may need this configuration if you want to provide visitors with contact information to obtain the password.

### encryptPageText

* Type: `string`
* Default: `'Only password can access this page'`
* Details:

  The prompt message when a page is partially encrypted. Supports HTML.
  You may need this configuration if you want to provide visitors with contact information to obtain the password.

### encryptButtonText

* Type: `string`
* Default: `'Confirm'`
* Details: The text for the confirm button.

### encryptPlaceholder

* Type: `string`
* Default: `'Enter password'`
* Details: The placeholder for the password input field.

### Configuration Example

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    locales: {
      '/': {
        encryptButtonText: 'Confirm',
        encryptPlaceholder: 'Enter password',
        encryptGlobalText: 'Only password can access this site',
        encryptPageText: 'Only password can access this page',
      }
    }
  })
})
```
