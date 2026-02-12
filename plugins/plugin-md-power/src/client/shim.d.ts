declare module '*.vue' {
  import type { ComponentOptions } from 'vue'

  const comp: ComponentOptions
  export default comp
}

declare module '@internal/md-power/replEditorData' {
  import type { ReplEditorData } from '../shared/repl.js'

  const res: ReplEditorData
  export default res
}

declare module '@internal/encrypt-snippets' {
  const res: Record<string, () => Promise<{ default: string }>>
  export default res
}
