# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

vuepress-theme-plume is a VuePress 2 theme monorepo for building blogs, documentation, and knowledge bases.
It includes a main theme, several plugins, a CLI tool, and example implementations.

## Commands

```bash
# Install dependencies
pnpm install

# Build all packages (required after clone, outputs to lib/)
pnpm build

# Development - runs theme + docs dev servers concurrently
pnpm dev

# Lint (eslint + stylelint)
pnpm lint
pnpm lint:fix  # auto-fix

# Run tests (vitest)
pnpm test

# Run a single test file
pnpm test src/path/to/file.spec.ts

# Run tests related to changed files (for pre-commit)
cross-env TZ=Etc/UTC vitest related --run

# Build docs only
pnpm docs:build

# Serve docs locally
pnpm docs:serve

# Release workflow
pnpm release  # runs lint + build + version bump + changelog + git commit
```

## Monorepo Structure

```txt
├── theme/          # Main VuePress theme (vuepress-theme-plume)
├── plugins/        # VuePress plugins
│   ├── plugin-search/    # Full-text fuzzy search
│   ├── plugin-md-power/  # Markdown enhancements
│   └── plugin-fonts/     # Special character font support
├── cli/            # CLI tool (create project scaffolding)
├── docs/           # Documentation site
└── examples/        # Example implementations
    ├── pure-blog/
    └── layout-slots/
```

## Theme Architecture

The theme is organized into three layers:

- **`src/node/`** - Build-time code (runs during `vuepress build/dev`)
  - `prepare/` - Content preparation (frontmatter parsing, collection resolution)
  - `plugins/` - VuePress plugin registration
  - `config/` - Theme configuration handling
  - `autoFrontmatter/` - Automatic frontmatter generation

- **`src/client/`** - Client-side code (runs in browser)
  - `components/` - Vue components
  - `composables/` - Vue composables (outline, search, etc.)
  - `styles/` - CSS/SCSS styles
  - `features/` - Feature-specific components and logic

- **`src/shared/`** - Shared code (used by both node and client)
  - `frontmatter/` - Frontmatter schemas and utilities
  - `locale/` - i18n translations
  - `options.ts` - Theme options types
  - `features/` - Feature flags and shared feature logic

## Build Output

Each package uses [tsdown](https://tsdown.dev/) to compile TypeScript. Build output goes to `lib/`:

- `lib/node/` - Node-side exports
- `lib/client/` - Client-side exports
- `lib/shared/` - Shared exports

The `lib/` directory is gitignored and must be built with `pnpm build`.

## Testing

Tests use Vitest with coverage enabled. Test files are located at `**/__test__/**/*.spec.ts` and are excluded from coverage reports. Run tests with timezone fixed to UTC to ensure consistent results.

## Key Dependencies

- **VuePress**: v2.0.0-rc.28 with @vuepress/bundler-vite
- **Vue**: ^3.5.30
- **Shiki**: ^4.x for syntax highlighting
- **VueUse**: ^14.x for composables
- **markdown-it**: ^14.x for Markdown processing

## Development Notes

- Node.js 20.19.0+ required
- pnpm catalogs are used for dependency management (`dev`, `peer`, `prod`, `vuepress`)
- The theme depends on `vuepress-plugin-md-power` and `@vuepress-plume/plugin-search` as workspace dependencies
- Some peer dependencies are optional (e.g., artplayer, dashjs, three.js)
- Plugins (`plugins/*`) do not have dev commands — changes require `pnpm build` to take effect
- The `lib/` directory is gitignored and must be rebuilt after `pnpm install`
