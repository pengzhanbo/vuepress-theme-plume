# Emoji

Emoji shortcodes work out of the box (`markdown-it-emoji`), no config needed.

```md
:tada: :100: :+1: :heart:
```

- GitHub-style shortcodes (`:name:`) and some unicode aliases are supported.
- Inside inline code (`` `:tada:` ``) the shortcode is left untouched.
- To render a literal `:` shortcode, escape it: `\:tada:`.
- Emoji names come from the standard `markdown-it-emoji` dictionary; if a shortcode does not render, it is not in
  the dictionary — use the unicode character directly instead.
