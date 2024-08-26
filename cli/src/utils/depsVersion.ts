export type DependencyVersion = 'latest' | 'next' | 'pre' | string

const api = 'https://api.pengzhanbo.cn/npm/dependencies/version'

export async function getDependenciesVersion(
  dependencies: string[],
  version: DependencyVersion = 'latest',
): Promise<Record<string, string>> {
  const result = await fetch(api, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ dependencies, version }),
  }).then(res => res.json())

  return result
}
