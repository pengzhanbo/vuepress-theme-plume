import process from 'node:process'
import { parseArgs } from 'node:util'

interface ArgvOptions {
  client: boolean
  node: boolean
}

const rawArgv = process.argv.slice(2)
const tsupArgv = rawArgv.includes('--') ? rawArgv.slice(rawArgv.indexOf('--') + 1) : []

const parsed = tsupArgv.length
  ? parseArgs({
    args: tsupArgv,
    options: {
      client: { type: 'boolean', short: 'c' },
      node: { type: 'boolean', short: 'n' },
      all: { type: 'boolean', short: 'a', default: false },
    },
    allowPositionals: true,
  }).values
  : { all: true }

export const argv: ArgvOptions = {
  client: parsed.client || parsed.all,
  node: parsed.node || parsed.all,
}
