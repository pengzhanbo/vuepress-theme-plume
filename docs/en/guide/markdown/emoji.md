---
title: emoji
icon: mdi:emoji-outline
createTime: 2025/11/29 14:03:43
permalink: /en/guide/markdown/emoji/
---

<script setup>
import EmojiList from '~/components/EmojiList.vue'
import { people, nature, foods, places, activities, symbols, objects, flags } from '~/composables/emoji'
</script>

## Quick Start

在 Markdown 中使用表情符号非常简单，只需用冒号包裹表情代码即可：

**Input：**

```md
:tada: :100:
```

**Output：**

:tada: :100:

## Full Emoji List

We provide complete emoji support based on the [markdown-it-emoji](https://github.com/markdown-it/markdown-it-emoji) plugin.

[To view all available emoji codes, visit: **📋Complete Emoji Code List**](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.mjs){.read-more}

::: tip Click the emoji to copy the emoji symbol to the clipboard.
:::

### People

<EmojiList :list="people" />

### Nature

<EmojiList :list="nature" />

### Foods

<EmojiList :list="foods" />

### Place

<EmojiList :list="places" />

### Activity

<EmojiList :list="activities" />

### Symbol

<EmojiList :list="symbols" />

### Object

<EmojiList :list="objects" />

### Flag

<EmojiList :list="flags" />
