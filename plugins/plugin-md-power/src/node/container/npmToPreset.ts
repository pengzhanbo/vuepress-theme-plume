import type { NpmToPackageManager } from '../../shared/index.js'

/**
 * Package command types
 *
 * 包命令类型
 */
export type PackageCommand = 'install' | 'add' | 'remove' | 'run' | 'create' | 'init' | 'npx' | 'ci'

/**
 * Command config item
 *
 * 命令配置项
 */
export interface CommandConfigItem {
  cli: string
  flags?: Record<string, string>
}

/**
 * Command config for package managers (excluding npm)
 *
 * 包管理器的命令配置（不包括 npm）
 */
export type CommandConfig = Record<Exclude<NpmToPackageManager, 'npm'>, CommandConfigItem | false>

/**
 * Command configs for all package commands
 *
 * 所有包命令的配置
 */
export type CommandConfigs = Record<PackageCommand, { pattern: RegExp } & CommandConfig>

/**
 * Allowed package managers list
 *
 * 允许的包管理器列表
 */
export const ALLOW_LIST = ['npm', 'pnpm', 'yarn', 'bun', 'deno'] as const

/**
 * Boolean flags for npm commands
 *
 * npm 命令的布尔标志
 */
export const BOOL_FLAGS: string[] = ['--no-save', '-B', '--save-bundle', '--save-dev', '-D', '--save-prod', '-P', '--save-peer', '-O', '--save-optional', '-E', '--save-exact', '-y', '--yes', '-g', '--global']

/**
 * Default tabs to display
 *
 * 默认显示的标签
 */
export const DEFAULT_TABS: NpmToPackageManager[] = ['npm', 'pnpm', 'yarn']

/**
 * Package manager configurations
 *
 * 包管理器配置
 */
export const MANAGERS_CONFIG: CommandConfigs = {
  install: {
    pattern: /(?:^|\s)npm\s+(?:install|i)$/,
    pnpm: { cli: 'pnpm install' },
    yarn: { cli: 'yarn' },
    bun: { cli: 'bun install' },
    deno: { cli: 'deno install' },
  },
  add: {
    pattern: /(?:^|\s)npm\s+(?:install|i|add)(?:\s|$)/,
    pnpm: {
      cli: 'pnpm add',
      flags: {
        '--no-save': '', // unsupported
        '-B': '', // unsupported
        '--save-bundle': '', // unsupported
      },
    },
    yarn: {
      cli: 'yarn add',
      flags: {
        '--save-dev': '--dev',
        '--save-prod': '--prod',
        '-P': '', // in npm, `-P` same as `--save-prod`. but in yarn, `-P` same as `--peer`
        '--save-peer': '--peer',
        '--save-optional': '--optional',
        '--no-save': '', // unsupported
        '--save-exact': '--exact',
        '-B': '', // unsupported
        '--save-bundle': '', // unsupported
      },
    },
    bun: {
      cli: 'bun add',
      flags: {
        '--save-dev': '--development',
        '-P': '', // it's default
        '--save-prod': '', // it's default
        '--save-peer': '', // unsupported
        '-O': '--optional',
        '--save-optional': '--optional',
        '--no-save': '', // unsupported
        '--save-exact': '--exact',
        '-B': '', // unsupported
        '--save-bundle': '', // unsupported
      },
    },
    deno: {
      cli: 'deno add',
      flags: {
        '-g': '', // unsupported
        '--global': '', // unsupported
        '--save-dev': '--dev',
        '-P': '', // unsupported
        '--save-prod': '', // unsupported
        '--save-peer': '', // unsupported
        '-O': '', // unsupported
        '--save-optional': '', // unsupported
        '--no-save': '', // unsupported
        '-E': '', // unsupported
        '--save-exact': '', // unsupported
        '-B': '', // unsupported
        '--save-bundle': '', // unsupported
      },
    },
  },
  run: {
    pattern: /(?:^|\s)npm\s+(?:run|run-script|rum|urn)(?:\s|$)/,
    pnpm: {
      cli: 'pnpm',
      flags: {
        '-w': '-F', // same as `--workspace`
        '--workspace': '--filter', // filter by workspaces
        '--': '', // scripts flags
      },
    },
    yarn: {
      cli: 'yarn',
      flags: {
        '-w': '', // unsupported
        '--workspace': '', // unsupported
      },
    },
    bun: {
      cli: 'bun run',
      flags: {
        '-w': '--filter', // same as `--workspace`
        '--workspace': '--filter', // filter by workspaces
      },
    },
    deno: {
      cli: 'deno run',
      flags: {
        '-w': '', // unsupported
        '--workspace': '', // unsupported
      },
    },
  },
  create: {
    pattern: /(?:^|\s)npm\s+create\s/,
    pnpm: { cli: 'pnpm create', flags: { '-y': '', '--yes': '' } },
    yarn: { cli: 'yarn create', flags: { '-y': '', '--yes': '' } },
    bun: { cli: 'bun create', flags: { '-y': '', '--yes': '' } },
    deno: { cli: 'deno run -A ', flags: { '-y': '', '--yes': '' } },
  },
  init: {
    pattern: /(?:^|\s)npm\s+init/,
    pnpm: { cli: 'pnpm init', flags: { '-y': '', '--yes': '' } },
    yarn: { cli: 'yarn init', flags: { '-y': '', '--yes': '' } },
    bun: { cli: 'bun init', flags: { '-y': '', '--yes': '' } },
    deno: { cli: 'deno init', flags: { '-y': '', '--yes': '' } },
  },
  npx: {
    pattern: /(?:^|\s)npx\s+/,
    pnpm: { cli: 'pnpm dlx' },
    yarn: { cli: 'yarn dlx' },
    bun: { cli: 'bunx' },
    deno: { cli: 'deno run -A' },
  },
  remove: {
    pattern: /(?:^|\s)npm\s+(?:uninstall|r|rm|remove|unlink|un)(?:\s|$)/,
    pnpm: {
      cli: 'pnpm remove',
      flags: { '--no-save': '', '--save': '', '-S': '' },
    },
    yarn: {
      cli: 'yarn remove',
      flags: { '--save-dev': '--dev', '--save': '', '-S': '', '-g': '', '--global': '' },
    },
    bun: {
      cli: 'bun remove',
      flags: { '--save-dev': '--development', '--save': '', '-S': '', '-g': '', '--global': '' },
    },
    deno: {
      cli: 'deno uninstall',
      flags: { '--save-dev': '--dev', '--save': '', '-S': '' },
    },
  },
  ci: {
    pattern: /(?:^|\s)npm\s+ci$/,
    pnpm: { cli: 'pnpm install --frozen-lockfile' },
    yarn: { cli: 'yarn install --immutable' },
    bun: { cli: 'bun install --frozen-lockfile' },
    deno: { cli: 'deno install --frozen' },
  },
}
