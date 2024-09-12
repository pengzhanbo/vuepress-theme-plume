import cac from 'cac'
import { Mode } from './constants.js'
import { run } from './run.js'

declare const __CLI_VERSION__: string

const cli = cac('create-vuepress-theme-plume')

cli
  .command('[root]', 'create a new vuepress-theme-plume project / 创建新的 vuepress-theme-plume 项目')
  .action((root: string) => run(Mode.create, root))

cli
  .command('init [root]', 'Initial vuepress-theme-plume in the existing project / 在现有项目中初始化 vuepress-theme-plume')
  .action((root: string) => run(Mode.init, root))

cli.help()

cli.version(__CLI_VERSION__)

cli.parse()
