declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.vue' {
  import type { Component } from 'vue'

  const comp: Component
  export default comp
}

declare module '*.css' {
  const res: string
  export default res
}
