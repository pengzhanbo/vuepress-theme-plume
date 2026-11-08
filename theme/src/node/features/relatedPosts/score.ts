/**
 * Inverted index and TF-IDF cosine scoring for related posts.
 *
 * 相关文章的倒排索引与 TF-IDF 余弦打分实现。
 */
import type { RelatedPostsOptions } from '../../../shared/index.js'

/**
 * Minimal document shape required by the scorer.
 *
 * 打分器所需的最小文档结构。
 */
export interface ScorableDoc {
  /** Page path, used for deterministic tie-breaking / 页面路径，用于确定性排序 */
  path: string
  /** Create time in milliseconds / 创建时间（毫秒） */
  createTime: number
  /** Weighted term frequency, see `collect.ts` / 加权词频，见 `collect.ts` */
  terms: Map<string, number>
}

/**
 * A scored candidate
 *
 * 一个已打分的候选
 */
export interface ScoredCandidate {
  /** Index of the target document / 目标文档的下标 */
  index: number
  /** Cosine similarity, rounded to 4 decimals / 余弦相似度，保留 4 位小数 */
  score: number
}

interface Postings {
  ids: number[]
  weights: number[]
}

interface VectorizedDoc {
  vector: Map<string, number>
  norm: number
}

/**
 * Built index of a document group
 *
 * 一个文档分组的索引
 */
export interface PostingsIndex {
  docs: ScorableDoc[]
  postings: Map<string, Postings>
  vectors: VectorizedDoc[]
}

/** Terms appearing in more than 30% of the documents are dropped / 出现在 30% 以上文档中的词项会被丢弃 */
const MAX_DF_RATIO = 0.3
/** Keep at most 256 terms per document / 每篇最多保留 256 个词项 */
const MAX_TERMS_PER_DOC = 256
/** High frequency pruning only applies to groups with at least this many documents / 仅当分组文档数达到该值时才做高频裁剪 */
const DF_PRUNE_MIN_DOCS = 10
/** Body field prefix, the only field that is pruned by document frequency / 正文字段前缀，唯一按文档频率裁剪的字段 */
const BODY_FIELD = 'b'
/** Take `limit * 3` candidates before diversity selection / 多样性筛选前先取 limit * 3 个候选 */
export const TOPK_FACTOR = 3

/**
 * Field boosts, keyed by the single character field prefix of a term
 *
 * 字段权重，以词项的单个字符字段前缀为键
 */
export type FieldBoosts = Record<string, number>

function resolveField(term: string): string {
  const end = term.indexOf(':')
  return term.charCodeAt(0) === 35 /* # */ && end > 1 ? term.slice(1, end) : ''
}

/**
 * Build the inverted index and unit-normalized TF-IDF vectors
 *
 * 构建倒排索引与归一化的 TF-IDF 向量
 *
 * The vector and the postings must come from the same pruned term set, otherwise the
 * dot product would include weights that are not part of the normalization and the
 * cosine similarity could exceed 1.
 *
 * 向量与倒排索引必须来自同一份裁剪后的词项集合，否则点积会包含不在归一化范围内的
 * 权重，导致余弦相似度大于 1。
 *
 * Field boosts are applied to the final weight (instead of the raw frequency) so that a
 * single shared tag is not outnumbered by several shared body 2-grams.
 *
 * 字段权重作用于最终权重（而非原始词频），避免一个共享标签被若干共享正文 2-gram 压过。
 *
 * @param docs - Documents of one group / 同一分组的文档
 * @param fieldBoosts - Field boosts keyed by field prefix / 以字段前缀为键的字段权重
 */
export function buildIndex(docs: ScorableDoc[], fieldBoosts: FieldBoosts = {}): PostingsIndex {
  const total = docs.length

  // 第一遍：词项文档频率
  const df = new Map<string, number>()
  for (const doc of docs) {
    for (const term of doc.terms.keys())
      df.set(term, (df.get(term) ?? 0) + 1)
  }

  // 小集合里「所有文档共有」的词恰恰是相关性的证据，不做高频裁剪
  const maxDf = total >= DF_PRUNE_MIN_DOCS
    ? Math.floor(total * MAX_DF_RATIO)
    : Number.POSITIVE_INFINITY

  const postings = new Map<string, Postings>()
  const vectors: VectorizedDoc[] = []

  docs.forEach((doc, id) => {
    const entries = [...doc.terms]
      // 同权重按词项字典序，保证结果与 Map 插入顺序无关
      .sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))
      .slice(0, MAX_TERMS_PER_DOC)

    const vector = new Map<string, number>()
    let sumSq = 0

    for (const [term, tf] of entries) {
      const field = resolveField(term)
      const boost = fieldBoosts[field] ?? 1
      if (boost <= 0)
        continue

      const dfi = df.get(term)!
      // 高频裁剪只作用于正文：标签、分类、标题是人工标注的主题信号
      if (field === BODY_FIELD && dfi > maxDf)
        continue

      const idf = Math.log(1 + total / (1 + dfi))
      const weight = boost * (1 + Math.log(tf)) * idf

      vector.set(term, weight)
      sumSq += weight * weight

      const posting = postings.get(term) ?? { ids: [], weights: [] }
      posting.ids.push(id)
      posting.weights.push(weight)
      postings.set(term, posting)
    }

    vectors.push({ vector, norm: Math.sqrt(sumSq) || 1 })
  })

  return { docs, postings, vectors }
}

