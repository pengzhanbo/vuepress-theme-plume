import fs from 'node:fs'
import { request } from 'node:https'
import path from 'node:path'
import process from 'node:process'
import { URL } from 'node:url'

const pluginsDir = path.resolve(process.cwd(), 'plugins')
const plugins = fs.readdirSync(pluginsDir)

async function npmMirrorSync() {
  const packages = [
    'create-vuepress-theme-plume',
    'vuepress-theme-plume',
  ]
  for (const plugin of plugins) {
    if (fs.statSync(path.resolve(pluginsDir, plugin)).isDirectory()) {
      const { name } = JSON.parse(fs.readFileSync(path.resolve(pluginsDir, plugin, 'package.json'), 'utf-8'))
      packages.push(name)
    }
  }
  return Promise.all(packages.map(async (pkg) => {
    const url = new URL(`https://registry-direct.npmmirror.com/${pkg}/sync?sync_upstream=true`)
    return new Promise((resolve, reject) => {
      const req = request(url, {
        method: 'PUT',
        headers: {
          'Content-Length': 0,
        },
      })
      req.write('')

      req.on('close', () => {
        resolve()
      })

      req.on('error', (error) => {
        reject(error)
      })

      req.end()
    })
  }))
}

try {
  await npmMirrorSync()
  console.log('npm mirror sync success !')
}
catch (error) {
  console.error(error)
  process.exit(1)
}
