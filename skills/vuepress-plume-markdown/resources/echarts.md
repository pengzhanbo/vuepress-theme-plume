# ECharts

## Enable

```ts
markdown: { echarts: true }
```

Requires `npm install echarts`.

## Syntax — JSON

````md
::: echarts 标题

```json
{
  "xAxis": { "type": "category", "data": ["Mon", "Tue"] },
  "yAxis": { "type": "value" },
  "series": [{ "data": [10, 20], "type": "bar" }]
}
```

:::
````

## Syntax — JS

The block runs in a sandbox where `echarts` is the instance; assign the config to `option`
(and optionally `width` / `height`). Top-level `await` and `fetch` are available.

````md
::: echarts 标题

```js
const res = await fetch('/api/stats')
const data = await res.json()
const option = { series: [{ type: 'line', data }] }
```

:::
````

> Script blocks **do not run by default** — the page shows an empty area and the build logs one warning.
> To execute them, enable both switches (or a file allowlist) explicitly:
>
> ```ts
> markdown: {
>   DANGEROUS_ALLOW_SCRIPT_EXECUTION: true,
>   DANGEROUS_SCRIPT_EXECUTION_ALLOWLIST: ['docs/charts/**'],
> }
> ```
>
> Executing author scripts in the browser is an XSS / RCE risk — prefer `'*'`-free allowlists and only for
> trusted content. JSON configurations carry no risk.

## Advanced

```ts
// .vuepress/client.ts
import { defineEchartsConfig } from '@vuepress/plugin-markdown-chart/client'
import { defineClientConfig } from 'vuepress/client'

defineEchartsConfig({
  setup: (echarts) => { /* register themes / custom series */ },
  options: { renderer: 'canvas' },
})

export default defineClientConfig({})
```
