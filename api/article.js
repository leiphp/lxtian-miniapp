/**
 * 文章相关接口（专栏列表等）
 */
import { get } from '@/utils/request.js'

/**
 * 文章列表
 * - 默认：page_size=6
 * - 分类：传 cid
 * - 推荐：传 types=1
 * @param {Object} params - { page, page_size, cid, types }
 * @returns {Promise<{ list: Array, page: number, page_size: number, total: number }>}
 */
export function getArticleList(params = {}) {
  const payload = {
    page: params.page ?? 1,
    page_size: params.page_size ?? 6
  }
  if (params.cid !== undefined && params.cid !== null && params.cid !== '') {
    payload.cid = params.cid
  }
  if (params.types !== undefined && params.types !== null && params.types !== '') {
    payload.types = params.types
  }
  return get('/web/article/list', payload, { noAuth: true, noToast: true })
}

/**
 * 文章详情
 * @param {number|string} id - 文章 ID
 * @returns {Promise<Object>} 文章详情对象
 */
export function getArticleDetail(id) {
  if (!id) {
    return Promise.reject(new Error('missing article id'))
  }
  return get(`/web/article/${id}`, {}, { noAuth: true, noToast: true })
}


