---
url: /en/guide/features/changelog/index.md
---
## Overview

The theme supports adding article changelogs to better track the modification history of your articles.

Article changelogs are obtained through git commit history.

This feature is powered by [@vuepress/plugin-git](https://ecosystem.vuejs.press/zh/plugins/development/git.html).

::: warning Note
This feature relies on the `git log` command to retrieve commit history for each markdown file,
which can be relatively time-consuming, especially for large projects with extensive commit histories.
Therefore, this feature is not enabled in development environments by default and is only enabled in production environments.

However, you can still enable it in development environments by setting `theme.plugins.git` to `true` for testing purposes.

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    plugins: { git: true }
  })
})
```

:::

## Usage

The theme has built-in support for the
[@vuepress/plugin-git](https://ecosystem.vuejs.press/zh/plugins/development/git.html) plugin, so you can use it without reinstalling.

Enable this feature in the theme configuration file:

```ts title=".vuepress/config.ts"
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    // Disabled by default, only takes effect when plugins.git is true
    // This configuration is invalid in plume.config.ts
    changelog: true,

    plugins: {
      // If you declare it directly as true here, it means the feature is enabled in both development and production environments
      git: process.env.NODE_ENV === 'production'
    }
  })
})
```

## Configuration

```ts
interface ChangelogOptions {
  /**
   * Maximum number of change records, defaults to all records
   */
  maxCount?: number
  /**
   * Git repository URL, e.g., https://github.com/vuepress/ecosystem
   */
  repoUrl?: string
  /**
   * Commit URL pattern
   *
   * - `:repo` - Git repository URL
   * - `:hash` - Commit hash
   *
   * @default ':repo/commit/:hash'
   */
  commitUrlPattern?: string
  /**
   * Issue URL pattern
   *
   * - `:repo` - Git repository URL
   * - `:issue` - Issue ID
   *
   * @default ':repo/issues/:issue'
   */
  issueUrlPattern?: string
  /**
   * Tag URL pattern
   * Default: ':repo/releases/tag/:tag'
   *
   * - `:repo` - Git repository URL
   * - `:tag` - Tag name
   *
   * @default ':repo/releases/tag/:tag'
   */
  tagUrlPattern?: string
}
```

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    changelog: {
      maxCount: 10,
      repoUrl: 'https://github.com/vuepress/vuepress',
      commitUrlPattern: ':repo/commit/:hash',
      issueUrlPattern: ':repo/issues/:issue',
      tagUrlPattern: ':repo/releases/tag/:tag'
    },

  })
})
```

::: warning Note
Ensure that `changelog.repoUrl` is correctly configured. The default value is [docsRepo](../../config/theme.md#docsrepo).

The theme by default adapts to the URL patterns of git hosting services like `GitHub`, `GitLab`, `Gitee`, and `Bitbucket`.
If you're using a self-hosted service or others, please configure `commitUrlPattern`, `issueUrlPattern`, and `tagUrlPattern` accordingly.
:::

## Notes

This feature requires your project to be under a
[Git repository](https://git-scm.com/book/en/Git-Basics-Getting-a-Git-Repository) so it can collect information from the commit history.

**When building your site, you should ensure all commit records are accessible.**

For example, CI workflows typically add the `--depth 1` parameter when cloning your repository to avoid
fetching all commit history. Therefore, you need to disable this feature so the plugin can work properly in CI.

Services like `GitHub Actions`, `Netlify`, and `Vercel` do not fetch all commit history by default.

In `GitHub Actions`, you can add the `--depth 0` parameter to ensure `GitHub Actions` can correctly fetch all commit records.

```yaml title=".github/workflows/deploy.yml"
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4 # [!code focus:3]
        with: # [!code ++:2]
          fetch-depth: 0
```

For services like `Netlify` and `Vercel`, the processing method is relatively more complex.
In such cases, you can first complete the build in `GitHub Actions` and output the artifacts to
a separate branch, then use that branch for deployment in `Netlify` or `Vercel`.

::: info
For projects created via the theme's `cli` tool, when selecting the deployment method as `GitHub Action`,
the build artifacts are output to the `gh_pages` branch. You can base your `Netlify` or `Vercel` deployment on this branch.
:::
