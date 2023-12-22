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
  //...
  plugins: [
    notesDataPlugin()
  ]
  // ...
}
```

## Options

``` ts
type NotesDataOptions = {
  dir: string
  link: string
  include?: string | string[]
  exclude?: string | string[]
  notes: NotesItem[]
}

type NotesItem = {
  dir: string
  link: string
  text: string
  sidebar?: NotesSidebar | 'auto'
}

type NotesSidebar = (NotesSidebarItem | string)[]

type NotesSidebarItem = {
  text?: string
  link?: string
  dir?: string
  collapsed?: boolean
  items?: NotesSidebar
}
```
