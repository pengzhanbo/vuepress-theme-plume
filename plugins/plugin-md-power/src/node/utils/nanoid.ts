import { customAlphabet } from 'nanoid'

export const nanoid: (size?: number) => string = customAlphabet('abcdefghijklmnopqrstuvwxyz', 5)
