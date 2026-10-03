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
        'frontend/basics.md': '123456',
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

```md title="frontmatter"
---
title: Encrypted Article
password: 123456
---
```

You can also add the `passwordHint` option to provide a password hint.

```md title="frontmatter"
---
title: Encrypted Article
password: 123456
passwordHint: The password is 123456
---
```

### Example

Click to visit [Encrypted Article, Password: 123456](/article/enx7c9s/)

## Partial Content Encryption

### Configuration

Partial content encryption is implemented through the `::: encrypt` container. You need to configure the `markdown.encrypt` option:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      encrypt: true, // [!code ++]
    }
  })
})
```

You can also set a unified default password for the `::: encrypt` container:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      encrypt: {
        password: 123456, // [!code ++]
      }
    }
  })
})
```

### Usage

Use the `::: encrypt` container to wrap the content that needs to be encrypted.
You can add `password` / `pwd` attribute to the container to set the password for that container.
If no password is set, the default password will be used.

You can also add a `hint` attribute to set a password hint.

```md /password="123456"/
::: encrypt password="123456" hint="The password is 6 consecutive digits"
This is encrypted content
:::
```

::: info Only one password is effective; multiple passwords are not supported simultaneously.
:::

### Example

**Input:**

```md
::: encrypt password="123456"
This is encrypted content
:::
```

**Output:**

::: encrypt password="123456"
This is encrypted content
:::

**Input:**

```md
::: encrypt password="654321" hint="The password is 6 consecutive digits"
This is encrypted content 2
:::
```

**Output:**

::: encrypt password="654321" hint="The password is 6 consecutive digits"
This is encrypted content 2
:::

::: warning Usage Limitations
The encrypted content is **no longer** processed as a Vue template; after decryption it is rendered as static HTML via `v-html`.

**For encrypted content, you can use:**

- All standard markdown syntax
- Extended syntax whose output is still standard HTML, such as hint containers
  (`::: tip` / `::: warning` / `::: details`, etc.), code highlighting, and tables

**Not supported:**

- Extended syntax that outputs Vue components, such as `tabs`, `code-tabs`, `code-tree`,
  `file-tree`, `collapse`, `timeline`, `card`, `table`, `steps`, `chat`, `repl`, etc.
- Global Vue components (provided by the theme or user-defined)
- Vue template syntax, such as `{{ }}` interpolation, `v-` directives and event bindings
- Syntax that imports content from directories, such as `@[demo]()`, `@[code]()`, `@[code-tree]()`

**Alternative:**

If encrypted content needs Vue components or Vue template syntax, use **page encryption** (`password` frontmatter)
or **global encryption** (`encrypt.global`) instead — their content is compiled at build time and is not subject to the limits above.
See the "If you are a technical developer" section below for the reasons.

**Network Environment Requirements:**
Partial content encryption is implemented using [Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Crypto),
therefore, it will not work properly in **non-HTTPS environments**.
:::

::: details If you are a technical developer, you may need to know

**Encryption Implementation:**

Partial content encryption is implemented using [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Crypto), involving the following key steps:

- **Key Derivation**: Uses the **PBKDF2** (Password-Based Key Derivation Function 2) algorithm, combined with the user-provided password and a random salt value to iteratively derive a fixed-length key, thereby increasing the difficulty of brute-force attacks.
- **Encryption Algorithm**: Uses the **AES-CBC** (Advanced Encryption Standard - Cipher Block Chaining) symmetric encryption algorithm to encrypt the content.
- **Build-time Encryption**: The original markdown content is first rendered into HTML content, then encrypted; transmitted to the client, then decrypted and rendered.

**Static Rendering:**

The decrypted content is rendered directly as static HTML; it is **no longer** processed as a Vue template,
so Vue components and Vue template syntax are not supported. Only the rendering method changed —
the encryption and decryption flow itself is unchanged.

The earlier implementation relied on Vue's runtime template compilation, which required shipping the template compiler:
that increased page size and runtime cost for every visitor and required loosening the site's security policy,
while the only capability gained was "Vue components inside an encrypted snippet". That trade-off is not worthwhile
for a static site, and such needs are better served by **page encryption / global encryption**.

**Environment Limitations:**

Since `crypto.subtle` in the Web Crypto API is only available in **Secure Contexts**, partial content encryption requires the site to run in an **HTTPS** environment (`http://localhost` is also considered a secure context). In non-HTTPS environments, the encryption feature will not work properly.
:::

## Related Configurations

For multilingual text configuration of the encryption feature, please refer to [Multilingual Configuration](../../config/locales.md#encryption-related-text).
