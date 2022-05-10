import { fs, path } from '@vuepress/utils'
import dotenv from 'dotenv'
import * as execa from 'execa'
import * as portFinder from 'portfinder'
import type { NetlifyFunctionsPluginOptions } from '../../shared'

const loadEnvConfig = (): Record<string, string | undefined> => {
  const configPath = path.resolve(process.cwd(), '.env')
  if (!fs.existsSync(configPath)) {
    return {}
  }
  try {
    const content = fs.readFileSync(configPath, 'utf-8')
    return dotenv.parse(Buffer.from(content))
  } catch {
    return {}
  }
}

export interface NetlifyServe {
  host: string
  cancel: () => void
}
export const netlifyServe = async ({
  directory,
}: NetlifyFunctionsPluginOptions): Promise<NetlifyServe> => {
  const port = await portFinder.getPortPromise({ port: 9000 })

  const argv = [
    'functions:serve',
    '--port',
    port + '',
    '--functions',
    path.join('./', path.relative(process.cwd(), directory.temp)),
    // '--debug',
  ]

  const { stdout, cancel } = execa(
    path.resolve(__dirname, '../../../node_modules/.bin/netlify'),
    argv,
    {
      cwd: process.cwd(),
      env: {
        ...loadEnvConfig(),
      },
    }
  )
  stdout?.pipe(process.stdout)

  return {
    host: 'http://localhost:' + port,
    cancel,
  }
}
