/**
 * 登录状态与微信登录封装（API 层）
 * - 小程序端：wx.login
 * - App 端：uni.login provider=weixin（需在 manifest 中配置）
 * - 后端登录接口：/auth/:type/login，此处固定 type=4
 */
import config from '@/utils/config.js'
import { post } from '@/utils/request.js'

export function getToken() {
  try {
    return uni.getStorageSync(config.tokenKey) || ''
  } catch (e) {
    return ''
  }
}

export function setToken(token) {
  try {
    uni.setStorageSync(config.tokenKey, token || '')
  } catch (e) {}
}

export function clearToken() {
  try {
    uni.removeStorageSync(config.tokenKey)
  } catch (e) {}
}

export function isLoggedIn() {
  return !!getToken()
}

/**
 * 统一的微信登录流程：获取 code + 用户信息 -> 调用后台换取业务 token
 * 后端接口：/auth/4/login
 * 请求体示例：
 * {
 *   "code": "xxx",
 *   "uuid": "",
 *   "login_type": 4,
 *   "userinfo": { nickName, gender, ... }
 * }
 */
export async function loginWithWeixin() {
  // 1. 获取登录 code
  const loginRes = await new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success(res) {
        if (!res.code) {
          reject(new Error('登录失败：未获取到 code'))
        } else {
          resolve(res)
        }
      },
      fail(err) {
        reject(err || new Error('微信登录失败'))
      }
    })
  })

  // 2. 获取微信用户基础信息（头像、昵称等）
  let userInfo = {}
  try {
    const profileRes = await new Promise((resolve, reject) => {
      uni.getUserProfile({
        desc: '用于完善会员资料',
        success: resolve,
        fail: reject
      })
    })
    userInfo = profileRes?.userInfo || {}
  } catch (e) {
    // 用户拒绝授权时，仍然允许继续登录，但 userinfo 为空或默认值
    userInfo = {}
  }

  // 如果你在别处生成过 uuid，可以从本地取；现在默认空字符串
  let uuid = ''
  try {
    uuid = uni.getStorageSync('uuid') || ''
  } catch (e) {
    uuid = ''
  }

  const payload = {
    code: loginRes.code,
    uuid,
    login_type: 4,
    userinfo: {
      nickName: userInfo.nickName || '微信用户',
      gender: userInfo.gender ?? 0,
      language: userInfo.language || '',
      city: userInfo.city || '',
      province: userInfo.province || '',
      country: userInfo.country || '',
      avatarUrl: userInfo.avatarUrl || '',
      is_demote: true
    }
  }

  // 3. 将 code + 用户信息 发送给后端换取业务 token
  const data = await post(
    '/user/login',
    payload,
    {
      noAuth: true,
      header: {
        appname: 'blog_miniapp',
        token: getToken() || ''
      }
    }
  )

  // 结合你给的示例，后端返回结构大致为：
  // { data: { access_token, user: { nickname, head_img, ... } } }
  // request 封装已把 res.data.data 解包为 data，这里直接取 data.access_token
  if (!data || !data.access_token) {
    throw new Error('登录接口未返回 access_token')
  }

  setToken(data.access_token)

  // 同步更新本地 userInfo（nickName / avatarUrl / vip）
  try {
    const oldUserInfo = uni.getStorageSync('userInfo') || {}
    const newUserInfo = {
      ...oldUserInfo,
      uid: data.user?.uid || oldUserInfo.uid || 0,
      nickName: data.user?.nickname || oldUserInfo.nickName || '微信用户',
      avatarUrl: data.user?.head_img || oldUserInfo.avatarUrl || '',
      vip: data.user?.vip || oldUserInfo.vip || null
    }
    uni.setStorageSync('userInfo', newUserInfo)
  } catch (e) {
    // ignore storage error
  }

  return data
}

/**
 * 确保已登录：
 * - 已有 token：直接返回 true
 * - 否则弹窗提示并拉起微信登录
 */
export async function ensureLogin() {
  if (isLoggedIn()) return true

  const modalRes = await new Promise((resolve) => {
    uni.showModal({
      title: '登录提示',
      content: '登录后可同步学习进度和购买记录',
      confirmText: '微信登录',
      cancelText: '暂不登录',
      success(res) {
        resolve(res)
      },
      fail() {
        resolve({ confirm: false })
      }
    })
  })

  if (!modalRes.confirm) return false

  try {
    await loginWithWeixin()
    uni.showToast({ title: '登录成功', icon: 'none' })
    return true
  } catch (e) {
    uni.showToast({ title: e?.message || '登录失败', icon: 'none' })
    return false
  }
}

