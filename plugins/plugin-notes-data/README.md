# `@vuepress-plume/plugin-notes-data`

## Install
```
yarn add @vuepress-plume/plugin-notes-data
```
## Usage
``` js
// .vuepress/config.js
const notesDataPlugin = require('@vuepress-plume/plugin-notes-data')
module.exports = {
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
