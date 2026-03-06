---
name: vuepress-plume-config
description: Generate and write VuePress Plume theme config. Invoke when user asks to init or update theme config, including collections, navbar, sidebar, locales, plugins, and all theme features like search, comments, watermark, encryption, bulletin, copyright, llmstxt, replaceAssets, etc.
---

# VuePress Plume Config Skill

This skill generates, manages, and writes VuePress Plume theme configuration files based on the official documentation. It supports `.vuepress/config.ts`, `.vuepress/config.js`, and `.vuepress/plume.config.ts`.

**When to Invoke**

- Initialize or update Plume theme configuration
- Configure collections (post/doc types), navbar, sidebar, locales
- Setup plugins (search, comments, watermark, llmstxt, etc.)
- Configure encryption, bulletin, copyright, and other advanced features
- Write the generated configuration into a specified target file

**Documentation Sources**

- [Theme Configuration](https://theme-plume.vuejs.press/config/theme/)
- [Locales Configuration](https://theme-plume.vuejs.press/config/locales/)
- [Collections Configuration](https://theme-plume.vuejs.press/config/collections/)
- [Navbar](https://theme-plume.vuejs.press/config/navbar/)
- [Sidebar](https://theme-plume.vuejs.press/config/sidebar/)
- [Markdown](https://theme-plume.vuejs.press/config/markdown/)
- [Plugins](https://theme-plume.vuejs.press/config/plugins/)
- [Frontmatter - Basic](https://theme-plume.vuejs.press/config/frontmatter/basic/)
- [Frontmatter - Post](https://theme-plume.vuejs.press/config/frontmatter/post/)
- [Frontmatter - Home](https://theme-plume.vuejs.press/config/frontmatter/home/)
- [Frontmatter - Friend](https://theme-plume.vuejs.press/config/frontmatter/friend/)

## Configuration Files

The theme supports two configuration approaches:

### 1. `.vuepress/config.ts` (Recommended for full control)

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  // Site-level config: lang, title, description, base, head, locales
  theme: plumeTheme({
    // Full theme config available, including plugins, markdown, search, comment, etc.
  })
})
```

### 2. `.vuepress/plume.config.ts` (Recommended for clean separation)

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  // Supported fields: hostname, home, logo, logoDark, appearance, profile, social,
  // navbarSocialInclude, navbar, collections, sidebar, sidebarScrollbar, aside, outline,
  // transition, footer, bulletin, copyright, prevPage, nextPage, createTime, locales,
  // docsRepo/docsBranch/docsDir, autoFrontmatter, editLinkPattern
})
```

::: warning Fields NOT supported in `plume.config.ts`
`plugins`, `markdown`, `codeHighlighter`, `search`, `comment`, `watermark`, `readingTime`, `copyCode`, `replaceAssets`, `editLink`, `lastUpdated`, `contributors`, `changelog`, `cache`, `hostname`, `configFile`, `encrypt`, `llmstxt`
:::

## Input Schema

```json
{
  "type": "object",
  "required": ["format", "target_file"],
  "properties": {
    "format": {
      "type": "string",
      "enum": ["plume-config-ts", "vuepress-config-ts", "vuepress-config-js"],
      "description": "Output file type and configuration style"
    },
    "target_file": {
      "type": "string",
      "description": "Target file path to write (relative to project root or absolute)"
    },
    "site": {
      "type": "object",
      "description": "VuePress site-level config (config.ts/js only)",
      "properties": {
        "lang": { "type": "string", "default": "zh-CN" },
        "title": { "type": "string" },
        "description": { "type": "string" },
        "base": { "type": "string" },
        "head": { "type": "array" },
        "locales": { "type": "object" }
      }
    },
    "theme": {
      "type": "object",
      "description": "Plume theme configuration",
      "properties": {
        "hostname": { "type": "string", "default": "" },
        "configFile": { "type": "string", "default": "" },
        "autoFrontmatter": {
          "type": ["object", "boolean"],
          "default": { "permalink": true, "createTime": true, "title": true },
          "properties": {
            "permalink": { "type": ["boolean", "string"], "default": true },
            "createTime": { "type": "boolean", "default": true },
            "title": { "type": "boolean", "default": true }
          }
        },
        "cache": {
          "type": ["string", "boolean"],
          "enum": ["memory", "filesystem", false],
          "default": "filesystem"
        },
        "docsRepo": { "type": "string", "default": "" },
        "docsBranch": { "type": "string", "default": "" },
        "docsDir": { "type": "string", "default": "" },
        "editLink": { "type": "boolean", "default": true },
        "editLinkPattern": { "type": "string", "default": "" },
        "lastUpdated": {
          "type": ["object", "boolean"],
          "default": { "formatOptions": { "dateStyle": "short", "timeStyle": "short" } }
        },
        "contributors": { "type": ["boolean", "object"], "default": true },
        "changelog": { "type": ["boolean", "object"], "default": false },
        "home": { "type": ["string", "boolean"], "default": "/" },
        "logo": { "type": ["string", "boolean"], "default": false },
        "logoDark": { "type": ["string", "boolean"], "default": false },
        "appearance": {
          "type": ["string", "boolean"],
          "enum": [true, false, "dark", "force-dark"],
          "default": true
        },
        "profile": {
          "type": "object",
          "properties": {
            "avatar": { "type": "string" },
            "name": { "type": "string" },
            "description": { "type": "string" },
            "circle": { "type": "boolean" },
            "location": { "type": "string" },
            "organization": { "type": "string" },
            "layout": { "type": "string", "enum": ["left", "right"], "default": "right" }
          }
        },
        "social": {
          "type": ["array", "boolean"],
          "default": false,
          "items": {
            "type": "object",
            "properties": {
              "icon": { "type": ["string", "object"] },
              "link": { "type": "string" },
              "ariaLabel": { "type": "string" }
            },
            "required": ["icon", "link"]
          }
        },
        "navbarSocialInclude": {
          "type": "array",
          "default": ["github", "twitter", "discord", "facebook"],
          "items": { "type": "string" }
        },
        "navbar": {
          "type": "array",
          "default": [],
          "items": {
            "type": ["string", "object"],
            "properties": {
              "text": { "type": "string" },
              "link": { "type": "string" },
              "prefix": { "type": "string" },
              "items": { "type": "array" },
              "icon": { "type": ["string", "object"] },
              "badge": { "type": ["string", "object"] },
              "activeMatch": { "type": "string" }
            }
          }
        },
        "collections": {
          "type": "array",
          "default": [],
          "description": "Content collections (post/doc)",
          "items": {
            "type": "object",
            "required": ["type", "dir", "title"],
            "properties": {
              "type": { "type": "string", "enum": ["post", "doc"] },
              "dir": { "type": "string" },
              "title": { "type": "string" },
              "linkPrefix": { "type": "string" },
              "tagsTheme": { "type": "string", "enum": ["colored", "gray", "brand"], "default": "colored" },
              "autoFrontmatter": { "type": ["object", "boolean"] },
              "include": { "type": "array", "items": { "type": "string" } },
              "exclude": { "type": "array", "items": { "type": "string" } },
              "pagination": { "type": ["boolean", "number", "object"] },
              "link": { "type": "string" },
              "postList": { "type": "boolean", "default": true },
              "tags": { "type": "boolean", "default": true },
              "tagsLink": { "type": "string" },
              "tagsText": { "type": "string" },
              "archives": { "type": "boolean", "default": true },
              "archivesLink": { "type": "string" },
              "archivesText": { "type": "string" },
              "categories": { "type": "boolean", "default": true },
              "categoriesLink": { "type": "string" },
              "categoriesText": { "type": "string" },
              "categoriesExpand": { "type": ["number", "string"], "default": "deep" },
              "categoriesTransform": { "type": "string" },
              "postCover": { "type": ["string", "object"] },
              "profile": { "type": ["object", "boolean"] },
              "social": { "type": ["array", "boolean"] },
              "sidebar": { "type": ["string", "array"] },
              "sidebarScrollbar": { "type": "boolean", "default": true },
              "sidebarCollapsed": { "type": "boolean", "default": false }
            }
          }
        },
        "sidebar": { "type": ["object", "boolean"] },
        "sidebarScrollbar": { "type": "boolean", "default": true },
        "aside": { "type": ["boolean", "string"], "enum": [true, false, "left"], "default": true },
        "outline": { "type": ["boolean", "number", "array", "string"], "default": [2, 3] },
        "transition": {
          "type": ["boolean", "object"],
          "default": true,
          "properties": {
            "page": { "type": "boolean", "default": true },
            "postList": { "type": "boolean", "default": true },
            "appearance": { "type": ["boolean", "string"], "default": "fade" }
          }
        },
        "footer": {
          "type": ["boolean", "object"],
          "default": false,
          "properties": {
            "message": { "type": "string" },
            "copyright": { "type": "string" }
          }
        },
        "bulletin": {
          "type": ["boolean", "object"],
          "default": false,
          "properties": {
            "layout": { "type": "string", "enum": ["top-left", "top-right", "bottom-left", "bottom-right", "center"], "default": "top-right" },
            "border": { "type": "boolean", "default": true },
            "enablePage": { "type": ["boolean", "string"] },
            "lifetime": { "type": "string", "enum": ["session", "always", "once"], "default": "always" },
            "id": { "type": "string" },
            "title": { "type": "string" },
            "content": { "type": "string" },
            "contentType": { "type": "string", "enum": ["markdown", "text"], "default": "text" },
            "contentFile": { "type": "string" }
          }
        },
        "copyright": {
          "type": ["boolean", "string", "object"],
          "default": false,
          "properties": {
            "license": { "type": ["string", "object"] },
            "author": { "type": ["string", "object"] },
            "creation": { "type": "string", "enum": ["original", "translate", "reprint"], "default": "original" }
          }
        },
        "prevPage": { "type": "boolean", "default": true },
        "nextPage": { "type": "boolean", "default": true },
        "createTime": { "type": ["boolean", "string"], "enum": [true, false, "only-posts"], "default": true },
        "locales": { "type": "object" },
        "plugins": { "type": "object" },
        "markdown": { "type": "object" },
        "codeHighlighter": { "type": ["object", "boolean"] },
        "search": { "type": ["object", "boolean"] },
        "comment": { "type": ["object", "boolean"] },
        "watermark": { "type": ["object", "boolean"] },
        "readingTime": { "type": ["object", "boolean"] },
        "copyCode": { "type": ["object", "boolean"] },
        "replaceAssets": { "type": ["object", "boolean"] },
        "llmstxt": { "type": ["object", "boolean"] },
        "encrypt": {
          "type": ["object", "boolean"],
          "properties": {
            "global": { "type": "boolean", "default": false },
            "admin": { "type": "array", "items": { "type": "string" } },
            "rules": { "type": "object" }
          }
        }
      }
    }
  }
}
```

## Collections Configuration

Collections are the core concept for organizing content. Each collection points to a specific folder in the source directory.

### Post Collection (Blog, Columns)

```ts
{
  type: 'post',
  dir: 'blog',
  title: '博客',
  link: '/blog/',
  linkPrefix: '/article/',
  postCover: 'top', // 'left' | 'right' | 'odd-left' | 'odd-right' | 'top'
  tags: true,
  archives: true,
  categories: true,
  pagination: { perPage: 15 },
  profile: { name: '博主', avatar: '/avatar.png' },
  social: [{ icon: 'github', link: 'https://github.com/username' }]
}
```

### Doc Collection (Documentation, Notes)

```ts
{
  type: 'doc',
  dir: 'guide',
  title: '指南',
  sidebar: 'auto', // or manual sidebar config
  sidebarScrollbar: true,
  sidebarCollapsed: false
}
```

## Built-in Plugins

The theme includes these plugins (configured in `plugins` field):

| Plugin | Description |
|--------|-------------|
| `@vuepress/plugin-nprogress` | Page loading progress bar |
| `@vuepress/plugin-photo-swipe` | Image preview |
| `@vuepress/plugin-reading-time` | Article reading time |
| `@vuepress/plugin-watermark` | Article watermark |
| `@vuepress-plume/plugin-search` | Local search |
| `@vuepress/plugin-docsearch` | Algolia DocSearch |
| `@vuepress/plugin-copy-code` | Code copy |
| `@vuepress/plugin-shiki` | Code highlighting |
| `@vuepress/plugin-comment` | Article comments |
| `@vuepress/plugin-markdown-hint` | Markdown hints |
| `@vuepress/plugin-markdown-image` | Markdown image |
| `@vuepress/plugin-markdown-math` | Markdown math |
| `@vuepress/plugin-markdown-include` | Markdown include |
| `@vuepress/plugin-markdown-chart` | Markdown charts (chartjs/echarts/mermaid/flowchart/markmap/plantuml) |
| `@vuepress/plugin-replace-assets` | Asset link replacement |
| `vuepress-plugin-md-power` | Markdown Power |
| `@vuepress/plugin-git` | Git commit info |
| `@vuepress/plugin-cache` | Page compilation cache |
| `@vuepress/plugin-seo` | SEO optimization |
| `@vuepress/plugin-sitemap` | Sitemap |
| `@vuepress/plugin-llms` | LLMs txt support |

## Markdown Configuration

Configure markdown features in `markdown` field:

```ts
markdown: {
  hint: true,        // Info, tip, warning, caution containers
  alert: true,       // GitHub-style alerts
  fileTree: true,    // File tree container
  plot: true,        // Hidden text (spoiler)
  icons: true,       // Icons support
  math: { type: 'katex' }, // Math formulas
  include: true,     // Include markdown files
  annotation: false, // Inline annotations
  abbr: false,       // Abbreviations
  mark: 'eager',     // Mark/highlight text
  codeTabs: true,    // Code block tabs
  tabs: true,        // General tabs
  npmTo: false,      // npm/yarn/pnpm switcher
  timeline: false,   // Timeline container
  collapse: false,   // Collapsible sections
  chat: false,       // Chat dialog
  demo: false,       // Demo container
  pdf: false,        // PDF embed
  bilibili: false,   // Bilibili video
  youtube: false,    // YouTube video
  artPlayer: false,  // ArtPlayer video
  audioReader: false,// Audio
  codepen: false,    // CodePen
  codeSandbox: false,// CodeSandbox
  jsfiddle: false,   // JSFiddle
  repl: false,       // REPL
  caniuse: false,    // Can I Use embed
  imageSize: false,  // Auto image dimensions
  chartjs: false,    // Chart.js
  echarts: false,    // ECharts
  mermaid: false,    // Mermaid
  markmap: false,    // Markmap
  plantuml: false,   // PlantUML
  flowchart: false,  // Flowchart
}
```

## Code Highlighter Configuration

```ts
codeHighlighter: {
  lineNumbers: true,      // Enable line numbers globally
  whitespace: false,      // Show whitespace globally
  collapsedLines: false,  // Collapse lines globally
  theme: { light: 'github-light', dark: 'github-dark' },
  languages: ['js', 'ts', 'vue', 'bash', 'json'],
  twoslash: false,        // TypeScript twoslash
}
```

## Search Configuration

### Local Search (Default)

```ts
search: {
  provider: 'local',
  // Additional options...
}
```

### Algolia DocSearch

```ts
search: {
  provider: 'algolia',
  appId: 'YOUR_APP_ID',
  apiKey: 'YOUR_API_KEY',
  indexName: 'YOUR_INDEX_NAME'
}
```

## Comments Configuration

### Giscus

```ts
comment: {
  provider: 'Giscus',
  repo: 'owner/repo',
  repoId: '...',
  category: 'Announcements',
  categoryId: '...'
}
```

### Waline

```ts
comment: {
  provider: 'Waline',
  serverURL: 'https://your-waline-server.vercel.app'
}
```

### Twikoo

```ts
comment: {
  provider: 'Twikoo',
  envId: 'your-env-id'
}
```

### Artalk

```ts
comment: {
  provider: 'Artalk',
  server: 'https://your-artalk-server.com'
}
```

## LLMs txt Configuration

Generate LLM-friendly content for AI assistants:

```ts
llmstxt: {
  locale: '/',
  // Additional options...
}
```

This generates:
- `/llms.txt` - Brief overview with links
- `/llms-full.txt` - Full content
- Individual markdown files for each page

## Encryption Configuration

### Global Encryption

```ts
encrypt: {
  global: true,
  admin: ['password1', 'password2']
}
```

### Partial Encryption

```ts
encrypt: {
  rules: {
    'secret/': 'password',
    '/article/secret/': ['pass1', 'pass2'],
    '^/private/': 'private-pass' // Regex pattern
  }
}
```

## Watermark Configuration

```ts
watermark: {
  enabled: true,
  content: 'Your Name',
  opacity: 0.1,
  zIndex: 999
}
```

## Replace Assets Configuration

Replace asset URLs for CDN deployment:

```ts
replaceAssets: {
  image: 'https://cdn.example.com/images/',
  js: 'https://cdn.example.com/js/'
}
```

## Common Configuration Patterns

### Blog Setup

```ts
export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      {
        type: 'post',
        dir: 'blog',
        title: '博客',
        link: '/blog/',
        postCover: 'right',
        tags: true,
        archives: true,
        categories: true
      }
    ],
    profile: {
      name: '博主名称',
      description: '博主描述',
      avatar: '/avatar.png'
    },
    social: [
      { icon: 'github', link: 'https://github.com/username' }
    ]
  })
})
```

### Documentation Setup

```ts
export default defineUserConfig({
  theme: plumeTheme({
    collections: [
      {
        type: 'doc',
        dir: 'guide',
        title: '指南',
        sidebar: 'auto'
      }
    ],
    navbar: [
      { text: '指南', link: '/guide/', icon: 'mdi:book-open-outline' }
    ]
  })
})
```

### Multi-language Setup

```ts
export default defineUserConfig({
  locales: {
    '/': { lang: 'zh-CN', title: '中文站点' },
    '/en/': { lang: 'en-US', title: 'English Site' }
  },
  theme: plumeTheme({
    locales: {
      '/': {
        selectLanguageName: '简体中文',
        collections: [
          { type: 'doc', dir: 'guide', title: '指南', sidebar: 'auto' }
        ]
      },
      '/en/': {
        selectLanguageName: 'English',
        collections: [
          { type: 'doc', dir: 'en/guide', title: 'Guide', sidebar: 'auto' }
        ]
      }
    }
  })
})
```

## Validation and Hints

- Check consistency between `format` and `target_file` extension
- If `format=plume-config-ts` and input contains fields only supported in config.ts/js:
  - Exclude these fields: `plugins`, `markdown`, `codeHighlighter`, `search`, `comment`, `watermark`, `readingTime`, `copyCode`, `replaceAssets`, `editLink`, `lastUpdated`, `contributors`, `changelog`, `cache`, `hostname`, `configFile`, `encrypt`, `llmstxt`
  - Report them as ignored with reasons
- In `collections`, `type` must be `post` or `doc`; `dir` and `title` are required
- `navbar` accepts strings (paths) and objects (with `text/link`)
- Keys in `locales` should be path prefixes like `'/'`, `'/en/'`, `'/zh/'`
- For `encrypt.rules`, keys can be: file paths, directory paths, URL paths, or regex patterns (starting with `^`)
- For `copyright`, support both preset licenses (CC-BY-4.0, etc.) and custom { name, url } format

## Execution Feedback

- Written file path and format type
- Summary of generated fields (collections count, navbar items, locales count)
- Ignored fields list with reasons
- For cache to take effect, remind removing `--clean-cache` from dev script
- For encrypt to work properly, remind HTTPS requirement for partial content encryption

## References

- Theme: [theme.md](https://theme-plume.vuejs.press/config/theme/)
- Locales: [locales.md](https://theme-plume.vuejs.press/config/locales/)
- Collections: [collections.md](https://theme-plume.vuejs.press/config/collections/)
- Navbar: [navbar.md](https://theme-plume.vuejs.press/config/navbar/)
- Sidebar: [sidebar.md](https://theme-plume.vuejs.press/config/sidebar/)
- Markdown: [markdown.md](https://theme-plume.vuejs.press/config/markdown/)
- Plugins: [plugins/README.md](https://theme-plume.vuejs.press/config/plugins/)
- Encryption: [encryption.md](https://theme-plume.vuejs.press/guide/features/encryption/)
- Bulletin: [bulletin.md](https://theme-plume.vuejs.press/guide/features/bulletin/)
- Copyright: [copyright.md](https://theme-plume.vuejs.press/guide/features/copyright/)
- LLMs txt: [llmstxt.md](https://theme-plume.vuejs.press/guide/features/llmstxt/)
