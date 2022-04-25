import { readdirSync } from 'fs'
import { get } from 'https'
import { resolve } from 'path'

const packages = readdirSync(resolve(__dirname, '../../packages'))

export const sync = () => {
  const promises = packages.map(packageName => {
    return import(`../../packages/${packageName}/package.json`)
      .then(content =>
        new Promise((resolve) => {
          get(`https://npmmirror.com/sync/${content.name}`).on(
            'finish',
            () => resolve()
          )
        })
    )
  })

  return Promise.all(promises)
}
