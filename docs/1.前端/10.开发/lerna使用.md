---
title: lerna使用
createTime: 2021/11/26 06:28:37
permalink: /article/i1wc1uld
author: pengzhanbo
top: false
type: null
---

![lerna](https://user-images.githubusercontent.com/645641/79596653-38f81200-80e1-11ea-98cd-1c6a3bb5de51.png)

## 概述

`lerna` 是一个多包管理工具，针对使用 git 和 npm/yarn 等管理多软件包的代码仓库的工作流程进行优化。

在开发一个大型项目时，往往会将整个项目拆分为多个代码仓库，进行独立版本化的软件包管理，这对于代码共享非常有用。

比如开源项目 `babel`，整个项目被拆分为了`@babel/core`, `@babel/parser`, `@babel/traverse`等多个软件包。

但是这也会导致如果某些更改跨越了多个代码仓库的话，会变得麻烦且难以跟踪。
`lerna`可以帮助优化对多个代码仓库的依赖、版本管理、工作流等。

## 安装

lerna 可以全局安装，也可以在项目中安装（以下内容使用项目中安装的方式）
``` sh
# npm
npm install lerna
# yarn
yarn add lerna
```

## 简单入门

创建一个项目，并使用lerna进行项目环境初始化
``` sh
mkdir lerna-demo && cd $_
yarn init -y
yarn add lerna
npx lerna init
```
你将会得到一个包含以下内容的项目文件夹：
``` sh
lerna-demo
  packages/
  lerna.json
  package.json
```

其中，`packages/` 目录用于存放所有的软件包。`lerna.json`是lerna的配置文件。


## 配置说明
``` json
// lerna.json
{
  "useWorkspaces": true,
  "npmClient": "npm", // npm | yarn
  "packages": ["packages/*"],
  "version": "0.0.0",
  "command": {
    "bootstrap": {
      // more...
    },
    // more
  }
}
```

- `npmClient`：设置当前使用的包管理器， 默认是npm， 可以设置为yarn；
- `version`：软件包版本号，根据 semver版本号规范命名；
- `packages`：软件包所在的目录，可以使用golb做模式匹配；
- `useWorkspaces`：使用工作空间，这个选项可以更好的跟yarn配合使用；
- `command`：对lerna的各个command进行配置。

## 命令行说明

### lerna init
初始化一个lerna项目，默认将会在目录中新建 packages/ 和 lerna.json。

`--independent`: 使用分包独立版本管理模式，各个软件包使用独立的版本号。


### lerna create pkgName [location]
在项目中新建一个子包， pkgName设置包名。 location制定包所在目录，默认是 packages配置的第一个元素。

### lerna add \<package\>[@version] [--dev] [--exact] [--peer]
类似于 `yarn add` 或`npm install`，在一个lerna repo中往dependency中添加依赖包。
- `--dev`: 表示将包添加到 devDependencies
- `--exact`: 添加一个确定版本的包（如1.0.1），而不是一个版本范围的包如（^1.0.1）
- `--peer`: 添加一个前置依赖包。

### lerna bootstrap
为当前 lerna repo 中的所有包安装 依赖库，并 link所有 同域依赖。

### lerna run \<script\>

在当前 lerna repo 中的所有包中执行 script 命令。
``` sh
packages/
  package1/
  package2/
```
``` sh
lerna run build # 相当于在 package1、package2 中执行 npm run build
```
- --scope 过滤符合条件的包
  ``` sh
  lerna run build --scope test component
  ```
- --stream 使用报名作为前缀，交叉输出所有包的控制台信息流。
  ``` sh
  lerna run build --stream
  ```
- --parallel 类似于 stream。
  ``` sh
  lerna run build --parallel
  ```

  ### lerna clean
  删除所有包的node_modules