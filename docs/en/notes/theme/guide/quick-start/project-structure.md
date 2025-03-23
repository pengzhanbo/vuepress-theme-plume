---
title: Project Structure
icon: ph:tree-structure-bold
createTime: 2025/03/02 13:41:25
permalink: /en/guide/project-structure/
---

This guide will illustrate the file structure of a project created with VuePress and Plume, as well as how to utilize them within your project.

When you [create a project using the command-line tool](quick-start.md#command-line-installation), its file structure looks like this:

::: file-tree

- .git/
- **docs** \# Documentation source directory
  - .vuepress  \# VuePress configuration folder
    - public/ \# Static resources directory
    - client.ts \# Client-side configuration (optional)
    - config.ts \# VuePress configuration
    - navbar.ts \# Navigation bar configuration (optional)
    - notes.ts \# Notes configuration (optional)
    - plume.config.ts \# Theme configuration file  (optional)
  - notes \# Series documentation, knowledge notes
    - demo
      - foo.md
      - bar.md
  - preview \# One of the blog categories
    - markdown.md \# Blog post under the category
  - article.md \# Blog post
  - README.md \# Home page
  - …
- package.json
- pnpm-lock.yaml
- .gitignore
- README.md
  :::

::: tip If you created the project manually, you can also manage your project by referring to this file structure.
:::

## Documentation Source Directory

The **documentation source directory** refers to the directory where all your site's markdown files are located. This directory is generally specified when you start VuePress using the command-line tool:

```sh
# [!code word:docs]
vuepress dev docs
#            Here, the documentation source directory is declared as docs
```

```json title="package.json"
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    //                        ^^^^
    "docs:build": "vuepress build docs"
    //                            ^^^^
  }
}
```

Generally, VuePress only takes over this directory, and other files outside the source directory will be ignored.

## `.vuepress` Directory

The `.vuepress/` directory is the VuePress configuration folder, where you can also create your own components, customize theme styles, etc.

**In this directory:**

### `client.ts`

Client-side configuration file, where you can extend VuePress's functionality, such as declaring new global components, etc.

::: code-tabs
@tab .vuepress/client.ts

```ts
import { defineClientConfig } from 'vuepress/client'

export default defineClientConfig({
  enhance({ app, router, siteData }) {
    // app: vue app instance
    // router: vue router instance
    // siteData: vuepress site configuration

    // Register global components
    app.component('MyComponent', MyComponent)
  },
  setup() {
    // Equivalent to the setup method on the root component of vue
  }
})
```

:::

### `config.ts`

The VuePress configuration file, where you need to make some necessary configurations, such as theme, plugins, build tools, etc.

::: code-tabs
@tab .vuepress/config.ts

```ts
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  lang: 'en-US',
  theme: plumeTheme({
    // more...
  }),
  bundler: viteBundler(),
})
```

:::

### `plume.config.ts`

Theme configuration file. Since modifying `.vuepress/config.ts` requires restarting the VuePress service each time, which is not necessary in most cases.

The theme moves the configurations that do not require restarting the service to here. When you modify the configuration here, the theme will be updated via hot reload.

::: code-tabs
@tab .vuepress/plume.config.ts

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'
import navbar from './navbar'
import notes from './notes'

export default defineThemeConfig({
  logo: '/logo.svg',
  profile: {
    name: 'Theme Plume',
  },
  navbar,
  notes,
  // ... more
})
```

@tab .vuepress/navbar.ts

```ts
import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  // ...
])
```

@tab .vuepress/notes.ts

```ts
import { defineNotesConfig } from 'vuepress-theme-plume'

export default defineNotesConfig({
  // ...
})
```

:::

## notes Directory

The **notes** directory is used to store your knowledge notes, series documentation, etc.

### How to Understand Knowledge Notes/Series Documentation?

A common scenario is that you are learning a skill and plan to record your learning experiences, key points, difficulties, etc., in your notes. In this case, you might write multiple documents for recording.

Alternatively, you are preparing for an interview and want to prepare interview questions and answers in advance. You might then have each question and answer as a separate document.

You would easily want to manage them all in a separate directory and, at the same time, be able to quickly navigate between different documents in the skill notes or between different interview questions in the generated documentation site.

This is a requirement that blog-type documentation cannot meet, and it is a pain point that `notes` aims to solve.

The above content can easily result in the following directory structure:

::: file-tree

- notes
  - interview  \# Interview questions
    - Self-Introduction.md
    - My-Skills.md
    - Projects-Worked.md
    - …
  - typescript \# Learning notes
    - Basics
      - Basic-Types.md
      - Generics.md
      - …
    - Advanced
      - Functions.md
      - …
:::

This allows for easy management of multiple series of documents, each with its own directory structure.

## Other Directories/Files

In the ==documentation source directory==, other directories and files, except for `README.md` which is recognized as the `home page`, will be identified as blog posts. The directory structure will be recognized as blog categories.

::: file-tree

- docs
  - Life
    - Travel-Diary.md
    - …
  - Study
    - Exam-Notes.md
    - …
  - Work
    - Tomato-Time.md
    - …
  - Miscellaneous.md  \# Articles without categories
  - README.md  \# Home page
  - …
:::
