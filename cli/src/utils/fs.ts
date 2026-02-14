import type { File } from '../types.js'
import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * Read all files from a directory recursively
 *
 * 递归读取目录下的所有文件
 *
 * @param root - Root directory path to read from / 要读取的根目录路径
 * @returns Array of file objects / 文件对象数组
 */
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

/**
 * Write files to target directory
 *
 * 将文件写入目标目录
 *
 * @param files - Array of file objects to write / 要写入的文件对象数组
 * @param target - Target directory path / 目标目录路径
 * @param rewrite - Optional function to rewrite file paths / 可选的文件路径重写函数
 */
export async function writeFiles(
  files: File[],
  target: string,
  rewrite?: (path: string) => string,
): Promise<void> {
  for (const { filepath, content } of files) {
    let root = path.join(target, filepath).replace(/\.handlebars$/, '')
    if (rewrite)
      root = rewrite(root)
    await fs.mkdir(path.dirname(root), { recursive: true })
    await fs.writeFile(root, content)
  }
}

/**
 * Read and parse JSON file
 *
 * 读取并解析 JSON 文件
 *
 * @param filepath - Path to JSON file / JSON 文件路径
 * @returns Parsed JSON object or null if parsing fails / 解析后的 JSON 对象，解析失败返回 null
 */
export async function readJsonFile<T extends Record<string, any> = Record<string, any>>(filepath: string): Promise<T | null> {
  try {
    const content = await fs.readFile(filepath, 'utf-8')
    return JSON.parse(content)
  }
  catch {
    return null
  }
}
