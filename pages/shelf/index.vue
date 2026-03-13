<template>
	<view class="page">
		<!-- 顶部导航 -->
		<view class="nav">
			<view class="nav-left">
				<view class="nav-icon-wrap">
					<text class="nav-icon">✨</text>
				</view>
				<text class="nav-title">AI知识库</text>
			</view>
			<view class="nav-right"></view>
		</view>

		<scroll-view class="scroll" scroll-y>
			<view class="container">
				<!-- 搜索栏 -->
				<view class="search-wrap">
					<view class="search-inner">
						<text class="search-icon">⌕</text>
						<input
							class="search-input"
							placeholder="搜索AI工具,提示词或教程..."
							placeholder-class="search-placeholder"
							confirm-type="search"
							@confirm="onSearch"
						/>
					</view>
				</view>

				<!-- Ask AI 卡片 -->
				<view class="ask-outer">
					<view class="ask-inner">
						<view class="ask-header">
							<view class="ask-logo">
								<text class="ask-logo-icon">💬</text>
							</view>
							<view class="ask-title-wrap">
								<text class="ask-label">INTELLIGENT ASSISTANT</text>
								<text class="ask-title">有什么想问AI的？</text>
							</view>
						</view>

						<view class="ask-input-wrap">
							<textarea
								class="ask-textarea"
								v-model="question"
								placeholder="输入你的问题,开启智慧对话..."
								:auto-height="true"
							/>
							<view class="ask-send" @click="sendQuestion">
								<text class="ask-send-icon">↑</text>
							</view>
						</view>

						<view class="ask-tags">
							<view class="ask-tag" v-for="tag in askTags" :key="tag">
								<text class="ask-tag-text">{{ tag }}</text>
							</view>
						</view>
					</view>
				</view>

				<!-- 分类探索 -->
				<view class="section">
					<view class="section-head">
						<view class="section-title-left">
							<view class="section-dot"></view>
							<text class="section-title">分类探索</text>
						</view>
					</view>
					<view class="category-grid">
						<view
							class="cat-item"
							v-for="item in categories"
							:key="item.id"
							@click="tapCategory(item.id)"
						>
							<view class="cat-icon" :class="'cat-icon-' + item.id">
								<image class="cat-icon-img" :src="item.icon" mode="aspectFit" />
							</view>
							<text class="cat-text">{{ item.text }}</text>
						</view>
					</view>
				</view>

				<!-- 最新动态 -->
				<view class="section">
					<view class="section-head">
						<view class="section-title-left">
							<view class="section-dot"></view>
							<text class="section-title">最新动态</text>
						</view>
						<text class="section-link" @click="tapViewAll">查看全部</text>
					</view>

					<view
						class="feed-card"
						v-for="item in feedList"
						:key="item.id"
						@click="tapFeed(item.id)"
					>
						<view class="feed-thumb">
							<view class="feed-thumb-ph"></view>
						</view>
						<view class="feed-main">
							<view class="feed-tags">
								<view
									class="feed-tag"
									v-for="tag in item.tags"
									:key="tag.text"
									:class="'feed-tag-' + tag.type"
								>
									<text class="feed-tag-text">{{ tag.text }}</text>
								</view>
							</view>
							<text class="feed-title">{{ item.title }}</text>
							<view class="feed-meta">
								<text class="feed-meta-views">👁 {{ item.views }}</text>
								<text class="feed-meta-time">{{ item.time }}</text>
							</view>
						</view>
					</view>
				</view>

				<view class="bottom-space"></view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const question = ref('')

const askTags = ref(['提示词优化', '代码生成', '文案创作'])

const categories = ref([
	{ id: 'prompt', icon: '/static/icon/prompt.png', text: '提示词' },
	{ id: 'tools', icon: '/static/icon/tools.png', text: 'AI工具' },
	{ id: 'cases', icon: '/static/icon/cases.png', text: '精选案例' },
	{ id: 'courses', icon: '/static/icon/courses.png', text: '系统教程' }
])

