---
url: /article/6pa64b1n/index.md
---
这两个版本做了一些 破坏性的更新，主要围绕以下两个方面：

* 适配 [Vuepress Guidelines](https://ecosystem.vuejs.press/zh/themes/guidelines.html)
* 更新 vuepress-plugin-md-enhance 插件，并迁移其中的部分功能，改用 VuePress 官方插件

## 适配 VuePress Guidelines

VuePress 推出了 [主题开发指南](https://ecosystem.vuejs.press/zh/themes/guidelines.html)。

这一举措旨在规范化主题开发流程，并提出了主题开发过程中需要遵守的几个约定，这包括：

* 约定 CSS 变量命名规范，并约束 主要 CSS 变量的命名，如 `--vp-c-accent`，`--vp-c-text` 等。
* 约定 主要的 HTML 元素容器应添加指定的 属性名，如 `vp-content`, `vp-navbar` 等。
* 约定 双主题模式应使用 `[data-theme="light"]` 和 `[data-theme="dark"]` 来区分。

围绕这几个约定，可以使得 VuePress 的 开发者们，可以很方便的 开发出 更具通用性的 主题和插件。

`plume` 主题也同样适配了这些约定：

* **CSS 变量命名的变更** 和 **HTML 元素添加属性**，对于用户是无感知的，您无需关注这方面是否会有影响。

* **双主题模式**，对于有自定义主题需求的用户而言，如果您有重新定义深色模式下的样式，则需要做出一些调整：

  在 CSS 中的 `.dark` 类应替换为 `[data-theme="dark"]`，请不用担心替换会带来额外的副作用，它们在 CSS 中的
  优先级是相同的，您可以安全的执行替换操作。

## vuepress-plugin-md-enhance 插件迁移

[vuepress-plugin-md-enhance](https://plugin-md-enhance.vuejs.press/zh/) 提供了非常多的功能支持，但与之带来的困难是，
它变得越来越臃肿，变得难以维护了。

我在 [#4130](https://github.com/vuepress-theme-hope/vuepress-theme-hope/issues/4130) 中提出了拆分迁移的计划。
因此从 `@2.0.0-rc.53` 版本开始，逐步开始拆分迁移的计划。

截止到 `@2.0.0-rc.54` 版本，已经拆分出了以下插件：

* [@vuepress/plugin-markdown-hint](https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-hint.html)
* [@vuepress/plugin-markdown-image](https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-image.html)
* [@vuepress/plugin-markdown-math](https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-math.html)
* [@vuepress/plugin-markdown-tab](https://ecosystem.vuejs.press/zh/plugins/markdown/markdown-tab.html)

当前主题也将 vuepress-plugin-md-enhance 更新到 `@2.0.0-rc.54` 版本，因此，也重新接入了上述的插件。

* `@vuepress/plugin-markdown-hint` 提供了 提示容器 和 `github alerts` 支持，主题已内置了该插件，对于该插件的迁移，
  用户是无需做任何修改的，您可以继续使用这些功能。

* `@vuepress/plugin-markdown-image` 提供了图片支持，主题已内置了该插件，但不启用该插件的默认功能，
  因此，如果您使用了如 `plugins.mdEnhance.imgSize` 配置项，您需要通过`plugins.markdownImage` 重新进行配置。

* `@vuepress/plugin-markdown-math` 提供了数学公式支持，主题已内置了该插件，并默认启用了 `katex` 支持。

* `@vuepress/plugin-markdown-tab` 提供了 Tab 容器 和 代码分组支持，主题重写了插件部分内容，对 `code-tabs` 容器
  做了一些调整，支持在 代码分组标题中显示 相关联的图标。

## 其它更新

* **文件树** 现在支持 不同的图标方案，可在 `:::file-tree` 后跟随 `:simple-icon` / `:colored-icon` 切换。

  默认为 colored-icon，如果切换为 simple-icon，则不再根据 文件夹名和文件扩展名匹配不同的图标，仅显示默认的
  文件夹图标和文件图标。

* **代码块分组** 的标题现在支持显示 图标。当作为 文件名时，与 **文件树** 采用相同的图标解析规则，还额外支持
  不同的技术、框架、语言的名称图标。

* 优化了 容器、任务列表、脚注、等的样式。
