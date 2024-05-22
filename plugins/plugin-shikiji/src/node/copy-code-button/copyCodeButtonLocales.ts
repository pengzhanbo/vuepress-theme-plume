import type { LocaleConfig } from 'vuepress'
import type { CopyCodeLocaleOptions } from '../types.js'

/** Multi language config for copy code button */
export const copyCodeButtonLocales: LocaleConfig<CopyCodeLocaleOptions>
  = {
    '/en/': {
      title: 'Copy code',
      copied: 'Copied',
    },

    '/zh/': {
      title: '复制代码',
      copied: '已复制',
    },

    '/zh-tw/': {
      title: '複製代碼',
      copied: '已複製',
    },

    '/de/': {
      title: 'Kopiere den Code.',
      copied: 'Kopiert',
    },

    '/de-at/': {
      title: 'Kopiere den Code.',
      copied: 'Kopierter',
    },

    '/vi/': {
      title: 'Sao chép code',
      copied: 'Đã sao chép',
    },

    '/uk/': {
      title: 'Скопіюйте код',
      copied: 'Скопійовано',
    },

    '/ru/': {
      title: 'Скопировать код',
      copied: 'Скопировано',
    },

    '/br/': {
      title: 'Copiar o código',
      copied: 'Código',
    },

    '/pl/': {
      title: 'Skopiuj kod',
      copied: 'Skopiowane',
    },

    '/sk/': {
      title: 'Skopíruj kód',
      copied: 'Skopírované',
    },

    '/fr/': {
      title: 'Copier le code',
      copied: 'Copié',
    },

    '/es/': {
      title: 'Copiar código',
      copied: 'Copiado',
    },

    '/ja/': {
      title: 'コードをコピー',
      copied: 'コピーしました',
    },

    '/tr/': {
      title: 'Kodu kopyala',
      copied: 'Kopyalandı',
    },

    '/ko/': {
      title: '코드 복사',
      copied: '복사됨',
    },

    '/fi/': {
      title: 'Kopioi koodi',
      copied: 'Kopioitu',
    },

    '/hu/': {
      title: 'Kód másolása',
      copied: 'Másolva',
    },

    '/id/': {
      title: 'Salin kode',
      copied: 'Disalin',
    },

    '/nl/': {
      title: 'Kopieer code',
      copied: 'Gekopieerd',
    },
  }
