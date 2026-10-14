export function stripHtmlTags(input: string): string {
  let current = input
  let previous: string
  do {
    previous = current
    current = current.replace(/<[^<>]*>/g, '')
  } while (current !== previous)
  return current
}
