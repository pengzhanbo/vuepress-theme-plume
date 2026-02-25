---
url: /en/guide/deployment/index.md
---
::: tip This document is forked from the [vuepress official doc](https://v2.vuepress.vuejs.org/zh/guide/deployment.html).
:::

The following guides are based on the following assumptions:

* Markdown source files are located in the `docs` directory of your project.
* The default build output directory (`.vuepress/dist`) is used.
* [pnpm](https://pnpm.io/) is used as the package manager, although npm or yarn are also supported.
* VuePress is installed as a project dependency and the following script is configured in `package.json`:

```json
{
  "scripts": {
    "docs:build": "vuepress build docs"
  }
}
```

## GitHub Pages

::: steps

* Set the correct [base](https://v2.vuepress.vuejs.org/reference/config.html#base) option.

  If you are deploying to `https://<USERNAME>.github.io/`, you can omit this step as `base` defaults to `"/"`.

  If you are deploying to `https://<USERNAME>.github.io/<REPO>/`,
  meaning your repository address is `https://github.com/<USERNAME>/<REPO>`, then set `base` to `"/<REPO>/"`.

* Choose your preferred CI tool. Here we use [GitHub Actions](https://github.com/features/actions) as an example.

  Create a `.github/workflows/docs.yml` file to configure the workflow.

:::

::: details Click to expand configuration example

```yaml
name: docs

on:
  # Trigger deployment on every push to the main branch
  push:
    branches: [main]
  # Allow manual triggering
  workflow_dispatch:

jobs:
  docs:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          # Fetch all commit history for info like 'last updated'
          fetch-depth: 0

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          # Choose the pnpm version to use
          version: 10
          # Use pnpm to install dependencies
          run_install: true

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          # Choose the Node.js version to use
          node-version: 22
          # Cache pnpm dependencies
          cache: pnpm

      # Run the build script
      - name: Build VuePress site
        run: pnpm docs:build

      # See https://github.com/crazy-max/ghaction-github-pages for more info
      - name: Deploy to GitHub Pages
        uses: crazy-max/ghaction-github-pages@v4
        with:
          # Deploy to the gh-pages branch
          target_branch: gh-pages
          # Deployment directory is VuePress's default output directory
          build_dir: docs/.vuepress/dist
        env:
          # @see https://docs.github.com/en/actions/security-guides/automatic-token-authentication#about-the-github_token-secret
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

:::

::: tip Please refer to the [GitHub Pages official guide](https://pages.github.com/) for more information.
:::

## GitLab Pages

::: steps

1. Set the correct [base](https://v2.vuepress.vuejs.org/reference/config.html#base) option.

   If you are deploying to `https://<USERNAME>.gitlab.io/`, you can omit this step as `base` defaults to `"/"`.

   If you are deploying to `https://<USERNAME>.gitlab.io/<REPO>/`,
   meaning your repository address is `https://gitlab.com/<USERNAME>/<REPO>`,
   then set `base` to `"/<REPO>/"`.

2. Create a `.gitlab-ci.yml` file to configure the [GitLab CI](https://about.gitlab.com/stages-devops-lifecycle/continuous-integration/) workflow.

:::

::: details Click to expand configuration example

```yaml
# Choose the docker image to use
image: node:22-buster

pages:
  # Trigger deployment on every push to the main branch
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

::: tip Please refer to the [GitLab Pages official guide](https://docs.gitlab.com/ce/user/project/pages/#getting-started) for more information.
:::

## Google Firebase

::: steps

1. Ensure you have [firebase-tools](https://www.npmjs.com/package/firebase-tools) installed.

2. In your project's root directory, create `firebase.json` and `.firebaserc` with the following content:

   ```json title="firebase.json"
   {
     "hosting": {
       "public": "./docs/.vuepress/dist",
       "ignore": []
     }
   }
   ```

   ```json title=".firebaserc"
   {
     "projects": {
       "default": "<YOUR_FIREBASE_ID>"
     }
   }
   ```

3. After running `pnpm docs:build`, use the `firebase deploy` command to deploy.

:::

::: tip Please refer to the [Firebase CLI official guide](https://firebase.google.com/docs/cli) for more information.
:::

## Heroku

::: steps

1. First, install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).

2. Create a Heroku account [here site](https://signup.heroku.com).

3. Run `heroku login` and fill in your Heroku credentials:

   ```bash
   heroku login
   ```

4. In your project's root directory, create a file named `static.json` with the following content:

   ```json title="static.json"
   {
     "root": "./docs/.vuepress/dist"
   }
   ```

   This is your project's configuration. Please refer to
   [heroku-buildpack-static](https://github.com/heroku/heroku-buildpack-static) for more information.

:::

## Kinsta

Please check [Set Up VuePress on Kinsta](https://kinsta.com/docs/vuepress-application/).

## Edgio

Please check [Edgio Documentation > Framework Guides > VuePress](https://docs.edg.io/guides/vuepress).

## Netlify

::: steps

1. Go to [Netlify](https://netlify.com), create a new project from GitHub, and configure it as follows:

   * **Build Command:** `pnpm docs:build`
   * **Publish directory:** `docs/.vuepress/dist`

2. Set [Environment variables](https://docs.netlify.com/configure-builds/environment-variables) to select the Node.js version:

   * `NODE_VERSION`: 22

3. Click the deploy button.

:::

## Vercel

::: steps

1. Go to [Vercel](https://vercel.com), create a new project from GitHub, and configure it as follows:

   * **FRAMEWORK PRESET:** `Other`
   * **BUILD COMMAND:** `pnpm docs:build`
   * **OUTPUT DIRECTORY:** `docs/.vuepress/dist`

2. Click the deploy button.

:::

## CloudBase

[CloudBase](https://cloudbase.net/?site=vuepress) is a cloud-native,
integrated Serverless cloud platform that supports various hosting capabilities like static websites and
containers. It provides an easy deployment tool,
[CloudBase Framework](https://cloudbase.net/framework.html?site=vuepress), for one-click application deployment.

::: steps

1. Install CloudBase CLI globally:

   ```bash
   pnpm install -g @cloudbase/cli
   ```

2. Run the following command in your project's root directory to deploy the VuePress application with
   one click. You can first [activate an environment](https://console.cloud.tencent.com/tcb/env/index?tdl_anchor=ad\&tdl_site=vuejs) before deployment:

   ```bash
   cloudbase init --without-template
   cloudbase framework:deploy
   ```

:::

The CloudBase CLI will first redirect to the console for login authorization and then proceed with an interactive confirmation.

After confirmation, deployment will begin immediately.
Once completed, you will get a website application with automatic SSL and CDN acceleration.
You can also use GitHub Action for continuous deployment of your VuePress application on GitHub.

You can also use `cloudbase init --template vuepress` to quickly create and deploy a new VuePress application.

::: tip
For more detailed information, please check the
[deployment project examples](https://github.com/TencentCloudBase/cloudbase-framework?site=vuepress#%E9%A1%B9%E7%9B%AE%E7%A4%BA%E4%BE%8B)
in the CloudBase Framework documentation.
:::

## 21 YunBox

Please check [21 YunBox - Deploy a VuePress Static Site](https://www.21yunbox.com/docs/#/deploy-vuepress).
