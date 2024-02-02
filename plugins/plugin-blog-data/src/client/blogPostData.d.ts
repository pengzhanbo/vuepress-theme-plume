import type { BlogPostData } from '../shared/index.js'

declare module '@internal/blogData' {
  const blogPostData: BlogPostData
  const extraBlogData: Record<string, any>

  export { blogPostData, extraBlogData }
}
