import type { Locale } from '../types.js'

/**
 * English locale configuration for CLI prompts and messages.
 *
 * CLI 提示和消息的英语本地化配置。
 */
export const en: Locale = {
  'question.root': 'Where would you want to initialize VuePress?',
  'question.site.name': 'Site Name:',
  'question.site.description': 'Site Description:',
  'question.bundler': 'Select a bundler',
  'question.multiLanguage': 'Do you want to use multiple languages?',
  'question.defaultLanguage': 'Select the default language of the site',
  'question.useTs': 'Use TypeScript?',
  'question.injectNpmScripts': 'Inject npm scripts?',
  'question.deploy': 'Deploy type:',
  'question.git': 'Initialize a git repository?',
  'question.installDeps': 'Install dependencies?',

  'spinner.start': '🚀 Creating...',
  'spinner.stop': '🎉 Create success!',
  'spinner.git': '📄 Initializing git repository...',
  'spinner.install': '📦 Installing dependencies...',
  'spinner.command': '🔨 Execute the following command to start:',

  'hint.cancel': 'Operation cancelled.',
  'hint.root': 'The path cannot be an absolute path, and cannot contain the parent path.',
  'hint.root.illegal': 'Project names cannot contain special characters.',
}
