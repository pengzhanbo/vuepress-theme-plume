import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

export async function resolveTsPaths(): Promise<Record<string, string[]> | undefined> {
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json')
  try {
    const tsconfig = JSON.parse(await fs.readFile(tsconfigPath, 'utf-8'))
    const paths = tsconfig.compilerOptions?.paths ?? undefined
    const baseUrl = tsconfig.compilerOptions?.baseUrl

    if (baseUrl && paths) {
      const dirname = path.join(process.cwd(), baseUrl)
      for (const key in paths) {
        const value = paths[key]
        if (Array.isArray(value))
          paths[key] = value.map(v => path.resolve(dirname, v))
        else if (value)
          paths[key] = path.resolve(dirname, value)
      }
    }

    return paths
  }
  catch {
    return undefined
  }
}
