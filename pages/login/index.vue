<template>
	<view class="page">
		<!-- 顶部：关闭 + 标题 -->
		<view class="header">
			<view class="header-close" @click="handleClose">
				<text class="header-close-icon">×</text>
			</view>
			<text class="header-title">确认登录</text>
			<view class="header-placeholder"></view>
		</view>

		<!-- 主内容区 -->
		<view class="main">
			<!-- Logo + 应用名 -->
			<view class="brand">
				<view class="brand-logo-wrap">
					<view class="brand-logo-glow"></view>
					<view class="brand-logo-inner">
						<view class="brand-logo-icon">◆</view>
					</view>
				</view>
				<text class="brand-title">Al Nexus</text>
				<text class="brand-subtitle">开放平台安全验证</text>
			</view>

			<!-- 玻璃卡片 -->
			<view class="glass-panel">
				<view class="panel-row">
					<view class="panel-icon-wrap">
						<text class="panel-icon">✓</text>
					</view>
					<view class="panel-text">
						<text class="panel-title">您正在登录 Al Nexus 平台</text>
						<text class="panel-desc">请确认是否允许使用微信账号登录该网站，我们将保护您的隐私安全。</text>
					</view>
				</view>

				<view class="panel-divider"></view>

				<view class="account-row">
					<view class="account-left">
						<view class="account-avatar-wrap">
							<image
								class="account-avatar"
								:src="isLogin ? (avatarUrl || '/static/avatar.png') : '/static/avatar.png'"
								mode="aspectFill"
							/>
						</view>
						<view class="account-info">
							<text class="account-name">{{ isLogin ? (userInfo.nickName || '微信用户') : '未登录' }}</text>
							<text class="account-label">微信授权账号</text>
						</view>
					</view>
					<view class="account-check-wrap">
						<text class="account-check">●</text>
					</view>
				</view>

				<view class="btn-group">
					<button class="btn btn-primary" :loading="submitting" @click="handleConfirm">
						<text class="btn-text">确认登录</text>
					</button>
					<button class="btn btn-outline" @click="handleCancel">
						<text class="btn-text">取消登录</text>
					</button>
				</view>
			</view>
		</view>

		<!-- 底部说明 -->
		<view class="footer">
			<text class="footer-text">本次登录仅用于身份验证，不会获取您的朋友圈、聊天记录等其他私人信息。</text>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { ensureLogin, isLoggedIn, loginWithWeixin, updateQrStatus } from '@/api/auth.js'

const loginToken = ref('') // 这里作为 uuid 使用
const submitting = ref(false)
const userInfo = ref({})
const avatarUrl = ref('')
const isLogin = ref(false)

async function initPage(options) {
	const sceneRaw = options?.scene || ''
	const scene = sceneRaw ? decodeURIComponent(sceneRaw) : ''
	loginToken.value = scene || options?.uuid || options?.token || options?.login_token || ''
	console.log('[login] initPage options=', options, 'scene=', scene, 'loginToken=', loginToken.value)

	try {
		const stored = uni.getStorageSync('userInfo') || {}
		userInfo.value = stored
		avatarUrl.value = stored.avatarUrl || '/static/avatar.png'
		isLogin.value = isLoggedIn()
	} catch (e) {
		userInfo.value = {}
		avatarUrl.value = '/static/avatar.png'
		isLogin.value = isLoggedIn()
	}

	// 打开页面时，自动通知后端：二维码状态变为 2（已扫码待确认）
	// 即使当前没有 uuid，也先尝试调用，方便你在 Network 中看到请求
	try {
		await updateQrStatus(loginToken.value || '', 2)
	} catch (e) {
		console.error('updateQrStatus error', e)
	}
}

onLoad((options) => {
	initPage(options || {})
})

async function handleConfirm() {
	if (!loginToken.value) {
		uni.showToast({ title: '登录标识无效', icon: 'none' })
		return
	}

	try {
		submitting.value = true

		if (!isLoggedIn()) {
			await loginWithWeixin()
		} else {
			await ensureLogin()
		}

		// TODO: 调用后端扫码确认接口
		// await confirmWebScanLogin(loginToken.value)

		uni.showToast({ title: '已确认登录', icon: 'none' })
		setTimeout(() => {
			uni.navigateBack({ delta: 1 })
		}, 800)
	} catch (e) {
		uni.showToast({ title: e?.message || '确认失败', icon: 'none' })
	} finally {
		submitting.value = false
	}
}

function handleCancel() {
	uni.showToast({ title: '已取消', icon: 'none' })
	setTimeout(() => {
		uni.navigateBack({ delta: 1 })
	}, 500)
}

function handleClose() {
	handleCancel()
}
</script>

