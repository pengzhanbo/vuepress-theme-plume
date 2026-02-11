---
name: vuepress-plume-config
description: Generate and write VuePress Plume theme config. Invoke when user asks to init or update theme config.
---

# VuePress Plume Config Skill

This skill generates, manages, and writes VuePress Plume theme configuration files based on the official documentation. It supports `.vuepress/config.ts`, `.vuepress/config.js`, and `.vuepress/plume.config.ts`.

**When to Invoke**

- Initialize or update Plume theme configuration
- Dynamically generate themeConfig, collections, navbar, sidebar, locales according to input
- Write the generated configuration into a specified target file

**Documentation Sources**

- [Theme Configuration](https://theme-plume.vuejs.press/config/theme/index.md)
- [Locales Configuration](https://theme-plume.vuejs.press/config/locales/index.md)
- [Collections Configuration](https://theme-plume.vuejs.press/config/collections/index.md)
- [Navbar](https://theme-plume.vuejs.press/config/navigation/index.md)
- [Sidebar](https://theme-plume.vuejs.press/config/sidebar/index.md)
- [Markdown](https://theme-plume.vuejs.press/config/markdown/index.md)
- [Plugins](https://theme-plume.vuejs.press/config/plugins/index.md)

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
        "lang": { "type": "string", "description": "Default language" },
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
        "hostname": { "type": "string", "default": "", "description": "Deployment hostname (for sitemap/SEO)" },
        "autoFrontmatter": {
          "type": ["object", "boolean"],
          "default": { "permalink": true, "createTime": true, "title": true },
          "properties": {
            "permalink": { "type": "boolean", "default": true },
            "createTime": { "type": "boolean", "default": true },
            "title": { "type": "boolean", "default": true }
          },
          "description": "Automatically add frontmatter to Markdown"
        },
        "cache": {
          "type": ["string", "boolean"],
          "enum": ["memory", "filesystem", false],
          "default": "filesystem",
          "description": "Compilation cache (config.ts/js only)"
        },
        "docsRepo": { "type": "string", "default": "", "description": "Docs repository url" },
        "docsBranch": { "type": "string", "default": "", "description": "Docs repository branch" },
        "docsDir": { "type": "string", "default": "", "description": "Docs directory (relative to repo root)" },
        "editLink": { "type": "boolean", "default": true, "description": "Enable edit link (config.ts/js only)" },
        "lastUpdated": {
          "type": ["object", "boolean"],
          "default": { "formatOptions": { "dateStyle": "short", "timeStyle": "short" } },
          "properties": {
            "formatOptions": { "type": "object", "description": "Intl.DateTimeFormatOptions & { forceLocale?: boolean }" }
          },
          "description": "Last updated time (config.ts/js only)"
        },
        "contributors": { "type": ["boolean", "object"], "default": true, "description": "Show contributors (config.ts/js only)" },
        "changelog": { "type": ["boolean", "object"], "default": false, "description": "Show page change history (config.ts/js only)" },
        "home": { "type": ["string", "boolean"], "default": "/", "description": "Home path" },
        "logo": { "type": ["string", "boolean"], "default": false, "description": "Navbar logo" },
        "logoDark": { "type": ["string", "boolean"], "default": false, "description": "Navbar logo for dark mode" },
        "appearance": {
          "type": ["string", "boolean"],
          "enum": [true, false, "dark", "force-dark"],
          "default": true,
          "description": "Dark mode toggle and default mode"
        },
        "profile": {
          "type": "object",
          "default": {},
          "description": "Site profile info",
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
          "description": "Social links (Iconify name or custom SVG)",
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
          "items": { "type": "string" },
          "description": "Social links allowed to display in navbar (PC)"
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
              "prefix": { "type": "string" },
              "items": { "type": "array" },
              "icon": { "type": ["string", "object"] },
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
              "pagination": {
                "type": ["boolean", "number", "object"],
                "properties": { "perPage": { "type": "number", "default": 15 } }
              },
              "link": { "type": "string" },
              "postList": { "type": "boolean" },
              "tags": { "type": "boolean" },
              "tagsLink": { "type": "string" },
              "tagsText": { "type": "string" },
              "archives": { "type": "boolean" },
              "archivesLink": { "type": "string" },
              "archivesText": { "type": "string" },
              "categories": { "type": "boolean" },
              "categoriesLink": { "type": "string" },
              "categoriesText": { "type": "string" },
              "categoriesExpand": { "type": ["number", "string"], "enum": ["deep"] },
              "postCover": {
                "type": ["string", "object"],
                "description": "Layout or style",
                "properties": {
                  "layout": { "type": "string", "enum": ["left", "right", "odd-left", "odd-right", "top"] },
                  "ratio": { "type": "string" },
                  "width": { "type": "number" },
                  "compact": { "type": "boolean" }
                }
              },
              "profile": { "type": ["object", "boolean"] },
              "social": { "type": ["array", "boolean"] },
              "sidebar": { "type": ["string", "array"], "description": "Doc type only" },
              "sidebarScrollbar": { "type": "boolean" },
              "sidebarCollapsed": { "type": "boolean" }
            }
          }
        },
        "sidebar": {
          "type": ["object", "boolean"],
          "description": "Global sidebar (prefer configuring in collections)"
        },
        "sidebarScrollbar": { "type": "boolean", "default": true },
        "aside": { "type": ["boolean", "string"], "enum": [true, false, "left"], "default": true },
        "outline": { "type": ["boolean", "number", "array", "string"], "default": [2, 3], "description": "false|n|[min,max]|'deep'" },
        "transition": {
          "type": ["boolean", "object"],
          "default": true,
          "properties": { "page": { "type": "boolean", "default": true } }
        },
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
          "description": "Built-in plugin options for the theme (config.ts/js only)"
        },
        "markdown": { "type": "object", "description": "Markdown options (config.ts/js only)" },
        "codeHighlighter": { "type": ["object", "boolean"], "description": "Code highlighter (config.ts/js only)" },
        "search": { "type": ["object", "boolean"], "description": "Search (config.ts/js only)" },
        "comment": { "type": ["object", "boolean"], "description": "Comments (config.ts/js only)" },
        "watermark": { "type": ["object", "boolean"], "description": "Watermark (config.ts/js only)" },
        "readingTime": { "type": ["object", "boolean"], "description": "Reading time (config.ts/js only)" },
        "copyCode": { "type": ["object", "boolean"], "description": "Copy code (config.ts/js only)" },
        "replaceAssets": { "type": ["object", "boolean"], "description": "Replace assets (config.ts/js only)" }
      }
    }
  }
}
```

## Execution Logic

- Parse input and validate `format` and fields
- If `format=plume-config-ts`:
  - Only write fields supported in `.vuepress/plume.config.ts` (ignore and report fields like `plugins`, `markdown`, `search`, etc.)
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
  // navbarSocialInclude, navbar, collections, sidebar, sidebarScrollbar,
  // aside, outline, transition, locales, docsRepo/docsBranch/docsDir, autoFrontmatter
})
```

### .vuepress/config.ts

```ts
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  // Optional site-level config: lang, title, description, base, head, locales
  theme: plumeTheme({
    // Full theme config available, including plugins/markdown/search/comment etc.
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
- If `format=plume-config-ts` and input contains `plugins/markdown/codeHighlighter/search/comment/watermark/readingTime/copyCode/replaceAssets/editLink/lastUpdated/contributors/changelog/cache`:
  - Exclude these fields from output
  - Report they are only supported in `.vuepress/config.ts`/`.js`
- In `collections`, `type` must be `post` or `doc`; `dir` and `title` are required
- `navbar` accepts strings (paths) and objects (with `text/link`)
- Keys in `locales` should be path prefixes like `'/'`, `'/en/'`, `'/zh/'`

## Execution Feedback

- Written file path and format type
- Summary of generated fields (collections count, navbar items, locales count)
- Ignored fields list with reasons
- For cache to take effect, remind removing `--clean-cache` from dev script

## References

- Theme: [theme.md](https://theme-plume.vuejs.press/config/theme/index.md)
- Locales: [locales.md](https://theme-plume.vuejs.press/config/locales/index.md)
- Collections: [collections.md](https://theme-plume.vuejs.press/config/collections/index.md)
