# vuepress-theme-plume

<p align="center">
  <img src="https://theme-plume.vuejs.press/plume.svg" width="200px" alt="plume">
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/vuepress-theme-plume" target="_blank">
    <img src="https://img.shields.io/npm/v/vuepress-theme-plume?color=32A9C3&labelColor=1B3C4A&label=npm" alt="npm version">
  </a>
  <a href="https://www.npmjs.com/package/vuepress-theme-plume" target="_blank">
    <img src="https://img.shields.io/npm/dy/vuepress-theme-plume?color=32A9C3&labelColor=1B3C4A&label=downloads" alt="npm download">
  </a>
  <img src="https://img.shields.io/npm/dependency-version/vuepress-theme-plume/peer/vuepress?color=32A9C3&labelColor=1B3C4A" alt="peer dependency">
  <img src="https://img.shields.io/github/license/pengzhanbo/vuepress-theme-plume?color=32A9C3&labelColor=1B3C4A" alt="github license">
  <br>
  <a href="https://codecov.io/gh/pengzhanbo/vuepress-theme-plume" >
  <img src="https://codecov.io/gh/pengzhanbo/vuepress-theme-plume/graph/badge.svg?token=W6KYBX7WO5" alt="codecov"/>
  </a>
</p>

<p align="center">
中文 | <a href="/readme.en-US.md">English</a>
</p>

## 项目简介

vuepress-theme-plume 是一个基于 VuePress 2 的现代化主题，专为创建**技术博客**、**生活随笔**、**产品文档**、**知识库**和**系列教程**而设计。

主题注重内容表达和用户体验，提供丰富的 Markdown 扩展功能，让您的文档更加美观、专业且富有表现力。

## 特性

- **💻 响应式设计** - 完美适配移动端、平板和桌面设备
- **📖 集合系统** - 通过集合可同时实现博客、专栏、产品文档、技术文档、知识库等多种内容类型
- **🔗 永久链接** - 自动生成文章永久链接
- **⚖ 多语言支持** - 内置中文、英文等 7+ 种语言支持
- **👀 搜索与评论** - 支持本地搜索、Algolia 搜索，以及多种评论系统（Giscus、Waline、Twikoo、Artalk）
- **👨‍💻 双主题模式** - 支持浅色/深色主题，包括代码高亮
- **📠 Markdown 增强** - 提示容器、任务列表、数学公式、代码演示、文件树、代码树、时间轴、折叠面板等
- **🧀 代码块增强** - 代码分组、折叠、聚焦、行高亮、词高亮、twoslash 等
- **😀 图标系统** - 内置 Iconify 200,000+ 图标，支持 IconFont、FontAwesome
- **📚 代码演示嵌入** - 支持 CodePen、JSFiddle、CodeSandbox、Replit 等
- **📊 图表支持** - Chart.js、ECharts、Mermaid、Flowchart、PlantUML、Markmap
- **🎛 媒体嵌入** - PDF、Bilibili、YouTube、本地视频、音频等
- **🪞 水印功能** - 支持全站水印和部分内容水印
- **🔑 内容加密** - 支持全站加密和部分加密（目录加密、文章加密）
- **⚡ 性能优化** - 编译缓存机制，大幅提升构建速度
- **🔥 热更新配置** - 修改主题配置无需重启服务

## 快速开始

### 环境要求

- **Node.js**: ^20.19.0 或 >= 22.0.0
- **包管理器**: npm 8+、pnpm 8+ 或 Yarn 2+

### 安装

使用命令行工具快速创建项目：

```bash
npm create vuepress-theme-plume@latest
```

或手动安装：

```bash
# 创建项目目录
mkdir my-blog && cd my-blog

# 初始化项目
npm init

# 安装依赖
npm i -D vuepress@next vue
npm i -D vuepress-theme-plume @vuepress/bundler-vite@next

# 添加脚本到 package.json
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
}
```

### 配置

创建 `docs/.vuepress/config.ts` 配置文件：

```ts
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  lang: 'zh-CN',
  title: '我的博客',
  description: '欢迎来到我的博客',
  bundler: viteBundler(),
  theme: plumeTheme({
    // 主题配置
  }),
})
```

### 启动

```bash
npm run docs:dev
```

访问 <http://localhost:8080> 查看您的站点。

## 文档

详细文档请访问：[https://theme-plume.vuejs.press](https://theme-plume.vuejs.press)

### 主要文档

- [安装与使用](https://theme-plume.vuejs.press/guide/usage/) - 完整的安装指南
- [主题配置](https://theme-plume.vuejs.press/config/intro/) - 配置选项详解
- [集合](https://theme-plume.vuejs.press/guide/quick-start/collection/) - 创建博客、文档专栏
- [Markdown 增强](https://theme-plume.vuejs.press/guide/markdown/basic/) - 丰富的 Markdown 语法
- [代码增强](https://theme-plume.vuejs.press/guide/code/intro/) - 代码块功能
- [组件](https://theme-plume.vuejs.press/guide/components/badge/) - 内置组件使用
- [功能特性](https://theme-plume.vuejs.press/guide/features/comments/) - 评论、搜索、加密等
- [部署指南](https://theme-plume.vuejs.press/guide/quick-start/deployment/) - 部署到各种平台

## 案例

- [作者个人博客](https://pengzhanbo.cn/)

[查看更多案例](https://theme-plume.vuejs.press/demos/)

## 交流与支持

- QQ 交流群：[792882761](https://qm.qq.com/q/O3HNy4rxYc)
- 问题反馈：[GitHub Issues](https://github.com/pengzhanbo/vuepress-theme-plume/issues)
- 讨论交流：[GitHub Discussions](https://github.com/pengzhanbo/vuepress-theme-plume/discussions)

## 常见问题

### 如何更新主题？

```bash
npx vp-update
```

### 构建时内存溢出？

```bash
export NODE_OPTIONS="--max_old_space_size=8192"
npm run docs:build
```

更多常见问题，请查阅 [常见问题文档](https://theme-plume.vuejs.press/faq/)。

## 贡献指南

欢迎贡献代码！请先阅读 [贡献指南](./CONTRIBUTING.md)。

开发要求：

- Node.js 20.19.0+
- pnpm 9+

本地开发：

```bash
# 克隆仓库
git clone https://github.com/pengzhanbo/vuepress-theme-plume.git

# 安装依赖
pnpm install

# 构建项目
pnpm build

# 启动开发服务
pnpm dev
```

## 更新日志

详细更新内容请查阅 [Changelog](./CHANGELOG.md)。

## 贡献者

感谢所有贡献者的付出！

![GitHub contributors](https://img.shields.io/github/contributors/pengzhanbo/vuepress-theme-plume?color=32A9C3&labelColor=1B3C4A&logo=contributorcovenant)

[![contributors](https://contrib.rocks/image?repo=pengzhanbo/vuepress-theme-plume)](https://github.com/pengzhanbo/vuepress-theme-plume/graphs/contributors)

## License

[MIT](./LICENSE)

---

![Star History Chart](https://api.star-history.com/svg?repos=pengzhanbo/vuepress-theme-plume&type=Date)
