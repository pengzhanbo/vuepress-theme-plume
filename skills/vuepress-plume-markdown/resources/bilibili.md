# Bilibili Video

Embed Bilibili videos in your markdown.

## Configuration

Enable the feature in `.vuepress/config.ts`:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      bilibili: true,
    },
  })
})
```

## Syntax

Simple syntax (using BVID):

```md
@[bilibili](bvid)
```

With options:

```md
@[bilibili p1 autoplay time="0" width="100%" height="400px" ratio="16:9"](bvid aid cid)
```

**Parameters:**

- `bvid`: Video BV ID (can be omitted if `aid` and `cid` are provided)
- `aid`: Video AID
- `cid`: Video CID
- `pX`: Page number (e.g., `p1`, `p2`)
- `autoplay`: Enable autoplay
- `time`: Start time (seconds or `mm:ss` / `hh:mm:ss`)
- `width`: Video width
- `height`: Video height
- `ratio`: Video aspect ratio (default `16:9`)

## Example

```md
@[bilibili](BV1EZ42187Hg)
```
