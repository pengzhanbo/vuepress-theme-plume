import type { ReplaceAssetsPluginOptions, ReplacementRule } from './options.js'
import { isArray, isFunction } from '@vuepress/helper'
import { KNOWN_ASSET_EXTENSIONS, KNOWN_IMAGE_EXTENSIONS, KNOWN_MEDIA_EXTENSIONS } from './constants.js'

export function createFindPattern(extensions: string[]): RegExp {
  return new RegExp(`\\.(?:${extensions.join('|')})(\\?.*)?$`)
}

export function normalizeRules(options: ReplaceAssetsPluginOptions): ReplacementRule[] {
  const normalized: ReplacementRule[] = []

  if ((typeof options === 'string' || isFunction(options))) {
    options && normalized.push({
      find: createFindPattern(KNOWN_ASSET_EXTENSIONS),
      replacement: options,
    })
    return normalized
  }

  if (isArray(options)) {
    normalized.push(...options)
    return normalized
  }

  if ('find' in options) {
    options.find && options.replacement && normalized.push(options)
    return normalized
  }

  if (options.image) {
    normalized.push({
      find: createFindPattern(KNOWN_IMAGE_EXTENSIONS),
      replacement: options.image,
    })
  }

  if (options.media) {
    normalized.push({
      find: createFindPattern(KNOWN_MEDIA_EXTENSIONS),
      replacement: options.media,
    })
  }

  if (options.all) {
    normalized.push({
      find: createFindPattern(KNOWN_ASSET_EXTENSIONS),
      replacement: options.all,
    })
  }

  if (options.rules) {
    normalized.push(...isArray(options.rules) ? options.rules : [options.rules])
  }

  return normalized
}
