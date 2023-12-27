import process from 'node:process'
import minimist from 'minimist'

const defaultOptions = {
  s: false,
  shared: false,
  c: false,
  client: false,
  h: false,
  help: false,
}

function normalizeArgv(argv) {
  return {
    name: argv._[0] || '',
    client: argv.client || argv.c,
    shared: argv.shared || argv.s,
    help: argv.h || argv.help,
  }
}

export function getConfig() {
  const argv = Object.assign(
    {},
    defaultOptions,
    minimist(process.argv.slice(2)),
  )
  return normalizeArgv(argv)
}
