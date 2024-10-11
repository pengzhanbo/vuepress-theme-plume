export function timeToSeconds(time: string): number {
  if (!time)
    return 0

  if (Number.parseFloat(time) === Number(time))
    return Number(time)

  const [s, m, h = 0] = time
    .split(/\s*:\s*/)
    .reverse()
    .map(n => Number(n) || 0)

  return s + m * 60 + h * 3600
}
