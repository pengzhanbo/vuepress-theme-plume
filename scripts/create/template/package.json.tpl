{
  "name": "@vuepress-plume/{{ pkgName }}",
  "version": "{{ version }}",
  "description": "The Plugin for VuePres 2",
  "keyword": [
    "VuePress",
    "vuepress plugin",
    "{{ lowerName }}",
    "vuepress-plugin-{{ pkgName }}"
  ],
  "homepage": "https://github.com/pengzhanbo/vuepress-theme-plume#readme",
  "bugs": {
    "url": "https://github.com/pengzhanbo/vuepress-theme-plume/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/pengzhanbo/vuepress-theme-plume.git"
  },
  "license": "MIT",
  "author": "pengzhanbo <volodymyr@foxmail.com>",
  "type": "module",
  "exports": {
    ".": "./lib/node/index.js",
    {{#if shared }}
    "./client": "./lib/client/index.js",
    {{/if}}
    "./package.json": "./package.json"
  },
  "main": "lib/node/index.js",
  "types": "./lib/node/index.d.ts",
  "scripts": {
    "build": "pnpm run clean && pnpm run copy && pnpm run ts",
    "clean": "rimraf lib *.tsbuildinfo",
    "copy": "cpx \"src/**/*.{d.ts,vue,css,scss,jpg,png}\" lib",
    "copy:watch": "cpx \"src/**/*.{d.ts,vue,css,scss,jpg,png}\" lib -w",
    "dev": "concurrently \"pnpm copy:watch\" \"pnpm ts:watch\"",
    "ts": "tsc -b tsconfig.build.json",
    "ts:watch": "tsc -b tsconfig.build.json --watch"
  },
  "publishConfig": {
    "access": "public"
  }
}
