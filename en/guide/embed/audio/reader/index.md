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
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      audioReader: true, // [!code ++]
    },
  })
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
* `title`: Audio title, displayed before the audio icon.
* `autoplay`: Whether to enable autoplay (not recommended).
* `start-time`: Audio playback start time in seconds.
* `end-time`: Audio playback end time in seconds.
* `volume`: Audio playback volume, range from `0 ~ 1`.

## Global Component

The theme provides a global component `<AudioReader />` to support more flexible and comprehensive usage.

### Props

| Field | Type | Description |
| --------- | --------- | ----------------------------------- |
| src | `string` | Required, audio source URL |
| type | `string` | Optional, audio format, parsed from `src` by default |
| autoplay | `boolean` | Optional, whether to enable autoplay (not recommended) |
| startTime | `number` | Optional, audio playback start time in seconds |
| endTime | `number` | Optional, audio playback end time in seconds |
| volume | `number` | Optional, audio playback volume, range from `0 ~ 1` |

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

**Input:**

```md
audio 美 <AudioReader src="/audio/audio.mp3">[ˈɔːdioʊ]</AudioReader>
```

**Output:**

audio 美 \[ˈɔːdioʊ]
