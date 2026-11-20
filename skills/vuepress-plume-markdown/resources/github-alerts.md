# GitHub Alerts

Use GitHub-style alerts.

## Syntax

```md
> [!NOTE]
> Note content.

> [!TIP]
> Tip content.

> [!IMPORTANT]
> Important content.

> [!WARNING]
> Warning content.

> [!CAUTION]
> Caution content.
```

## Notes

- Alerts are on by default (`markdown.alert: true`).
- While `markdown.obsidian` is enabled (the default), alerts are rendered by the Obsidian **callout** renderer, so
  callout-only types (`> [!note] 自定义标题`) also work. Setting `obsidian: false` falls back to
  `@vuepress/plugin-markdown-hint`.
- The title after the type is optional; `> [!TIP] 提示` renders a custom title.
