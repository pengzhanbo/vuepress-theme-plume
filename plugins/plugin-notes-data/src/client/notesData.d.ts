import type { NotesData } from '../shared/index.js'

declare module '@internal/notesData' {
  const notesData: NotesData

  export { notesData }
}
