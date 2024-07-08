/**
 * 仅内容发生变更时，才写入临时文件
 */
import type { App } from 'vuepress'
import { hash } from './hash.js'

export const contentHash: Map<string, string> = new Map()

export async function writeTemp(
  app: App,
  filepath: string,
  content: string,
): Promise<void> {
  const currentHash = hash(content)
  if (!contentHash.has(filepath) || contentHash.get(filepath) !== currentHash) {
    contentHash.set(filepath, currentHash)
    await app.writeTemp(filepath, content)
  }
}

export function setContentHash(filepath: string, content: string): void {
  if (content) {
    const currentHash = hash(content)
    contentHash.set(filepath, currentHash)
  }
  else {
    contentHash.delete(filepath)
  }
}
