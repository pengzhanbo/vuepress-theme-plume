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
- `plugin-replace-assets`: Provides resource link replacement functionality
- `plugin-fonts`: Provides special character font support

## Development Configuration

Development requirements:

- [Node.js](http://nodejs.org/) version 20.6.0+
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

The `build` command uses `tsc` to compile the source code into `.js` files in the `lib` directory.
It also copies resources that do not need to be compiled to the corresponding `lib` directory.

After cloning the repository, you need to run this command first to ensure that the project code
can run smoothly, as the compiled output directory is excluded from the repository by `.gitignore`.

#### `pnpm dev`

The `dev` command starts two services locally. One runs the `tsup:watch & copy:watch` for
the `theme` directory, and the other runs the `vuepress` development service for the example `docs` directory.

By default, all plugins under the `plugins` directory do not have a `dev` command.
Therefore, changes to the `plugins` directory may require running the `pnpm build` command to rebuild.
Some changes to the `plugins/**/node` directory require re-running `pnpm dev` to take effect.

#### `pnpm lint`

The `lint` command uses ESLint to check all source files.

When `lint` reports errors, you can manually modify the source code to fix the ESLint errors, or run `pnpm lint:fix` to automatically fix them.

#### `pnpm test`

The `test` command uses Vitest to run all tests.

### IDE Support

It is recommended to use `vs code` for development. This repository is configured with
the recommended `vs code` extensions for developing this theme. When you import this repository,
`vs code` may recommend that you install some extensions.
