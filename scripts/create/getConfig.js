import minimist from 'minimist'

const defaultOptions = {
  s: false,
  shared: false,
  c: false,
  client: false,
  h: false,
  help: false
}

const normalizeArgv = (argv) => {
  return {
    name: argv._[0] || '',
    client: argv.client || argv.c,
    shared: argv.shared || argv.s,
    help: argv.h || argv.help
  }
}

export const getConfig = () => {
  const argv = Object.assign(
    {},
    defaultOptions,
    minimist(process.argv.slice(2))
  )
  return normalizeArgv(argv)
}
