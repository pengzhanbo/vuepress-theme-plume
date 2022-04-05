import { format, getTime, parse } from 'date-fns'

export const getCreateTime = (date: string): number => {
  const d = parse(date, 'yyyy/MM/dd HH:mm:ss', new Date())
  return getTime(d)
}

export const formatDate = (date: string | undefined): string => {
  if (!date) return ''
  const d = parse(date, 'yyyy/MM/dd HH:mm:ss', new Date())
  return format(d, 'yyyy-MM-dd')
}
