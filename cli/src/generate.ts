import path from 'node:path'
import { createPackageJson } from './packageJson.js'
import type { PromptResult } from './prompt.js'
import { createRender } from './render.js'
import { getTemplate, readFiles, writeFiles } from './utils/index.js'
import type { File } from './types.js'
import { DeployType } from './constants.js'

export async function generate(result: PromptResult): Promise<void> {
  const source = 'docs'
  const fileList: File[] = [
    // add package.json
    await createPackageJson(result),
    // add repo root files
    ...await readFiles(getTemplate('common')),
    // add docs files
    ...await createDocsFiles(result, source),
    // add vuepress and theme-plume configs
    ...updateFileListTarget(await readFiles(getTemplate('.vuepress')), `${source}/.vuepress`),
  ]

  if (result.git)
    fileList.push(...await readFiles(getTemplate('git')))

  if (result.deploy !== DeployType.custom) {
    fileList.push(...await readFiles(getTemplate(`deploy/${result.deploy}`)))
  }

  const render = createRender(result)

  const renderedFiles = fileList.map((file) => {
    if (file.filepath.endsWith('.handlebars'))
      file.content = render(file.content)

    return file
  })

  await writeFiles(renderedFiles, result.targetDir)
}

async function createDocsFiles(result: PromptResult, target: string): Promise<File[]> {
  const fileList: File[] = []
  if (result.multiLanguage) {
    const enDocs = await readFiles(getTemplate('docs/en'))
    const zhDocs = await readFiles(getTemplate('docs/zh'))

    if (result.defaultLanguage === 'en-US') {
      fileList.push(...enDocs)
      fileList.push(...updateFileListTarget(zhDocs, 'zh'))
    }
    else {
      fileList.push(...zhDocs)
      fileList.push(...updateFileListTarget(enDocs, 'en'))
    }
  }
  else {
    if (result.defaultLanguage === 'en-US')
      fileList.push(...await readFiles(getTemplate('docs/en')))
    else
      fileList.push(...await readFiles(getTemplate('docs/zh')))
  }

  return updateFileListTarget(fileList, target)
}

function updateFileListTarget(fileList: File[], target: string): File[] {
  return fileList.map(({ filepath, content }) => ({
    filepath: path.join(target, filepath),
    content,
  }))
}
