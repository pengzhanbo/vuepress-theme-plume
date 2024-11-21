---
title: sitemap
author: pengzhanbo
icon: mdi:sitemap-outline
createTime: 2024/03/02 16:47:00
permalink: /guide/sitemap/
---

## 使用

主题提供了开箱即用的配置，为 站点生成 `sitemap.xml` 文件。
要启用它，需要进行以下配置：

```js
export default defineUserConfig({
  theme: plumeTheme({
    hostname: 'http://your_site_url',
  })
})
```

如需要自定义 sitemap，可以通过 `plugins.sitemap` 配置来实现。

```js
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      sitemap: {
        // ... sitemap 配置
      }
    }
  })
})
```

完整配置请查看 [文档](https://ecosystem.vuejs.press/zh/plugins/seo/sitemap/config.html)
