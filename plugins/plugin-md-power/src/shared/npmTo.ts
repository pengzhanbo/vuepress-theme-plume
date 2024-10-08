export type NpmToPackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun' | 'deno'

export type NpmToOptions = NpmToPackageManager[] | {
  tabs?: NpmToPackageManager[]
}
