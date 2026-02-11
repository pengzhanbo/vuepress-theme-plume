# Annotation

Annotation allows adding extra information or hints that are revealed on click.

## Syntax

1. **Inline Marker**: `[+label]` (must have a space before `[+`)
2. **Definition**: `[+label]: content` (can be multiline with indentation)

## Example

```md
This site is powered by VuePress [+vuepress].

[+vuepress]:
  VuePress is a [Static Site Generator](https://en.wikipedia.org/wiki/Static_site_generator) (SSG).
  It is specifically designed for building fast, content-centric sites.
```
