
import prerelease  from 'semver/functions/prerelease.js'


export const versions = {}

export const getVersion = answers =>
  answers.customVersion || versions[answers.bump]

export const isPreRelease = version =>
  Boolean(prerelease(version))

export const getNpmTags = version => {
  if (isPreRelease(version)) return ['next', 'alpha', 'beta', 'latest']

  return ['latest', 'beta', 'alpha', 'next']
}
