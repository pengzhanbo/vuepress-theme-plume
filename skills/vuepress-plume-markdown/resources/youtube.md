# YouTube Video

Embed YouTube videos in your markdown.

## Configuration

Enable the feature in `.vuepress/config.ts`:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      youtube: true,
    },
  })
})
```

## Syntax

Simple syntax:

```md
@[youtube](id)
```

With options:

```md
@[youtube autoplay loop start="0" end="0" width="100%" height="400px" ratio="16:9"](id)
```

**Parameters:**

- `id`: Video ID
- `autoplay`: Enable autoplay
- `loop`: Enable loop playback
- `start`: Start time
- `end`: End time
- `width`: Video width
- `height`: Video height
- `ratio`: Video aspect ratio (default `16:9`)

## Example

```md
@[youtube](0JJPfz5dg20)
```
