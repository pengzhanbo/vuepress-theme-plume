import { defaultFile, defaultFolder, definitions } from './definitions.js'

export function getFileIcon(fileName: string, type?: 'file' | 'folder'): string {
  const name = getFileIconName(fileName, type)
  if (!name)
    return type !== 'folder' ? defaultFile : defaultFolder

  return name
}

export function getFileIconName(fileName: string, type: 'file' | 'folder' = 'file'): string | undefined {
  if (type === 'folder') {
    const icon = definitions.folders[fileName]
    if (icon)
      return icon
    if (fileName.includes('/'))
      return definitions.folders[fileName.slice(fileName.lastIndexOf('/') + 1)]
    return
  }
  let icon: string | undefined = definitions.named[fileName] || definitions.files[fileName]
  if (icon)
    return icon
  icon = getFileIconTypeFromExtension(fileName) || undefined
  if (icon)
    return icon
  for (const [partial, partialIcon] of Object.entries(definitions.partials)) {
    if (fileName.includes(partial))
      return partialIcon
  }
  return icon
}

export function getFileIconTypeFromExtension(fileName: string): string | void {
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
}
