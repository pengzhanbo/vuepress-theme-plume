/**
 * 只写一个 npm 代码块，自动转为 代码块分组 [npm, pnpm, yarn, bun, deno]
 *
 * ::: npm-to
 * ``` sh
 * npm i -D vuepress-theme-plume
 * ```
 * :::
 * ↓ ↓ ↓ ↓ ↓
 * ::: code-tabs
 * @tab npm
 * ```sh
 * npm i -D vuepress-theme-plume
 * ```
 * @tab pnpm
 * ```sh
 * pnpm add -D vuepress-theme-plume
 * ```
 * @tab yarn
 * ```sh
 * yarn add -D vuepress-theme-plume
 * ```
 * :::
 */
import type Token from 'markdown-it/lib/token.mjs'
import type { Markdown } from 'vuepress/markdown'
import type { NpmToOptions, NpmToPackageManager } from '../../shared/index.js'
import { isArray } from '@vuepress/helper'
import container from 'markdown-it-container'
import { resolveAttrs } from '../utils/resolveAttrs.js'

type PackageCommand = 'install' | 'add' | 'remove' | 'run' | 'create' | 'init' | 'npx' | 'ci'
interface CommandConfigItem {
  cli: string
  flags?: Record<string, string>
}
type CommandConfig = Record<Exclude<NpmToPackageManager, 'npm'>, CommandConfigItem | false>
type CommandConfigs = Record<PackageCommand, { pattern: RegExp } & CommandConfig>

const ALLOW_LIST = ['npm', 'pnpm', 'yarn', 'bun', 'deno'] as const
const BOOL_FLAGS: string[] = ['--no-save', '-B', '--save-bundle', '--save-dev', '-D', '--save-prod', '-P', '--save-peer', '-O', '--save-optional', '-E', '--save-exact', '-y', '--yes', '-g', '--global']

const DEFAULT_TABS: NpmToPackageManager[] = ['npm', 'pnpm', 'yarn']

const MANAGERS_CONFIG: CommandConfigs = {
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

export function npmToPlugins(md: Markdown, options: NpmToOptions = {}): void {
  const type = 'npm-to'

  const opt = isArray(options) ? { tabs: options } : options
  const defaultTabs = opt.tabs?.length ? opt.tabs : DEFAULT_TABS

  const render = (tokens: Token[], idx: number): string => {
    const { attrs } = resolveAttrs(tokens[idx].info.trim().slice(type.length))
    const tabs = (attrs.tabs ? attrs.tabs.split(/,\s*/) : defaultTabs) as NpmToPackageManager[]
    if (tokens[idx].nesting === 1) {
      const token = tokens[idx + 1]
      const info = token.info.trim()
      if (token.type === 'fence') {
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

  md.use(container, type, { render })
}

function resolveNpmTo(lines: string[], info: string, idx: number, tabs: NpmToPackageManager[]): string {
  tabs = validateTabs(tabs)
  const res: string[] = []
  const map: Record<string, LineParsed | false> = {}
  for (const tab of tabs) {
    const newLines: string[] = []
    for (const line of lines) {
      const config = findConfig(line)
      if (config && config[tab]) {
        const parsed = (map[line] ??= parseLine(line)) as LineParsed
        const { cli, flags } = config[tab] as CommandConfigItem

        let newLine = `${parsed.env ? `${parsed.env} ` : ''}${cli}`
        if (parsed.args && flags) {
          let args = parsed.args
          for (const [key, value] of Object.entries(flags)) {
            args = args.replaceAll(key, value)
          }
          newLine += ` ${args.replace(/\s+-/g, ' -').trim()}`
        }

        if (parsed.cmd)
          newLine += ` ${parsed.cmd}`

        if (parsed.scriptArgs)
          newLine += ` ${parsed.scriptArgs}`
        newLines.push(newLine.trim())
      }
      else {
        newLines.push(line)
      }
    }
    res.push(`@tab ${tab}\n\`\`\`${info}\n${newLines.join('')}\n\`\`\``)
  }
  return `:::code-tabs#npm-to-${idx}\n${res.join('\n')}\n:::`
}

function findConfig(line: string): CommandConfig | undefined {
  for (const { pattern, ...config } of Object.values(MANAGERS_CONFIG)) {
    if (pattern.test(line)) {
      return config
    }
  }
  return undefined
}

function validateTabs(tabs: NpmToPackageManager[]): NpmToPackageManager[] {
  tabs = tabs.filter(tab => ALLOW_LIST.includes(tab))
  if (tabs.length === 0) {
    return DEFAULT_TABS
  }
  return tabs
}

interface LineParsed {
  env: string
  cli: string
  cmd: string
  args?: string
  scriptArgs?: string
}

const LINE_REG = /(.*)(npm|npx)\s+(.*)/
export function parseLine(line: string): false | LineParsed {
  const match = line.match(LINE_REG)
  if (!match)
    return false

  const [, env, cli, rest] = match
  const idx = rest.trim().indexOf(' ')
  if (cli === 'npx') {
    let cmd = ''
    let scriptArgs = ''
    if (idx !== -1) {
      cmd = rest.slice(0, idx)
      scriptArgs = rest.slice(idx + 1).trim()
    }
    else {
      cmd = rest
    }
    return { env, cli, cmd, scriptArgs }
  }

  if (idx === -1)
    return { env, cli: `${cli} ${rest.trim()}`, cmd: '' }

  return { env, cli: `${cli} ${rest.slice(0, idx)}`, ...parseArgs(rest.slice(idx + 1)) }
}

function parseArgs(line: string): { cmd: string, args?: string, scriptArgs?: string } {
  line = line?.trim()

  const [npmArgs, scriptArgs] = line.split(/\s+--\s+/)
  let cmd = ''
  let args = ''
  if (npmArgs[0] !== '-') {
    if (npmArgs[0] === '"' || npmArgs[0] === '\'') {
      const idx = npmArgs.slice(1).indexOf(npmArgs[0])
      cmd = npmArgs.slice(0, idx + 2)
      args = npmArgs.slice(idx + 2)
    }
    else {
      const idx = npmArgs.indexOf(' -')
      if (idx === -1) {
        cmd = npmArgs
      }
      else {
        cmd = npmArgs.slice(0, idx)
        args = npmArgs.slice(idx + 1)
      }
    }
  }
  else {
    let newLine = ''
    let value = ''
    let isQuote = false
    let isBool = false
    let isNextValue = false
    let quote = ''
    for (let i = 0; i < npmArgs.length; i++) {
      const v = npmArgs[i]
      if (!isQuote && (v === '"' || v === '\'')) {
        quote = v
        isQuote = true
        value += v
      }
      else if (isQuote && v === quote) {
        isQuote = false
        value += v
      }
      else if ((v === ' ' || v === '=' || i === npmArgs.length - 1) && !isQuote && value) {
        if (i === npmArgs.length - 1) {
          value += v
        }

        const isKey = value[0] === '-'
        if (isKey) {
          isBool = BOOL_FLAGS.includes(value)
          isNextValue = !isBool
        }
        if (!isKey && !isNextValue) {
          cmd += `${value}`
        }
        else {
          newLine += `${value}${i !== npmArgs.length - 1 ? v : ''}`
          if (!isKey && isNextValue) {
            isNextValue = false
          }
        }
        value = ''
      }
      else {
        value += v
      }
    }
    args = newLine
  }

  return { cmd: cmd.trim(), args: args.trim(), scriptArgs }
}
