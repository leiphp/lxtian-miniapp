/**
 * 请求相关配置（可按环境切换）
 */
export default {
  /** 接口根地址，与 api/*.js 中的路径拼接为完整 URL */
  baseURL: process.env.NODE_ENV === 'development'
    ? 'https://gw.100txy.com'
    : 'https://gw.100txy.com',
  /** 请求超时时间 ms */
  timeout: 15000,
  /** 本地存储的 token 键名 */
  tokenKey: 'token',
  /** 业务成功码（与后端约定，如 0 或 200） */
  successCode: 0
}
