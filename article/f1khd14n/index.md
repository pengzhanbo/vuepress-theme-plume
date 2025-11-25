---
url: /article/f1khd14n/index.md
---
::: warning 当前版本包含了破坏性的更新。
:::

## Breaking Changes

### 移除 `node18` 支持

主题从 `1.0.0-rc.144` 开始，不再支持 `node18` 。最低支持的 node 版本为 `20.6.0` 。

### 图标语法

在 主题 `1.0.0-rc.144` 版本之前，图标语法如下：

```md
:[collect:name]:
:[collect:name size/color]:
```

该语法支持所有的 `iconify` 图标，然而该语法存在一些问题：

* 书写体验不友好，标记语法中的字符 `:[` 和  `]:` 从键盘布局和输入顺序上，不适合快速输入
* `size/color` 不严谨，很容易解析错误

  如果使用 `rgb(34 12 64 / 60%)`、 `hsl(30 100% 50% / 60%)`、`hwb(90 10% 10% / 0.5)` 等颜色值，由于包含了 `/`
  会错误的将 `/` 之前的部分解析为 `size`，从而导致解析错误。
* 仅能支持 `iconify` 来源的图标，无法支持 `iconfont` / `fontawesome` / `lucide` 等图标库的图标

**由于上述原因，主题决定弃用该语法，修改为下述语法：**

```md
::collect:name::
::collect:name =size /color::
```

* 标记符号 `:[`、 `]:` 替换为 `::`，这是的可以连续敲击同一个按键以实现快速输入
* `=size` 代表图标的大小，`/color` 代表图标的颜色，使用明确的前置符号来区分 `size` 和 `color`

:::info 更多图表来源支持
当前版本依然仅支持 `iconify` 图标，主题计划在后续版本中支持 `iconfont` / `fontawesome` / `lucide` 等图标库，
更用户更灵活的选择。
:::

::: warning
为了方便从旧语法迁移到新语法，在当前版本中，旧的语法依然能够正确渲染图标，
主题会在控制台输出警告信息和修改建议，请根据修改建议进行调整。
:::

### 重写 `file-tree` 容器

在新的版本中，主题重写了 `file-tree` 容器的 markdown-it 插件，
使用全局的解析方法解析文件树内容，并改进了文件树的显示效果和交互行为。

此破坏性更新为主题内部调整，语法保持不变，用户无需对内容进行调整。

## 新功能

### 版权信息配置调整

在 `themeConfig` 的 `copyright` 配置中，新增 `author` 和 `creation` 配置项。

* `author` 全局配置文章的默认的版权所有者。
* `creation` 全局配置文章的默认的创作方式。

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    copyright: {
      author: 'pengzhanbo', // [!code ++:2]
      creation: 'original',
      license: 'MIT'
    }
  })
})
```
