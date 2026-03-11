/**
 * 分类相关接口（专栏分类等）
 */
import { get } from '@/utils/request.js'

/**
 * 分类列表
 * @param {Object} params - { page, page_size }
 * @returns {Promise<{ list: Array, page: number, page_size: number, total: number }>}
 */
export function getCategoryList(params = {}) {
  return get('/web/category/list', {
    page: params.page ?? 1,
    page_size: params.page_size ?? 10
  }, { noAuth: true, noToast: true })
}
