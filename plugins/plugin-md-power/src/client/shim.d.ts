import type { ReplEditorData } from '../shared/repl.js'

declare module '*.vue' {
  import type { ComponentOptions } from 'vue'

  const comp: ComponentOptions
  export default comp
}

declare module '@internal/md-power/replEditorData' {

  const res: ReplEditorData
  export default res
}
