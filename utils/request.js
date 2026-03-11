/**
 * 封装 uni.request 的请求工具类
 * 支持：baseURL、统一 header、token、错误与业务码处理
 */
import config from './config.js'

/**
 * 从本地存储读取 token
 */
function getToken() {
  try {
    return uni.getStorageSync(config.tokenKey) || ''
  } catch (e) {
    return ''
  }
}

/**
 * 统一请求
 * @param {Object} options - 同 uni.request，额外支持 baseURL、noAuth、noToast
 * @param {string} [options.url] - 路径（相对 baseURL 或绝对）
 * @param {string} [options.method='GET']
 * @param {Object} [options.data]
 * @param {boolean} [options.noAuth] - 为 true 时不带 token
 * @param {boolean} [options.noToast] - 为 true 时接口错误不自动 showToast
 * @returns {Promise<unknown>} 成功时 resolve 为 data 或完整 response（由业务约定）
 */
function request(options = {}) {
  const {
    url = '',
    method = 'GET',
    data = {},
    header = {},
    noAuth = false,
    noToast = false,
    ...rest
  } = options

  const fullUrl = url.startsWith('http') ? url : (config.baseURL.replace(/\/$/, '') + '/' + url.replace(/^\//, ''))
  const token = noAuth ? '' : getToken()

  const defaultHeader = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...header
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: fullUrl,
      method: method.toUpperCase(),
      data,
      header: defaultHeader,
      timeout: config.timeout,
      ...rest,
      success(res) {
        const { statusCode, data: resData } = res
        if (statusCode >= 200 && statusCode < 300) {
          // 若后端用 body 里 code 表示业务状态，可在此统一处理
          const code = resData?.code
          if (code !== undefined && code !== config.successCode && code !== 200) {
            if (!noToast && resData?.message) {
              uni.showToast({ title: resData.message, icon: 'none' })
            }
            reject(new Error(resData?.message || '请求失败'))
            return
          }
          // 约定：直接返回 data 字段，若无则返回整份 res.data
          resolve(resData?.data !== undefined ? resData.data : resData)
        } else if (statusCode === 401) {
          try {
            uni.removeStorageSync(config.tokenKey)
          } catch (e) {}
          if (!noToast) {
            uni.showToast({ title: '请先登录', icon: 'none' })
          }
          reject(new Error('未授权'))
        } else {
          const msg = resData?.message || `请求失败(${statusCode})`
          if (!noToast) {
            uni.showToast({ title: msg, icon: 'none' })
          }
          reject(new Error(msg))
        }
      },
      fail(err) {
        const msg = err?.errMsg || '网络错误'
        if (!noToast) {
          uni.showToast({ title: msg, icon: 'none' })
        }
        reject(new Error(msg))
      }
    })
  })
}

/**
 * GET
 * @param {string} url
 * @param {Object} [data] - query 参数
 * @param {Object} [options] - 透传 request 的 noAuth、noToast 等
 */
export function get(url, data = {}, options = {}) {
  return request({ url, method: 'GET', data, ...options })
}

/**
 * POST
 */
export function post(url, data = {}, options = {}) {
  return request({ url, method: 'POST', data, ...options })
}

/**
 * PUT
 */
export function put(url, data = {}, options = {}) {
  return request({ url, method: 'PUT', data, ...options })
}

/**
 * DELETE
 */
export function del(url, data = {}, options = {}) {
  return request({ url, method: 'DELETE', data, ...options })
}

export { request, getToken, config }
export default request
