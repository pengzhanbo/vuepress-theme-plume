import { createHash } from 'node:crypto'
import { customAlphabet } from 'nanoid'

export const hash = (content: string) => createHash('md5').update(content).digest('hex')

export const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8)
