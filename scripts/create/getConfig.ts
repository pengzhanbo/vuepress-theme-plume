import minimist from 'minimist'

export type ConfigOptions = {
  client: boolean
  shared: boolean
  help: boolean
  name: string
}

export type ArgvOptions = {
  _ : string[]
  c: boolean
  h: boolean
  s: boolean
} & ConfigOptions

const defaultOptions: Partial<ArgvOptions> = {
  s: false,
  shared: false,
  c: false,
  client: false,
  h: false,
  help: false
}

const normalizeArgv = (argv: ArgvOptions): ConfigOptions => {
  return {
    name: argv._[0] || '',
    client: argv.client || argv.c,
    shared: argv.shared || argv.s,
    help: argv.h || argv.help
  }
}

export const getConfig = (): ConfigOptions => {
  const argv: ArgvOptions = Object.assign(
    {},
    defaultOptions,
    minimist(process.argv.slice(2)) as ArgvOptions
  )
  return normalizeArgv(argv)
}