const feedList = ref([
	{
		id: 'midjourney',
		title: 'Midjourney V6 进阶教程: 如何生成极具写实感的摄影作品?',
		views: '1.2k',
		time: '2小时前',
		tags: [
			{ type: 'primary', text: 'Midjourney' },
			{ type: 'secondary', text: '绘图' }
		]
	},
	{
		id: 'gpts',
		title: '十个让你的工作效率翻倍的 GPTs 推荐,建议收藏!',
		views: '856',
		time: '5小时前',
		tags: [
			{ type: 'green', text: 'GPT-4' },
			{ type: 'blue', text: '办公' }
		]
	},
	{
		id: 'sora',
		title: 'Sora 深度解析: AI视频生成的未来已来?',
		views: '3.4k',
		time: '昨天',
		tags: [
			{ type: 'orange', text: 'Sora' },
			{ type: 'purple', text: '视频' }
		]
	}
])

function onSearch(e) {
	const kw = (e?.detail?.value || '').trim()
	if (!kw) return
	uni.showToast({ title: '搜索：' + kw, icon: 'none' })
}

function sendQuestion() {
	if (!question.value.trim()) {
		uni.showToast({ title: '先输入一个问题', icon: 'none' })
		return
	}
	uni.showToast({ title: '已发送：' + question.value.trim(), icon: 'none' })
	question.value = ''
}

function tapCategory(id) {
	if (id === 'prompt') {
		uni.navigateTo({ url: '/pages/prompt/index' })
		return
	}
	uni.showToast({ title: '分类：' + id, icon: 'none' })
}

function tapFeed(id) {
	uni.showToast({ title: '打开：' + id, icon: 'none' })
}

