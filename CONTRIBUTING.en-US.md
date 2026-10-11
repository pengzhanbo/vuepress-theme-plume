# Contribution Guide

## Overview

The project repository uses [pnpm workspaces](https://pnpm.io/zh/workspaces) to implement
a [Monorepo](https://en.wikipedia.org/wiki/Monorepo), which stores multiple interrelated independent Packages.

- The theme is developed and maintained in the `theme` directory.
- Plugins are developed and maintained in the `plugins` directory.
- Documentation is developed and maintained in the `docs` directory.

In the `plugins` directory:

- `plugin-search`: Provides full-text fuzzy search functionality for the theme.
- `plugin-md-power`: Provides enhanced markdown features.
- `plugin-fonts`: Provides special character font support

## Development Configuration

Development requirements:

- [Node.js](http://nodejs.org/) version 20.19.0+
- [pnpm](https://pnpm.io/zh/) version 9+

Clone the repository and install dependencies:

```sh
pnpm install
```

Before starting the development service for the first time, build the source code:

```sh
pnpm build
```

### Main Tools

- [TypeScript](https://www.typescriptlang.org/) as the development language.
- [ESLint](https://eslint.org/) for code checking and formatting.
- [StyleLint](https://stylelint.io/) for code checking and formatting.

### Scripts

#### `pnpm build`

The `build` command compiles every package and emits its output to the `dist` directory (not `lib`).

After cloning the repository, you need to run this command first to ensure that the project code
can run smoothly, as the compiled output directory is excluded from the repository by `.gitignore`.

#### `pnpm dev`

The `dev` command starts two services locally. One runs the `tsup:watch & copy:watch` for
the `theme` directory, and the other runs the `vuepress` development service for the example `docs` directory.

By default, all plugins under the `plugins` directory do not have a `dev` command.
Therefore, changes to the `plugins` directory may require running the `pnpm build` command to rebuild.
Some changes to the `plugins/**/node` directory require re-running `pnpm dev` to take effect.

#### `pnpm lint`

The `lint` command uses ESLint to check all source files, plus markdownlint for Markdown files
(including Chinese typography rules).

When `lint` reports errors, you can manually modify the source code to fix the ESLint errors, or run `pnpm lint:fix` to automatically fix them.

#### `pnpm test`

The `test` command uses Vitest to run all tests.

### IDE Support

It is recommended to use `vs code` for development. This repository is configured with
the recommended `vs code` extensions for developing this theme. When you import this repository,
`vs code` may recommend that you install some extensions.

## Documentation Contribution

Thanks for contributing to the vuepress-theme-plume documentation! The following are the conventions
and workflow for documentation contributions.

### Documentation Style Conventions

- **Pronouns**: Use "you" for explanatory text.
- **File naming**: All Markdown files use kebab-case (e.g. `audio-reader.md`, not `audioReader.md`).
- **Overview paragraph**: Each document should have a short overview paragraph right after its first `##` heading, explaining what the document covers and when to read it.
- **Code examples**: Code blocks must declare a language. Configuration examples must include the complete import statements and surrounding context.
- **Link references**: Reference other documents with relative paths and make sure the links resolve.

### TypeScript code blocks must use twoslash

All ` ```ts ` code blocks **must** carry the `twoslash` flag, so that documentation examples are
actually compiled during the build:

````md
```ts twoslash
import { defineThemeConfig } from 'vuepress-theme-plume'

export default defineThemeConfig({
  // ...
})
```
````

This is not decorative. Multiple "user copies it and it fails" problems (non-existent export names,
invalid config keys, misspelled field names, misspelled variable names) went undetected precisely
because this flag was missing, and only surfaced after users copied the snippet. With twoslash, these
fail loudly during `pnpm docs:build`.

Companion requirements:

- **Reference types with `import type`, never hand-copy them.** Importing from the source lets the
  docs follow source changes automatically, and type drift gets caught by twoslash.

  ```ts twoslash
  import type { ThemeNavItem } from 'vuepress-theme-plume'

  const navbar: ThemeNavItem[] = []
  ```

- **Verify API and config names against the source.** Check `theme/src/shared/` and
  `theme/src/node/defineConfig.ts` before writing. A past documentation review found names that simply
  do not exist.
- **Verify default values against the source.** Take them from `node/locales/*.ts` or
  `initThemeOptions.ts` rather than writing them from memory.

### Keep the Chinese and English docs in sync

`docs/` and `docs/en/` must be updated together:

- Keep structure, code blocks, and component references identical across languages.
- `permalink` values must correspond exactly (Chinese `/config/plugins/watermark/` matches English
  `/en/config/plugins/watermark/`; never drop a directory level or change singular/plural form).
- Historical changelog entries under `docs/blog/3.更新说明/` record what was true at the time and
  **should not be modified**.

### Documentation Submission Workflow

1. Fork the repository and create a new branch
2. Modify or add documents under `docs/`
3. If a new document is added, register it in the matching sidebar config under `docs/.vuepress/collections/`
4. Run `pnpm lint` to check code quality (including Markdown typography)
5. Run `pnpm docs:build` — twoslash validates every TypeScript example at this stage
6. Run `pnpm docs:dev` to preview the result
7. Submit a Pull Request describing the documentation changes
