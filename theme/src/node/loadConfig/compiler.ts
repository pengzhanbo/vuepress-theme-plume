import type { ThemeConfig } from '../types.js'
import { promises as fsp } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { pathToFileURL } from 'node:url'
import { build } from 'esbuild'
import { importFileDefault } from 'vuepress/utils'
import { hash } from '../utils/index.js'

export async function compiler(configPath?: string,
): Promise<{
    config: ThemeConfig
    dependencies: string[]
  }> {
  if (!configPath) {
    return { config: {}, dependencies: [] }
  }

  const dirnameVarName = '__vite_injected_original_dirname'
  const filenameVarName = '__vite_injected_original_filename'
  const importMetaUrlVarName = '__vite_injected_original_import_meta_url'
  const result = await build({
    absWorkingDir: process.cwd(),
    entryPoints: [configPath],
    outfile: 'out.js',
    write: false,
    target: [`node${process.versions.node}`],
    platform: 'node',
    bundle: true,
    format: 'esm',
    mainFields: ['main'],
    sourcemap: 'inline',
    metafile: true,
    define: {
      '__dirname': dirnameVarName,
      '__filename': filenameVarName,
      'import.meta.url': importMetaUrlVarName,
      'import.meta.dirname': dirnameVarName,
      'import.meta.filename': filenameVarName,
    },
    plugins: [
      {
        name: 'externalize-deps',
        setup(build) {
          build.onResolve({ filter: /.*/ }, ({ path: id }) => {
            // externalize bare imports
            if (id[0] !== '.' && !path.isAbsolute(id)) {
              return { external: true }
            }
            return null
          })
        },
      },
      {
        name: 'inject-file-scope-variables',
        setup(build) {
          build.onLoad({ filter: /\.[cm]?[jt]s$/ }, async (args) => {
            const contents = await fsp.readFile(args.path, 'utf-8')
            const injectValues
                = `const ${dirnameVarName} = ${JSON.stringify(
                  path.dirname(args.path),
                )};`
                + `const ${filenameVarName} = ${JSON.stringify(args.path)};`
                + `const ${importMetaUrlVarName} = ${JSON.stringify(
                  pathToFileURL(args.path).href,
                )};`

            return {
              loader: args.path.endsWith('ts') ? 'ts' : 'js',
              contents: injectValues + contents,
            }
          })
        },
      },
    ],
  })

  const { text } = result.outputFiles[0]
  const tempFilePath = `${configPath}.${hash(text)}.mjs`
  let config: ThemeConfig
  try {
    await fsp.writeFile(tempFilePath, text)
    config = await importFileDefault(tempFilePath)
  }
  finally {
    await fsp.rm(tempFilePath)
  }
  return {
    config,
    dependencies: Object.keys(result.metafile?.inputs ?? {}),
  }
}
