export type IconOptions = IconifyProvider | IconFontProvider | FontAwesomeProvider

export interface IconProviderBase {
  /**
   * The provider of the icon
   *
   * 图标提供商
   * @default 'iconify'
   */
  provider?: 'iconify' | 'iconfont' | 'fontawesome'

  /**
   * The size of the icon
   * @default '1em'
   */
  size?: string | number

  /**
   * The color of the icon
   * @default 'currentColor'
   */
  color?: string
}

export interface IconFontProvider extends IconProviderBase {
  provider?: 'iconfont'

  /**
   * The prefix of the iconfont
   * @default 'iconfont icon-'
   */
  prefix?: string

  /**
   * The assets of the iconfont
   */
  assets?: IconAssetLink | IconAssetLink[]
}

export interface FontAwesomeProvider extends IconProviderBase {

  provider?: 'fontawesome'

  /**
   * The prefix of the fontawesome icon
   * @default 'fas'
   */
  prefix?: LiteralUnion<FontAwesomePrefix>

  /**
   * The assets of the fontawesome
   * @default 'fontawesome'
   */
  assets?: FontAwesomeAssetBuiltIn | IconAssetLink | (IconAssetLink | FontAwesomeAssetBuiltIn)[]
}

export interface IconifyProvider extends IconProviderBase {
  provider?: 'iconify'

  /**
   * The prefix of the icon
   * @default ''
   */
  prefix?: LiteralUnion<IconifyPrefix>
}

export type FontAwesomeAssetBuiltIn = 'fontawesome' | 'fontawesome-with-brands'
export type IconAssetLink = `//${string}` | `//${string}` | `https://${string}` | `http://${string}`

export type FontAwesomePrefix
  = | 'fas' | 's' // fa-solid fa-name
    | 'far' | 'r' // fa-regular fa-name
    | 'fal' | 'l' // fa-light fa-name
    | 'fat' | 't' // fa-thin fa-name
    | 'fads' | 'ds' // fa-duotone fa-solid fa-name
    | 'fass' | 'ss' // fa-sharp fa-solid fa-name
    | 'fasr' | 'sr' // fa-sharp fa-regular fa-name
    | 'fasl' | 'sl' // fa-sharp fa-light fa-name
    | 'fast' | 'st' // fa-sharp fa-thin fa-name
    | 'fasds' | 'sds' // fa-sharp-duotone fa-solid fa-name
    | 'fab' | 'b' // fa-brands fa-name

export type IconifyPrefix = 'material-symbols' | 'material-symbols-light' | 'ic' | 'mdi' | 'mdi-light' | 'line-md' | 'solar' | 'tabler' | 'hugeicons' | 'mingcute' | 'ri' | 'mynaui' | 'iconamoon' | 'iconoir' | 'lucide' | 'lucide-lab' | 'uil' | 'tdesign' | 'si' | 'bx' | 'bxs' | 'majesticons' | 'gg' | 'flowbite' | 'basil' | 'pixelarticons' | 'pixel' | 'akar-icons' | 'ci' | 'proicons' | 'typcn' | 'meteor-icons' | 'prime' | 'circum' | 'fe' | 'eos-icons' | 'bitcoin-icons' | 'humbleicons' | 'uim' | 'uit' | 'uis' | 'gridicons' | 'mi' | 'cuida' | 'weui' | 'duo-icons' | 'svg-spinners' | 'lets-icons' | 'mage' | 'stash' | 'lineicons' | 'icon-park-outline' | 'icon-park-solid' | 'icon-park-twotone' | 'jam' | 'guidance' | 'carbon' | 'ion' | 'famicons' | 'ant-design' | 'lsicon' | 'gravity-ui' | 'cil' | 'ep' | 'charm' | 'quill' | 'bytesize' | 'bi' | 'rivet-icons' | 'nimbus' | 'formkit' | 'fluent' | 'ph' | 'teenyicons' | 'clarity' | 'ix' | 'octicon' | 'memory' | 'system-uicons' | 'radix-icons' | 'zondicons' | 'uiw' | 'maki' | 'codex' | 'ei' | 'heroicons' | 'pepicons-pop' | 'pepicons-print' | 'pepicons-pencil' | 'f7' | 'pajamas' | 'garden' | 'streamline' | 'fa6-solid' | 'fa6-regular' | 'picon' | 'ooui' | 'oui' | 'nrk' | 'qlementine-icons' | 'fluent-color' | 'icon-park' | 'marketeq' | 'vscode-icons' | 'codicon' | 'material-icon-theme' | 'file-icons' | 'devicon' | 'devicon-plain' | 'catppuccin' | 'skill-icons' | 'unjs' | 'simple-icons' | 'logos' | 'cib' | 'fa6-brands' | 'bxl' | 'nonicons' | 'arcticons' | 'cbi' | 'brandico' | 'entypo-social' | 'token' | 'token-branded' | 'cryptocurrency' | 'cryptocurrency-color' | 'openmoji' | 'twemoji' | 'noto' | 'fluent-emoji' | 'fluent-emoji-flat' | 'fluent-emoji-high-contrast' | 'noto-v1' | 'emojione' | 'emojione-monotone' | 'emojione-v1' | 'fxemoji' | 'streamline-emojis' | 'circle-flags' | 'flag' | 'flagpack' | 'cif' | 'gis' | 'map' | 'geo' | 'game-icons' | 'fad' | 'academicons' | 'wi' | 'meteocons' | 'healthicons' | 'medical-icon' | 'covid' | 'la' | 'eva' | 'dashicons' | 'flat-color-icons' | 'entypo' | 'foundation' | 'raphael' | 'icons8' | 'iwwa' | 'gala' | 'heroicons-outline' | 'heroicons-solid' | 'fa-solid' | 'fa-regular' | 'fa-brands' | 'fa' | 'fluent-mdl2' | 'fontisto' | 'icomoon-free' | 'subway' | 'oi' | 'wpf' | 'simple-line-icons' | 'et' | 'el' | 'vaadin' | 'grommet-icons' | 'whh' | 'si-glyph' | 'zmdi' | 'ls' | 'bpmn' | 'flat-ui' | 'vs' | 'topcoat' | 'il' | 'websymbol' | 'fontelico' | 'ps' | 'feather' | 'mono-icons' | 'pepicons'

export type LiteralUnion<Union extends Base, Base = string>
  = | Union
    | (Base & { zz_IGNORE_ME?: never })
