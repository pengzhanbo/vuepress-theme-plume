import type { App } from 'vuepress'
import type { ThemeOptions } from '../../shared/index.js'
import { collectReaderLocales, generateReaderPaletteStyle } from '../features/reader/index.js'
import { getThemeOptions } from '../options.js'
import { perf, writeTemp } from '../utils/index.js'

export async function prepareReader(app: App, options: ThemeOptions = getThemeOptions()): Promise<void> {
  perf.mark('prepare:reader')
  const locales = collectReaderLocales(options)
  const style = generateReaderPaletteStyle(locales)
  await writeTemp(app, 'internal/reader.css', style)
  perf.log('prepare:reader')
}
