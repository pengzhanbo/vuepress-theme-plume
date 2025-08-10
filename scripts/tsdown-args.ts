import process from 'node:process'
import minimist from 'minimist'

interface ArgvOptions {
  client: boolean
  node: boolean
}

const rawArgv = process.argv.slice(2)
const tsupArgv = rawArgv.includes('--') ? rawArgv.slice(rawArgv.indexOf('--') + 1) : []

const parsed = tsupArgv.length
  ? minimist(tsupArgv, {
      boolean: ['client', 'node', 'all'],
      alias: {
        client: 'c',
        node: 'n',
        all: 'a',
      },
    })
  : {
      client: true,
      node: true,
      all: true,
    }

export const argv: ArgvOptions = {
  client: parsed.client || parsed.all,
  node: parsed.node || parsed.all,
}
