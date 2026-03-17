import CryptoJS from 'crypto-js'
import { QINIU_CONFIG, DEFAULT_EXPIRES, isQiniuConfigured } from '@/config/qiniu.js'

// 生成七牛私有空间 HTTPS 访问 URL
export function generatePrivateHttpsUrl(key, expires = DEFAULT_EXPIRES) {
	if (!CryptoJS || typeof CryptoJS.HmacSHA1 !== 'function') {
		console.warn('[qiniu] crypto-js 未正确加载，无法生成签名')
		return `https://${String(QINIU_CONFIG.domain || '').replace(/^https?:\/\//, '')}/${key}`
	}

	const { accessKey, secretKey, domain } = QINIU_CONFIG

	const cleanDomain = String(domain || '').replace(/^https?:\/\//, '')
	const downloadUrl = `https://${cleanDomain}/${key}`

	const deadline = Math.floor(Date.now() / 1000) + expires
	const signString = `${downloadUrl}?e=${deadline}`

	const signature = CryptoJS.HmacSHA1(signString, secretKey).toString(CryptoJS.enc.Base64)
	const encodedSignature = signature.replace(/\+/g, '-').replace(/\//g, '_')

	return `${downloadUrl}?e=${deadline}&token=${accessKey}:${encodedSignature}`
}

// 不依赖 URL 构造函数，兼容小程序环境
export function extractKeyFromUrl(url) {
	if (typeof url !== 'string' || !url) return ''
	// 去掉协议和域名，取 path 部分，再去掉首位的 / 和 query
	const domain = 'img.100txy.com'
	const idx = url.indexOf(domain)
	if (idx === -1) return ''
	const pathStart = idx + domain.length
	const pathPart = url.slice(pathStart).replace(/^\//, '').split('?')[0]
	return pathPart || ''
}

export function isQiniuPrivateUrl(url) {
	return typeof url === 'string' && url.includes('img.100txy.com') && !url.includes('token=')
}

// 头像 URL 处理：如果是七牛私有资源，则自动带上 token
export function processAvatarUrl(url, expires = DEFAULT_EXPIRES) {
	if (!url) return '/static/avatar.png'

	if (!isQiniuConfigured()) {
		console.warn('七牛云配置不完整，无法生成签名 URL，返回原始 URL')
		return url
	}

	if (isQiniuPrivateUrl(url)) {
		const key = extractKeyFromUrl(url)
		if (!key) return url
		return generatePrivateHttpsUrl(key, expires)
	}

	return url
}

