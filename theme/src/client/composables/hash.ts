import { ref } from 'vue'
import { inBrowser } from '../utils/index.js'

const hashRef = ref(inBrowser ? location.hash : '')

if (inBrowser) {
  window.addEventListener('hashchange', () => {
    hashRef.value = location.hash
  })
}

export { hashRef }
