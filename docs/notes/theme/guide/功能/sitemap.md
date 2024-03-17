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
