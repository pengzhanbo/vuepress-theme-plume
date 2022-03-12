export interface NavbarItemOption {
  label: string
  link: string
  frontmatter: Record<string, any>
}

export const navbarList: NavbarItemOption[] = [
  { label: '栏目', link: '/category/', frontmatter: { pageType: 'category' } },
  { label: '标签', link: '/tags/', frontmatter: { pageType: 'tags' } },
  { label: '归档', link: '/archives/', frontmatter: { pageType: 'archives' } },
]
