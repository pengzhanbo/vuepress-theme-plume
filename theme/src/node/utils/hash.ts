import { createHash } from 'node:crypto'
import { customAlphabet } from 'nanoid'

export const hash = (content: string): string => createHash('md5').update(content).digest('hex')

export const nanoid: (size?: number) => string = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8)
