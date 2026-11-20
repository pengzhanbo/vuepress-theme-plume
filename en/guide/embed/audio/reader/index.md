---
url: /en/guide/embed/audio/reader/index.md
---
## Overview

The theme supports embedding audio reading capabilities in documentation.

This feature is powered by [vuepress-plugin-md-power](../../config/plugins/markdown-power.md).

**Audio Reader** is not a music player; it simply embeds an
(@[audioReader](https://sensearch.baidu.com/gettts?lan=en\&spd=3\&source=alading\&text=audio))
button within content that plays an audio clip when clicked.

It is suitable for playing short audio clips, such as **word pronunciation guides**.

## Configuration

This feature is disabled by default. You need to enable it in the theme configuration.

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

## Markdown Syntax

The audio embedding markdown syntax is an inline syntax, allowing usage anywhere within markdown.

```md
@[audioReader](src)
```

With configuration options:

```md
@[audioReader type="audio/mpeg" title="title" autoplay start-time="0" end-time="10" volume="0.7"](src)
```

**Parameter Description:**

* `type`: Audio type, formatted as `audio/mpeg`.
  Defaults to inference from the file extension in the audio URL. If the URL lacks an extension, declare manually.
* `title`: **The native tooltip text displayed on mouse hover**. It is ultimately rendered as the `title`
  attribute of the root `<button>` element and **is not displayed as visible text**. To display visible text,
  use the global component below and pass content through the default slot.
* `autoplay`: Whether to enable autoplay (not recommended).
* `start-time`: Audio playback start time in seconds.
* `end-time`: Audio playback end time in seconds.
* `volume`: Audio playback volume, range from `0 ~ 1`. Falls back to the browser default when not set.

## Global Component

The theme provides a global component `<VPAudioReader />` to support more flexible and comprehensive usage.

### Props

:::: field-group
::: field src
@type `string`
@required
Audio source URL
:::
::: field type
@type `string`
@default undefined
Audio format. Inferred from the extension of `src` when not set
:::
::: field autoplay
@type `boolean`
@default `false`
Whether to autoplay (not recommended)
:::
::: field startTime
@type `number`
@default undefined
Audio playback start time, in seconds
:::
::: field endTime
@type `number`
@default undefined
Audio playback end time, in seconds
:::
::: field volume
@type `number`
@default undefined
Audio playback volume, range `0 ~ 1`. Falls back to the browser default when not set
:::
::::

## Examples

**Input:**

```md
audio 美 [ˈɔːdioʊ] @[audioReader](/audio/audio.mp3)
```

**Output:**

audio 美 \[ˈɔːdioʊ] @[audioReader](https://sensearch.baidu.com/gettts?lan=en\&spd=3\&source=alading\&text=audio)

**Input:**

```md
audio 美 @[audioReader title="[ˈɔːdioʊ]"](/audio/audio.mp3)
```

**Output:**

audio 美 @[audioReader title="\[ˈɔːdioʊ\]"](https://sensearch.baidu.com/gettts?lan=en\&spd=3\&source=alading\&text=audio)

(Here `[ˈɔːdioʊ]` only appears as a mouse hover tooltip and will not be displayed on the page)

**Input:**

```md
audio 美 <VPAudioReader src="/audio/audio.mp3">[ˈɔːdioʊ]</VPAudioReader>
```

**Output:**

audio 美 \[ˈɔːdioʊ]
