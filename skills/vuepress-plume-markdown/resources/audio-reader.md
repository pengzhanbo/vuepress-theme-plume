# Audio Reader

Embed a simple audio player button, useful for pronunciation guides.

## Configuration

Enable the feature in `.vuepress/config.ts`:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      audioReader: true,
    },
  })
})
```

## Syntax

Inline syntax:

```md
@[audioReader](src)
```

With options:

```md
@[audioReader type="audio/mpeg" title="title" autoplay start-time="0" end-time="10" volume="0.7"](src)
```

**Parameters:**

- `src`: Audio source URL
- `type`: Audio MIME type (e.g., `audio/mpeg`)
- `title`: Title displayed before the icon
- `autoplay`: Enable autoplay
- `start-time`: Start time in seconds
- `end-time`: End time in seconds
- `volume`: Volume (0-1)

## Global Component

You can also use the `<AudioReader />` component.

```md
<AudioReader src="/audio/audio.mp3">[ˈɔːdioʊ]</AudioReader>
```

## Example

```md
audio 美 [ˈɔːdioʊ] @[audioReader](/audio/audio.mp3)
```
