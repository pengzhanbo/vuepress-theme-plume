# Chat

Display chat records using `::: chat` container.

## Syntax

- Container: `::: chat title="Title"`
- Timestamp: `{:timestamp}`
- Other User: `{username}`
- Current User: `{.}`

## Example

```md
::: chat title="Conversation"
{:2023-10-01 12:00}

{Alice}
Hello there!

{.}
Hi Alice! How are you?

{Alice}
I'm good, thanks.
:::
```
