---
title: Audio Reader 音频
icon: rivet-icons:audio
createTime: 2024/12/24 22:31:01
permalink: /guide/embed/audio/reader/
---

## 概述

主题支持在文档中嵌入 音频阅读 。

该功能由 [vuepress-plugin-md-power](../../config/plugins/markdownPower.md) 提供支持。

**音频阅读** 并不是一个音乐播放器，它仅是在内容中嵌入一个（ @[audioReader](https://sensearch.baidu.com/gettts?lan=en&spd=3&source=alading&text=audio) ）按钮，点击后播放一段音频。

它适合用于播放一些短时间的音频，比如 **单词标音** 。

## 配置

该功能默认不启用。你需要在主题配置中开启。

::: code-tabs
@tab .vuepress/config.ts

```ts
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      markdownPower: {
        audioReader: true,
      },
    }
  })
})
```

:::

## markdown 语法

音频嵌入 markdown 语法是一个 行内语法，因此你可以在 markdown 的任何地方中使用。

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
- `title`： 音频标题，显示在音频图标之前。
- `autoplay`：是否自动播放，不建议启用。
- `start-time`：音频起始播放时间点，单位为 秒。
- `end-time`：音频结束播放时间点，单位为 秒。
- `volume`：音频播放音量，范围为 `0 ~ 1` 。

## 全局组件

主题提供了全局组件 `<AudioReader />` 以支持更灵活丰富的使用方式。

### Props

| 字段      | 类型      | 描述                                |
| --------- | --------- | ----------------------------------- |
| src       | `string`  | 必填，音频播放地址                  |
| type      | `string`  | 选填，音频格式，默认从 `src` 中截取 |
| autoplay  | `boolean` | 选填，是否自动播放，不建议启用      |
| startTime | `number`  | 选填，音频起始播放时间点，单位为 秒 |
| endTime   | `number`  | 选填，音频结束播放时间点，单位为 秒 |
| volume    | `number`  | 选填，音频播放音量，范围为 `0 ~ 1`  |

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

**输入：**

```md
audio 美 <AudioReader src="/audio/audio.mp3">[ˈɔːdioʊ]</AudioReader>
```

**输出：**

audio 美 <AudioReader src="https://sensearch.baidu.com/gettts?lan=en&spd=3&source=alading&text=audio">[ˈɔːdioʊ]</AudioReader>
