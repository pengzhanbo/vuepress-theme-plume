---
title: 文件树
createTime: 2024/09/30 14:41:57
icon: mdi:file-tree
permalink: /guide/markdown/file-tree/
---

## 概述

在 Markdown 中，你可以使用 `file-tree` 容器 来显示带有文件图标和可折叠子目录的目录结构。

## 语法

在 `::: file-tree` 容器，使用内置的 **Markdown 无序列表语法** 指定文件和目录的组织结构。
使用嵌套的列表项创建子目录；若希望某个目录不显示具体内容，只需在列表项末尾添加斜杠 `/` 即可。

以下语法可用于自定义文件树的外观：

- 通过加粗文件名或目录名来突出显示，例如 `**README.md**`
- 通过在名称后添加更多文本来为文件或目录添加注释
- 使用 `...` 或 `…` 作为名称来添加占位符文件和目录。
- 在 `:::file-tree` 后添加 `icon="simple"` 或 添加 `icon="colored"` 可以切换为简单图标或彩色图标，默认为彩色图标。

**输入：**

```md
::: file-tree

- docs
  - .vuepress
    - config.ts
  - page1.md
  - README.md
- theme  一个 **主题** 目录
  - client
    - components
      - **Navbar.vue**
    - composables
      - useNavbar.ts
    - styles
      - navbar.css
    - config.ts
  - node/
- package.json
- pnpm-lock.yaml
- .gitignore
- README.md
- …
:::
```

**输出：**

::: file-tree

- docs
  - .vuepress
    - config.ts
  - page1.md
  - README.md
- theme  一个 **主题** 目录
  - client
    - components
      - **Navbar.vue**
    - composables
      - useNavbar.ts
    - styles
      - navbar.css
    - config.ts
  - node/
- package.json
- pnpm-lock.yaml
- .gitignore
- README.md
- …
:::

## 使用简单图标

**输入：**

```md
::: file-tree icon="simple"
- docs
  - .vuepress
    - config.ts
  - page1.md
  - README.md
- package.json
:::
```

**输出：**

::: file-tree icon="simple"

- docs
  - .vuepress
    - config.ts
  - page1.md
  - README.md
- package.json
:::

## 配置

你可以在 `plugins.mdPower.fileTree` 选项中配置 文件树的图标默认类型：

::: code-tabs
@tab .vuepress/config.ts

```ts
export default defineUserConfig({
  theme: plumeTheme({
    plugins: {
      markdownPower: {
        fileTree: {
          icon: 'simple', // 'simple' | 'colored'
        }
      },
    }
  })
})
```

:::

::: tip 担心彩色图标会影响构建包体积？
您无需担心，文件树的彩色图标 也是从 `iconify` 解析获取，推荐您在本地安装 `@iconify/json` 项目，
主题会自动将 `@iconify/json` 中的图标数据解析为本地图标资源，即使您在不同的页面
多次使用，这包括了 导航栏、侧边栏、图标组件等，相同图标仅会存在一份资源！

每个彩色图标的大小约在 `1kb ~ 2kb` 之间，即使您的文件树非常夸张的使用了 100+ 不同的图标，对最终的构建包体积影响
也不会很大。
:::
