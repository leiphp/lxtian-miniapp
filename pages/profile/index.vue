<template>
	<view class="page">
		<!-- 顶部占位（去掉标题与图标） -->
		<view class="nav">
			<view class="nav-right"></view>
		</view>

		<scroll-view class="scroll" scroll-y>
			<view class="container">
				<!-- 头像 + 昵称 + 等级 + ID -->
				<view class="profile-card">
					<view class="avatar-wrap">
						<image
							class="avatar-img"
							:src="isLogin ? (avatarUrl || '/static/avatar.png') : '/static/avatar.png'"
							mode="aspectFill"
						/>
						<view class="avatar-badge" v-if="isLogin">
							<text class="avatar-badge-text">PRO</text>
						</view>
					</view>
					<view class="profile-main">
						<view class="name-row">
							<text class="name">{{ isLogin ? (userInfo.nickName || '微信用户') : '未登录' }}</text>
							<view class="level-badge" v-if="isLogin && isVip">
								<text class="level-text">V{{ vipLevel }}</text>
								<text class="level-bar">‖</text>
								<text class="level-bar">{{ vipExpireDate }}</text>
							</view>
						</view>
						<text class="user-id" v-if="isLogin">ID: {{ userInfo.uid }}</text>
						<text class="user-id sub" v-else>登录后同步学习进度与购买记录</text>
					</view>
				</view>

				<!-- 统计三卡片 -->
				<view class="stats-row">
					<view class="stat-item">
						<text class="stat-number">12</text>
						<text class="stat-label">我的专栏</text>
					</view>
					<view class="stat-item">
						<text class="stat-number">256</text>
						<text class="stat-label">收藏记录</text>
					</view>
					<view class="stat-item">
						<text class="stat-number">89h</text>
						<text class="stat-label">学习时长</text>
					</view>
				</view>

				<!-- 超级会员中心：仅在 VIP 有效时显示 -->
				<view class="member-card" v-if="isLogin && isVip">
					<view class="member-bg"></view>
					<view class="member-pattern"></view>
					<view class="member-content">
						<view class="member-head">
							<view class="member-title-wrap">
								<view class="member-star">★</view>
								<text class="member-title">超级会员中心</text>
							</view>
							<text class="member-expire">{{ vipExpireDate }}</text>
						</view>
						<view class="member-desc">
							<text class="member-desc-main">50+ AI</text>
							<text class="member-desc-sub">尊享无限次 AI 模型调用与专享技术文档</text>
						</view>
						<view class="member-actions">
							<view class="member-btn primary" @click="tapRenew">
								<text class="member-btn-text">立即续费</text>
							</view>
							<view class="member-btn outline" @click="tapBenefits">
								<text class="member-btn-text">权益说明</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 第一组菜单 -->
				<view class="menu-group">
					<view class="menu-item" @click="tapCell('orders')">
						<view class="menu-icon doc">
							<image class="menu-icon-img" src="/static/icon/order.png" mode="aspectFit" />
						</view>
						<text class="menu-text">我的订单</text>
						<text class="menu-arrow">›</text>
					</view>
					<view class="menu-item" @click="tapCell('columns')">
						<view class="menu-icon doc">
							<image class="menu-icon-img" src="/static/icon/column.png" mode="aspectFit" />
						</view>
						<text class="menu-text">我的专栏</text>
						<text class="menu-arrow">›</text>
					</view>
					<view class="menu-item" @click="tapCell('favorites')">
						<view class="menu-icon bookmark">
							<image class="menu-icon-img" src="/static/icon/star.png" mode="aspectFit" />
						</view>
						<text class="menu-text">我的收藏</text>
						<text class="menu-arrow">›</text>
					</view>
				</view>

				<!-- 第二组：帮助、退出（未登录时隐藏退出） -->
				<view class="menu-group second">
					<view class="menu-item" @click="tapCell('help')">
						<view class="menu-icon help">
							<image class="menu-icon-img" src="/static/icon/help.png" mode="aspectFit" />
						</view>
						<text class="menu-text">帮助与反馈</text>
						<text class="menu-arrow">›</text>
					</view>
					<view class="menu-item" v-if="isLogin" @click="tapLogout">
						<view class="menu-icon logout">
							<image class="menu-icon-img" src="/static/icon/exit.png" mode="aspectFit" />
						</view>
						<text class="menu-text logout-text">退出登录</text>
						<text class="menu-arrow">›</text>
					</view>
				</view>

				<view class="bottom-space"></view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ensureLogin, isLoggedIn, clearToken } from '@/api/auth.js'
import CryptoJS from 'crypto-js'
import { QINIU_CONFIG, DEFAULT_EXPIRES, isQiniuConfigured } from '@/config/qiniu.js'

const isLogin = ref(false)
const avatarUrl = ref('')
const userInfo = ref({})

