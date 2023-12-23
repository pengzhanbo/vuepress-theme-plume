import { notesData as notesDataRaw } from '@internal/notesData'
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { NotesData } from '../../shared/index.js'

declare const __VUE_HMR_RUNTIME__: Record<string, any>

export type NotesDataRef<T extends NotesData = NotesData> = Ref<T>

export const notesData: NotesDataRef = ref(notesDataRaw)

export const useNotesData = <
  T extends NotesData = NotesData
>(): NotesDataRef<T> => notesData as NotesDataRef<T>

if (import.meta.webpackHot || import.meta.hot) {
  __VUE_HMR_RUNTIME__.updateNotesData = (data: NotesData) => {
    notesData.value = data
  }
}
