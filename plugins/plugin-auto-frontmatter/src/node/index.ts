import type {
  AutoFrontmatterOptions,
  FrontmatterArray,
  FrontmatterObject,
} from '../shared/index.js'
import { autoFrontmatterPlugin } from './plugin.js'

export * from './plugin.js'

export type { AutoFrontmatterOptions, FrontmatterArray, FrontmatterObject }

export default autoFrontmatterPlugin
