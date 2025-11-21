---
url: /en/guide/features/encryption/index.md
---
## Encryption

This theme supports multiple flexible encryption methods, including **full-site encryption** and **partial encryption**.

::: warning Note
Due to the inherent limitations of `vuepress` as a static site generator,
the **encryption** only makes content *appear* invisible and excludes the content from being pre-rendered
into `html` during compilation. However, the content can still be accessed from the site's source files.

Therefore, the **encryption** feature should not be considered **secure and reliable**.

Avoid using the **encryption feature** for content that requires **strict confidentiality**.
:::

**Unlocked articles are only visible within the current session.**

## Enabling Encryption

Add the `encrypt` option in the theme configuration.

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    encrypt: {
      // more options...
    }
  })
})
```

## Full-Site Encryption

In some cases, you may need to encrypt the entire site. Configure full-site encryption using the `encrypt.
global` option, then set one or more passwords using the `encrypt.admin` option.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    encrypt: {
      global: true,
      admin: ['123456'],
    }
  })
})
```

## Partial Encryption

In most cases, you may only need to encrypt specific articles, directories, etc. Configure partial encryption using the `encrypt.rules` option.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    encrypt: {
      rules: {
        // Can be relative path to md file - encrypts this file
        '前端/基础.md': '123456',
        // Can be directory path - encrypts all articles under this directory
        '/notes/vuepress-theme-plume/': '123456',
        // Can be request path - encrypts all articles under this access path
        '/vuepress-theme-plume/': '123456',
        // Can be specific page request path - encrypts this page
        '/article/f8dnci3/': '123456',
        // If starting with `^`, pages matching this regex will also be encrypted
        '^/(a|b)/': '123456',
      }
    }
  })
})
```

The **keys** in `encrypt.rules` serve as matching rules, and the **values** serve as passwords for those rules. You can set one or multiple passwords.

:::tip Notes

* Passwords must be plain strings.
* If an entire directory is encrypted, unlocking applies to the entire directory, not individual articles within it.
* `encrypt.admin` can also be used to unlock **partially encrypted** pages.
* After unlocking with `encrypt.admin`, the user is considered an administrator and other locked pages are unlocked by default.
  :::

### Frontmatter

Use the `password` field in Markdown file `Frontmatter` to set article passwords.

```md
---
title: Encrypted Article
password: 123456
---
```

You can also add the `passwordHint` option to set password hint information.

```md
---
title: Encrypted Article
password: 123456
passwordHint: The password is 123456
---
```

## Example

Click to visit [Encrypted Article, Password: 123456](/article/enx7c9s/)

## Related Configuration

The following configurations support use in [multilingual configuration](../../config/locales.md).

### encryptGlobalText

* **Type**: `string`
* **Default**: `'Only password can access this site'`
* **Description**:

  Prompt message for full-site encryption. Supports HTML. Useful if you want to provide contact information for visitors to obtain passwords.

### encryptPageText

* **Type**: `string`
* **Default**: `'Only password can access this page'`
* **Description**:

  Prompt message for partial encryption. Supports HTML. Useful if you want to provide contact information for visitors to obtain passwords.

### encryptButtonText

* **Type**: `string`
* **Default**: `'Confirm'`
* **Description**: Text for the confirmation button

### encryptPlaceholder

* **Type**: `string`
* **Default**: `'Enter password'`
* **Description**: Placeholder text for the password input field

### Example

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