function tapViewAll() {
	uni.showToast({ title: '查看全部', icon: 'none' })
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
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.nav-left {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.nav-icon-wrap {
		width: 44rpx;
		height: 44rpx;
		border-radius: 12rpx;
		background: linear-gradient(135deg, #0d33f2 0%, #7c3aed 100%);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-icon {
		font-size: 24rpx;
		color: #ffffff;
	}

	.nav-title {
		margin-left: 10rpx;
		font-size: 32rpx;
		color: rgba(255, 255, 255, 0.96);
		font-weight: 700;
	}

	.nav-right {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.nav-btn {
		width: 44rpx;
		height: 44rpx;
		border-radius: 22rpx;
		background: rgba(30, 41, 59, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 12rpx;
	}

	.nav-btn-icon {
		font-size: 24rpx;
		color: rgba(148, 163, 184, 0.9);
	}

	.nav-avatar {
		width: 44rpx;
		height: 44rpx;
		border-radius: 22rpx;
		border-width: 2rpx;
		border-style: solid;
		border-color: rgba(13, 51, 242, 0.5);
		overflow: hidden;
	}

	.nav-avatar-ph {
		width: 100%;
		height: 100%;
		background: rgba(148, 163, 184, 0.8);
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

	.search-wrap {
		margin-bottom: 24rpx;
	}

	.search-inner {
		height: 76rpx;
		border-radius: 38rpx;
		background: rgba(30, 41, 59, 0.9);
		border-width: 1rpx;
		border-style: solid;
		border-color: rgba(148, 163, 184, 0.25);
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0 28rpx;
	}

	.search-icon {
		font-size: 28rpx;
		color: rgba(148, 163, 184, 0.9);
		margin-right: 12rpx;
	}

	.search-input {
		flex: 1;
		height: 76rpx;
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.92);
	}

	.search-placeholder {
		color: rgba(148, 163, 184, 0.9);
	}

	.ask-outer {
		padding: 8rpx;
		border-radius: 28rpx;
		background: linear-gradient(135deg, #0d33f2, #7c3aed);
		margin-bottom: 28rpx;
		box-shadow: 0 0 32rpx rgba(13, 51, 242, 0.35);
	}

	.ask-inner {
		border-radius: 24rpx;
		background: #0f172a;
		padding: 24rpx;
	}

	.ask-header {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		margin-bottom: 18rpx;
	}

	.ask-logo {
		width: 44rpx;
		height: 44rpx;
		border-radius: 22rpx;
		background: rgba(13, 51, 242, 0.15);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 14rpx;
	}

	.ask-logo-icon {
		font-size: 24rpx;
		color: #0d33f2;
	}

	.ask-title-wrap {
		flex: 1;
	}

	.ask-label {
		font-size: 20rpx;
		color: rgba(148, 163, 184, 0.9);
		text-transform: uppercase;
		letter-spacing: 2rpx;
	}

	.ask-title {
		margin-top: 4rpx;
		font-size: 32rpx;
		color: rgba(255, 255, 255, 0.98);
		font-weight: 700;
	}

	.ask-input-wrap {
		margin-top: 4rpx;
		border-radius: 20rpx;
		border-width: 1rpx;
		border-style: solid;
		border-color: rgba(30, 64, 175, 0.6);
		background: rgba(15, 23, 42, 0.9);
		padding: 12rpx;
		position: relative;
	}

	.ask-textarea {
		width: 100%;
		min-height: 80rpx;
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.95);
	}

	.ask-send {
		position: absolute;
		right: 14rpx;
		bottom: 14rpx;
		width: 44rpx;
		height: 44rpx;
		border-radius: 22rpx;
		background: #0d33f2;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ask-send-icon {
		font-size: 24rpx;
		color: #ffffff;
	}

	.ask-tags {
		margin-top: 14rpx;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.ask-tag {
		margin-right: 10rpx;
		margin-bottom: 6rpx;
		border-radius: 12rpx;
		background: rgba(51, 65, 85, 0.8);
		padding: 8rpx 16rpx;
	}

	.ask-tag-text {
		font-size: 22rpx;
		color: rgba(203, 213, 225, 0.95);
	}

	.section {
		margin-bottom: 24rpx;
	}

	.section-head {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 16rpx;
	}

	.section-title-left {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.section-dot {
		width: 4rpx;
		height: 24rpx;
		border-radius: 4rpx;
		background: #0d33f2;
		margin-right: 8rpx;
	}

	.section-title {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.96);
		font-weight: 700;
	}

	.section-link {
		font-size: 22rpx;
		color: #0d33f2;
	}

	.category-grid {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.cat-item {
		width: 23%;
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.cat-icon {
		width: 100%;
		aspect-ratio: 1;
		border-radius: 24rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	/* 图标缩小一些，居中悬浮的感觉 */
	.cat-icon-img {
		width: 56rpx;
		height: 56rpx;
	}

	.cat-icon-prompt {
		background: rgba(59, 130, 246, 0.15);
	}

	.cat-icon-tools {
		background: rgba(147, 51, 234, 0.15);
	}

	.cat-icon-cases {
		background: rgba(249, 115, 22, 0.15);
	}

	.cat-icon-courses {
		background: rgba(16, 185, 129, 0.15);
	}

	.cat-text {
		margin-top: 6rpx;
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.9);
		text-align: center;
	}

	.feed-card {
		border-radius: 24rpx;
		background: rgba(30, 41, 59, 0.6);
		border-width: 1rpx;
		border-style: solid;
		border-color: rgba(51, 65, 85, 0.6);
		padding: 18rpx;
		display: flex;
		flex-direction: row;
		margin-bottom: 18rpx;
	}

	.feed-thumb {
		width: 120rpx;
		height: 120rpx;
		border-radius: 20rpx;
		overflow: hidden;
		margin-right: 18rpx;
	}

	.feed-thumb-ph {
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3));
	}

	.feed-main {
		flex: 1;
	}

	.feed-tags {
		display: flex;
		flex-direction: row;
		margin-bottom: 8rpx;
	}

	.feed-tag {
		margin-right: 6rpx;
		padding: 2rpx 8rpx;
		border-radius: 10rpx;
	}

	.feed-tag-text {
		font-size: 18rpx;
		font-weight: 700;
	}

	.feed-tag-primary {
		background: rgba(15, 118, 246, 0.15);
	}

	.feed-tag-secondary {
		background: rgba(124, 58, 237, 0.15);
	}

	.feed-tag-green {
		background: rgba(16, 185, 129, 0.15);
	}

	.feed-tag-blue {
		background: rgba(59, 130, 246, 0.15);
	}

	.feed-tag-orange {
		background: rgba(249, 115, 22, 0.15);
	}

	.feed-tag-purple {
		background: rgba(147, 51, 234, 0.15);
	}

	.feed-title {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.98);
		font-weight: 700;
		line-height: 1.4;
	}

	.feed-meta {
		margin-top: 12rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.feed-meta-views {
		font-size: 22rpx;
		color: rgba(148, 163, 184, 0.9);
	}

	.feed-meta-time {
		font-size: 22rpx;
		color: rgba(148, 163, 184, 0.85);
	}

	.bottom-space {
		height: 60rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		background: #0b1020;
	}
</style>

