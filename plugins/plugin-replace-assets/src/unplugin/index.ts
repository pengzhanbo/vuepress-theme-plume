import type { VitePlugin, WebpackPluginInstance } from 'unplugin'
import type { ReplacementRule } from '../options.js'
import {
  createVitePlugin as _createVitePlugin,
  createWebpackPlugin as _createWebpackPlugin,

} from 'unplugin'
import { unpluginFactory } from './factory.js'

export const createVitePlugin: () => (
  options: ReplacementRule[]
) => VitePlugin<any> | VitePlugin<any>[] = () => _createVitePlugin(unpluginFactory)

export const createWebpackPlugin: () => (
  options: ReplacementRule[]
) => WebpackPluginInstance = () => _createWebpackPlugin(unpluginFactory)

export * from './transform.js'
