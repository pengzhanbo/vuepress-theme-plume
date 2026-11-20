# ArtPlayer (custom video)

## Enable

```ts
markdown: { artPlayer: true }
```

Optional peers (install only the ones you need):

```sh
npm i artplayer              # required
npm i dashjs                 # .mpd / .dash
npm i hls.js                 # .m3u8 / .hls
npm i mpegts.js              # .ts / .flv
```

## Syntax

```md
@[artPlayer](https://example.com/video.mp4)

@[artPlayer muted autoplay loop width="100%" height="400px" ratio="16:9" poster="/poster.png"](src)
```

| Prop | Type | Default |
| --- | --- | --- |
| `src` | `string` | required |
| `width` / `height` | `string` | `100%` / auto |
| `ratio` | `string` | `16:9` |
| `type` | `string` | auto-detected from the extension |
| `autoplay` | `boolean` | `false` |
| `muted` | `boolean` | follows `autoplay` |
| `loop` | `boolean` | `false` |
| `volume` | `number` | `0.75` |
| `poster` | `string` | — |
| `auto-mini` | `boolean` | `false` (mini player on scroll) |

## Component

```md
<ArtPlayer src="/videos/demo.mp4" fullscreen />
```

`@[artPlayer ...]` is equivalent to the component with
`fullscreen flip playback-rate aspect-ratio setting pip` enabled.
