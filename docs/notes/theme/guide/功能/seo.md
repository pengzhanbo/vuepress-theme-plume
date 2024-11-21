---
title: SEO
author: pengzhanbo
icon: tabler:seo
createTime: 2024/03/02 14:46:25
permalink: /guide/seo/
---

## 使用

主题提供了开箱即用的配置，为 站点 启用 SEO 优化功能。
要启用它，需要进行以下配置：

```js
export default defineUserConfig({
  theme: plumeTheme({
    hostname: 'http://your_site_url',
  })
})
```

如需要自定义 SEO 优化，可以通过 `plugins.seo` 配置来实现。

```js
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      seo: {
        // ... seo 配置
      }
    }
  })
})
```

完整配置请查看 [文档](https://ecosystem.vuejs.press/zh/plugins/seo/seo/config.html)

::: note
示例 Fork 自 [@vuepress/plugin-seo](https://ecosystem.vuejs.press/zh/plugins/seo/seo/),
遵循 [MIT](https://github.com/vuepress/ecosystem/blob/main/LICENSE) 许可证。
:::

## 指南

主题会通过向网站 `<head>` 注入标签，让你的网站完全支持 [开放内容协议 OGP](https://ogp.me/)
和 [JSON-LD 1.1](https://www.w3.org/TR/json-ld-api/)，以全面增强站点的搜索引擎优化性。

默认情况下，插件会读取站点配置、主题配置与页面的 frontmatter 来尽可能自动生成。
诸如站点名称，页面标题，页面类型，写作日期，最后更新日期，文章标签均会自动生成。

## 默认的 OGP 生成逻辑

|         属性名称         |                                                 值                                                 |
| :----------------------: | :------------------------------------------------------------------------------------------------: |
|         `og:url`         |                                    `options.hostname` + `path`                                     |
|      `og:site_name`      |                                         `siteConfig.title`                                         |
|        `og:title`        |                                            `page.title`                                            |
|     `og:description`     |    `page.frontmatter.description` \|\| 自动生成 (当插件选项中的 `autoDescription` 为 `true` 时)    |
|        `og:type`         |                                            `"article"`                                             |
|        `og:image`        | `options.hostname` + `page.frontmatter.image` \|\| 页面的第一张图片\|\| 插件选项的 `fallbackImage` |
|    `og:updated_time`     |                                       `page.git.updatedTime`                                       |
|       `og:locale`        |                                            `page.lang`                                             |
|  `og:locale:alternate`   |                                 `siteData.locales` 包含的其他语言                                  |
|      `twitter:card`      |                              `"summary_large_image"` (仅在找到图片时)                              |
|   `twitter:image:alt`    |                                   `page.title` (仅在找到图片时)                                    |
|     `article:author`     |                          `page.frontmatter.author` \|\| `options.author`                           |
|      `article:tag`       |                        `page.frontmatter.tags` \|\| `page.frontmatter.tag`                         |
| `article:published_time` |                        `page.frontmatter.date` \|\| `page.git.createdTime`                         |
| `article:modified_time`  |                                       `page.git.updatedTime`                                       |

## 默认的 JSON-LD 生成逻辑

|     属性名      |                               值                               |
| :-------------: | :------------------------------------------------------------: |
|   `@context`    |                     `"https://schema.org"`                     |
|     `@type`     |                        `"NewsArticle"`                         |
|   `headline`    |                          `page.title`                          |
|     `image`     | 页面中的图片\|\| `options.hostname` + `page.frontmatter.image` |
| `datePublished` |      `page.frontmatter.date` \|\| `page.git.createdTime`       |
| `dateModified`  |                     `page.git.updatedTime`                     |
|    `author`     |        `page.frontmatter.author` \|\| `options.author`         |

## SEO 介绍

搜索引擎优化 (**S**earch **E**ngine **O**ptimization)，是一种透过了解搜索引擎的运作规则来调整网站，
以及提高目的网站在有关搜索引擎内排名的方式。由于不少研究发现，搜索引擎的用户往往只会留意搜索结果最
前面的几个条目，所以不少网站都希望透过各种形式来影响搜索引擎的排序，让自己的网站可以有优秀的搜索排名。
所谓“针对搜索引擎作最优化的处理”，是指为了要让网站更容易被搜索引擎接受。搜索引擎会将网站彼此间的内容做
一些相关性的资料比对，然后再由浏览器将这些内容以最快速且接近最完整的方式，呈现给搜索者。
搜索引擎优化就是通过搜索引擎的规则进行优化，为用户打造更好的用户体验，最终的目的就是做好用户体验。

## 相关文档

- [开放内容协议 OGP](https://ogp.me/) (**O**pen **G**raph **Pr**otocal)

  本插件完美支持该协议，会自动生成符合该协议的 `<meta>` 标签。

- [JSON-LD 1.1](https://www.w3.org/TR/json-ld-api/)

  本插件会为文章类页面生成 NewsArticle 类标签。

- [RDFa 1.1](https://www.w3.org/TR/rdfa-primer/)

  RDFa 主要标记 HTML 结构。

- [Schema.Org](https://schema.org/)

  结构标记的 Schema 定义站点
