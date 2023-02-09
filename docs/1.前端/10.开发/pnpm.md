---
title: pnpm 包管理器
createTime: 2022/05/10 03:50:47
author: pengzhanbo
permalink: /article/84nu27cz/
---

`pnpm` 是一款新兴不久的包管理器，相比于 `npm` 和 `yarn`，`pnpm` 拥有更快的安装速度，同时节约磁盘空间。

<!-- more -->

## 介绍

![pnpm](https://pnpm.io/zh/img/pnpm-no-name-with-frame.svg)

`pnpm` 是一个类似于 `npm` 、`yarn` 的包管理器。

`pnpm` 安装的包都会被存储在硬盘的某个相同位置，软甲包通过硬链接到这个位置，实现共享同一版本的依赖，
对于同一依赖的不同版本，`pnpm update` 时，只会向存储中心添加新版本更新的文件，而不是仅仅应为一个文件的改变而复制整个新版本包的内容。

`pnpm` 内置支持 `monorepo`，即单仓库多包。

## 比较

### pnpm/yarn/npm

| 功能                  | pnpm | yarn | npm |
| --                   | :--:  | :--:  | :--: |
| 工作空间支持（monorepo）| ✔️ | ✔️ | ✔️ |
| 隔离的`node_modules`  | ✔️ - 默认 | ✔️ | ❌ |
| 提升的`node_modules`  | ✔️ | ✔️ | ✔️ -默认 |
| 自动安装peers         | ✔️ - `auto-install-peers=true` | ❌ | ✔️ |
| Plug'n'Play          | ✔️ | ✔️ - 默认 | ❌ |
| 零安装                | ❌ | ✔️ | ❌ |
| 修复依赖项             | ✔️ | ✔️ | ❌ |
| 管理nodejs版本         | ✔️ | ❌ | ❌ |
| 有锁文件               | ✔️ - `pnpm-lock.yaml` | ✔️ - `yarn.lock` | ✔️ - `package-lock.json` |
| 支持覆盖               | ✔️ | ✔️ - `resolutions` | ✔️ |
| 内容可寻址存储          | ✔️ | ❌ | ❌ |
| 动态包执行             | ✔️ - `pnpm dlx` | ✔️ - `yarn dlx` | ✔️ - `npx` |
| Side-effects cache   | ✔️ | ❌ | ❌ |

### 区别

与 `yarn/npm` 不同的是，`pnpm` 并非采用 *扁平的`node_modules`* 来管理依赖项，
而是基于符号链接的`node_modules` 结构。

`node_modules` 中每个包的每个文件都是来自内容可寻址存储的硬链接。 假设安装了依赖于 `bar@1.0.0` 的 `foo@1.0.0`。 `pnpm` 会将两个包硬链接到 `node_modules` 如下所示：

```sh
node_modules
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       └── bar -> <store>/bar
    │           ├── index.js
    │           └── package.json
    └── foo@1.0.0
        └── node_modules
            └── foo -> <store>/foo
                ├── index.js
                └── package.json
```
这是 `node_modules` 中的唯一的“真实”文件。 一旦所有包都硬链接到 `node_modules`，
就会创建符号链接来构建嵌套的依赖关系图结构。

`bar` 将被符号链接到 `foo@1.0.0/node_modules` 文件夹，然后处理依赖关系，`foo` 将被符号链接至根目录的 `node_modules` 文件夹:

```sh
node_modules
├── foo -> ./.pnpm/foo@1.0.0/node_modules/foo
└── .pnpm
    ├── bar@1.0.0
    │   └── node_modules
    │       └── bar -> <store>/bar
    └── foo@1.0.0
        └── node_modules
            ├── foo -> <store>/foo
            └── bar -> ../../bar@1.0.0/node_modules/bar
```

这种布局的好处在于，只有真正在依赖项中的包才能访问。
如果是平铺的 `node_modules` 结构，所有被提升的包都可以访问。

### 优势

- 节约磁盘空间
  
  包存储在全局存储中，pnpm 创建从全局存储到项目下 `node_modules` 文件夹的 硬链接，硬链接指向磁盘上原始文件所在的同一位置。不同软件包可以共享相同依赖项所占用的空间。

  如果是单个依赖的不同版本，如版本更新，`pnpm` 仅安装版本更新的文件，而不是全量安装整个新版本的包。

- 安装速度快
  
  软件包中安装依赖时，如果检索到在本地的全局存储中已安装过该依赖，那么不会从网络下重新安装，而是直接创建硬链接到软件包中。

- 内置支持 monorepo
  
  支持 单仓库多包，通过 `pnpm-workspace.yaml` 配置工作空间，通过 `workspace:*` 协议引用工作空间的依赖包。

## 安装

### 通过 npm 安装

```sh
npm install -g pnpm
```

### 通过 Corepack 安装

从 v16.13 开始，Node.js 发布了 `Corepack` 来管理包管理器。 这是一项实验性功能，因此需要通过运行如下脚本来启用它：

```sh
corpack enabled
```

这将自动在系统上安装 pnpm。 但是，它可能不是最新版本的 pnpm。
若要升级，请检查 [最新的 pnpm 版本](https://github.com/pnpm/pnpm/releases/tag/v7.9.1) 并运行：

```sh
corepack prepare pnpm@<version> --activate
```
### 使用独立脚本安装

在 POSIX 系统上，即使没有安装 Node.js，也可以使用以下脚本安装 pnpm：

```sh
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

如果没有安装 `curl` ，也可以使用 `wget`:

```sh
wget -qO- https://get.pnpm.io/install.sh | sh -
```

在 Windows 系统中，如果使用 Powershell:

```sh
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

### 使用 Homebrew 安装

```sh
brew install pnpm
```

### 使用 Scoop 安装

```sh
scoop install nodejs-lts pnpm
```

## 使用

`pnpm` 在使用上 与 `npm` 、`yarn` 的使用上差别不大，但需要注意的区别，`pnpm` 会严格校验所有参数，
比如，`pnpm install --target_arch x64` 会执行失败，因为 `--target_arch x64` 不是 `pnpm install` 的有效参数。

### 常用命令

#### `pnpm install`

别名 `pnpm i`

等效于 `npm install` / `yarn`

用于安装项目所有依赖。

[pnpm install 官方文档](https://pnpm.io/zh/cli/install)

#### `pnpm add <pkg>`

安装软件包及其依赖的任何软件包。 默认情况下，任何新软件包都安装为生产依赖项。

[pnpm add 官方文档](https://pnpm.io/zh/cli/add)

#### `pnpm remove`

别名： `rm` `uninstall` `un`

从 `node_modules` 和项目的 `package.json` 中删除相关 packages。

[pnpm remove 官方文档](https://pnpm.io/zh/cli/remove)

#### `pnpm update`

别名： `up` `upgrade`

`pnpm update` 根据指定的范围更新软件包的最新版本。

在不带参数的情况下使用时，将更新所有依赖关系。 您可以使用一些模式来更新特定的依赖项。

[pnpm update 官方文档](https://pnpm.io/zh/cli/update)

更多命令请查阅[官方文档](https://pnpm.io/zh/cli/add)

### 配置

#### `.npmrc`

`pnpm` 从命令行、环境变量和 `.npmrc` 文件中获取其配置。

`pnpm config` 命令可用于更新和编辑 用户和全局 .npmrc 文件的内容。

四个相关文件分别为：

- 每个项目的配置文件（`/path/to/my/project/.npmrc`）
- 每个工作区的配置文件（包含 `pnpm-workspace.yaml` 文件的目录）
- 每位用户的配置文件（ `~/.npmrc` ）
- 全局配置文件（ `/etc/.npmrc` ）

#### `pnpm-workspace.yaml`

`pnpm-workspace.yaml` 定义了 工作空间 的根目录，并能够使工作空间中包含 / 排除目录 。 默认情况下，包含所有子目录。

``` yaml
packages:
  # 定义 packages 目录下的所有子目录都为一个 package
  - 'packages/*'
  # 定义 components 目录下的所有子目录都为一个 package
  - 'components/**'
  # 排除任何目录中的 test 目录下的所有目录
  - '!**/test/**'
```

## 工作空间

pnpm 内置了对单一存储库（也称为多包存储库、多项目存储库或单体存储库）的支持， 你可以创建一个 workspace 以将多个项目合并到一个仓库中。

一个 workspace 的根目录下必须有 `pnpm-workspace.yaml` 文件， 也可能会有 `.npmrc` 文件。

### Workspace 协议 (workspace:)

默认情况下，如果可用的 packages 与已声明的可用范围相匹配，pnpm 将从工作区链接这些 packages。 例如，如果 `bar` 中有 `"foo"："^1.0.0"` 的这个依赖项，则 `foo@1.0.0` 链接到 `bar。` 但是，如果 `bar` 的依赖项中有 `"foo": "2.0.0"`，而 `foo@2.0.0` 在工作空间中并不存在，则将从 `npm registry` 安装 `foo@2.0.0` 。 这种行为带来了一些不确定性。

幸运的是，pnpm 支持 workspace 协议 `workspace:` 。 当使用此协议时，pnpm 将拒绝解析除本地 workspace 包含的 package 之外的任何内容。 因此，如果设置为 `"foo": "workspace:2.0.0"` 时，安装将会失败，因为 `"foo@2.0.0"` 不存在于此 workspace 中。

使用示例：

工作空间中存在以下项目：
```sh
+ packages/
  + foo/
  + bar/
  + qar/
  + zoo/
```

如果各个项目以其目录名作为其 package name，那么可以在其他项目中如下引入依赖：

``` json
{
  "dependencies": {
    "foo": "workspace:*",
    "bar": "workspace:~",
    "qar": "workspace:^",
    "zoo": "workspace:^1.5.0"
  }
}
```

::: tip
引入依赖的包名，是由包的 `package.json name` 确定，而不是 workspace 目录下的目录名确定。
:::

### 发布 Workspace

当以上示例进行发布时，会被转换为
```json
{
  "dependencies": {
    "foo": "1.5.0",
    "bar": "~1.5.0",
    "qar": "^1.5.0",
    "zoo": "^1.5.0"
  }
}
```
这个功能允许你发布转化之后的包到远端，并且可以正常使用本地 workspace 中的 packages，而不需要其它中间步骤。包的使用者也可以像常规的包那样正常使用，且仍然可以受益于语义化版本。
