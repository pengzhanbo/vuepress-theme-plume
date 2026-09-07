import process from 'node:process'
import { parseArgs } from 'node:util'

interface ArgvOptions {
  client: boolean
  node: boolean
}

const rawArgv = process.argv.slice(2)
const args = rawArgv.includes('--') ? rawArgv.slice(rawArgv.indexOf('--') + 1) : []

const parsed = args.length
  ? parseArgs({
    args,
    options: {
      client: { type: 'boolean', short: 'c' },
      node: { type: 'boolean', short: 'n' },
      all: { type: 'boolean', short: 'a', default: false },
    },
    allowPositionals: true,
  }).values
  : { all: true } as ArgvOptions & { all: boolean }

export const argv: ArgvOptions = {
  client: parsed.client || parsed.all,
  node: parsed.node || parsed.all,
}
