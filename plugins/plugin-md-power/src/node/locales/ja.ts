import type { MDPowerLocaleData } from '../../shared/locale'

export const jaLocale: MDPowerLocaleData = {
  common: {
    copy: 'コピー',
    copied: 'コピー済み',
  },
  encrypt: {
    hint: 'コンテンツは暗号化されています。閲覧するにはロックを解除してください。',
    placeholder: 'パスワードを入力',
    incPwd: 'パスワードが間違っています',
    noContent: 'ロックは解除されましたが、コンテンツの読み込みに失敗しました。後ほど再度お試しください。',
    warningTitle: '🚨 セキュリティ警告:',
    warningText: '接続がHTTPSで暗号化されていないため、コンテンツの漏洩リスクがあり、暗号化されたコンテンツへのアクセスができません。',
  },
}
