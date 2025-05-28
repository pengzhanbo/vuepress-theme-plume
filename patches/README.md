# 依赖补丁

修复一些依赖包中存在的问题

## floating-vue

**问题：** 水合过程中激活不匹配

**进度：** 暂不知晓该包何时修复该问题。

**影响：** 在控制台中输出 `hydration mismatch` 错误警告，但不影响站点正常访问和交互。

相关 issue：

- <https://github.com/vuepress/ecosystem/issues/477>
- <https://github.com/Akryum/floating-vue/issues/1006>

当在项目中启用了 `twoslash` 功能，并额外安装了 `@vuepress/shiki-twoslash` 包，在项目进行 `vuepress build` 构建部署包并部署后。
访问部署后的站点，在有使用 `twoslash` 功能的相关页面，会出现下面的错误信息：

```
hydration mismatch
```

这表示在 水合过程中激活不匹配，即打包后的 SSR 代码与浏览器端代码不匹配。

该问题是由于 `floating-vue` 中的 `popper-id` 的值不匹配导致的。

为了解决这个问题，需要在 `floating-vue` 中修改 `popper-id` 的值。

通过以下步骤进行修复:

> [!CAUTION]
> 此修复方案仅适用于 PNPM <https://pnpm.io/zh/cli/patch>

1. 运行下面的命令

   ```bash
   pnpm patch floating-vue@5.2.2
   ```

   该命令会下载 `floating-vue` 的补丁包到 `node_modules/.pnpm_patches/floating-vue@5.2.2`

   并在控制台中输出类似的信息：

   ```bash
   pnpm patch-commit <path>
   ```

   留意这部分信息，在步骤 5 中，需要复制此行命令

   `<path>` 表示补丁包的路径，在这里是 `node_modules/.pnpm_patches/floating-vue@5.2.2`

2. 进入 `node_modules/.pnpm_patches/floating-vue@5.2.2` 文件夹。

3. 打开 `dist/floating-vue.mjs` 文件，并跳转到第 `948` 行 （`id: e.popperId,`）

4. 在该行下方插入新的一行，内容为：

   ```diff
      id: e.popperId,
   +  'data-allow-mismatch': '',
   ```

5. 复制 步骤 1 中的控制台输出的 `pnpm patch-commit <path>` 命令，并粘贴到控制台中执行。

6. 重新构建部署站点
