import { Buffer } from 'node:buffer'
import process from 'node:process'
import { fs, getDirname, path } from 'vuepress/utils'
import dotenv from 'dotenv'
import { execa } from 'execa'
import * as portFinder from 'portfinder'
import type { NetlifyFunctionsPluginOptions } from '../../shared/index.js'

const __dirname = getDirname(import.meta.url)

function loadEnvConfig(): Record<string, string | undefined> {
  const configPath = path.resolve(process.cwd(), '.env')
  if (!fs.existsSync(configPath))
    return {}

  try {
    const content = fs.readFileSync(configPath, 'utf-8')
    return dotenv.parse(Buffer.from(content))
  }
  catch {
    return {}
  }
}

export interface NetlifyServe {
  host: string
  close: () => void
}
export async function netlifyServe({
  directory,
}: NetlifyFunctionsPluginOptions): Promise<NetlifyServe> {
  const port = await portFinder.getPortPromise({ port: 9000 })

  const argv = [
    'functions:serve',
    '--port',
    `${port}`,
    '--functions',
    path.join('./', path.relative(process.cwd(), directory.temp)),
    // '--debug',
  ]

  const { stdout, kill } = execa(
    path.resolve(__dirname, '../../../node_modules/.bin/netlify'),
    argv,
    {
      cwd: process.cwd(),
      env: {
        ...loadEnvConfig(),
      },
    },
  )
  stdout?.pipe(process.stdout)

  return {
    host: `http://localhost:${port}`,
    close: () => kill(),
  }
}
