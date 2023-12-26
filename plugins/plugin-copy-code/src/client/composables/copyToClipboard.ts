export function copyToClipboard(str: string): void {
  const selection = document.getSelection()
  const selectedRange
    = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : false

  const textEl = document.createElement('textarea')

  textEl.value = str
  textEl.setAttribute('readonly', '')
  textEl.style.position = 'absolute'
  textEl.style.top = '-9999px'
  document.body.appendChild(textEl)

  textEl.select()
  document.execCommand('copy')

  document.body.removeChild(textEl)

  if (selectedRange && selection) {
    selection.removeAllRanges()
    selection.addRange(selectedRange)
  }
}
