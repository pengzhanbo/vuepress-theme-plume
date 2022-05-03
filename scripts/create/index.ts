import { getConfig } from './getConfig'
import { getHelp } from './getHelp'
import { generator } from './generator'

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
