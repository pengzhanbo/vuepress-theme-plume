import type { File } from '../types.js'
import fs from 'node:fs/promises'
import path from 'node:path'

export async function readFiles(root: string): Promise<File[]> {
  const filepaths = await fs.readdir(root, { recursive: true })
  const files: File[] = []
  for (const file of filepaths) {
    const filepath = path.join(root, file)
    if ((await fs.stat(filepath)).isFile()) {
      files.push({
        filepath: file,
        content: await fs.readFile(filepath, 'utf-8'),
      })
    }
  }

  return files
}

export async function writeFiles(
  files: File[],
  target: string,
  rewrite?: (path: string) => string,
) {
  for (const { filepath, content } of files) {
    let root = path.join(target, filepath).replace(/\.handlebars$/, '')
    if (rewrite)
      root = rewrite(root)
    await fs.mkdir(path.dirname(root), { recursive: true })
    await fs.writeFile(root, content)
  }
}

export async function readJsonFile<T extends Record<string, any> = Record<string, any>>(filepath: string): Promise<T | null> {
  try {
    const content = await fs.readFile(filepath, 'utf-8')
    return JSON.parse(content)
  }
  catch {
    return null
  }
}
