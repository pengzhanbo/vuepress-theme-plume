## scripts/autoInstall

检查各个 workspace package 中的 vuepress 相关依赖，并更新到最新版本。

``` sh
pnpm autoUpdate
```

## scripts/create

在 `packages/` 目录下生成一个新的 插件包

``` sh
pnpm pkg <package-name> [--option]
```

- `package-name` 插件名称

### Option

- `--client,-c` 是否生成 `client` 目录及其文件，默认不生成
- `--shared,-s` 是否生成 `shared` 目录及其文件，默认不生成

- `--help,-h` 显示帮助信息
