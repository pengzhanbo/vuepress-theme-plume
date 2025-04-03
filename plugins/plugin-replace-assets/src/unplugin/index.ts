import {
  createVitePlugin as _createVitePlugin,
  createWebpackPlugin as _createWebpackPlugin,
} from 'unplugin'
import { unpluginFactory } from './factory.js'

export const createVitePlugin = () => _createVitePlugin(unpluginFactory)
export const createWebpackPlugin = () => _createWebpackPlugin(unpluginFactory)

export * from './transform.js'
