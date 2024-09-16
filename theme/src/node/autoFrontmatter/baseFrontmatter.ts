import { format } from 'date-fns'
import type {
  AutoFrontmatter,
  AutoFrontmatterObject,
} from '../../shared/index.js'

export function createBaseFrontmatter(options: AutoFrontmatter): AutoFrontmatterObject {
  const res: AutoFrontmatterObject = {}

  if (options.createTime !== false) {
    res.createTime = (formatTime: string, { createTime }, data) => {
      if (formatTime)
        return formatTime
      if (data.friends || data.pageLayout === 'friends')
        return
      return format(new Date(createTime), 'yyyy/MM/dd HH:mm:ss')
    }
  }

  return res
}
