# LLMs.txt markers

When the site enables `llmstxt` (a **build-only** theme option, off by default), `vuepress build` emits
`/llms.txt`, `/llms-full.txt` and a markdown file per page. Two HTML-ish markers control what those files contain.

## `<llm-only>`

Content kept **only** in the generated LLM files:

```md
<llm-only>

## Section for LLMs

这段内容只出现在生成的 LLM 文件中。

</llm-only>
```

## `<llm-exclude>`

Content **removed** from the generated LLM files (still visible on the site):

```md
<llm-exclude>

## Section for humans

这段内容不会出现在 LLM 文件中。

</llm-exclude>
```

## Rules

- Block form: the opening and closing markers sit on their own lines, separated by a blank line.
- Inline form is allowed, but **only one** `<llm-only>` / `<llm-exclude>` per line — two markers on one line break
  parsing.
- Encrypted pages, drafts and `article: false` pages never appear in the LLM files regardless of markers.
