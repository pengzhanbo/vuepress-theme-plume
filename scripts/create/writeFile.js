import path from 'path'
import fs from 'fs'

export const writeFile = async (filepath, content) => {
  const dirname = path.dirname(filepath)
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true })
  }
  return new Promise((resolve, reject) => {
    fs.writeFile(filepath, content, 'utf-8', (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
