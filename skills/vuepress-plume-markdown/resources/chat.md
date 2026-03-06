# Chat

Display chat records using `::: chat` container.

## Enable

This feature is disabled by default, enable it in theme config:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      chat: true, // [!code ++]
    }
  })
})
```

## Syntax

- Container: `::: chat title="Title"`
- Timestamp: `{:timestamp}` (optional)
- Other User: `{username}`
- Current User: `{.}`

## Example

```md
::: chat title="Conversation"
{:2025-03-24 10:15:00}

{Alice}
Hello there!

{.}
Hi Alice! How are you?

{Alice}
I'm good, thanks.
:::
```

## Notes

::: warning
This is a feature that is rarely used. Please consider whether you need to use it. For content involving privacy, please filter it yourself.
:::
