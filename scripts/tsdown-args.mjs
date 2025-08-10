import process from 'node:process'
import minimist from 'minimist'

// interface ArgvOptions {
//   client: boolean
//   node: boolean
// }

/**
 * @typedef {object} ArgvOptions
 * @property {boolean} client - 是否构建客户端
 * @property {boolean} node - 是否构建 node 端
 */

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

/** @type {ArgvOptions} */
export const argv = {
  client: parsed.client || parsed.all,
  node: parsed.node || parsed.all,
}
