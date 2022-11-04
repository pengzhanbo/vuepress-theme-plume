import { getDirname, path } from '@vuepress/utils'
import { defineConfig } from 'windicss/helpers'
import typography from 'windicss/plugin/typography'

const __dirname = getDirname(import.meta.url)

export default defineConfig({
  darkMode: 'class',
  // attributify: true,
  plugins: [(typography as any)()],
  theme: {
    extend: {
      textColor: '#2c3e50',
      fontFamily: {
        sans: [
          'ui-sans-serif',
          '-apple-system',
          'BlinkMackSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          '"Fira Sans"',
          '"Droid Sans"',
          '"Helvetica Neue"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        mono: [
          'Consolas',
          'Monaco',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          '"Andale Mono"',
          '"Ubuntu Mono"',
          'monospace',
        ],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#2c3e50',
            a: {
              color: 'red',
            },
            h1: { color: 'inherit' },
            h2: { color: 'inherit' },
            h3: { color: 'inherit' },
            h4: { color: 'inherit' },
            h5: { color: 'inherit' },
            h6: { color: 'inherit' },
            b: { color: 'inherit' },
            em: { color: 'inherit' },
            strong: { color: 'inherit' },
            blockquote: { color: 'inherit' },
          },
        },
      },
    },
  },
  extract: {
    include: [
      path.resolve(__dirname, '{components,layouts}/**/*'),
      path.resolve(process.cwd(), '**/.vuepress/{components,layouts}/*'),
      path.resolve(process.cwd(), '**/*.md'),
    ],
  },
})
