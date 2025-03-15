/** 法语 */
import type { PresetLocale, ThemeLocaleText } from '../../shared/index.js'

export const frLocale: ThemeLocaleText = {
  selectLanguageName: 'Français',
  selectLanguageText: 'Choisir la langue',

  appearanceText: 'Apparence',
  lightModeSwitchTitle: 'Passer au thème clair',
  darkModeSwitchTitle: 'Passer au thème sombre',

  outlineLabel: 'Contenu de cette page',
  returnToTopLabel: 'Retour en haut',
  editLinkText: 'Modifier cette page',
  contributorsText: 'Contributeurs',
  prevPageLabel: 'Page précédente',
  nextPageLabel: 'Page suivante',
  lastUpdatedText: 'Dernière mise à jour',

  changelogText: 'Historique des changements',
  changelogOnText: 'le',
  changelogButtonText: 'Voir tout l\'historique des changements',

  copyrightText: 'Tous droits réservés',
  copyrightAuthorText: 'Copyright appartenant à :',
  copyrightCreationOriginalText: 'Lien de l\'article :',
  copyrightCreationTranslateText: 'Traduit de :',
  copyrightCreationReprintText: 'Reproduit de :',
  copyrightLicenseText: 'Licence :',

  notFound: {
    code: '404',
    title: 'Page non trouvée',
    quote: 'Mais si tu ne changes pas de direction et que tu continues à chercher, tu finiras par arriver à destination.',
    linkText: 'Retour à l\'accueil',
  },

  homeText: 'Accueil',
  blogText: 'Blog',
  tagText: 'Étiquette',
  archiveText: 'Archives',
  categoryText: 'Catégorie',
  archiveTotalText: '{count} articles',

  encryptButtonText: 'Confirmer',
  encryptPlaceholder: 'Veuillez entrer le mot de passe',
  encryptGlobalText: 'Ce site n\'est accessible qu\'avec un mot de passe',
  encryptPageText: 'Cette page n\'est accessible qu\'avec un mot de passe',

  footer: {
    message:
      'Propulsé par <a target="_blank" href="https://v2.vuepress.vuejs.org/">VuePress</a> & <a target="_blank" href="https://theme-plume.vuejs.press">vuepress-theme-plume</a>',
  },
}

export const frPresetLocale: PresetLocale = {
  // ------ copyright license ------
  'CC0': 'CC0 1.0 Universel',
  'CC-BY-4.0': 'Attribution 4.0 International',
  'CC-BY-NC-4.0': 'Attribution-Pas d\'Utilisation Commerciale 4.0 International',
  'CC-BY-NC-SA-4.0': 'Attribution-Pas d\'Utilisation Commerciale-Partage dans les Mêmes Conditions 4.0 International',
  'CC-BY-NC-ND-4.0': 'Attribution-Pas d\'Utilisation Commerciale-Pas de Modification 4.0 International',
  'CC-BY-ND-4.0': 'Attribution-Pas de Modification 4.0 International',
  'CC-BY-SA-4.0': 'Attribution-Partage dans les Mêmes Conditions 4.0 International',
}
