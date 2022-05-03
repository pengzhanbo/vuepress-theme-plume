import chalk from 'chalk'

export const getHelp = (): void => {
  console.log(`
  this command will generator a package to ${chalk.cyan('packages')}.

  command: ${chalk.green('pnpm pkg <package-name> [-p]')}

  options:
  ${chalk.green('package-name')}: 包名
  ${chalk.green('--client, -c')}: 是否生成 ${chalk.cyan('client/')} 目录
  ${chalk.green('--shared, -s')}: 是否生成 ${chalk.cyan('shared/')} 目录

  ${chalk.green('--help, -h')}: show help message.

  exp:  ${chalk.green('pnpm pkg caniuse -p')}
  It will generator to ${chalk.cyan('packages/plugin-caniuse')}
  `)
}