<style>
	/* 设计变量：与 HTML 中 tailwind 一致 */
	.page {
		min-height: 100vh;
		background-color: #101322;
		display: flex;
		flex-direction: column;
		color: #f1f5f9;
		padding-top: constant(safe-area-inset-top);
		padding-top: env(safe-area-inset-top);
	}

	/* 顶部栏 */
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 32rpx;
		flex-shrink: 0;
	}

	.header-close {
		width: 80rpx;
		height: 80rpx;
		border-radius: 9999rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.header-close-icon {
		font-size: 48rpx;
		color: #f1f5f9;
		line-height: 1;
	}

	.header-title {
		flex: 1;
		text-align: center;
		font-size: 36rpx;
		font-weight: 700;
		color: #f1f5f9;
		letter-spacing: -0.5rpx;
	}

	.header-placeholder {
		width: 80rpx;
	}

	/* 主内容 */
	.main {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 48rpx 40rpx 32rpx;
	}

	/* 品牌区 */
	.brand {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 80rpx;
	}

	.brand-logo-wrap {
		position: relative;
		width: 192rpx;
		height: 192rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.brand-logo-glow {
		position: absolute;
		left: -8rpx;
		right: -8rpx;
		top: -8rpx;
		bottom: -8rpx;
		border-radius: 9999rpx;
		background: linear-gradient(135deg, #0d33f2, #9333ea);
		opacity: 0.25;
	}

	.brand-logo-inner {
		position: relative;
		width: 192rpx;
		height: 192rpx;
		border-radius: 96rpx;
		background-color: #1e293b;
		box-shadow: 0 24rpx 48rpx rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.brand-logo-icon {
		width: 128rpx;
		height: 128rpx;
		border-radius: 24rpx;
		background-color: rgba(13, 51, 242, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 56rpx;
		color: #0d33f2;
	}

	.brand-title {
		margin-top: 48rpx;
		font-size: 48rpx;
		font-weight: 700;
		color: #f1f5f9;
		letter-spacing: -0.5rpx;
	}

	.brand-subtitle {
		margin-top: 16rpx;
		font-size: 28rpx;
		color: #94a3b8;
	}

	/* 玻璃面板 */
	.glass-panel {
		width: 100%;
		max-width: 600rpx;
		background: rgba(27, 29, 39, 0.7);
		border: 2rpx solid rgba(255, 255, 255, 0.05);
		border-radius: 24rpx;
		padding: 48rpx;
		box-shadow: 0 32rpx 64rpx rgba(0, 0, 0, 0.4);
	}

	.panel-row {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		gap: 32rpx;
	}

	.panel-icon-wrap {
		width: 96rpx;
		height: 96rpx;
		flex-shrink: 0;
		border-radius: 20rpx;
		background-color: rgba(13, 51, 242, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.panel-icon {
		font-size: 48rpx;
		color: #0d33f2;
		font-weight: 700;
	}

	.panel-text {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}

	.panel-title {
		font-size: 36rpx;
		font-weight: 600;
		color: #f1f5f9;
	}

	.panel-desc {
		font-size: 28rpx;
		color: #94a3b8;
		line-height: 1.5;
	}

	.panel-divider {
		height: 2rpx;
		background-color: #334155;
		width: 100%;
		margin: 32rpx 0;
	}

	.account-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: rgba(15, 23, 42, 0.5);
		padding: 32rpx;
		border-radius: 20rpx;
	}

	.account-left {
		display: flex;
		align-items: center;
		gap: 24rpx;
	}

	.account-avatar-wrap {
		width: 96rpx;
		height: 96rpx;
		border-radius: 48rpx;
		overflow: hidden;
		border: 4rpx solid rgba(13, 51, 242, 0.3);
	}

	.account-avatar {
		width: 100%;
		height: 100%;
	}

	.account-info {
		display: flex;
		flex-direction: column;
		gap: 4rpx;
	}

	.account-name {
		font-size: 32rpx;
		font-weight: 700;
		color: #f1f5f9;
	}

	.account-label {
		font-size: 24rpx;
		color: #94a3b8;
	}

	.account-check-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.account-check {
		font-size: 36rpx;
		color: #0d33f2;
		line-height: 1;
	}

	.btn-group {
		display: flex;
		flex-direction: column;
		gap: 24rpx;
		padding-top: 24rpx;
	}

	.btn {
		width: 100%;
		height: 112rpx;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 40rpx;
		font-size: 32rpx;
		font-weight: 700;
		border: none;
	}

	.btn::after {
		border: none;
	}

	.btn-primary {
		background: linear-gradient(90deg, #0d33f2, #9333ea);
		color: #fff;
		box-shadow: 0 16rpx 40rpx rgba(13, 51, 242, 0.25);
	}

	.btn-outline {
		background: transparent;
		color: #94a3b8;
		border: 4rpx solid #334155;
	}

	.btn-text {
		color: inherit;
	}

	/* 底部说明 */
	.footer {
		padding: 64rpx 48rpx 48rpx;
		text-align: center;
		flex-shrink: 0;
	}

	.footer-text {
		font-size: 24rpx;
		color: #64748b;
		line-height: 1.6;
		max-width: 500rpx;
		display: block;
		margin: 0 auto;
	}
</style>
