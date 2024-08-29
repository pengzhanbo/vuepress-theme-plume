import type { Bundler, Langs, Options } from './types.js'

export const languageOptions: Options<Langs> = [
  { label: 'English', value: 'en-US' },
  { label: '简体中文', value: 'zh-CN' },
]

export const bundlerOptions: Options<Bundler> = [
  { label: 'Vite', value: 'vite' },
  { label: 'Webpack', value: 'webpack' },
]

export enum Mode {
  init,
  create,
}

export enum DeployType {
  github = 'github',
  vercel = 'vercel',
  netlify = 'netlify',
  custom = 'custom',
}

export const deployOptions: Options<DeployType> = [
  { label: 'Custom', value: DeployType.custom },
  { label: 'GitHub Pages', value: DeployType.github },
  { label: 'Vercel', value: DeployType.vercel },
  { label: 'Netlify', value: DeployType.netlify },
]
