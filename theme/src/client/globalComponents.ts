import type { App } from 'vue'
import VPHomeBox from '@theme/Home/VPHomeBox.vue'
import VPButton from '@theme/VPButton.vue'
import VPIcon from '@theme/VPIcon.vue'
import VPLink from '@theme/VPLink.vue'
import { hasGlobalComponent } from '@vuepress/helper/client'
import { h, resolveComponent } from 'vue'

export function globalComponents(app: App): void {
  app.component('VPLink', VPLink)

  app.component('Icon', VPIcon)
  app.component('VPIcon', VPIcon)

  app.component('VPButton', VPButton)

  app.component('HomeBox', VPHomeBox)
  app.component('VPHomeBox', VPHomeBox)

  app.component('DocComment', (props) => {
    if (hasGlobalComponent('CommentService')) {
      return h(resolveComponent('CommentService'), props)
    }
    return null
  })

  app.component('DocGitContributors', () => {
    if (hasGlobalComponent('GitContributors')) {
      return h(resolveComponent('GitContributors'))
    }
    return null
  })

  app.component('DocGitChangelog', () => {
    if (hasGlobalComponent('GitChangelog')) {
      return h(resolveComponent('GitChangelog'))
    }
    return null
  })
}
