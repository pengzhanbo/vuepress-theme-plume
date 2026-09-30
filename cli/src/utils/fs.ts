import type { File } from '../types.js'
import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * Read all files from a directory recursively
 *
 * 递归读取目录下的所有文件
 *
 * @param dir - Root directory path to read from / 要读取的根目录路径
 * @returns Array of file objects / 文件对象数组
 */
export async function readFiles(dir: string): Promise<File[]> {
  const filepaths = await fs.readdir(dir, { recursive: true })
  const files: File[] = []
  for (const file of filepaths) {
    const filepath = path.join(dir, file)
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
 * Result of writing files.
 *
 * 文件写入结果。
 */
export interface WriteFilesResult {
  /**
   * Absolute paths of the files that were written.
   *
   * 已写入文件的绝对路径。
   */
  written: string[]
  /**
   * Absolute paths of the existing files that were skipped.
   *
   * 因已存在而被跳过的文件绝对路径。
   */
  skipped: string[]
}

/**
 * Check whether a path already exists.
 *
 * 检查路径是否已存在。
 *
 * @param filepath - Path to check / 要检查的路径
 * @returns Whether the path exists / 路径是否存在
 */
async function exists(filepath: string): Promise<boolean> {
  try {
    await fs.access(filepath)
    return true
  }
  catch {
    return false
  }
}

/**
 * Write files to target directory
 *
 * Existing files are skipped by default to avoid silently overwriting the
 * user's data. Pass `force` to overwrite everything, or set `overwrite` on a
 * single file for files that are intentionally merged with the user's content.
 *
 * 将文件写入目标目录
 *
 * 默认跳过已存在的文件，避免静默覆盖用户数据。传入 `force` 可覆盖全部文件；
 * 对需要与用户内容合并的单个文件，可设置其 `overwrite` 为 `true`。
 *
 * @param files - Array of file objects to write / 要写入的文件对象数组
 * @param target - Target directory path / 目标目录路径
 * @param force - Whether to overwrite existing files / 是否覆盖已存在的文件
 * @returns Written and skipped file paths / 已写入与被跳过的文件路径
 */
export async function writeFiles(
  files: File[],
  target: string,
  force = false,
): Promise<WriteFilesResult> {
  const written: string[] = []
  const skipped: string[] = []

  for (const { filepath, content, overwrite } of files) {
    const file = path.join(target, filepath).replace(/\.tpl$/, '')
    if (!force && !overwrite && await exists(file)) {
      skipped.push(file)
      continue
    }
    await fs.mkdir(path.dirname(file), { recursive: true })
    await fs.writeFile(file, content)
    written.push(file)
  }

  return { written, skipped }
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
