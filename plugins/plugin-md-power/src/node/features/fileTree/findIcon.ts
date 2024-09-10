import { definitions, FileIcons } from './icons.js'

export interface FileIcon {
  name: string
  svg: string
}

export const defaultFileIcon: FileIcon = {
  name: 'default',
  svg: makeSVGIcon(FileIcons['seti:default']),
}

export const folderIcon: FileIcon = {
  name: 'folder',
  svg: makeSVGIcon(FileIcons['seti:folder']),
}

export function getFileIcon(fileName: string): FileIcon {
  const name = getFileIconName(fileName)
  if (!name)
    return defaultFileIcon

  if (name in FileIcons) {
    const path = FileIcons[name as keyof typeof FileIcons]
    return {
      name: name.includes(':') ? name.split(':')[1] : name,
      svg: makeSVGIcon(path),
    }
  }
  return defaultFileIcon
}

function makeSVGIcon(svg: string): string {
  svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${svg}</svg>`
    .replace(/"/g, '\'')
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/\{/g, '%7B')
    .replace(/\}/g, '%7D')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
  return `url("data:image/svg+xml,${svg}")`
}

function getFileIconName(fileName: string) {
  let icon: string | undefined = definitions.files[fileName]
  if (icon)
    return icon
  icon = getFileIconTypeFromExtension(fileName)
  if (icon)
    return icon
  for (const [partial, partialIcon] of Object.entries(definitions.partials)) {
    if (fileName.includes(partial))
      return partialIcon
  }
  return icon
}

function getFileIconTypeFromExtension(fileName: string): string | undefined {
  const firstDotIndex = fileName.indexOf('.')
  if (firstDotIndex === -1)
    return
  let extension = fileName.slice(firstDotIndex)
  while (extension !== '') {
    const icon = definitions.extensions[extension]
    if (icon)
      return icon
    const nextDotIndex = extension.indexOf('.', 1)
    if (nextDotIndex === -1)
      return
    extension = extension.slice(nextDotIndex)
  }
  return undefined
}
