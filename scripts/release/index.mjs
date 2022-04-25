import { release } from './release.mjs'

release().catch((err) => {
  console.error(err)
  process.exit(1)
})
