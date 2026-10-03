import type { CliOptions, File, ResolvedData } from './types.js'
import type { WriteFilesResult } from './utils/index.js'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { BUILD_SCRIPT_PACKAGES, DeployType, Mode } from './constants.js'
import { createPackageJson } from './packageJson.js'
import { createRender } from './render.js'
import { getPnpmMajorVersion, getTemplate, readFiles, readJsonFile, writeFiles } from './utils/index.js'

/**
 * Generate VuePress project files
 *
 * 生成 VuePress 项目文件
 *
 * @param mode - Operation mode (init or create) / 操作模式（初始化或创建）
 * @param data - Resolved configuration data / 解析后的配置数据
 * @param options - CLI options / CLI 可选配置
 * @returns Written and skipped file paths / 已写入与被跳过的文件路径
 */
export async function generate(
  mode: Mode,
  data: ResolvedData,
  options: CliOptions = {},
): Promise<WriteFilesResult> {
  const cwd = process.cwd()
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
      fileList.push(await createPnpmWorkspaceFile())
    }
  }

  // rewrite git files begin ==================================
  if (data.git) {
    const gitFiles = await readFiles(getTemplate('git'))
    if (mode === Mode.init) {
      const gitignorePath = path.join(cwd, '.gitignore')
      if (fs.existsSync(gitignorePath)) {
        const content = await fs.promises.readFile(gitignorePath, 'utf-8')
        fileList.push({
          filepath: '.gitignore',
          // 与用户既有的 .gitignore 合并写入，而非替换。
          // Merge into the user's existing .gitignore instead of replacing it.
          overwrite: true,
          content: `${content}\n# VuePress\n.vuepress/.cache\n.vuepress/.temp\n.vuepress/dist\n`,
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

  // Yarn 1 会在 createPackageJson 中被升级为 Yarn 4（写入 `packageManager` 字段），
  // 因此此处对所有 yarn 用户统一写入 Yarn Berry 的 nodeLinker 配置即可。
  // Yarn 1 is upgraded to Yarn 4 in createPackageJson (via the `packageManager`
  // field), so Yarn Berry's nodeLinker config applies to every yarn user.
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
    if (file.filepath.endsWith('.tpl'))
      file.content = render(file.content)

    return file
  })

  const output = mode === Mode.create ? path.join(cwd, data.root) : cwd
  return writeFiles(renderedFiles, output, options.force)
}

/**
 * Create the `pnpm-workspace.yaml` file for the generated project.
 *
 * pnpm 11+ no longer reads configuration from the `pnpm` field of
 * `package.json`, and consolidates the build script allowlist into the
 * `allowBuilds` field of `pnpm-workspace.yaml`. Lower versions keep using
 * `package.json#pnpm.onlyBuiltDependencies` (see `createPackageJson`).
 *
 * 为生成工程创建 `pnpm-workspace.yaml`。
 *
 * pnpm 11+ 不再读取 `package.json` 的 `pnpm` 字段，并将构建脚本白名单统一为
 * `pnpm-workspace.yaml` 的 `allowBuilds` 字段。更低版本仍使用
 * `package.json#pnpm.onlyBuiltDependencies`（见 `createPackageJson`）。
 *
 * @returns File object with pnpm-workspace.yaml content / 包含 pnpm-workspace.yaml 内容的文件对象
 */
async function createPnpmWorkspaceFile(): Promise<File> {
  let content = 'shamefullyHoist: true\nshellEmulator: true\n'

  if (await getPnpmMajorVersion() >= 11) {
    content += `\nallowBuilds:\n${
      BUILD_SCRIPT_PACKAGES.map(pkg => `  '${pkg}': true`).join('\n')
    }\n`
  }

  return { filepath: 'pnpm-workspace.yaml', content }
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
  return fileList.map(({ filepath, content, overwrite }) => ({
    filepath: path.join(target, filepath),
    content,
    overwrite,
  }))
}
