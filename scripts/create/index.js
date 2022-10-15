import { getConfig } from './getConfig.js'
import { getHelp } from './getHelp.js'
import { generator } from './generator.js'

const config = getConfig()

if (config.help) {
  getHelp()
  process.exit(0)
} else {
  generator(config).catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
