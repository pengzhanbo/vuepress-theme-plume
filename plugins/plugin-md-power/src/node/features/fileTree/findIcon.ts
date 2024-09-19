import { defaultFile, defaultFolder, definitions } from './definitions.js'

export function getFileIcon(fileName: string, type: 'file' | 'folder' = 'file'): string {
  const name = getFileIconName(fileName, type)
  if (!name)
    return type === 'file' ? defaultFile : defaultFolder

  return name
}

function getFileIconName(fileName: string, type: 'file' | 'folder' = 'file'): string | undefined {
  if (type === 'folder') {
    return definitions.folders[fileName]
  }
  let icon: string | undefined = definitions.named[fileName] || definitions.files[fileName]
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
