# Audio Reader

Small play-button audio player, handy for pronunciations.

## Enable

```ts
markdown: { audioReader: true }
```

## Syntax

```md
audio 美 [ˈɔːdioʊ] @[audioReader](/audio/audio.mp3)

@[audioReader type="audio/mpeg" autoplay start-time="0" end-time="10" volume="0.7"](src)
```

| Prop | Type | Default | Note |
| --- | --- | --- | --- |
| `src` | `string` | required | audio URL |
| `type` | `string` | — | MIME type |
| `title` | `string` | — | native tooltip (`<button title>`), **not** visible text |
| `autoplay` | `boolean` | `false` | |
| `start-time` | `number` | — | seconds |
| `end-time` | `number` | — | seconds |
| `volume` | `number` | browser default | `0`–`1` |

## Component

```md
<VPAudioReader src="/audio/audio.mp3">[ˈɔːdioʊ]</VPAudioReader>
```

The default slot is the visible label (the markdown syntax has no visible label). Props are camelCase in the
component: `src`, `type`, `autoplay`, `startTime`, `endTime`, `volume`.
