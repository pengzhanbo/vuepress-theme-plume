# Include

Import another file's content into the current page (enabled by default, `markdown.include`).

```md
<!-- @include: ./snippet.md -->
<!-- @include: ./snippet.md{1-10} -->
<!-- @include: ./snippet.md{10-} -->
<!-- @include: ./snippet.md{-10} -->
<!-- @include: ./snippet.md#region-name -->
```

Region markers inside the source file:

```md
<!-- region region-name -->

内容

<!-- endregion region-name -->
```

## Config

```ts
markdown: {
  include: {
    resolvePath: (str) => str,      // transform the resolved path
    deep: false,                    // allow nested includes
    useComment: true,               // false disables the `<!-- @include -->` form
    resolveImagePath: true,         // rewrite image paths relative to the included file
    resolveLinkPath: true,          // rewrite link paths
  },
}
```

- `<!-- @include: xxx -->` is the default form; `@include: xxx` also works while `useComment` is `true`.
- Included files are plain markdown; path resolution is relative to the **current** file.
- Snippet files are usually excluded from the build: add `'!**/*.snippet.md'` to `pagePatterns`.
- `deep: false` keeps includes one level deep (prevents recursion).
