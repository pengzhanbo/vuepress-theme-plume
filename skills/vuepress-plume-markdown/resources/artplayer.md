# ArtPlayer Video

Embed custom source videos using ArtPlayer.

## Configuration

Enable the feature in `.vuepress/config.ts`:

```ts title=".vuepress/config.ts"
export default defineUserConfig({
  theme: plumeTheme({
    markdown: {
      artPlayer: true,
    },
  })
})
```

You must install `artplayer`. Additional dependencies may be needed for specific formats:

- `dashjs` for `.mpd`, `.dash`
- `hls.js` for `.m3u8`, `.hls`
- `mpegts.js` for `.ts`, `.flv`

```sh
npm i artplayer
# Optional
npm i dashjs hls.js mpegts.js
```

## Syntax

```md
@[artPlayer](src)
```

With options:

```md
@[artPlayer muted autoplay loop width="100%" height="400px" ratio="16:9"](src)
```

**Parameters:**

- `src`: Video source URL
- `width`: Video width
- `height`: Video height
- `ratio`: Video aspect ratio (default `16:9`)
- `type`: Video format (auto-detected)
- `autoplay`: Enable autoplay
- `muted`: Mute video (default `true` if autoplay)
- `volume`: Volume (0-1)
- `poster`: Poster image URL
- `auto-mini`: Auto mini-player on scroll

## Example

```md
@[artPlayer](https://example.com/video.mp4)
```
