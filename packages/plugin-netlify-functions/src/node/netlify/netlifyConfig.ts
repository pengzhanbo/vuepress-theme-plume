import type { JsonMap } from '@iarna/toml'
import { parse, stringify } from '@iarna/toml'
import type { App } from '@vuepress/core'
import { fs, path } from '@vuepress/utils'
import type { NetlifyFunctionsPluginOptions } from '../../shared'

export interface NetlifyConfig {
  functions: Record<string, any>
  redirects: Record<string, any>[]
}

const configName = 'netlify.toml'

const readConfig = (filepath: string): NetlifyConfig => {
  let netlifyConfig = ''
  if (fs.existsSync(filepath)) {
    netlifyConfig = fs.readFileSync(filepath, 'utf-8') || ''
  }
  return (parse(netlifyConfig) as unknown as NetlifyConfig) || {}
}

const writeConfig = (filepath: string, netlifyConfig: NetlifyConfig): void => {
  fs.writeFileSync(
    filepath,
    stringify(netlifyConfig as unknown as JsonMap),
    'utf-8'
  )
}

const resolveFunctions = (
  config: NetlifyConfig,
  { directory }: NetlifyFunctionsPluginOptions,
  app: App
): void => {
  const functions = (config.functions = config.functions || {})
  functions.directory =
    functions.directory || path.relative(app.dir.dest('../'), directory.dest)
}

const resolveRedirects = (
  config: NetlifyConfig,
  { proxyPrefix }: NetlifyFunctionsPluginOptions
): void => {
  const funcDir = '/' + (config.functions.directory || '').replace(/^\//, '')
  const redirects = (config.redirects = config.redirects || [])
  if (!redirects.some((redirect) => redirect?.to?.startsWith(funcDir))) {
    redirects.push({
      from: path.join('/', proxyPrefix, '*'),
      to: path.join(funcDir, ':splat'),
      status: 200,
      force: true,
      Headers: {
        'X-From': 'Netlify',
      },
    })
  }
}

export const generateNetlifyConfig = (
  app: App,
  options: NetlifyFunctionsPluginOptions
): NetlifyConfig => {
  const configPath = path.join(process.cwd(), configName)
  const config = readConfig(configPath)

  resolveFunctions(config, options, app)
  resolveRedirects(config, options)

  writeConfig(configPath, config)
  return config
}
