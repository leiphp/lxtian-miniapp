<template>
	<view class="page">
		<view class="nav">
			<view class="nav-left" @click="goBack">
				<text class="nav-back">←</text>
				<text class="nav-title" number-of-lines="1">{{ article?.title || '文章详情' }}</text>
			</view>
		</view>

		<scroll-view class="scroll" scroll-y>
			<view class="container" v-if="article">
				<view class="meta-card">
					<text class="meta-title">{{ article.title }}</text>
					<view class="meta-row">
						<text class="meta-author">{{ article.author || '佚名' }}</text>
						<text class="meta-dot">·</text>
						<text class="meta-cat">{{ article.category_name }}</text>
					</view>
					<view class="meta-row">
						<text class="meta-time">{{ article.created_at }}</text>
						<text class="meta-dot">·</text>
						<text class="meta-views">👁 {{ formatCount(article.view_count) }}</text>
					</view>
				</view>

				<view class="content-card">
					<rich-text class="article-content" :nodes="contentHtml" />
				</view>

				<view class="bottom-space"></view>
			</view>
			<view class="container empty" v-else>
				<text class="empty-text">正在加载文章...</text>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getArticleDetail } from '@/api/article.js'
import { marked } from 'marked'

const article = ref(null)
const contentHtml = ref('')

function decodeHtml(str) {
	return String(str || '')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
}

// 将接口内容尽量转成 Markdown 风格 HTML
function toHtml(raw) {
	const s = decodeHtml(raw || '').trim()
	if (!s) return ''
	// 如果看起来本身就是 HTML，则直接返回
	if (/^<\/?[a-z][\s\S]*>/i.test(s)) {
		return s
	}
	// 否则按 Markdown 解析
	marked.setOptions({
		breaks: true
	})
	return marked.parse(s)
}

function formatCount(n) {
	const num = Number(n || 0)
	if (!Number.isFinite(num)) return '0'
	if (num >= 10000) return (num / 10000).toFixed(1).replace(/\.0$/, '') + 'w'
	if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
	return String(num)
}

async function fetchDetail(id) {
	try {
		const data = await getArticleDetail(id)
		article.value = data
		contentHtml.value = toHtml(data.content || '')
	} catch (e) {
		uni.showToast({ title: '文章详情加载失败', icon: 'none' })
	}
}

onLoad((options) => {
	const id = options?.id
	if (!id) {
		uni.showToast({ title: '缺少文章 ID', icon: 'none' })
		return
	}
	fetchDetail(id)
})

function goBack() {
	if (getCurrentPages().length > 1) {
		uni.navigateBack()
	} else {
		uni.switchTab({ url: '/pages/columns/index' })
	}
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
		height: 96rpx;
		padding: 0 24rpx;
		display: flex;
		align-items: center;
	}

	.nav-left {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.nav-back {
		width: 56rpx;
		height: 56rpx;
		border-radius: 28rpx;
		background: rgba(15, 23, 42, 0.9);
		text-align: center;
		line-height: 56rpx;
		font-size: 34rpx;
		color: rgba(255, 255, 255, 0.9);
		margin-right: 12rpx;
	}

	.nav-title {
		max-width: 520rpx;
		font-size: 30rpx;
		color: rgba(255, 255, 255, 0.96);
		font-weight: 700;
	}

	.scroll {
		flex: 1;
		background: #0b1020;
	}

	.container {
		padding: 16rpx 24rpx 0 24rpx;
		box-sizing: border-box;
		background: #0b1020;
	}

	.meta-card {
		border-radius: 24rpx;
		background: rgba(15, 23, 42, 0.96);
		padding: 20rpx 20rpx 16rpx 20rpx;
		margin-bottom: 16rpx;
	}

	.meta-title {
		font-size: 32rpx;
		color: rgba(255, 255, 255, 0.98);
		font-weight: 700;
		line-height: 1.4;
	}

	.meta-row {
		margin-top: 10rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.meta-author,
	.meta-cat,
	.meta-time,
	.meta-views {
		font-size: 22rpx;
		color: rgba(148, 163, 184, 0.95);
	}

	.meta-dot {
		margin: 0 8rpx;
		font-size: 22rpx;
		color: rgba(148, 163, 184, 0.6);
	}

	.content-card {
		border-radius: 24rpx;
		background: rgba(15, 23, 42, 0.96);
		padding: 20rpx;
	}

	.article-content {
		font-size: 26rpx;
		color: rgba(226, 232, 240, 0.96);
		line-height: 1.7;
	}

	/* Markdown 风格排版 */
	.article-content h1,
	.article-content h2,
	.article-content h3,
	.article-content h4 {
		margin: 24rpx 0 16rpx;
		font-weight: 700;
		color: rgba(248, 250, 252, 0.98);
	}

	.article-content h1 {
		font-size: 34rpx;
	}

	.article-content h2 {
		font-size: 30rpx;
	}

	.article-content h3,
	.article-content h4 {
		font-size: 28rpx;
	}

	.article-content p {
		margin: 12rpx 0;
	}

	.article-content ul,
	.article-content ol {
		margin: 12rpx 0 12rpx 32rpx;
	}

	.article-content li {
		margin-bottom: 6rpx;
	}

	.article-content code {
		font-family: Menlo, SFMono-Regular, Consolas, 'Liberation Mono', 'Courier New',
			monospace;
		background: rgba(15, 23, 42, 0.9);
		padding: 2rpx 6rpx;
		border-radius: 6rpx;
		font-size: 24rpx;
	}

	.article-content pre {
		margin: 18rpx 0;
		padding: 18rpx;
		background: #020617;
		border-radius: 16rpx;
		overflow: hidden;
	}

	.article-content pre code {
		display: block;
		white-space: pre-wrap;
		word-break: break-all;
		background: transparent;
		padding: 0;
	}

	.article-content img {
		max-width: 100%;
		border-radius: 12rpx;
		margin: 18rpx 0;
	}

	.empty {
		align-items: center;
		justify-content: center;
	}

	.empty-text {
		margin-top: 80rpx;
		font-size: 24rpx;
		color: rgba(148, 163, 184, 0.9);
		text-align: center;
	}

	.bottom-space {
		height: 60rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>