const isVip = computed(() => {
	const vip = userInfo.value && userInfo.value.vip
	return !!(vip && vip.is_valid)
})

const vipLevel = computed(() => {
	const level = userInfo.value?.vip?.level
	return level || 0
})

const vipExpireDate = computed(() => {
	const end = userInfo.value?.vip?.end_time
	if (!end) return ''
	// 格式如 "2026-04-15 00:27:17" -> 只取年月日
	return String(end).split(' ')[0]
})

function generatePrivateHttpsUrl(key, expires = DEFAULT_EXPIRES) {
	if (!CryptoJS || typeof CryptoJS.HmacSHA1 !== 'function') {
		console.warn('[qiniu] crypto-js 未正确加载，无法生成签名')
		const cleanDomain = String(QINIU_CONFIG.domain || '').replace(/^https?:\/\//, '')
		return `https://${cleanDomain}/${key}`
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

function extractKeyFromUrl(url) {
	if (typeof url !== 'string' || !url) return ''
	const domain = 'img.100txy.com'
	const idx = url.indexOf(domain)
	if (idx === -1) return ''
	const pathStart = idx + domain.length
	const pathPart = url.slice(pathStart).replace(/^\//, '').split('?')[0]
	return pathPart || ''
}

function isQiniuPrivateUrl(url) {
	return typeof url === 'string' && url.includes('img.100txy.com') && !url.includes('token=')
}

function processAvatarUrl(url, expires = DEFAULT_EXPIRES) {
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

function loadUserInfo() {
	try {
		const stored = uni.getStorageSync('userInfo') || {}
		userInfo.value = stored
		const rawAvatar = stored.avatarUrl || stored.head_img || ''
		if (rawAvatar) {
			try {
				avatarUrl.value = processAvatarUrl(rawAvatar)
			} catch (e) {
				console.error('[qiniu] processAvatarUrl error', e)
				avatarUrl.value = rawAvatar
			}
		} else {
			avatarUrl.value = ''
		}
	} catch (e) {
		userInfo.value = {}
		avatarUrl.value = ''
	}
}

onMounted(() => {
	isLogin.value = isLoggedIn()
	if (isLogin.value) {
		loadUserInfo()
	}
})

async function guardLogin(handler, ...args) {
	const ok = await ensureLogin()
	isLogin.value = ok
	if (ok) {
		loadUserInfo()
	}
	if (!ok) return
	handler && handler(...args)
}

function tapCell(type) {
	guardLogin(() => {
		uni.showToast({ title: type, icon: 'none' })
	})
}

function tapRenew() {
	guardLogin(() => {
		uni.showToast({ title: '立即续费', icon: 'none' })
	})
}

function tapBenefits() {
	guardLogin(() => {
		uni.showToast({ title: '权益说明', icon: 'none' })
	})
}

async function tapLogout() {
	if (!isLogin.value) {
		uni.showToast({ title: '当前未登录', icon: 'none' })
		return
	}
	const { confirm } = await new Promise((resolve) => {
		uni.showModal({
			title: '退出登录',
			content: '确定要退出当前账号吗？',
			success: resolve,
			fail: () => resolve({ confirm: false })
		})
	})
	if (!confirm) return
	clearToken()
	isLogin.value = false
	userInfo.value = {}
	avatarUrl.value = ''
	uni.showToast({ title: '已退出登录', icon: 'none' })
}
</script>

<style>
	.page {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: #0b1020;
		padding-top: constant(safe-area-inset-top);
		padding-top: env(safe-area-inset-top);
	}

	.nav {
		/* height: 96rpx; */
		padding: 0 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		margin-top: 12rpx;
	}

	.nav-title {
		font-size: 34rpx;
		color: rgba(255, 255, 255, 0.95);
		font-weight: 700;
	}

	.nav-right {
		position: absolute;
		right: 24rpx;
		width: 56rpx;
		height: 56rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-icon {
		font-size: 36rpx;
		color: rgba(255, 255, 255, 0.9);
	}

	.scroll {
		flex: 1;
	}

	.container {
		padding: 12rpx 24rpx 0 24rpx;
		box-sizing: border-box;
	}

	/* 头像区域 */
	.profile-card {
		margin-top: 16rpx;
		padding: 24rpx 0;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.avatar-wrap {
		width: 120rpx;
		height: 120rpx;
		border-radius: 60rpx;
		overflow: visible;
		margin-right: 24rpx;
		position: relative;
	}

	.avatar-img {
		width: 100%;
		height: 100%;
		border-radius: 60rpx;
	}

	/* PRO 标识：头像右下角悬浮徽章 */
	.avatar-badge {
		position: absolute;
		right: -4rpx;
		bottom: 0;
		min-width: 48rpx;
		height: 32rpx;
		border-radius: 16rpx;
		background: #0d33f2;
		padding: 0 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.avatar-badge-text {
		font-size: 20rpx;
		color: #fff;
		font-weight: 700;
	}

	.profile-main {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.name-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;
	}

	.name {
		font-size: 36rpx;
		color: rgba(255, 255, 255, 0.98);
		font-weight: 700;
		margin-right: 12rpx;
	}

	.level-badge {
		display: inline-flex;
		flex-direction: row;
		align-items: center;
		height: 36rpx;
		padding: 0 12rpx;
		border-radius: 10rpx;
		background: #0d33f2;
	}

	.level-text {
		font-size: 22rpx;
		color: #fff;
		font-weight: 700;
	}

	.level-bar {
		font-size: 18rpx;
		color: rgba(255, 255, 255, 0.8);
		margin-left: 4rpx;
	}

	.user-id {
		margin-top: 8rpx;
		font-size: 24rpx;
		color: rgba(148, 163, 184, 0.9);
	}

	.user-id.sub {
		color: rgba(148, 163, 184, 0.65);
	}

	/* 统计三卡片 */
	.stats-row {
		margin-top: 20rpx;
		display: flex;
		flex-direction: row;
		gap: 16rpx;
	}

	.stat-item {
		flex: 1;
		padding: 24rpx 16rpx;
		border-radius: 24rpx;
		background: rgba(30, 41, 59, 0.8);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.stat-number {
		font-size: 40rpx;
		color: #0d33f2;
		font-weight: 700;
		line-height: 1.2;
	}

	.stat-label {
		margin-top: 8rpx;
		font-size: 22rpx;
		color: rgba(148, 163, 184, 0.9);
	}

	/* 超级会员卡片 */
	.member-card {
		margin-top: 28rpx;
		border-radius: 28rpx;
		overflow: hidden;
		position: relative;
		min-height: 260rpx;
	}

	.member-bg {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(135deg, #2563eb 0%, #0d33f2 40%, #7c3aed 100%);
	}

	.member-pattern {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		opacity: 0.12;
		background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='none' stroke='%23fff' stroke-width='0.5'/%3E%3Cpath d='M0 0L60 0L60 60L0 60z' fill='none' stroke='%23fff' stroke-width='0.3'/%3E%3C/svg%3E");
	}

	.member-content {
		position: relative;
		padding: 28rpx 24rpx;
		display: flex;
		flex-direction: column;
	}

	.member-head {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16rpx;
	}

	.member-title-wrap {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.member-star {
		width: 44rpx;
		height: 44rpx;
		border-radius: 22rpx;
		background: rgba(255, 255, 255, 0.25);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #fff;
		margin-right: 12rpx;
	}

	.member-title {
		font-size: 32rpx;
		color: #fff;
		font-weight: 700;
	}

	.member-expire {
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.85);
	}

	.member-desc {
		margin-bottom: 24rpx;
	}

	.member-desc-main {
		font-size: 28rpx;
		color: #fff;
		font-weight: 700;
		margin-right: 8rpx;
	}

	.member-desc-sub {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.9);
		line-height: 1.45;
	}

	.member-actions {
		display: flex;
		flex-direction: row;
		gap: 16rpx;
	}

	.member-btn {
		flex: 1;
		height: 72rpx;
		border-radius: 36rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.member-btn.primary {
		background: #0d33f2;
	}

	.member-btn.outline {
		background: transparent;
		border: 2rpx solid rgba(255, 255, 255, 0.6);
	}

	.member-btn-text {
		font-size: 28rpx;
		color: #fff;
		font-weight: 600;
	}

	/* 菜单组 */
	.menu-group {
		margin-top: 24rpx;
		border-radius: 24rpx;
		overflow: hidden;
		background: rgba(30, 41, 59, 0.8);
	}

	.menu-group.second {
		margin-top: 32rpx;
	}

	.menu-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 28rpx 24rpx;
		border-bottom-width: 1rpx;
		border-bottom-style: solid;
		border-bottom-color: rgba(255, 255, 255, 0.06);
	}

	.menu-item:last-child {
		border-bottom-width: 0;
	}

	.menu-icon {
		width: 48rpx;
		height: 48rpx;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
	}

	.menu-icon-img {
		width: 28rpx;
		height: 28rpx;
	}

	.menu-icon.doc {
		background: rgba(59, 130, 246, 0.2);
	}

	.menu-icon.bookmark {
		background: rgba(249, 115, 22, 0.2);
	}

	.menu-icon.help {
		background: rgba(34, 197, 94, 0.2);
	}

	.menu-icon.logout {
		background: rgba(239, 68, 68, 0.2);
	}

	.menu-text {
		flex: 1;
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.95);
	}

	.menu-text.logout-text {
		color: rgba(239, 68, 68, 0.95);
	}

	.menu-arrow {
		font-size: 32rpx;
		color: rgba(148, 163, 184, 0.6);
	}

	.bottom-space {
		height: 80rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>
