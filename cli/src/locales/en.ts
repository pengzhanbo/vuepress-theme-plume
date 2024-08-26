import type { Locale } from '../types.js'

export const en: Locale = {
  'question.projectName': 'Please enter your project name',
  'question.packageManager': 'Select a package manager',
  'question.bundler': 'Select a bundler',
  'question.multiLanguage': 'Do you want to use multiple languages?',
  'question.defaultLanguage': 'Select the default language of the site',
  'question.git': 'Initialize a git repository?',
  'question.installDeps': 'Install dependencies?',

  'spinner.start': '🚀 Creating...',
  'spinner.stop': '🎉 Create success!',
  'spinner.git': '📄 Initializing git repository...',
  'spinner.install': '📦 Installing dependencies...',
  'spinner.command': '🔨 Execute the following command to start:',

  'hint.cancel': 'Operation cancelled.',
  'hint.targetDir': 'Project names cannot contain special characters.',
}
