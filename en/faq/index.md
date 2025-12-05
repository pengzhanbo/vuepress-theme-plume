---
url: /en/faq/index.md
---
This document primarily covers common issues and solutions you might encounter while using the theme.

If you encounter any problems, you can first check the content below to see if there are related issues and solutions.

If you don't find what you're looking for, you can start a discussion with us via GitHub [Discussions](https://github.com/pengzhanbo/vuepress-theme-plume/discussions/new?category=q-a).

If you're certain that there's indeed an issue, please
[Open an issue](https://github.com/pengzhanbo/vuepress-theme-plume/issues/new?assignees=pengzhanbo\&labels=bug\&projects=\&template=bug-report.zh-CN.yml\&title=%5BBug%5D)
on GitHub. In the issue, describe the specific details of the problem and, if necessary,
try to provide a minimal reproduction package. We will address it as soon as possible.

::: details What should I pay attention to when starting a discussion or raising an issue?
We welcome you to start discussions or ask any questions, regardless of how simple they may seem.
Asking questions actively is good. However, please ensure the following three points:

1. You have already attempted to search the relevant documentation.
2. You provide a detailed description in your discussion.
3. You are not asking questions unrelated to VuePress, nor are you seeking technical support for custom implementations.

   We will not answer questions like "How can I use a specific feature of the theme in isolation in my
   own project?" or "How can I implement a specific feature of the theme in my own project?".
   :::

## How to update the theme?

You can update the theme using the `vp-update` command.

`vp-update` is a CLI tool maintained by the VuePress team. It helps you check for the latest versions of
VuePress-related themes, plugins, etc., within your project and automatically installs the dependencies for you.

Copy and run the following command in your project:

::: npm-to

```sh
npx vp-update
```

:::

## Why don't new features take effect after updating the theme version?

Because VuePress takes a long time to fully compile all `markdown` files in the source directory when
starting the dev server, the theme implements caching for `markdown` compilation to improve startup speed.
After updating the theme and restarting the dev server, if the `markdown` files in the source directory
haven't changed, the compilation is skipped and the cache is used directly. This can cause new features related to markdown not to take effect.

**Simply delete the cache files and restart**:

1. Method 1: Directly delete the `.vuepress/.cache` directory.
2. Method 2: Add the `--clean-cache` parameter when starting the dev server command:

   ```sh
   vuepress dev docs --clean-cache
   ```

## Why don't changes to theme plugin configurations take effect?

This issue commonly occurs when modifying configurations for `plugins.markdownEnhance`,
`plugins.markdownPower`, `plugins.markdownImage`, and `plugins.markdownMath`. The reason is the same as
[Why don't new features take effect after updating the theme version?](#why-dont-new-features-take-effect-after-updating-the-theme-version).
Therefore,

**Simply delete the cache files and restart**:

1. Method 1: Directly delete the `.vuepress/.cache` directory.
2. Method 2: Add the `--clean-cache` parameter when starting the dev server command:

   ```sh
   vuepress dev docs --clean-cache
   ```

## After updating dependencies, restart prompts `import "xxxx" not exist`

Sometimes, after updating the theme and related dependencies, there might be an issue where the package
manager fails to correctly generate the new dependency tree, leading to errors
like "module not found" when importing certain dependencies. At this point, the dependency lock
files (like `package-lock.json` or `pnpm-lock.yaml`) might be corrupted.

Please directly delete the dependency lock files (`package-lock.json`, `pnpm-lock.yaml`, etc.)
and the `node_modules` directory, then reinstall the dependencies.
