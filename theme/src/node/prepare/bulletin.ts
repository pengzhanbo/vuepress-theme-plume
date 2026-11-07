import type { App } from 'vuepress'
import type { BulletinOptions, ThemeLocaleData, ThemeOptions } from '../../shared/index.js'
import { deleteKey, difference, isPlainObject, objectEntries, uniq } from '@pengzhanbo/utils'
import { watch } from 'chokidar'
import { fs, hash, path } from 'vuepress/utils'
import { getThemeOptions } from '../options.js'
import { configLoader } from '../options.js'
import { genTempCode, logger, perf, writeTemp } from '../utils/index.js'

type BulletinData = Omit<BulletinOptions, 'contentFile' | 'enablePage'>

const fileList: string[] = []

export async function prepareBulletin(
  app: App,
  isWatch = false,
  options: ThemeOptions = getThemeOptions(),
): Promise<string[]> {
  perf.mark('prepare:bulletin')

  const watchFiles: string[] = []
  const bulletinData: Record<string, BulletinData> = Object.create(null)

  if (options.locales) {
    for (const [locale, localeOptions] of objectEntries(options.locales)) {
      bulletinData[locale] = Object.create(null)
      watchFiles.push(await addBulletin(app, bulletinData[locale], localeOptions))
    }
  }

  !isWatch && fileList.push(...watchFiles.filter(Boolean))

  await writeTemp(
    app,
    'internal/bulletin-data.js',
    genTempCode(app, { name: 'bulletinData', content: bulletinData }),
  )

  perf.log('prepare:bulletin')

  return uniq(watchFiles.filter(Boolean))
}

export function watchBulletinFiles(app: App, watchers: any[]) {
  const watcher = watch(uniq(fileList), {
    cwd: app.dir.source(),
    ignoreInitial: true,
  })
  watcher.on('change', () => prepareBulletin(app, true))

  async function onChange() {
    const newFiles = await prepareBulletin(app, true)
    watcher.unwatch(difference(fileList, newFiles))
    watcher.add(difference(newFiles, fileList))
  }

  configLoader.on('change', onChange)

  watchers.push({
    close: () => {
      watcher.close()
      fileList.length = 0
      configLoader.off('change', onChange)
    },
  })
}

async function addBulletin(app: App, bulletinData: BulletinData, options: ThemeLocaleData): Promise<string> {
  let file: string = ''
  if (isPlainObject(options.bulletin)) {
    const { contentFile, enablePage: _, ...opt } = options.bulletin
    Object.assign(bulletinData, opt)
    if (contentFile) {
      file = contentFile
      const { content, type } = await readBulletinFile(contentFile)
      bulletinData.content = content
      bulletinData.contentType = type
    }
    if (bulletinData.contentType === 'markdown' && bulletinData.content) {
      bulletinData.content = app.markdown.render(bulletinData.content, {
        filepath: contentFile || app.dir.source('_bulletin.md'),
        filePathRelative: contentFile ? path.relative(app.dir.source(), contentFile) : '_bulletin.md',
      })
    }
    bulletinData.id ||= hash(bulletinData)
    deleteKey(bulletinData, 'contentType')
  }
  return file
}

async function readBulletinFile(filepath: string): Promise<{ content: string, type: 'text' | 'markdown' }> {
  try {
    const content = await fs.readFile(filepath, 'utf-8')
    return { content, type: filepath.endsWith('.md') ? 'markdown' : 'text' }
  }
  catch (error) {
    logger.warn(`Failed to read the bulletin file ${filepath}`, error)
  }
  return { content: '', type: 'text' }
}
