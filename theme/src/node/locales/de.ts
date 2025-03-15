/** 德语 */
import type { PresetLocale, ThemeLocaleText } from '../../shared/index.js'

export const deLocale: ThemeLocaleText = {
  selectLanguageName: 'Deutsch',
  selectLanguageText: 'Sprache auswählen',

  appearanceText: 'Erscheinungsbild',
  lightModeSwitchTitle: 'Zu hellem Thema wechseln',
  darkModeSwitchTitle: 'Zu dunklem Thema wechseln',

  outlineLabel: 'Inhalt dieser Seite',
  returnToTopLabel: 'Zurück nach oben',
  editLinkText: 'Diese Seite bearbeiten',
  contributorsText: 'Mitwirkende',
  prevPageLabel: 'Vorherige Seite',
  nextPageLabel: 'Nächste Seite',
  lastUpdatedText: 'Zuletzt aktualisiert am',

  changelogText: 'Änderungsprotokoll',
  changelogOnText: 'am',
  changelogButtonText: 'Alle Änderungen anzeigen',

  copyrightText: 'Alle Rechte vorbehalten',
  copyrightAuthorText: 'Urheberrecht liegt bei:',
  copyrightCreationOriginalText: 'Originalartikel:',
  copyrightCreationTranslateText: 'Übersetzt aus:',
  copyrightCreationReprintText: 'Nachdruck von:',
  copyrightLicenseText: 'Lizenz:',

  notFound: {
    code: '404',
    title: 'Seite nicht gefunden',
    quote: 'Aber wenn du deine Richtung nicht änderst und weiter suchst, könntest du schließlich dorthin gelangen, wohin du gehen willst.',
    linkText: 'Zur Startseite',
  },

  homeText: 'Startseite',
  blogText: 'Blog',
  tagText: 'Tag',
  archiveText: 'Archiv',
  categoryText: 'Kategorie',
  archiveTotalText: '{count} Beiträge',

  encryptButtonText: 'Bestätigen',
  encryptPlaceholder: 'Bitte Passwort eingeben',
  encryptGlobalText: 'Diese Website ist nur mit Passwort zugänglich',
  encryptPageText: 'Diese Seite ist nur mit Passwort zugänglich',

  footer: {
    message:
      'Unterstützt von <a target="_blank" href="https://v2.vuepress.vuejs.org/">VuePress</a> & <a target="_blank" href="https://theme-plume.vuejs.press">vuepress-theme-plume</a>',
  },
}

export const dePresetLocale: PresetLocale = {

  // ------ copyright license ------
  'CC0': 'CC0 1.0 Universell',
  'CC-BY-4.0': 'Namensnennung 4.0 International',
  'CC-BY-NC-4.0': 'Namensnennung-Nicht kommerziell 4.0 International',
  'CC-BY-NC-SA-4.0': 'Namensnennung-Nicht kommerziell-Weitergabe unter gleichen Bedingungen 4.0 International',
  'CC-BY-NC-ND-4.0': 'Namensnennung-Nicht kommerziell-Keine Bearbeitung 4.0 International',
  'CC-BY-ND-4.0': 'Namensnennung-Keine Bearbeitung 4.0 International',
  'CC-BY-SA-4.0': 'Namensnennung-Weitergabe unter gleichen Bedingungen 4.0 International',
}
