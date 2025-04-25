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
import type { Markdown, MarkdownEnv } from 'vuepress/markdown'
import type { NpmToOptions, NpmToPackageManager } from '../../shared/index.js'
import type { CommandConfig, CommandConfigItem } from './npmToPreset.js'
import { isArray } from '@vuepress/helper'
import { colors } from 'vuepress/utils'
import { cleanMarkdownEnv } from '../utils/cleanMarkdownEnv.js'
import { resolveAttrs } from '../utils/resolveAttrs.js'
import { createContainerPlugin } from './createContainer.js'
import { ALLOW_LIST, BOOL_FLAGS, DEFAULT_TABS, MANAGERS_CONFIG } from './npmToPreset.js'

export function npmToPlugins(md: Markdown, options: NpmToOptions = {}): void {
  const opt = isArray(options) ? { tabs: options } : options
  const defaultTabs = opt.tabs?.length ? opt.tabs : DEFAULT_TABS

  createContainerPlugin(md, 'npm-to', {
    before: (info, tokens, idx, _opt, env: MarkdownEnv) => {
      const { attrs } = resolveAttrs<{ tabs?: string }>(info)
      const tabs = (attrs.tabs ? attrs.tabs.split(/,\s*/) : defaultTabs) as NpmToPackageManager[]
      const token = tokens[idx + 1]
      if (token.type === 'fence') {
        const content = token.content
        token.hidden = true
        token.type = 'text'
        token.content = ''
        const lines = content.split(/(\n|\s*&&\s*)/)
        return md.render(
          resolveNpmTo(lines, token.info.trim(), idx, tabs),
          cleanMarkdownEnv(env),
        )
      }
      console.warn(`${colors.yellow('[vuepress-plugin-md-power]')} Invalid npm-to container in ${colors.gray(env.filePathRelative || env.filePath)}`)
      return ''
    },
    after: () => '',
  })
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
  return `:::code-tabs#npm-to-${tabs.join('-')}\n${res.join('\n')}\n:::`
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
          cmd += ` ${value}`
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
