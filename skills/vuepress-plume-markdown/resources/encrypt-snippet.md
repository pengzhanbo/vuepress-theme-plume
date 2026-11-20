# Encrypted snippet

Encrypt part of a page with a password. Page-level encryption (`frontmatter.password`) is covered by the
`vuepress-plume-config` skill.

## Enable

```ts
markdown: {
  encrypt: true,                    // container enabled, passwords per block
  encrypt: { password: '123456' },  // default password for blocks without one
}
```

## Syntax

````md
:::: encrypt password="123456"
这是加密的内容
::::

:::: encrypt password="654321" hint="密码是连续的 6 位数"
这是加密的内容 2
::::
````

| Attribute | Meaning |
| --- | --- |
| `password` / `pwd` | block password (only one of them takes effect) |
| `hint` | password hint shown in the unlock UI |

## Rules

- Without a block password and without a default password the build **fails** and the content is not rendered.
- Decrypted content is rendered as **static HTML**: no Vue components, no template syntax, no dynamic content.
- Requires HTTPS for the decryption flow to work in browsers.
- Use it for snippets/excerpts; for whole pages use `encrypt.rules` or `frontmatter.password`.
- Don't rely on it for real secrecy in a public repo — the ciphertext ships to the client.
