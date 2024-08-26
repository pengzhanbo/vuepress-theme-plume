import path from 'node:path'
import fs from 'node:fs'
import fastGlob from 'fast-glob'
import type { File } from '../types.js'

export async function readFiles(dir: string): Promise<File[]> {
  const filepaths = await fastGlob('**/*', { cwd: dir, dot: true })
  const files: File[] = []
  for (const filepath of filepaths) {
    files.push({
      filepath,
      content: await fs.promises.readFile(path.join(dir, filepath), 'utf-8'),
    })
  }

  return files
}

export async function writeFiles(files: File[], targetDir: string) {
  for (const { filepath, content } of files) {
    const target = path.join(targetDir, filepath).replace(/\.handlebars$/, '')
    await fs.promises.mkdir(path.dirname(target), { recursive: true })
    await fs.promises.writeFile(target, content)
  }
}

export async function readJsonFile<T extends Record<string, any> = Record<string, any>>(filepath: string): Promise<T | null> {
  try {
    const content = await fs.promises.readFile(filepath, 'utf-8')
    return JSON.parse(content)
  }
  catch {
    return null
  }
}
