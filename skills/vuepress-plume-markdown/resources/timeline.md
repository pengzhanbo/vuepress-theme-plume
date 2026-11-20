# Timeline

## Enable

```ts
markdown: { timeline: true }
```

## Syntax

```md
::: timeline
- 事件 1
  time=2023-01-01 type=success

  内容 1

- 事件 2
  time=2023-02-01 type=warning icon=mdi:alert

  内容 2
:::
```

| Container option | Meaning |
| --- | --- |
| `horizontal` | horizontal layout |
| `card` | render items as cards |
| `line="solid \| dashed \| dotted"` | connector style (default `solid`) |
| `placement="left \| right \| between"` | item side (default `left`; `between` alternates in vertical mode) |

| Item option | Meaning |
| --- | --- |
| `time="..."` | time label |
| `type="info \| tip \| success \| warning \| danger \| caution \| important"` | color preset (default `info`) |
| `icon="mdi:xxx"` | item icon |
| `color="..."` | custom color |
| `line="solid \| dashed \| dotted"` | per-item connector override |
| `card=true \| false` | per-item card override |
| `placement="left \| right"` | per-item side (with container `placement="between"`) |

Rules: item options go on the line right after the item title; a **blank line** is required before the item body.
Quotes around values are optional as long as there is no space.

## Example

```md
::: timeline horizontal card
- v1.0.0
  time=2025-06-01 type=success

  正式发布
:::
```

Theme hooks: `--vp-timeline-c-line`, `--vp-timeline-c-point`, `--vp-timeline-c-title`,
`--vp-timeline-c-text`, `--vp-timeline-c-time`, `--vp-timeline-c-icon`, `--vp-timeline-bg-card`.
