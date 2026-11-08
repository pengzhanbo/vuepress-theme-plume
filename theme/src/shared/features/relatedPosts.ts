/**
 * Related posts field weights
 *
 * 相关文章推荐中各信号字段的权重
 */
export interface RelatedPostsWeights {
  /**
   * Weight of tags, the strongest signal
   *
   * 标签权重，最强信号
   *
   * @default 3
   */
  tags?: number
  /**
   * Weight of categories
   *
   * 分类权重
   *
   * @default 2
   */
  category?: number
  /**
   * Weight of the page title
   *
   * 标题权重
   *
   * @default 2
   */
  title?: number
  /**
   * Weight of heading text
   *
   * 标题结构权重
   *
   * @default 1.5
   */
  headings?: number
  /**
   * Weight of the body text
   *
   * 正文权重
   *
   * @default 1
   */
  content?: number
}

/**
 * Related posts options
 *
 * 相关文章推荐配置
 *
 * 推荐结果在构建期计算（TF-IDF + 余弦相似度），客户端只负责渲染。
 */
export interface RelatedPostsOptions {
  /**
   * Max number of related posts, clamped to 1–12
   *
   * 最多推荐条数，取值会被限制在 1–12
   *
   * @default 4
   */
  limit?: number
  /**
   * Similarity threshold, candidates below it are dropped
   *
   * 相似度阈值，低于该值的候选不会被展示
   *
   * @default 0.12
   */
  minScore?: number
  /**
   * Field weights
   *
   * 各信号字段的权重
   */
  weights?: RelatedPostsWeights
  /**
   * Recency decay, expressed as a half-life in years. `0` disables it.
   *
   * 时间衰减系数，以「年」为半衰期，`0` 表示不考虑新旧
   *
   * @default 0
   */
  recency?: number
  /**
   * Diversity of the result (0–1), implemented with MMR. `0` disables it and keeps
   * the pure relevance order.
   *
   * 推荐结果的多样性（0–1），通过 MMR 实现。`0` 表示关闭，仅按相关度排序。
   *
   * @default 0.3
   */
  diversity?: number
  /**
   * Candidate scope
   * - `collection`: only pages of the same collection (default)
   * - `locale`: all collections sharing the same locale and collection type
   *
   * 候选范围
   * - `collection`: 仅在当前集合内推荐（默认）
   * - `locale`: 同语言、同集合类型的所有集合
   *
   * @default 'collection'
   */
  scope?: 'collection' | 'locale'
  /**
   * Max characters of the body used for scoring, `0` disables the body signal
   *
   * 参与计算的正文最大字符数，`0` 表示不参与计算
   *
   * @default 2000
   */
  contentLimit?: number
  /**
   * CJK tokenizer strategy
   * - `segmenter`: use the built-in `Intl.Segmenter`
   * - `bigram`: split CJK runs into 2-grams (fully deterministic)
   *
   * 中文分词策略
   * - `segmenter`: 使用内置 `Intl.Segmenter`
   * - `bigram`: 按 2-gram 切分（结果完全确定）
   *
   * @default 'segmenter'
   */
  cjk?: 'segmenter' | 'bigram'
  /**
   * Whether to include an excerpt in each item
   *
   * 是否在推荐项中附带摘要
   *
   * @default false
   */
  showExcerpt?: boolean
  /**
   * Max length of the excerpt
   *
   * 摘要最大长度
   *
   * @default 80
   */
  excerptLength?: number
  /**
   * Title of the block, defaults to the theme locale text
   *
   * 区块标题，默认取主题的本地化文案
   */
  title?: string
  /**
   * Paths to exclude, supports exact paths and glob patterns
   *
   * 需要排除的路径，支持精确路径与 glob 模式
   */
  exclude?: string[]
  /**
   * Print per-page scores in the build log
   *
   * 在构建日志中输出评分明细
   *
   * @default false
   */
  debug?: boolean
}

/**
 * Related post item, resolved at build time
 *
 * 构建期计算出的相关文章项
 */
export interface ThemeRelatedPostItem {
  /**
   * Target page path
   *
   * 目标页面路径
   */
  path: string
  /**
   * Target page title
   *
   * 目标页面标题
   */
  title: string
  /**
   * Target page tags
   *
   * 目标页面标签
   */
  tags?: string[]
  /**
   * Target page create time
   *
   * 目标页面创建时间
   */
  createTime?: string
  /**
   * Excerpt, only present when `showExcerpt` is enabled
   *
   * 摘要，仅在开启 `showExcerpt` 时存在
   */
  excerpt?: string
}
