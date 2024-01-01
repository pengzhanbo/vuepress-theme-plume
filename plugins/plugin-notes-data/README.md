# `@vuepress-plume/plugin-notes-data`

## Install

```sh
npm install @vuepress-plume/plugin-notes-data
# or
pnpm add @vuepress-plume/plugin-notes-data
# or
yarn add @vuepress-plume/plugin-notes-data
```
## Usage

``` js
// .vuepress/config.[jt]s
import { notesDataPlugin } from '@vuepress-plume/plugin-notes-data'

export default {
  // ...
  plugins: [
    notesDataPlugin()
  ]
  // ...
}
```

## Options

``` ts
interface NotesDataOptions {
  dir: string
  link: string
  include?: string | string[]
  exclude?: string | string[]
  notes: NotesItem[]
}

interface NotesItem {
  dir: string
  link: string
  text: string
  sidebar?: NotesSidebar | 'auto'
}

type NotesSidebar = (NotesSidebarItem | string)[]

interface NotesSidebarItem {
  text?: string
  link?: string
  dir?: string
  collapsed?: boolean
  items?: NotesSidebar
}
```
