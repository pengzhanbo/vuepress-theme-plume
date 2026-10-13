---
title: Audio Reader 音频
icon: rivet-icons:audio
createTime: 2024/12/24 22:31:01
permalink: /guide/embed/audio/reader/
---

## 概述

主题支持在文档中嵌入音频阅读 。

该功能由 [vuepress-plugin-md-power](../../config/plugins/markdown-power.md) 提供支持。

**音频阅读** 并不是一个音乐播放器，它仅是在内容中嵌入一个（ @[audioReader](https://sensearch.baidu.com/gettts?lan=en&spd=3&source=alading&text=audio) ）按钮，点击后播放一段音频。

它适合用于播放一些短时间的音频，比如 **单词标音** 。

## 配置

该功能默认不启用。你需要在主题配置中开启。

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      audioReader: true, // [!code ++]
    },
  }),
})
```

## markdown 语法

音频嵌入 markdown 语法是一个行内语法，因此你可以在 markdown 的任何地方中使用。

```md
@[audioReader](src)
```

添加配置项：

```md
@[audioReader type="audio/mpeg" title="title" autoplay start-time="0" end-time="10" volume="0.7"](src)
```

**配置说明：**

- `type`：音频类型，格式如：`audio/mpeg` ,
  默认根据音频链接地址的文件扩展名推断，如果链接地址中不包含扩展名，请手动声明。
- `title`：**鼠标悬停时显示的原生提示文本**。它最终渲染为根元素 `<button>` 的 `title` 属性，
  **不会作为可见文字显示**。如需显示可见文字，请使用下方的全局组件并通过默认插槽传入内容。
- `autoplay`：是否自动播放，不建议启用。
- `start-time`：音频起始播放时间点，单位为秒。
- `end-time`：音频结束播放时间点，单位为秒。
- `volume`：音频播放音量，范围为 `0 ~ 1` ，未设置时使用浏览器默认音量。

## 全局组件

主题提供了全局组件 `<VPAudioReader />` 以支持更灵活丰富的使用方式。

### Props

:::: field-group
::: field src
@type `string`
@required
音频播放地址
:::
::: field type
@type `string`
@default undefined
音频格式。未设置时从 `src` 的扩展名推断
:::
::: field autoplay
@type `boolean`
@default `false`
是否自动播放，不建议启用
:::
::: field startTime
@type `number`
@default undefined
音频起始播放时间点，单位为秒
:::
::: field endTime
@type `number`
@default undefined
音频结束播放时间点，单位为秒
:::
::: field volume
@type `number`
@default undefined
音频播放音量，范围为 `0 ~ 1`。未设置时使用浏览器默认音量
:::
::::

## 示例

**输入：**

```md
audio 美 [ˈɔːdioʊ] @[audioReader](/audio/audio.mp3)
```

**输出：**

audio 美 [ˈɔːdioʊ] @[audioReader](https://sensearch.baidu.com/gettts?lan=en&spd=3&source=alading&text=audio)

**输入：**

```md
audio 美 @[audioReader title="[ˈɔːdioʊ]"](/audio/audio.mp3)
```

**输出：**

audio 美 @[audioReader title="[ˈɔːdioʊ]"](https://sensearch.baidu.com/gettts?lan=en&spd=3&source=alading&text=audio)

（这里的 `[ˈɔːdioʊ]` 只会作为鼠标悬停提示出现，不会显示在页面上）

**输入：**

```md
audio 美 <VPAudioReader src="/audio/audio.mp3">[ˈɔːdioʊ]</VPAudioReader>
```

**输出：**

audio 美 <VPAudioReader src="https://sensearch.baidu.com/gettts?lan=en&spd=3&source=alading&text=audio">[ˈɔːdioʊ]</VPAudioReader>
