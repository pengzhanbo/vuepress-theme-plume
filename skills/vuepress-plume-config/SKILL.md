---
name: vuepress-plume-config
description: Generate and write VuePress Plume theme config. Invoke when user asks to init or update theme config, including collections, navbar, sidebar, locales, plugins, and all theme features like search, comments, watermark, encryption, bulletin, copyright, etc.
---

# VuePress Plume Config Skill

This skill generates, manages, and writes VuePress Plume theme configuration files based on the official documentation. It supports `.vuepress/config.ts`, `.vuepress/config.js`, and `.vuepress/plume.config.ts`.

**When to Invoke**

- Initialize or update Plume theme configuration
- Configure collections (post/doc types), navbar, sidebar, locales
- Setup plugins (search, comments, watermark, etc.)
- Configure encryption, bulletin, copyright, and other advanced features
- Write the generated configuration into a specified target file

**Documentation Sources**

- [Theme Configuration](https://theme-plume.vuejs.press/config/theme/)
- [Locales Configuration](https://theme-plume.vuejs.press/config/locales/)
- [Collections Configuration](https://theme-plume.vuejs.press/config/collections/)
- [Navbar](https://theme-plume.vuejs.press/config/navigation/)
- [Sidebar](https://theme-plume.vuejs.press/config/sidebar/)
- [Markdown](https://theme-plume.vuejs.press/config/markdown/)
- [Plugins](https://theme-plume.vuejs.press/config/plugins/)
- [Frontmatter - Basic](https://theme-plume.vuejs.press/config/frontmatter/basic/)
- [Frontmatter - Post](https://theme-plume.vuejs.press/config/frontmatter/post/)
- [Frontmatter - Home](https://theme-plume.vuejs.press/config/frontmatter/home/)
- [Frontmatter - Friend](https://theme-plume.vuejs.press/config/frontmatter/friend/)

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
        "lang": { "type": "string", "description": "Default language, e.g., 'zh-CN', 'en-US'", "default": "zh-CN" },
        "title": { "type": "string", "description": "Site title" },
        "description": { "type": "string", "description": "Site description" },
        "base": { "type": "string", "description": "Deployment base path like /subpath/" },
        "head": { "type": "array", "description": "Extra <head> tags", "items": { "type": "array" } },
        "locales": {
          "type": "object",
          "description": "Site locales (config.ts/js only)",
          "additionalProperties": {
            "type": "object",
            "properties": {
              "lang": { "type": "string" },
              "title": { "type": "string" },
              "description": { "type": "string" }
            }
          }
        }
      }
    },
    "theme": {
      "type": "object",
      "description": "Plume theme configuration (themeConfig)",
      "properties": {
        "hostname": { "type": "string", "default": "", "description": "Deployment hostname (for sitemap/SEO). Not supported in plume.config.ts" },
        "configFile": { "type": "string", "default": "", "description": "Custom theme config file path. Not supported in plume.config.ts" },
        "autoFrontmatter": {
          "type": ["object", "boolean"],
          "default": { "permalink": true, "createTime": true, "title": true },
          "properties": {
            "permalink": { "type": ["boolean", "string"], "default": true, "description": "true|false|'filepath'" },
            "createTime": { "type": "boolean", "default": true },
            "title": { "type": "boolean", "default": true }
          },
          "description": "Automatically add frontmatter to Markdown"
        },
        "cache": {
          "type": ["string", "boolean"],
          "enum": ["memory", "filesystem", false],
          "default": "filesystem",
          "description": "Compilation cache: 'memory', 'filesystem', or false. Not supported in plume.config.ts"
        },
        "docsRepo": { "type": "string", "default": "", "description": "Docs repository url for edit link" },
        "docsBranch": { "type": "string", "default": "", "description": "Docs repository branch" },
        "docsDir": { "type": "string", "default": "", "description": "Docs directory (relative to repo root)" },
        "editLink": { "type": "boolean", "default": true, "description": "Enable edit link. Not supported in plume.config.ts" },
        "editLinkPattern": { "type": "string", "default": "", "description": "Edit link pattern, e.g., ':repo/edit/:branch/:path'" },
        "lastUpdated": {
          "type": ["object", "boolean"],
          "default": { "formatOptions": { "dateStyle": "short", "timeStyle": "short" } },
          "properties": {
            "formatOptions": { "type": "object", "description": "Intl.DateTimeFormatOptions & { forceLocale?: boolean }" }
          },
          "description": "Last updated time. Not supported in plume.config.ts"
        },
        "contributors": { "type": ["boolean", "object"], "default": true, "description": "Show contributors. Not supported in plume.config.ts" },
        "changelog": { "type": ["boolean", "object"], "default": false, "description": "Show page change history. Not supported in plume.config.ts" },
        "home": { "type": ["string", "boolean"], "default": "/", "description": "Home path" },
        "logo": { "type": ["string", "boolean"], "default": false, "description": "Navbar logo" },
        "logoDark": { "type": ["string", "boolean"], "default": false, "description": "Navbar logo for dark mode" },
        "appearance": {
          "type": ["string", "boolean"],
          "enum": [true, false, "dark", "force-dark"],
          "default": true,
          "description": "Dark mode: true (auto), false (disabled), 'dark' (default dark), 'force-dark' (forced dark)"
        },
        "profile": {
          "type": "object",
          "default": {},
          "description": "Site profile info for blogger display",
          "properties": {
            "avatar": { "type": "string", "description": "Avatar URL" },
            "name": { "type": "string", "description": "Blogger name" },
            "description": { "type": "string", "description": "Description/motto" },
            "circle": { "type": "boolean", "description": "Circle avatar" },
            "location": { "type": "string", "description": "User location" },
            "organization": { "type": "string", "description": "User organization/company" },
            "layout": { "type": "string", "enum": ["left", "right"], "default": "right" }
          }
        },
        "social": {
          "type": ["array", "boolean"],
          "default": false,
          "description": "Social links (Iconify name or custom SVG)",
          "items": {
            "type": "object",
            "properties": {
              "icon": { "type": ["string", "object"], "description": "Iconify name or { svg: string, name?: string }" },
              "link": { "type": "string" },
              "ariaLabel": { "type": "string" }
            },
            "required": ["icon", "link"]
          }
        },
        "navbarSocialInclude": {
          "type": "array",
          "default": ["github", "twitter", "discord", "facebook"],
          "items": { "type": "string" },
          "description": "Social links allowed to display in navbar (PC only)"
        },
        "navbar": {
          "type": "array",
          "default": [],
          "description": "Navbar configuration",
          "items": {
            "type": ["string", "object"],
            "properties": {
              "text": { "type": "string" },
              "link": { "type": "string" },
              "prefix": { "type": "string", "description": "Page prefix for group" },
              "items": { "type": "array", "description": "Nested nav items (max depth 2)" },
              "icon": { "type": ["string", "object"], "description": "Iconify icon or { svg: string }" },
              "badge": { "type": ["string", "object"], "description": "Badge text or { text, type, color, bgColor, borderColor }" },
              "activeMatch": { "type": "string", "description": "Regex pattern for active state" }
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
              "type": { "type": "string", "enum": ["post", "doc"], "description": "Collection type" },
              "dir": { "type": "string", "description": "Directory relative to source" },
              "title": { "type": "string", "description": "Collection title for breadcrumb" },
              "linkPrefix": { "type": "string", "description": "Article link prefix" },
              "tagsTheme": { "type": "string", "enum": ["colored", "gray", "brand"], "default": "colored" },
              "autoFrontmatter": { "type": ["object", "boolean"] },
              "include": { "type": "array", "items": { "type": "string" }, "description": "Glob patterns for included files" },
              "exclude": { "type": "array", "items": { "type": "string" }, "description": "Glob patterns for excluded files" },
              "pagination": {
                "type": ["boolean", "number", "object"],
                "properties": { "perPage": { "type": "number", "default": 15 } }
              },
              "link": { "type": "string", "description": "Post list page link" },
              "postList": { "type": "boolean", "default": true, "description": "Enable post list page (post type only)" },
              "tags": { "type": "boolean", "default": true, "description": "Enable tags page (post type only)" },
              "tagsLink": { "type": "string" },
              "tagsText": { "type": "string" },
              "archives": { "type": "boolean", "default": true, "description": "Enable archives page (post type only)" },
              "archivesLink": { "type": "string" },
              "archivesText": { "type": "string" },
              "categories": { "type": "boolean", "default": true, "description": "Enable categories (post type only)" },
              "categoriesLink": { "type": "string" },
              "categoriesText": { "type": "string" },
              "categoriesExpand": { "type": ["number", "string"], "enum": ["deep"], "default": "deep" },
              "categoriesTransform": { "type": "string", "description": "Function name for categories transform" },
              "postCover": {
                "type": ["string", "object"],
                "description": "Post cover layout/style",
                "properties": {
                  "layout": { "type": "string", "enum": ["left", "right", "odd-left", "odd-right", "top"] },
                  "ratio": { "type": ["number", "string"], "description": "Aspect ratio like '16:9' or number" },
                  "width": { "type": "number", "default": 240 },
                  "compact": { "type": "boolean", "default": false }
                }
              },
              "profile": { "type": ["object", "boolean"], "description": "Profile config for this collection" },
              "social": { "type": ["array", "boolean"], "description": "Social links for this collection" },
              "sidebar": { "type": ["string", "array"], "description": "Doc type only: 'auto' or sidebar config" },
              "sidebarScrollbar": { "type": "boolean", "default": true },
              "sidebarCollapsed": { "type": "boolean", "default": false }
            }
          }
        },
        "sidebar": {
          "type": ["object", "boolean"],
          "description": "Global sidebar (prefer configuring in collections)"
        },
        "sidebarScrollbar": { "type": "boolean", "default": true },
        "aside": { "type": ["boolean", "string"], "enum": [true, false, "left"], "default": true, "description": "Right sidebar/outline display" },
        "outline": { "type": ["boolean", "number", "array", "string"], "default": [2, 3], "description": "false|n|[min,max]|'deep'" },
        "transition": {
          "type": ["boolean", "object"],
          "default": true,
          "properties": {
            "page": { "type": "boolean", "default": true, "description": "Page transition animation" },
            "postList": { "type": "boolean", "default": true, "description": "Post list transition animation" },
            "appearance": { "type": ["boolean", "string"], "default": "fade", "description": "Theme switch animation: fade, circle-clip, horizontal-clip, vertical-clip, skew-clip, blinds-vertical, blinds-horizontal, soft-blur-fade, diamond-reveal" }
          }
        },
        "footer": {
          "type": ["boolean", "object"],
          "default": false,
          "description": "Footer config",
          "properties": {
            "message": { "type": "string" },
            "copyright": { "type": "string" }
          }
        },
        "bulletin": {
          "type": ["boolean", "object"],
          "default": false,
          "description": "Bulletin/announcement board config",
          "properties": {
            "layout": { "type": "string", "enum": ["top-left", "top-right", "bottom-left", "bottom-right", "center"], "default": "top-right" },
            "border": { "type": "boolean", "default": true },
            "enablePage": { "type": ["boolean", "string"], "description": "Boolean or function name" },
            "lifetime": { "type": "string", "enum": ["session", "always", "once"], "default": "always" },
            "id": { "type": "string", "description": "Bulletin unique ID" },
            "title": { "type": "string" },
            "content": { "type": "string" },
            "contentType": { "type": "string", "enum": ["markdown", "text"], "default": "text" },
            "contentFile": { "type": "string", "description": "Path to markdown/html file" }
          }
        },
        "copyright": {
          "type": ["boolean", "string", "object"],
          "default": false,
          "description": "Copyright config: true (CC-BY-4.0), license string, or object",
          "properties": {
            "license": { "type": ["string", "object"], "description": "License: CC-BY-4.0, CC-BY-SA-4.0, CC-BY-NC-4.0, CC-BY-NC-SA-4.0, CC-BY-ND-4.0, CC-BY-NC-ND-4.0, CC0, or { name, url }" },
            "author": { "type": ["string", "object"], "description": "Author name or { name, url }" },
            "creation": { "type": "string", "enum": ["original", "translate", "reprint"], "default": "original" }
          }
        },
        "prevPage": { "type": "boolean", "default": true, "description": "Show previous page link" },
        "nextPage": { "type": "boolean", "default": true, "description": "Show next page link" },
        "createTime": { "type": ["boolean", "string"], "enum": [true, false, "only-posts"], "default": true, "description": "Show create time" },
        "locales": {
          "type": "object",
          "description": "Theme locales (texts and per-locale theme config)",
          "additionalProperties": {
            "type": "object",
            "properties": {
              "selectLanguageName": { "type": "string" },
              "selectLanguageText": { "type": "string" },
              "selectLanguageAriaLabel": { "type": "string" },
              "appearanceText": { "type": "string" },
              "homeText": { "type": "string" },
              "postsText": { "type": "string" },
              "tagText": { "type": "string" },
              "categoryText": { "type": "string" },
              "archiveText": { "type": "string" },
              "archiveTotalText": { "type": "string" },
              "sidebarMenuLabel": { "type": "string" },
              "returnToTopLabel": { "type": "string" },
              "outlineLabel": { "type": "string" },
              "editLinkText": { "type": "string" },
              "latestUpdatedText": { "type": "string" },
              "contributorsText": { "type": "string" },
              "changelogText": { "type": "string" },
              "changelogOnText": { "type": "string" },
              "changelogButtonText": { "type": "string" },
              "copyrightText": { "type": "string" },
              "copyrightAuthorText": { "type": "string" },
              "copyrightCreationOriginalText": { "type": "string" },
              "copyrightCreationTranslateText": { "type": "string" },
              "copyrightCreationReprintText": { "type": "string" },
              "copyrightLicenseText": { "type": "string" },
              "prevPageLabel": { "type": "string" },
              "nextPageLabel": { "type": "string" },
              "encryptGlobalText": { "type": "string" },
              "encryptPageText": { "type": "string" },
              "encryptButtonText": { "type": "string" },
              "encryptPlaceholder": { "type": "string" },
              "notFound": {
                "type": "object",
                "properties": {
                  "code": { "type": "string" },
                  "title": { "type": "string" },
                  "quote": { "type": "string" },
                  "linkLabel": { "type": "string" },
                  "linkText": { "type": "string" }
                }
              },
              "collections": { "type": "array" }
            }
          }
        },
        "plugins": {
          "type": "object",
          "description": "Built-in plugin options. Not supported in plume.config.ts"
        },
        "markdown": { "type": "object", "description": "Markdown options. Not supported in plume.config.ts" },
        "codeHighlighter": { "type": ["object", "boolean"], "description": "Code highlighter options. Not supported in plume.config.ts" },
        "search": { "type": ["object", "boolean"], "description": "Search config: { provider: 'local'|'algolia', ...options }. Not supported in plume.config.ts" },
        "comment": { "type": ["object", "boolean"], "description": "Comments config: { provider: 'Giscus'|'Waline'|'Twikoo'|'Artalk', ...options }. Not supported in plume.config.ts" },
        "watermark": { "type": ["object", "boolean"], "description": "Watermark config. Not supported in plume.config.ts" },
        "readingTime": { "type": ["object", "boolean"], "description": "Reading time config. Not supported in plume.config.ts" },
        "copyCode": { "type": ["object", "boolean"], "description": "Copy code config. Not supported in plume.config.ts" },
        "replaceAssets": { "type": ["object", "boolean"], "description": "Replace assets config. Not supported in plume.config.ts" },
        "encrypt": {
          "type": ["object", "boolean"],
          "description": "Encryption config. Not supported in plume.config.ts",
          "properties": {
            "global": { "type": "boolean", "default": false, "description": "Enable global site encryption" },
            "admin": { "type": "array", "items": { "type": "string" }, "description": "Admin passwords" },
            "rules": { "type": "object", "description": "Path-based encryption rules: { 'path/or/pattern': 'password' | ['password1', 'password2'] }" }
          }
        }
      }
    }
  }
}
```

## Execution Logic

- Parse input and validate `format` and fields
- If `format=plume-config-ts`:
  - Only write fields supported in `.vuepress/plume.config.ts` (ignore and report fields like `plugins`, `markdown`, `search`, `comment`, `watermark`, `encrypt`, etc.)
  - Generate `defineThemeConfig({ ...theme })`
- If `format=vuepress-config-ts`:
  - Generate `defineUserConfig({ site..., theme: plumeTheme({ ...theme }) })`
- If `format=vuepress-config-js`:
  - Generate equivalent JavaScript version (remove types and `import type`)
- Write generated text to `target_file` (create parent dirs if missing)
- Output feedback: path, format, field summary, and ignored fields

## Templates

### plume.config.ts

```ts
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  // Supported fields in plume.config.ts: hostname, home, logo, logoDark, appearance, profile, social,
  // navbarSocialInclude, navbar, collections, sidebar, sidebarScrollbar, aside, outline, transition,
  // footer, bulletin, copyright, prevPage, nextPage, createTime, locales, docsRepo/docsBranch/docsDir,
  // autoFrontmatter, editLinkPattern
})
```

### .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  // Optional site-level config: lang, title, description, base, head, locales
  theme: plumeTheme({
    // Full theme config available, including plugins/markdown/search/comment/watermark/encrypt etc.
  })
})
```

### .vuepress/config.js

```js
const { defineUserConfig } = require('vuepress')
const { plumeTheme } = require('vuepress-theme-plume')

module.exports = defineUserConfig({
  theme: plumeTheme({
    // Same as TS version
  })
})
```

## Validation and Hints

- Check consistency between `format` and `target_file` extension
- If `format=plume-config-ts` and input contains fields only supported in config.ts/js:
  - Exclude these fields from output: `plugins`, `markdown`, `codeHighlighter`, `search`, `comment`, `watermark`, `readingTime`, `copyCode`, `replaceAssets`, `editLink`, `lastUpdated`, `contributors`, `changelog`, `cache`, `hostname`, `configFile`, `encrypt`
  - Report them as ignored with reasons
- In `collections`, `type` must be `post` or `doc`; `dir` and `title` are required
- `navbar` accepts strings (paths) and objects (with `text/link`)
- Keys in `locales` should be path prefixes like `'/'`, `'/en/'`, `'/zh/'`
- For `encrypt.rules`, keys can be: file paths, directory paths, URL paths, or regex patterns (starting with `^`)
- For `copyright`, support both preset licenses (CC-BY-4.0, etc.) and custom { name, url } format

## Common Configuration Patterns

### Blog Setup

```json
{
  "collections": [
    {
      "type": "post",
      "dir": "blog",
      "title": "博客",
      "link": "/blog/",
      "postCover": "right",
      "tags": true,
      "archives": true,
      "categories": true
    }
  ],
  "profile": {
    "name": "博主名称",
    "description": "博主描述",
    "avatar": "/avatar.png"
  },
  "social": [
    { "icon": "github", "link": "https://github.com/username" }
  ]
}
```

### Documentation Setup

```json
{
  "collections": [
    {
      "type": "doc",
      "dir": "guide",
      "title": "指南",
      "sidebar": "auto"
    }
  ],
  "navbar": [
    { "text": "指南", "link": "/guide/", "icon": "mdi:book-open-outline" }
  ]
}
```

### Multi-language Setup

```json
{
  "locales": {
    "/": {
      "selectLanguageName": "简体中文",
      "selectLanguageText": "选择语言"
    },
    "/en/": {
      "selectLanguageName": "English",
      "selectLanguageText": "Languages"
    }
  }
}
```

### Search Configuration

```text
// Local search (default)
{
  search: {
    provider: 'local'
  }
}

// Algolia DocSearch
{
  search: {
    provider: 'algolia',
    appId: 'YOUR_APP_ID',
    apiKey: 'YOUR_API_KEY',
    indexName: 'YOUR_INDEX_NAME'
  }
}
```

### Comments Configuration

```text
// Giscus
{
  comment: {
    provider: 'Giscus',
    repo: 'owner/repo',
    repoId: '...',
    category: 'Announcements',
    categoryId: '...'
  }
}

// Waline
{
  comment: {
    provider: 'Waline',
    serverURL: 'https://your-waline-server.vercel.app'
  }
}
```

### Encryption Configuration

```text
// Global encryption
{
  encrypt: {
    global: true,
    admin: ['password1', 'password2']
  }
}

// Partial encryption
{
  encrypt: {
    rules: {
      'secret/': 'password',
      '/article/secret/': ['pass1', 'pass2'],
      '^/private/': 'private-pass'
    }
  }
}
```

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
- Navbar: [navbar.md](https://theme-plume.vuejs.press/config/navigation/)
- Sidebar: [sidebar.md](https://theme-plume.vuejs.press/config/sidebar/)
- Markdown: [markdown.md](https://theme-plume.vuejs.press/config/markdown/)
- Plugins: [plugins/README.md](https://theme-plume.vuejs.press/config/plugins/)
- Encryption: [encryption.md](https://theme-plume.vuejs.press/guide/features/encryption/)
- Bulletin: [bulletin.md](https://theme-plume.vuejs.press/guide/features/bulletin/)
- Copyright: [copyright.md](https://theme-plume.vuejs.press/guide/features/copyright/)
