import type { File, ResolvedData } from './types.js'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import spawn from 'nano-spawn'
import { DeployType, Mode } from './constants.js'
import { createPackageJson } from './packageJson.js'
import { createRender } from './render.js'
import { getTemplate, readFiles, readJsonFile, writeFiles } from './utils/index.js'

/**
 * Generate VuePress project files
 *
 * 生成 VuePress 项目文件
 *
 * @param mode - Operation mode (init or create) / 操作模式（初始化或创建）
 * @param data - Resolved configuration data / 解析后的配置数据
 * @param cwd - Current working directory / 当前工作目录
 */
export async function generate(
  mode: Mode,
  data: ResolvedData,
  cwd: string = process.cwd(),
): Promise<void> {
  let userPkg: Record<string, any> = {}
  if (mode === Mode.init) {
    const pkgPath = path.join(cwd, 'package.json')
    if (fs.existsSync(pkgPath)) {
      userPkg = (await readJsonFile(pkgPath)) || {}
    }
  }

  const fileList: File[] = [
    // add package.json
    await createPackageJson(mode, userPkg, data),
    // add docs files
    ...await createDocsFiles(data),
    // add vuepress and theme-plume configs
    ...updateFileListTarget(await readFiles(getTemplate('.vuepress')), `${data.docsDir}/.vuepress`),
  ]

  // add repo root files
  if (mode === Mode.create) {
    fileList.push(...await readFiles(getTemplate('common')))
    if (data.packageManager === 'pnpm') {
      fileList.push({
        filepath: '.npmrc',
        content: 'shamefully-hoist=true\nshell-emulator=true',
      })
    }
    if (data.packageManager === 'yarn') {
      const { output } = await spawn('yarn', ['--version'])
      if (output.startsWith('2')) {
        fileList.push({
          filepath: '.yarnrc.yml',
          content: 'nodeLinker: \'node-modules\'\n',
        })
      }
    }
  }

  // rewrite git files begin ==================================
  if (data.git) {
    const gitFiles = await readFiles(getTemplate('git'))
    if (mode === Mode.init) {
      const gitignorePath = path.join(cwd, '.gitignore')
      const docs = data.docsDir
      if (fs.existsSync(gitignorePath)) {
        const content = await fs.promises.readFile(gitignorePath, 'utf-8')
        fileList.push({
          filepath: '.gitignore',
          content: `${content}\n${docs}/.vuepress/.cache\n${docs}/.vuepress/.temp\n${docs}/.vuepress/dist\n`,
        })
        fileList.push(...gitFiles.filter(({ filepath }) => filepath !== '.gitignore'))
      }
      else {
        fileList.push(...gitFiles)
      }
    }
    else {
      fileList.push(...gitFiles)
    }
  }
  // rewrite git files end ====================================

  if (data.packageManager === 'yarn') {
    fileList.push({
      filepath: '.yarnrc.yml',
      content: 'nodeLinker: \'node-modules\'\n',
    })
  }

  if (data.deploy !== DeployType.custom) {
    fileList.push(...await readFiles(getTemplate(`deploy/${data.deploy}`)))
  }

  const render = createRender(data)

  const renderedFiles = fileList.map((file) => {
    if (file.filepath.endsWith('.handlebars'))
      file.content = render(file.content)

    return file
  })

  const ext = data.useTs ? '' : userPkg.type !== 'module' ? '.mjs' : '.js'
  const REG_EXT = /\.ts$/
  const output = mode === Mode.create ? path.join(cwd, data.root) : cwd
  await writeFiles(renderedFiles, output, (filepath) => {
    if (filepath.endsWith('.d.ts'))
      return filepath
    if (ext)
      return filepath.replace(REG_EXT, ext)
    return filepath
  })
}

/**
 * Create documentation files based on configuration
 *
 * 根据配置创建文档文件
 *
 * @param data - Resolved configuration data / 解析后的配置数据
 * @returns Array of file objects / 文件对象数组
 */
async function createDocsFiles(data: ResolvedData): Promise<File[]> {
  const fileList: File[] = []
  if (data.multiLanguage) {
    const enDocs = await readFiles(getTemplate('docs/en'))
    const zhDocs = await readFiles(getTemplate('docs/zh'))

    if (data.defaultLanguage === 'en-US') {
      fileList.push(...enDocs)
      fileList.push(...updateFileListTarget(zhDocs, 'zh'))
    }
    else {
      fileList.push(...zhDocs)
      fileList.push(...updateFileListTarget(enDocs, 'en'))
    }
  }
  else {
    if (data.defaultLanguage === 'en-US')
      fileList.push(...await readFiles(getTemplate('docs/en')))
    else
      fileList.push(...await readFiles(getTemplate('docs/zh')))
  }

  return updateFileListTarget(fileList, data.docsDir)
}

/**
 * Update file list target path
 *
 * 更新文件列表的目标路径
 *
 * @param fileList - Array of files / 文件数组
 * @param target - Target directory path / 目标目录路径
 * @returns Updated file array / 更新后的文件数组
 */
function updateFileListTarget(fileList: File[], target: string): File[] {
  return fileList.map(({ filepath, content }) => ({
    filepath: path.join(target, filepath),
    content,
  }))
}
