/** Korean */
import type { PresetLocale, ThemeLocaleText } from '../../shared/index.js'

export const koLocale: ThemeLocaleText = {
  selectLanguageName: '한국어',
  selectLanguageText: '',

  appearanceText: '모양',
  lightModeSwitchTitle: '밝은 테마로 전환',
  darkModeSwitchTitle: '어두운 테마로 전환',

  sidebarMenuLabel: '메뉴',
  returnToTopLabel: '위로 이동',
  outlineLabel: '목차',
  editLinkText: '편집하기',
  contributorsText: '기여자',
  lastUpdatedText: '마지막 업데이트',
  changelogText: '변경 내역',
  changelogOnText: 'On',
  changelogButtonText: '변경 내역 모두 보기',
  prevPageLabel: '이전 페이지',
  nextPageLabel: '다음 페이지',

  copyrightText: 'Copyright',
  copyrightAuthorText: '저작권 소유자:',
  copyrightCreationOriginalText: 'This article link:',
  copyrightCreationTranslateText: 'This article is translated from:',
  copyrightCreationReprintText: 'This article is reprint from:',
  copyrightLicenseText: 'License under:',

  encryptButtonText: '확인',
  encryptPlaceholder: '비밀번호를 입력하세요',
  encryptGlobalText: '이 사이트를 이용하려면 비밀번호가 필요합니다',
  encryptPageText: '이 페이지를 이용하려면 비밀번호가 필요합니다',

  homeText: '홈',
  postsText: '블로그',
  tagText: '태그',
  archiveText: '아카이브',
  categoryText: '카테고리',
  archiveTotalText: '{count}개의 글',

  notFound: {
    code: '404',
    title: '페이지를 찾을 수 없습니다',
    quote: '방향을 잃지 않고 꾸준히 나아가다 보면 결국엔 목적지에 닿을 수 있습니다.',
    linkText: '홈으로',
  },

  footer: {
    message:
      'Powered by <a target="_blank" href="https://v2.vuepress.vuejs.org/">VuePress</a> & <a target="_blank" href="https://theme-plume.vuejs.press">vuepress-theme-plume</a>',
  },

  copyPageText: '페이지 복사',
  copiedPageText: '복사 완료',
  copingPageText: '복사 중..',
  copyTagline: '페이지를 마크다운 형식으로 복사하여 LLM에서 사용',
  viewMarkdown: 'Markdown 형식으로 보기',
  viewMarkdownTagline: '이 페이지를 일반 텍스트로 보기',
  askAIText: '{name} 에서 열기',
  askAITagline: '이 페이지에 대해 {name} 에 질문하기',
  askAIMessage: '{link} 을(를) 읽고 내용과 관련된 질문에 답변해 주세요.',
}

export const koPresetLocale: PresetLocale = {
  // ------ copyright license ------
  'CC0': 'CC0 1.0 Universal',
  'CC-BY-4.0': 'Attribution 4.0 International',
  'CC-BY-NC-4.0': 'Attribution-NonCommercial 4.0 International',
  'CC-BY-NC-SA-4.0': 'Attribution-NonCommercial-ShareAlike 4.0 International',
  'CC-BY-NC-ND-4.0': 'Attribution-NonCommercial-NoDerivatives 4.0 International',
  'CC-BY-ND-4.0': 'Attribution-NoDerivatives 4.0 International',
  'CC-BY-SA-4.0': 'Attribution-ShareAlike 4.0 International',
}
