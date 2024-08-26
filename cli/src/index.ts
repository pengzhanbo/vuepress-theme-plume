import cac from 'cac'
import { run } from './run.js'

const cli = cac('create-vuepress-theme-plume')

cli
  .command('[dir]', 'create a new vuepress-theme-plume project')
  .action(async (dir: string) => run(dir))

cli.help()

cli.parse()
