# 贡献指南

## 概览

项目仓库借助于 [pnpm 工作空间](https://pnpm.io/zh/workspaces) 来实现
[Monorepo](https://en.wikipedia.org/wiki/Monorepo) ，存放了多个互相关联的独立 Package 。

- 主题于 `theme` 目录中进行开发维护。
- 插件于 `plugins` 目录中进行开发维护。
- 文档于 `docs` 目录中进行开发维护。

在 `plugins` 目录中：

- `plugin-search`: 为主题提供 全文模糊搜索 功能
- `plugin-md-power`: 提供 markdown 增强功能
- `plugin-fonts`: 提供特殊字符字体支持

## 开发配置

开发要求：

- [Node.js](http://nodejs.org/) version `^20.19.0` 或 `>=22.12.0`
- [pnpm](https://pnpm.io/zh/) version `>=12.6.0`

克隆代码仓库，并安装依赖：

```sh
pnpm install
```

在首次启动开发服务前，先构建源代码：

```sh
pnpm build
```

### 主要工具

- [TypeScript](https://www.typescriptlang.org/) 作为开发语言
- [ESLint](https://eslint.org/) 用于代码检查和格式化
- [StyleLint](https://stylelint.io/) 用于代码检查和格式化

### 脚本

#### `pnpm build`

`build` 命令使用 [tsdown](https://tsdown.dev/) 将源代码编译成 `dist` 目录下的 `.js` 文件，
同时通过 `cpx` 复制不需要编译的静态资源（`.vue`、`.css`、图片、字体等）到对应的 `dist` 目录下。

由于编译后的输出目录 `dist` 被 `.gitignore` 排除在仓库以外，你在克隆代码仓库后，
需要先执行该命令来确保项目代码可以顺利运行。

#### `pnpm dev`

`dev` 命令会在本地同时开启两个进程，一个是监听 主题 `theme` 目录的 `tsdown:watch` 与 `copy:watch`（即 `dev:package`），
一个是运行 文档 `docs` 目录的 `vuepress` 开发服务（即 `docs:dev`）。

除 `plugin-md-power` 外，`plugins` 目录下的其它插件默认都没有 `dev` 命令，因此你对这些插件的改动，
需要执行 `pnpm build` 命令进行重新构建；部分对 `plugins/**/node` 目录下的改动，需要重新执行 `pnpm dev` 才能生效。

#### `pnpm lint`

`lint` 命令使用 ESLint 来检查所有源文件。

当 `lint` 给出了错误时，你可以手动修改源码以修复 eslint 的报错。
也可以执行 `pnpm lint:fix` 来自动修复。

#### `pnpm test`

`test` 命令使用 Vitest 来运行所有测试。

### IDE 支持

推荐使用 `vs code` 进行开发。本仓库配置了开发本主题时，推荐的 `vs code` 扩展，
当你导入本仓库时，`vs code` 可能会推荐你安装一些扩展。

## 文档贡献

感谢您对 vuepress-theme-plume 文档的贡献！以下是文档贡献的规范和流程。

### 文档风格规范

- **人称代词**：统一使用"您"作为说明性文字的称谓，避免使用"你"。
- **文件命名**：所有 Markdown 文件使用 kebab-case 命名（如 `audio-reader.md`，而非 `audioReader.md`）。
- **概述段落**：每个文档的 `##` 标题之后应有简短的概述段落，说明该文档的内容和用途。
- **代码示例**：代码块应标注语言类型，配置示例应包含完整的导入语句和上下文。
- **链接引用**：使用相对路径引用其他文档，确保链接有效性。

### TypeScript 代码块必须使用 twoslash

所有 ` ```ts ` 代码块**必须**追加 `twoslash` 标记，让文档示例在构建时被真实编译一次：

````md
```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  // ...
})
```
````

这不是可选的装饰。历史上多个「用户照抄即失败」的问题（虚构的导出名、不存在的配置键、拼错的字段名、拼错的变量名），都因缺少该标记而无法在构建阶段被发现，只能等用户复制后才暴露。twoslash 会在 `pnpm docs:build` 时直接报错。

配套要求：

- **类型引用用 `import type`，不要手抄**：从源码导入类型，源码变更时文档会自动跟随，且类型漂移会被 twoslash 捕获。

  ```ts twoslash
  import type { ThemeNavItem } from 'vuepress-theme-plume'

  const navbar: ThemeNavItem[] = []
  ```

- **API 名称与配置键须核对源码**：写之前对照 `theme/src/shared/` 与 `theme/src/node/defineConfig.ts`，确认导出名与字段名真实存在。
- **默认值须核对源码**：不要凭印象填写，从 `node/locales/*.ts`、`initThemeOptions.ts` 等处确认。

### 中英双语文档同步

`docs/` 与 `docs/en/` 必须同步修改，包括：

- 同一段落的结构、代码块、组件引用保持一致
- `permalink` 严格对应（中文 `/config/plugins/watermark/` 对应英文 `/en/config/plugins/watermark/`，不可漏掉目录层级或改动单复数）
- 历史更新说明（`docs/blog/3.更新说明/`）记录的是当时的事实，**不应修改**

### 文档提交流程

1. Fork 仓库并创建新的分支
2. 在 `docs/` 目录下修改或新建文档
3. 如新建文档，需在 `docs/.vuepress/collections/zh/` 下对应的侧边栏配置文件中添加条目
4. 运行 `pnpm lint` 检查代码质量（含 Markdown 排版检查）
5. 运行 `pnpm docs:build` 构建文档，twoslash 会在此阶段校验所有 TypeScript 示例
6. 运行 `pnpm docs:dev` 预览文档效果
7. 提交 Pull Request，描述文档变更内容

### 文档目录结构

```text
docs/
├── guide/           # 使用指南
│   ├── quick-start/ # 快速开始
│   ├── markdown/    # Markdown 扩展
│   ├── features/    # 功能特性
│   └── custom/      # 自定义配置
├── config/          # 配置参考
│   ├── plugins/     # 插件配置
│   └── ...
└── .vuepress/       # VuePress 配置
    └── collections/ # 集合和侧边栏配置
```
