---
url: /en/guide/features/contributors/index.md
---
## Overview

The theme supports adding contributor information to articles to better track your article contributors.

Article contributors are obtained through git commit history.

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
    // Enabled by default, only takes effect when plugins.git is true
    // This configuration is invalid in plume.config.ts
    contributors: true,

    plugins: {
      // If you declare it directly as true here, it means the feature is enabled in both development and production environments
      git: process.env.NODE_ENV === 'production'
    }
  })
})
```

## Configuration

### mode

* Type: `'inline' | 'block'`
* Default: `'inline'`
* Description:

  * `inline`: Display contributor information at the bottom of the article page,
    alongside the last updated time. In this mode, only contributor names are displayed.

    ![contributors inline](/images/contributors-inline.png)

  * `block`: Insert contributor information at the end of the article content. This mode includes contributor names, links, and avatars.
    (As shown at the end of the current page's content)

    In `block` mode, avatars are displayed by default for all contributors,
    even if you haven't provided an avatar URL.
    The plugin will generate avatar URLs from `https://gravatar.com/` based on email addresses or usernames.

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    contributors: {
      mode: 'block',
    },
  })
})
```

### info

* Type: `ContributorInfo[]`

  ```ts
  interface ContributorInfo {
    /**
     * Contributor's username on Git hosting service
     */
    username: string
    /**
     * Name displayed for the contributor on the page, defaults to `username`
     */
    name?: string
    /**
     * Contributor alias. Since the username saved in local git configuration might not match the hosting service username,
     * aliases can be used to map to the actual username
     */
    alias?: string[] | string
    /**
     * Contributor avatar URL
     * If the git hosting service is `GitHub`, this can be omitted as the plugin will auto-fill it
     */
    avatar?: string
    /**
     * Contributor profile URL
     * If the git hosting service is `GitHub`, this can be omitted as the plugin will auto-fill it
     */
    url?: string
  }
  ```

* Description:

  List of contributor information.

  The username and email configured in the user's local git service might not match the user information
  on git hosting services (like GitHub, GitLab, Gitee). You can pre-configure contributor information here.

  (For non-GitHub git hosting services such as GitLab and Gitee, since avatars and user URLs cannot be
  directly obtained from usernames, please supplement and complete user information here.)

::: code-tabs

@tab Github

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    contributors: {
      mode: 'block',
      info: [
        {
          username: 'pengzhanbo', // github username
          alias: ['peng_zhan_bo'], // alias, username in local git configuration
        }
      ]
    },
  })
})
```

@tab Gitlab

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    contributors: {
      mode: 'block',
      info: [
        {
          username: 'pengzhanbo', // gitlab username
          alias: ['peng_zhan_bo'], // alias, username in local git configuration
          url: 'https://gitlab.com/pengzhanbo',
          avatar: 'https://gitlab.com/uploads/-/system/user/avatar/1/avatar.png',
        }
      ]
    },
  })
})
```

@tab Gitee

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    contributors: {
      mode: 'block',
      info: [
        {
          username: 'pengzhanbo', // gitee username
          alias: ['peng_zhan_bo'], // alias, username in local git configuration
          url: 'https://gitee.com/pengzhanbo',
          avatar: 'https://foruda.gitee.com/avatar/1234455/avatar.png',
        }
      ]
    },
  })
})
```

@tab Bitbucket

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    contributors: {
      mode: 'block',
      info: [
        {
          username: 'pengzhanbo', // bitbucket username
          alias: ['peng_zhan_bo'], // alias, username in local git configuration
          url: 'https://bitbucket.org/pengzhanbo',
          avatar: 'https://bitbucket.org/pengzhanbo/avatar/1234455/avatar.png',
        }
      ]
    },
  })
})
```

@tab Others

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  theme: plumeTheme({
    contributors: {
      mode: 'block',
      info: [
        {
          username: 'pengzhanbo', // username
          alias: ['peng_zhan_bo'], // alias, username in local git configuration
          url: 'https://your-git.com/pengzhanbo',
          avatar: 'https://your-git.com/avatar.png',
        }
      ]
    },
  })
})
```

:::

### avatar

* Type: `boolean`
* Default: `true`
* Description: Whether to display contributor avatars

### avatarPattern

* Type: `string`
* Default: `'https://github.com/:username.png'`
* Description: Contributor avatar URL pattern

  `:username` will be replaced with the contributor's username

### transform(contributors)

* Type: `(contributors: GitContributor[]) => GitContributor[]`

  ```ts
  interface GitContributor {
    name: string // Display name
    username: string // Git hosting service username
    email: string
    commits: number // Number of commits by the contributor
    avatar?: string
  }
  ```

* Description:

  Contributor transformation function. This function should return a new list of contributors.
  You can add transformation logic here, such as sorting, deduplication, or completing information.

## frontmatter

### contributors

* Type: `boolean | string[]`

* Description:

  Whether to display contributor information.

  If your article comes from a third party and git commits cannot fully list all authors, you can supplement contributors here.

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
In such cases, you can first complete the build in `GitHub Actions` and output the artifacts to a
separate branch, then use that branch for deployment in `Netlify` or `Vercel`.

::: info
For projects created via the theme's `cli` tool, when selecting the deployment method as `GitHub Action`,
the build artifacts are output to the `gh_pages` branch. You can base your `Netlify` or `Vercel` deployment on this branch.
:::
