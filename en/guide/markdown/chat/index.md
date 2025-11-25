---
url: /en/guide/markdown/chat/index.md
---
## Preface

::: chat title="User B"
{:2025-03-24 10:15:00}

{User B}
Putting chat screenshots in the documentation still looks pretty bad, is there a better way? \[doge]

{.}
Sure there is, bro, definitely sure

{.}
But is it really okay to post chat records like this?

{User B}
Proof of our fiery debates is worth keeping \[doge]

{:2025-03-24 15:32:00}

{.}
Good news: the docs now support chat records!

{.}
Bad news: I've used you as the example \[doge]

{User B}
???
:::

## Overview

In Markdown, wrapping specially formatted text content within a `:: chat` container allows you to display ==chat records== within the documentation.

::: warning This is a feature you likely won't need most of the time.
Please consider carefully whether you should use it when the need arises.
Filter out any private or sensitive content yourself.
:::

## Enable

This feature is disabled by default. You need to enable it in the `theme` configuration.

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      chat: true, // [!code ++]
    }
  })
})
```

## Usage

Within a `::: chat` container, use specific markers to identify the sender and timestamp of messages,
which will then render the chat record in the documentation.

```md
::: chat title="Title"
{:date}     <!-- Mark the starting timestamp -->

{username}  <!-- Mark the sender -->
xxx         <!-- The sender's message content -->

{.}         <!-- Mark as sent by the current user -->
xxx         <!-- The current user's message content -->
:::
```

* `{:date}` Marks the starting timestamp (Optional). Use the format `{:` + date + `}`. `date` can be in common date formats.

  The theme does not process `date` in any way; it simply renders it.

* `{username}` Marks the sender of the subsequent content. Use the format `{` + username + `}`. `username` can be any string.

* `{.}` Marks the message as sent by the current user.

## Example

**Input:**

```md
::: chat title="Title"
{:2025-03-24 10:15:00}

{User 1}
Message from User 1

{.}
Message from the current user

{User 2}
Message from User 2

{.}
Message from the current user
:::
```

**Output:**

::: chat title="Title"
{:2025-03-24 10:15:00}

{User 1}
Message from User 1

{.}
Message from the current user

{User 2}
Message from User 2

{.}
Message from the current user
:::
