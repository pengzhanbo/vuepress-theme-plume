# Abbreviation

## Enable

```ts
markdown: { abbr: true }
```

Without the flag the `*[ABBR]: ...` syntax is left as plain text.

## Syntax

```md
The HTML specification is maintained by the W3C.

*[HTML]: Hyper Text Markup Language
*[W3C]: World Wide Web Consortium
```

Definitions can appear anywhere in the file (usually at the bottom) and apply to the whole document.

## Presets

Define abbreviations once for every page in the theme config:

```ts
markdown: {
  abbr: true,
  abbr: { HTML: 'Hyper Text Markup Language' }, // same as `markdown.env.abbreviations`
}
```

## Notes

- Matching is whole-word and case-sensitive.
- For CJK abbreviations add spaces on both sides in the text so the boundary is detected.
- Definitions are rendered as a tooltip on hover, not as visible text.
