<h1 align="center">vuepress-theme-plume</h1>

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
  <a href="https://codecov.io/gh/pengzhanbo/vuepress-theme-plume">
    <img src="https://codecov.io/gh/pengzhanbo/vuepress-theme-plume/graph/badge.svg?token=W6KYBX7WO5" alt="codecov">
  </a>
</p>

<p align="center">
<a href="/readme.md">中文</a> | English
</p>

## Introduction

vuepress-theme-plume is a modern theme built on VuePress 2, designed for creating
**technical blogs**, **personal notes**, **product documentation**, **knowledge bases**, and **tutorial series**.

The theme focuses on content presentation and user experience,
providing rich Markdown extensions to make your documentation more beautiful, professional, and expressive.

## Features

- **💻 Responsive Design** - Perfectly adapts to mobile, tablet, and desktop devices
- **📖 Collection System** - Create blogs, columns, product docs, technical docs, knowledge bases, and more through collections
- **🔗 Permanent Links** - Auto-generate permanent article links
- **⚖ Multi-language Support** - Built-in support for 7+ languages including English and Chinese
- **👀 Search & Comments** - Supports local search, Algolia search, and multiple comment systems (Giscus, Waline, Twikoo, Artalk)
- **👨‍💻 Dual Theme Mode** - Light/dark theme support including code highlighting
- **📠 Markdown Enhancement** - Tip containers, task lists, math formulas, code demos, file trees, code trees, timelines, collapsible panels, and more
- **🧀 Enhanced Code Blocks** - Code grouping, folding, focusing, line highlighting, word highlighting, twoslash, and more
- **😀 Icon System** - Built-in Iconify with 200,000+ icons, supports IconFont and FontAwesome
- **📚 Code Demo Embedding** - Supports CodePen, JSFiddle, CodeSandbox, Replit, and more
- **📊 Chart Support** - Chart.js, ECharts, Mermaid, Flowchart, PlantUML, Markmap
- **🎛 Media Embedding** - PDF, Bilibili, YouTube, local videos, audio, and more
- **🪞 Watermark** - Full-site watermark and partial content watermark support
- **🔑 Content Encryption** - Full-site encryption and partial encryption (directory encryption, article encryption)
- **⚡ Performance Optimization** - Compilation caching mechanism significantly improves build speed
- **🔥 Hot Reload Configuration** - Theme configuration changes take effect without restarting

## Quick Start

### Environment Requirements

- **Node.js**: ^20.19.0 or >= 22.0.0
- **Package Manager**: npm 8+, pnpm 8+, or Yarn 2+

### Installation

Use the CLI tool to quickly create a project:

```bash
npm create vuepress-theme-plume@latest
```

Or install manually:

```bash
# Create project directory
mkdir my-blog && cd my-blog

# Initialize project
npm init

# Install dependencies
npm i -D vuepress@next vue
npm i -D vuepress-theme-plume @vuepress/bundler-vite@next

# Add scripts to package.json
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  }
}
```

### Configuration

Create the `docs/.vuepress/config.ts` configuration file:

```ts
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  lang: 'en-US',
  title: 'My Blog',
  description: 'Welcome to my blog',
  bundler: viteBundler(),
  theme: plumeTheme({
    // Theme configuration
  }),
})
```

### Start Development

```bash
npm run docs:dev
```

Visit <http://localhost:8080> to view your site.

## Documentation

For detailed documentation, visit: [https://theme-plume.vuejs.press](https://theme-plume.vuejs.press)

### Key Documentation

- [Installation & Usage](https://theme-plume.vuejs.press/en/guide/usage/) - Complete installation guide
- [Theme Configuration](https://theme-plume.vuejs.press/en/config/intro/) - Configuration options explained
- [Collections](https://theme-plume.vuejs.press/en/guide/quick-start/collection/) - Create blog and documentation columns
- [Markdown Enhancement](https://theme-plume.vuejs.press/en/guide/markdown/basic/) - Rich Markdown syntax
- [Code Enhancement](https://theme-plume.vuejs.press/en/guide/code/intro/) - Code block features
- [Components](https://theme-plume.vuejs.press/en/guide/components/badge/) - Built-in component usage
- [Features](https://theme-plume.vuejs.press/en/guide/features/comments/) - Comments, search, encryption, and more
- [Deployment](https://theme-plume.vuejs.press/en/guide/quick-start/deployment/) - Deploy to various platforms

## Examples

- [Author's Blog](https://pengzhanbo.cn/)

[View more examples](https://theme-plume.vuejs.press/demos/)

## Community & Support

- QQ Group: [792882761](https://qm.qq.com/q/O3HNy4rxYc)
- Issue Tracker: [GitHub Issues](https://github.com/pengzhanbo/vuepress-theme-plume/issues)
- Discussions: [GitHub Discussions](https://github.com/pengzhanbo/vuepress-theme-plume/discussions)

## FAQ

### How to update the theme?

```bash
npx vp-update
```

### Out of memory during build?

```bash
export NODE_OPTIONS="--max_old_space_size=8192"
npm run docs:build
```

For more FAQs, please check the [FAQ documentation](https://theme-plume.vuejs.press/en/faq/).

## Contribution Guide

Contributions are welcome! Please read the [Contribution Guide](./CONTRIBUTING.md) first.

Development requirements:

- Node.js 20.19.0+
- pnpm 9+

Local development:

```bash
# Clone the repository
git clone https://github.com/pengzhanbo/vuepress-theme-plume.git

# Install dependencies
pnpm install

# Build the project
pnpm build

# Start development server
pnpm dev
```

## Changelog

For detailed changelog, please refer to [Changelog](./CHANGELOG.md).

## Contributors

Thank you to all contributors!

![GitHub contributors](https://img.shields.io/github/contributors/pengzhanbo/vuepress-theme-plume?color=32A9C3&labelColor=1B3C4A&logo=contributorcovenant)

[![contributors](https://contrib.rocks/image?repo=pengzhanbo/vuepress-theme-plume)](https://github.com/pengzhanbo/vuepress-theme-plume/graphs/contributors)

## License

[MIT](./LICENSE)

---

![Star History Chart](https://api.star-history.com/svg?repos=pengzhanbo/vuepress-theme-plume&type=Date)
