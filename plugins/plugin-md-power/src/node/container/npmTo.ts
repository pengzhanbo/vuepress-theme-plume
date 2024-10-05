/**
 * ::: npm-to
 * ``` sh
 * npm i -D vuepress-theme-plume
 * ```
 * :::
 */
import type Token from 'markdown-it/lib/token.mjs'
import type { Markdown } from 'vuepress/markdown'
import container from 'markdown-it-container'
import { resolveAttrs } from '../utils/resolveAttrs.js'

type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun' | 'deno'
type PackageCommand = 'install' | 'add' | 'remove' | 'run' | 'create' | 'npx'
interface CommandConfigItem {
  cmd: string
  flags?: Record<string, string>
}
type CommandConfig = Record<Exclude<PackageManager, 'npm'>, CommandConfigItem | false>
type CommandConfigs = Record<PackageCommand, { pattern: RegExp } & CommandConfig>

const ALLOW_LIST = ['npm', 'pnpm', 'yarn', 'bun', 'deno'] as const
const DEFAULT_TABS: PackageManager[] = ['npm', 'pnpm', 'yarn']

const MANAGERS_CONFIG: CommandConfigs = {
  install: {
    pattern: /(?:^|\s)(npm\s+(?:install|i))$/,
    pnpm: { cmd: 'pnpm install' },
    yarn: { cmd: 'yarn install' },
    bun: { cmd: 'bun install' },
    deno: { cmd: 'deno install' },
  },
  add: {
    pattern: /(?:^|\s)(npm\s+(?:install|i|add))(?:\s|$)/,
    pnpm: {
      cmd: 'pnpm add',
      flags: {
        '--no-save': '', // unsupported
        '-B': '', // unsupported
        '--save-bundle': '', // unsupported
      },
    },
    yarn: {
      cmd: 'yarn add',
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
      cmd: 'bun add',
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
      cmd: 'deno add',
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
    pattern: /(?:^|\s)(npm\s+(?:run|run-script|rum|urn))(?:\s|$)/,
    pnpm: {
      cmd: 'pnpm',
      flags: {
        '-w': '-F', // same as `--workspace`
        '--workspace': '--filter', // filter by workspaces
        '--': '', // scripts flags
      },
    },
    yarn: {
      cmd: 'yarn',
      flags: {
        '-w': '', // unsupported
        '--workspace': '', // unsupported
      },
    },
    bun: {
      cmd: 'bun run',
      flags: {
        '-w': '--filter', // same as `--workspace`
        '--workspace': '--filter', // filter by workspaces
      },
    },
    deno: {
      cmd: 'deno run',
      flags: {
        '-w': '', // unsupported
        '--workspace': '', // unsupported
      },
    },
  },
  create: {
    pattern: /(?:^|\s)(npm\s+create\s)/,
    pnpm: {
      cmd: 'pnpm create ',
      flags: { '-y': '', '--yes': '' },
    },
    yarn: {
      cmd: 'yarn dlx create-',
      flags: { '-y': '', '--yes': '' },
    },
    bun: {
      cmd: 'bun create ',
      flags: { '-y': '', '--yes': '' },
    },
    deno: {
      cmd: 'deno run -A ',
      flags: { '-y': '', '--yes': '' },
    },
  },
  npx: {
    pattern: /npx\s+/,
    pnpm: false,
    yarn: false,
    bun: false,
    deno: false,
    // pnpm: 'pnpm dlx',
    // yarn: 'yarn dlx',
    // bun: 'bunx',
    // deno: false,
  },
  remove: {
    pattern: /npm\s+(?:uninstall|r|rm|remove|unlink|un)(?:\s|$)/,
    pnpm: false,
    yarn: false,
    bun: false,
    deno: false,
    // pnpm: 'pnpm remove',
    // yarn: 'yarn remove',
    // bun: 'bun remove',
    // deno: 'deno uninstall',
  },
}

export function npmToPlugins(md: Markdown): void {
  const type = 'npm-to'
  const validate = (info: string): boolean => info.trim().startsWith(type)

  const render = (tokens: Token[], idx: number): string => {
    const { attrs } = resolveAttrs(tokens[idx].info.slice(type.length - 1))
    const tabs = (attrs.tabs ? attrs.tabs.split(/,\s*/) : DEFAULT_TABS) as PackageManager[]
    if (tokens[idx].nesting === 1) {
      const token = tokens[idx + 1]
      const info = token.info.trim()
      if (
        token.type === 'fence'
        && (info.startsWith('sh') || info.startsWith('bash') || info.startsWith('shell'))
      ) {
        const content = token.content
        token.hidden = true
        token.type = 'text'
        token.content = ''
        const lines = content.split(/(\n|\s*&&\s*)/)
        return md.render(resolveNpmTo(lines, info, idx, tabs), {})
      }
    }
    return ''
  }

  md.use(container, type, { validate, render })
}

function resolveNpmTo(lines: string[], info: string, idx: number, tabs: PackageManager[]): string {
  tabs = validateTabs(tabs)
  const res: string[] = []
  for (const tab of tabs) {
    const newLines: string[] = []
    for (const line of lines) {
      const config = findConfig(line)
      if (config && config[tab]) {
        const { pattern, ...pm } = config
        const { cmd, flags } = pm[tab] as CommandConfigItem
        let newLine = line.replace(pattern, (match, npmCmd) => match.replace(npmCmd, cmd))
        for (const [key, value] of Object.entries(flags || {})) {
          newLine = newLine.replaceAll(key, value)
        }
        newLines.push(newLine)
      }
      else {
        newLines.push(line)
      }
    }
    res.push(`@tab ${tab}\n\`\`\`${info}\n${newLines.join('')}\n\`\`\``)
  }
  return `:::code-tabs#npm-to-${idx}\n${res.join('\n')}\n:::`
}

function findConfig(line: string): CommandConfig & { pattern: RegExp } | undefined {
  for (const config of Object.values(MANAGERS_CONFIG)) {
    if (config.pattern.test(line)) {
      return config
    }
  }
  return undefined
}

function validateTabs(tabs: PackageManager[]): PackageManager[] {
  if (tabs.length === 0) {
    return DEFAULT_TABS
  }
  return tabs.filter(tab => ALLOW_LIST.includes(tab))
}

export function parseLine(line: string) {
  const index = line.indexOf('npm')
  const prefix = index > 0 ? line.slice(0, index) : ''
  line = index > 0 ? line.slice(index) : line
  const words = line.split(/\s+/)
  const cmd = words.slice(0, 2).join(' ')
  const packages: string[] = []
  let i = 2
  for (; i < words.length; i++) {
    const p = words[i]
    if (p.startsWith('-')) {
      break
    }
    else {
      packages.push(p)
    }
  }
  const [npmFlags, scriptFlags] = words.slice(i).join(' ').split(/\s+--\s+/)

  return { prefix, cmd, packages, npmFlags, scriptFlags }
}
