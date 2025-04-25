---
title: Build Optimization
icon: clarity:bundle-solid
outline: 2
createTime: 2025/03/05 16:06:03
permalink: /en/guide/optimize-build/
---

## Image Optimization <Badge type="warning" text="Experimental" />

When we embed images in markdown using `[alt](url)` or `<img src="url">`, the page displays the images as expected.

However, due to different image sizes, when images are small or network conditions are good,
we may not notice significant layout shifts.
When images are large or network conditions are poor, the layout can change noticeably as images load,
causing other content to shift.

This experience is not user-friendly, especially with many images on a page. Frequent layout changes can cause noticeable jitter.

To stabilize the layout, images must be optimized. According to [MDN > img](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/img#height):

::: info
`<img>` with both `height` and `width` allows the browser to calculate the image's aspect ratio before loading.
This reserves space for the image, reducing or preventing layout shifts during download and rendering.
Reducing layout shifts is crucial for good user experience and web performance.
:::

Our theme provides a solution: automatically adding `width` and `height` attributes to `[alt](url)` or `<img src="url">` in markdown files.

Enable it by configuring `markdownPower`:

```ts
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      markdownPower: {
        imageSize: true, // 'local' | 'all'
      },
    }
  })
})
```

When enabled, the theme retrieves the original dimensions of images from their source URLs and adds `width` and `height` attributes.

- `'local'`: Only adds attributes to local images.
- `'all'`: Adds attributes to both local and remote images.
- `true`: Equivalent to `'local'`.

::: important
For performance reasons, this feature only takes effect during production build.
:::

::: important
Use `'all'` cautiously. It requests all remote images during production build,
which can increase build time for sites with many images.
The theme optimizes this by only requesting a few KB of data to analyze dimensions and processing images concurrently.
:::

## Icon Optimization

Thanks to the open-source project [iconify](https://icon-sets.iconify.design/), you can use approximately 200,000 icons in our theme.

However, this doesn't mean the theme needs to load all icons.
You may have noticed the theme recommends installing the `@iconify/json` package locally,
which requires downloading a 70Mb resource pack.
Loading all icons into the documentation site would be excessively large.

But rest assured, the theme only loads the icon resources you actually use.
This includes Iconify icons in navigation, sidebar, homepage Features,
and icons used via the `::collect:name::` syntax or `<Icon name="icon_name" />` component.

When loading icons from local `@iconify/json`, iconify names icons by `[collect]:[name]`,
with each collection containing 100 to 1000+ icons in a `json` file.
Using many different `collect` icons can slow down initial loading and parsing.
For example, our theme uses 54 `collect` collections with over 160 icons,
taking about `500ms` to load and parse initially.

In response to this situation, the theme caches the used icon resources upon the first launch.
During subsequent launches, icons are preferentially loaded from the cache.
Since only the utilized icon resources are cached, loading these resources is significantly
faster than repeatedly parsing icon resources under different `collect` sections,
and it also results in higher resource utilization efficiency.

::: info
Using 54 `collect` collections is extreme. While `500ms` for 54 I/O reads and JSON parses seems normal,
it's unexpected for only 160+ icons. Caching these icons is a good solution.
:::
