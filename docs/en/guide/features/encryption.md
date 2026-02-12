---
title: Encryption
icon: mdi:encryption-outline
createTime: 2025/10/08 15:58:48
permalink: /en/guide/features/encryption/
---

## Encryption

In this topic, various flexible encryption methods such as **full-site encryption** and **partial encryption** are supported.

::: warning Note
Due to the limitations of `vuepress` as a static site, **encryption** only makes the content *appear* invisible.
During compilation, the content is not pre-rendered into the `html`,
but it can still be retrieved from the site's source files.
Therefore, the **encryption** feature should not be considered as completely secure or reliable.

Avoid using the **encryption feature** for content that requires **strict confidentiality**.
:::

**Unlocked articles are only visible during the current session.**

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

In some cases, you may need to encrypt the entire site.
You can configure full-site encryption using the `encrypt.global` option and set one or more passwords with `encrypt.admin`.

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

In most cases, you may only need to encrypt a specific article, directory, etc.
You can configure partial encryption using the `encrypt.rules` option.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    encrypt: {
      rules: {
        // Can be the relative path of an MD file to encrypt that file
        '前端/基础.md': '123456',
        // Can be a directory path to encrypt all articles under that directory
        '/notes/vuepress-theme-plume/': '123456',
        // Can be a request path to encrypt all articles under that path
        '/vuepress-theme-plume/': '123456',
        // Can be a specific page's request path to encrypt that page
        '/article/f8dnci3/': '123456',
        // If prefixed with `^`, pages matching the regex will also be encrypted
        '^/(a|b)/': '123456',
      }
    }
  })
})
```

The **key** in `encrypt.rules` serves as the matching rule,
and the **value** is the corresponding password (or multiple passwords) for that rule.

:::tip Notes

- Passwords must be plain strings.
- If encrypting an entire directory, unlocking applies to the entire directory, not individual articles within it.
- `encrypt.admin` can also be used to unlock **partially encrypted** pages.
- After unlocking with `encrypt.admin`, the user is considered an admin, and all other locked pages are unlocked by default.
:::

### Frontmatter

In the `Frontmatter` of a Markdown file, you can set the article's password using the `password` field.

```md
---
title: Encrypted Article
password: 123456
---
```

You can also add the `passwordHint` option to provide a password hint.

```md
---
title: Encrypted Article
password: 123456
passwordHint: The password is 123456
---
```

## Example

Click to visit [Encrypted Article, Password: 123456](/article/enx7c9s/)

## Related Configurations

The following configurations can be used in [multilingual settings](../../config/locales.md).

### encryptGlobalText

- **Type**: `string`
- **Default**: `'Only password can access this site'`
- **Description**:

  The prompt message for full-site encryption. Supports HTML. Useful if you want to provide contact information for visitors to obtain the password.

### encryptPageText

- **Type**: `string`
- **Default**: `'Only password can access this page'`
- **Description**:

  The prompt message for partial encryption. Supports HTML. Useful if you want to provide contact information for visitors to obtain the password.

### encryptButtonText

- **Type**: `string`
- **Default**: `'Confirm'`
- **Description**: The text for the confirmation button.

### encryptPlaceholder

- **Type**: `string`
- **Default**: `'Enter password'`
- **Description**: The placeholder text for the password input field.

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
