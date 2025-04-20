---
pageLayout: home
config:
  -
    type: doc-hero
    hero:
      name: Theme Plume
      text: VuePress Next Theme
      tagline: 示例用于展示所有的布局插槽
      image:
        src: /plume.svg
        width: 240
      actions:
        -
          theme: brand
          text: 博客
          link: /blog/
        -
          theme: alt
          text: Github →
          link: https://github.com/pengzhanbo/vuepress-theme-plume
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(120deg, var(--vp-c-purple-1) 30%, var(--vp-c-brand-2));
  --vp-home-hero-tagline: var(--vp-c-text-2);
  --vp-home-hero-text: var(--vp-c-text-1);
  --vp-home-hero-image-background-image: linear-gradient(-45deg, var(--vp-c-brand-soft) 50%, var(--vp-c-brand-2) 50%);
  --vp-home-hero-image-filter: blur(44px);
}
</style>
