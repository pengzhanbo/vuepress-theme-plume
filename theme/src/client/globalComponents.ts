import type { App } from 'vue'
import VPBadge from '@theme/global/VPBadge.vue'
import VPCard from '@theme/global/VPCard.vue'
import VPCardGrid from '@theme/global/VPCardGrid.vue'
import VPImageCard from '@theme/global/VPImageCard.vue'
import VPLinkCard from '@theme/global/VPLinkCard.vue'
import VPHomeBox from '@theme/Home/VPHomeBox.vue'
import VPIcon from '@theme/VPIcon.vue'

export function globalComponents(app: App) {
  app.component('Badge', VPBadge)
  app.component('VPBadge', VPBadge)

  app.component('VPCard', VPCard)
  app.component('Card', VPCard)

  app.component('VPCardGrid', VPCardGrid)
  app.component('CardGrid', VPCardGrid)

  app.component('VPLinkCard', VPLinkCard)
  app.component('LinkCard', VPLinkCard)

  app.component('VPImageCard', VPImageCard)
  app.component('ImageCard', VPImageCard)

  app.component('Icon', VPIcon)
  app.component('VPIcon', VPIcon)

  app.component('HomeBox', VPHomeBox)
  app.component('VPHomeBox', VPHomeBox)
}
