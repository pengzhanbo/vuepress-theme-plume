import type { BlogPostData } from '../shared/index.js'

declare module '@internal/blogData' {
  const blogPostData: BlogPostData

  export { blogPostData }
}
