import { type ClientConfig, defineClientConfig } from 'vuepress/client'
import HeroTintPlateConfig from './themes/components/HeroTintPlateConfig.vue'
import CanIUseConfig from './themes/components/CanIUseConfig.vue'
import Demos from './themes/components/Demos.vue'

export default defineClientConfig({
  enhance({ app }) {
    app.component('HeroTintPlateConfig', HeroTintPlateConfig)
    app.component('CanIUseConfig', CanIUseConfig)
    app.component('Demos', Demos)
  },
}) as ClientConfig
