---
url: /article/r532eavn/index.md
---
当前版本包含了一些破坏性的更新，因此做一些说明。

## vuepress-plugin-md-enhance 插件迁移

在 [1.0.0-rc.103](./102-103.md#vuepress-plugin-md-enhance-插件迁移) 版本中，
主题完成了一部分功能到 vuepress 官方插件的迁移工作。但依然还有部分功能尚未完成。

在当前版本更新中，主题对这项工作进行了新的推进，将 `markdownEnhance.include` 功能迁移到了
[`@vuepress/plugin-markdown-include`](https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-include.html) 插件。
因此，与之关联的配置项 `plugins.markdownEnhance.include` 将被移除，并迁移到 `plugins.markdownInclude` 进行配置。

**如果你有自定义配置，请注意需要进行迁移。**

## 功能修复

### @vuepress/plugin-git

在 `1.0.0-rc.119` 版本中，我重构了 [@vuepress/plugin-git](https://ecosystem.vuejs.press/zh/plugins/development/git.html) ，使插件能够获得更多的 git 信息，如 每个文件的 创建时间，最后修改时间，作者、提交历史记录等。

但与此同时也引入了新的 bug，该 bug 会导致在 私有 git 托管服务中进行构建时，在不能自动获取 贡献者头像使用 sha256
自动生成临时头像时会导致构建失败。
（ [#334](https://github.com/pengzhanbo/vuepress-theme-plume/issues/334),
[#349](https://github.com/pengzhanbo/vuepress-theme-plume/issues/349) )

另外的一个 隐性问题是，如果项目的提交记录过多，拥有数千条以上的记录时，由于读取的 git log 过多会导致内存占用过高。
可能会导致构建时间过长甚至失败。

我在 [vuepress/ecosystem#292](https://github.com/vuepress/ecosystem/pull/292) 修复了相关问题，并在
主题 `1.0.0-rc.120` 版本中进行了修复。