/**
 * Recency decay, `recency` is the half-life in years
 *
 * 时间衰减，`recency` 为以「年」为半衰期的衰减系数
 *
 * @param a - Create time of one document in ms / 一篇文档的创建时间（毫秒）
 * @param b - Create time of the other document in ms / 另一篇文档的创建时间（毫秒）
 * @param recency - Decay coefficient, `0` disables it / 衰减系数，`0` 表示不衰减
 */
export function recencyDecay(a: number, b: number, recency: number): number {
  if (!recency || !a || !b)
    return 1

  const years = Math.abs(a - b) / 864e5 / 365
  return 1 / (1 + recency * years)
}

/**
 * Score every document pair sharing at least one term
 *
 * 对存在共享词项的文档对打分
 *
 * Complexity is O(Σ_i Σ_{t∈i} |postings(t)|), close to linear after the `df` and
 * per-document term caps.
 *
 * 复杂度为 O(Σ_i Σ_{t∈i} |postings(t)|)，在词频与词项数双重裁剪后接近线性。
 *
 * @param index - Built index / 已构建的索引
 * @param options - Scoring options / 打分配置
 * @param options.minScore - Similarity threshold / 相似度阈值
 * @param options.recency - Recency decay coefficient / 时间衰减系数
 */
export function scoreAll(
  index: PostingsIndex,
  { minScore, recency }: Required<Pick<RelatedPostsOptions, 'minScore' | 'recency'>>,
): ScoredCandidate[][] {
  const { docs, postings, vectors } = index

  return docs.map((doc, i) => {
    const acc = new Map<number, number>()

    for (const [term, weight] of vectors[i].vector) {
      const posting = postings.get(term)
      if (!posting)
        continue

      for (let k = 0; k < posting.ids.length; k++) {
        const j = posting.ids[k]
        if (j === i)
          continue
        acc.set(j, (acc.get(j) ?? 0) + weight * posting.weights[k])
      }
    }

    const candidates: ScoredCandidate[] = []
    for (const [j, dot] of acc) {
      // 定点化，保证排序稳定
      const score = Math.round(
        (dot / (vectors[i].norm * vectors[j].norm)) * recencyDecay(doc.createTime, docs[j].createTime, recency) * 1e4,
      ) / 1e4

      if (score >= minScore)
        candidates.push({ index: j, score })
    }

    // 确定性排序：分数降序 → 新文章优先 → 路径升序
    candidates.sort((a, b) =>
      b.score - a.score
      || docs[b.index].createTime - docs[a.index].createTime
      || docs[a.index].path.localeCompare(docs[b.index].path),
    )

    return candidates
  })
}

/**
 * Cosine similarity between two indexed documents
 *
 * 两个已索引文档之间的余弦相似度
 *
 * @param index - Built index / 已构建的索引
 * @param a - Index of the first document / 第一个文档的下标
 * @param b - Index of the second document / 第二个文档的下标
 */
export function cosineSimilarity(index: PostingsIndex, a: number, b: number): number {
  const va = index.vectors[a]
  const vb = index.vectors[b]
  if (!va || !vb)
    return 0

  // 遍历较短的一侧，减少比较次数
  const [small, large] = va.vector.size <= vb.vector.size
    ? [va.vector, vb.vector]
    : [vb.vector, va.vector]

  let dot = 0
  for (const [term, weight] of small) {
    const other = large.get(term)
    if (other)
      dot += weight * other
  }

  return dot / (va.norm * vb.norm)
}

/**
 * Maximal Marginal Relevance selection
 *
 * 最大边际相关性选择：在相关度与多样性之间取平衡，避免推荐结果高度同质
 *
 * @param candidates - Scored candidates sorted by score desc / 按分数降序的候选
 * @param limit - Max number of items / 最多返回条数
 * @param similarity - Pairwise similarity reader / 两两相似度读取函数
 * @param lambda - `1` = pure relevance, `0` = pure diversity / `1` 只看相关度，`0` 只看多样性
 */
export function selectDiverse(
  candidates: ScoredCandidate[],
  limit: number,
  similarity: (a: number, b: number) => number,
  lambda = 0.7,
): ScoredCandidate[] {
  const selected: ScoredCandidate[] = []
  const rest = [...candidates]

  while (selected.length < limit && rest.length) {
    let bestIndex = 0
    let bestValue = Number.NEGATIVE_INFINITY

    for (let k = 0; k < rest.length; k++) {
      const candidate = rest[k]
      const maxSimilarity = selected.length
        ? Math.max(...selected.map(item => similarity(candidate.index, item.index)))
        : 0
      const value = lambda * candidate.score - (1 - lambda) * maxSimilarity

      if (value > bestValue) {
        bestValue = value
        bestIndex = k
      }
    }

    selected.push(rest.splice(bestIndex, 1)[0])
  }

  return selected
}
