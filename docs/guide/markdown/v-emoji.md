---
title: emoji
icon: mdi:emoji-outline
createTime: 2025/11/29 14:03:43
permalink: /guide/markdown/emoji/
---

<script setup>
import EmojiList from '~/components/EmojiList.vue'
import { people, nature, foods, places, activities, symbols, objects, flags } from '~/composables/emoji'
</script>

## 概述

在 Markdown 中使用 `:emoji_name:` 语法即可插入 emoji 表情，该功能默认可用，无需额外配置。

## 示例

在 Markdown 中使用表情符号非常简单，只需用冒号包裹表情代码即可：

**输入示例：**

```md
:tada: :100:
```

**渲染效果：**

:tada: :100:

## 完整表情库

我们基于 [markdown-it-emoji](https://github.com/markdown-it/markdown-it-emoji) 插件提供完整的表情符号支持。

[如需查看所有可用的表情代码，请访问：**📋完整表情代码列表**](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.mjs){.read-more}

::: tip 点击 emoji 表情即可复制表情符号到剪贴板。
:::

### 人物

<EmojiList :list="people" />

### 自然

<EmojiList :list="nature" />

### 食物

<EmojiList :list="foods" />

### 地点

<EmojiList :list="places" />

### 活动

<EmojiList :list="activities" />

### 符号

<EmojiList :list="symbols" />

### 物品

<EmojiList :list="objects" />

### 旗帜

<EmojiList :list="flags" />
