declare module 'glob-to-regexp' {
  interface GlobToRegexp {
    (
      glob: string,
      options?: {
        globstar?: boolean
        extended?: boolean
        flags?: string
      }
    ): RegExp
  }

  const globToRegexp: GlobToRegexp

  export default globToRegexp
}
