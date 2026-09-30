/**
 * VuePress Theme Plume CLI Entry Point
 *
 * VuePress Theme Plume CLI 入口文件
 *
 * This module provides command-line interface for creating and initializing
 * VuePress projects with vuepress-theme-plume.
 *
 * 本模块提供用于创建和初始化 VuePress 项目的命令行接口。
 *
 * @module cli
 */
import type { CliOptions } from './types.js'
import cac from 'cac'
import { version } from '../package.json'
import { Mode } from './constants.js'
import { run } from './run.js'

const cli = cac('create-vuepress-theme-plume')

cli
  .command('[root]', 'create a new vuepress-theme-plume project / 创建新的 vuepress-theme-plume 项目')
  .option('--force', 'overwrite existing files / 覆盖已存在的文件')
  .action((root: string, options: CliOptions) => run(Mode.create, root, options))

cli
  .command('init [root]', 'Initial vuepress-theme-plume in the existing project / 在现有项目中初始化 vuepress-theme-plume')
  .option('--force', 'overwrite existing files / 覆盖已存在的文件')
  .action((root: string, options: CliOptions) => run(Mode.init, root, options))

cli.help()

cli.version(version)

cli.parse()
