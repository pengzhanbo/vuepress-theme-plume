---
title: Deployment
icon: material-symbols:deployed-code-outline
createTime: 2025/03/04 13:31:42
permalink: /en/guide/deployment/
tags:
  - Guide
  - Deployment
---

::: tip
This document is forked from the [vuepress official doc](https://v2.vuepress.vuejs.org/zh/guide/deployment.html).
:::

The following guide is based on the following conditions:

- The Markdown source files are placed in the `docs` directory of your project;
- The default build output directory (`.vuepress/dist`) is used;
- [pnpm](https://pnpm.io/zh/) is used as the package manager, although npm or yarn is also supported;
- VuePress is installed as a project dependency, and the following script is configured in `package.json`:

```json
{
  "scripts": {
    "docs:build": "vuepress build docs"
  }
}
```

## GitHub Pages

1. Set the correct [base](https://v2.vuepress.vuejs.org/zh/reference/config.html#base) option.

   If you are going to publish to `https://<USERNAME>.github.io/`, you can skip this step because the default `base` is `"/"`.

   If you are going to publish to `https://<USERNAME>.github.io/<REPO>/`, which means your repository address is `https://github.com/<USERNAME>/<REPO>`, set `base` to `"/<REPO>/"`.

2. Choose the CI tool you want to use. Here we take [GitHub Actions](https://github.com/features/actions) as an example.

   Create the `.github/workflows/docs.yml` file to configure the workflow.

::: details Click to expand the configuration example

```yaml
name: docs

on:
  # Trigger deployment whenever a push is made to the main branch
  push:
    branches: [main]
  # Manually trigger deployment
  workflow_dispatch:

jobs:
  docs:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          # To fetch all commit history for "Last updated time" and other git log information
          fetch-depth: 0

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          # Choose the pnpm version to use
          version: 8
          # Install dependencies using pnpm
          run_install: true

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          # Choose the node version to use
          node-version: 20
          # Cache pnpm dependencies
          cache: pnpm

      # Run the build script
      - name: Build VuePress site
        run: pnpm docs:build

      # See the workflow documentation for more information
      # @see https://github.com/crazy-max/ghaction-github-pages
      - name: Deploy to GitHub Pages
        uses: crazy-max/ghaction-github-pages@v4
        with:
          # Deploy to the gh-pages branch
          target_branch: gh-pages
          # The deployment directory is the default output directory of VuePress
          build_dir: docs/.vuepress/dist
        env:
          # @see https://docs.github.com/cn/actions/reference/authentication-in-a-workflow#about-the-github_token-secret
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

:::

::: tip
Please refer to the [GitHub Pages official guide](https://pages.github.com/) for more information.
:::

## GitLab Pages

1. Set the correct [base](https://v2.vuepress.vuejs.org/zh/reference/config.html#base) option.

   If you are going to publish to `https://<USERNAME>.gitlab.io/`, you can skip this step, so the default `base` is `"/"`.

   If you are going to publish to `https://<USERNAME>.gitlab.io/<REPO>/`, which means your repository address is `https://gitlab.com/<USERNAME>/<REPO>`, set `base` to `"/<REPO>/"`.

2. Create the `.gitlab-ci.yml` file to configure the [GitLab CI](https://about.gitlab.com/stages-devops-lifecycle/continuous-integration/) workflow.

::: details Click to expand the configuration example

```yaml
# Choose the docker image you want to use
image: node:18-buster

pages:
  # Trigger deployment whenever a push is made to the main branch
  only:
    - main

  # Cache node_modules
  cache:
    key:
      files:
        - pnpm-lock.yaml
    paths:
      - .pnpm-store

  # Install pnpm
  before_script:
    - curl -fsSL https://get.pnpm.io/install.sh | sh -
    - pnpm config set store-dir .pnpm-store

  # Install dependencies and run the build script
  script:
    - pnpm install --frozen-lockfile
    - pnpm docs:build --dest public

  artifacts:
    paths:
      - public
```

:::

::: tip
Please refer to the [GitLab Pages official guide](https://docs.gitlab.com/ce/user/project/pages/#getting-started) for more information.
:::

## Google Firebase

1. Ensure you have installed [firebase-tools](https://www.npmjs.com/package/firebase-tools).

2. Create `firebase.json` and `.firebaserc` in the root directory of your project with the following content:

   `firebase.json`:

    ```json
    {
      "hosting": {
        "public": "./docs/.vuepress/dist",
        "ignore": []
      }
    }
    ```

   `.firebaserc`:

    ```json
    {
      "projects": {
        "default": "<YOUR_FIREBASE_ID>"
      }
    }
    ```

3. After running `pnpm docs:build`, use the `firebase deploy` command to deploy.

::: tip
Please refer to the [Firebase CLI official guide](https://firebase.google.com/docs/cli) for more information.
:::

## Heroku

1. First, install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli);

2. [Sign up](https://signup.heroku.com) for a Heroku account here;

3. Run `heroku login` and enter your Heroku credentials:

    ```bash
    heroku login
    ```

4. In the root directory of your project, create a file named `static.json` with the following content:

`static.json`:

```json
{
  "root": "./docs/.vuepress/dist"
}
```

This is the configuration for your project. For more information, please refer to [heroku-buildpack-static](https://github.com/heroku/heroku-buildpack-static).

## Kinsta

Please see [Set Up VuePress on Kinsta](https://kinsta.com/docs/vuepress-application/).

## Edgio

Please see [Edgio Documentation > Framework Guides > VuePress](https://docs.edg.io/guides/vuepress).

## Netlify

1. Go to [Netlify](https://netlify.com), create a new project from GitHub, and configure as follows:

  - **Build Command:** `pnpm docs:build`
  - **Publish directory:** `docs/.vuepress/dist`

2. Set [Environment variables](https://docs.netlify.com/configure-builds/environment-variables) to select the Node version:

  - `NODE_VERSION`: 18

3. Click the deploy button.

## Vercel

1. Go to [Vercel](https://vercel.com), create a new project from GitHub, and configure as follows:

  - **FRAMEWORK PRESET:** `Other`
  - **BUILD COMMAND:** `pnpm docs:build`
  - **OUTPUT DIRECTORY:** `docs/.vuepress/dist`

2. Click the deploy button.

## CloudBase

[CloudBase](https://cloudbase.net/?site=vuepress) is a cloud-native integrated Serverless cloud platform that supports multiple hosting capabilities such as static websites and containers, and provides a simple deployment tool [CloudBase Framework](https://cloudbase.net/framework.html?site=vuepress) to deploy applications with one click.

1. Install CloudBase CLI globally:

   ```bash
   pnpm install -g @cloudbase/cli
   ```

2. Run the following commands in the root directory of your project to deploy the VuePress application with one click. Before deployment, you can first [activate the environment](https://console.cloud.tencent.com/tcb/env/index?tdl_anchor=ad&tdl_site=vuejs):

    ```bash
    cloudbase init --without-template
    cloudbase framework:deploy
    ```

The CloudBase CLI will first redirect to the console for login authorization, and then interactively confirm.

After confirming the information, deployment will start immediately. After deployment, you will obtain a website application with automatic SSL and CDN acceleration. You can also use GitHub Action to continuously deploy VuePress applications on GitHub.

You can also use `cloudbase init --template vuepress` to quickly create and deploy a new VuePress application.

::: tip
For more detailed information, please see the [deployment project example](https://github.com/TencentCloudBase/cloudbase-framework?site=vuepress#%E9%A1%B9%E7%9B%AE%E7%A4%BA%E4%BE%8B) of CloudBase Framework.
:::

## 21 Cloud Box

Please see [21 Cloud Box - Deploy a VuePress Static Web Page](https://www.21yunbox.com/docs/#/deploy-vuepress).
