<template>
	<view class="page">
		<!-- 顶部导航 -->
		<view class="nav">
			<view class="nav-left" @click="goBack">
				<view class="nav-back">
					<text class="nav-back-icon">←</text>
				</view>
				<text class="nav-title">提示词广场</text>
			</view>
		</view>

		<scroll-view class="scroll" scroll-y>
			<view class="container">
				<!-- 搜索与过滤 -->
				<view class="search-wrap">
					<view class="search-inner">
						<text class="search-icon">⌕</text>
						<input
							class="search-input"
							v-model="keyword"
							placeholder="搜索提示词、场景或作者..."
							placeholder-class="search-placeholder"
							confirm-type="search"
							@confirm="onSearch"
						/>
					</view>
					<scroll-view class="tags" scroll-x>
						<view class="tags-inner">
							<view
								v-for="tag in categories"
								:key="tag.id"
								class="tag-chip"
								:class="{ active: tag.id === activeCategory }"
								@click="activeCategory = tag.id"
							>
								<text class="tag-text">{{ tag.name }}</text>
							</view>
						</view>
					</scroll-view>
				</view>

				<!-- 提示词卡片列表 -->
				<view class="list">
					<view
						v-for="item in filteredPrompts"
						:key="item.id"
						class="prompt-card"
						@click="previewPrompt(item)"
					>
						<view class="card-head">
							<view class="card-title-wrap">
								<text class="card-title">{{ item.title }}</text>
								<view class="card-meta">
									<text class="card-meta-text">{{ item.scene }}</text>
									<text class="card-dot">·</text>
									<text class="card-meta-text">{{ item.language }}</text>
								</view>
							</view>
							<view class="card-stat">
								<text class="stat-number">{{ formatCount(item.uses) }}</text>
								<text class="stat-label">次使用</text>
							</view>
						</view>

						<text class="card-desc">{{ item.description }}</text>

						<view class="card-footer">
							<view class="card-tags">
								<text v-for="t in item.tags" :key="t" class="card-tag">#{{ t }}</text>
							</view>
							<view class="card-actions">
								<view class="btn ghost" @click.stop="copyPrompt(item)">
									<text class="btn-text">复制提示词</text>
								</view>
								<view class="btn primary" @click.stop="usePrompt(item)">
									<text class="btn-text">一键使用</text>
								</view>
							</view>
						</view>
					</view>

					<view v-if="!filteredPrompts.length" class="empty">
						<text class="empty-text">暂无匹配的提示词，试试调整筛选或搜索关键字</text>
					</view>

					<view class="bottom-space" />
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { computed, ref } from 'vue'

const keyword = ref('')

const categories = ref([
	{ id: 'all', name: '全部' },
	{ id: 'writing', name: '写作辅助' },
	{ id: 'code', name: 'IT / 编程' },
	{ id: 'ai', name: 'AI 应用' },
	{ id: 'life', name: '生活效率' }
])

const activeCategory = ref('all')

// 本地示例数据，后续可接后端接口
const prompts = ref([
	{
		id: 'writer-pro',
		title: '高级写作润色助手',
		scene: '文章 / 报告',
		language: '中文',
		category: 'writing',
		description: '让 AI 帮你从逻辑、结构和表达三个维度，全面润色一篇技术文章或报告。',
		uses: 12840,
		tags: ['写作', '技术文档'],
		content:
			'你是一名资深技术编辑，请从逻辑结构、段落衔接和语言表达三个方面，全面润色下面的内容，尽量保留原有术语和技术细节，但让整体更易读：\\n\\n【在这里粘贴原文】'
	},
	{
		id: 'bug-analyzer',
		title: '前端 Bug 快速排查',
		scene: '调试 / 排错',
		language: '中文',
		category: 'code',
		description: '将报错信息、关键代码和期望行为输入，AI 会帮你定位可能的原因并给出修改建议。',
		uses: 7643,
		tags: ['前端', '调试'],
		content:
			'你是一名资深前端工程师，请根据以下信息帮我排查问题并给出修改建议：\\n1. 报错信息：\\n【粘贴控制台或接口报错】\\n2. 相关代码：\\n【粘贴关键代码片段】\\n3. 期望行为：\\n【描述你希望实现的效果】'
	},
	{
		id: 'prompt-refine',
		title: '提示词重写优化',
		scene: 'Prompt 设计',
		language: '中 / 英',
		category: 'ai',
		description: '把随手一写的需求交给它，自动帮你扩展成结构清晰、可复用的专业提示词。',
		uses: 19231,
		tags: ['Prompt', '通用'],
		content:
			'我将给出一个非常随意的需求描述，请你将它改写成适合 GPT 类模型使用的高质量提示词，要求：\\n- 结构清晰，有角色、目标、约束条件和输出格式\\n- 默认回答语言为中文\\n- 尽量让提示词可复用\\n\\n下面是原始需求：\\n【粘贴你的原始想法】'
	}
])

const filteredPrompts = computed(() => {
	const kw = keyword.value.trim().toLowerCase()
	return prompts.value.filter((item) => {
		const hitCategory = activeCategory.value === 'all' || item.category === activeCategory.value
		if (!hitCategory) return false
		if (!kw) return true
		const text = `${item.title}${item.description}${item.scene}${item.tags.join('')}`.toLowerCase()
		return text.includes(kw)
	})
})

function onSearch() {
	// 搜索逻辑已经在 computed 里，触发一次即可
}

function formatCount(n) {
	const num = Number(n || 0)
	if (!Number.isFinite(num)) return '0'
	if (num >= 10000) return (num / 10000).toFixed(1).replace(/\.0$/, '') + 'w'
	if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
	return String(num)
}

function copyPrompt(item) {
	if (!item?.content) return
	uni.setClipboardData({
		data: item.content,
		success() {
			uni.showToast({ title: '已复制到剪贴板', icon: 'none' })
		}
	})
}

function usePrompt(item) {
	copyPrompt(item)
	// 这里可以根据你的路由规划，跳转到某个对话页并带上 ID
}

function previewPrompt(item) {
	// 目前点击整卡片只做复制提示，后续可以扩展为弹窗预览
}

function goBack() {
	if (getCurrentPages && getCurrentPages().length > 1) {
		uni.navigateBack()
	} else {
		uni.switchTab({ url: '/pages/shelf/index' })
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
		background: #0b1020;
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
		background: rgba(15, 23, 42, 0.92);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 10rpx;
		border-width: 1rpx;
		border-style: solid;
		border-color: rgba(148, 163, 184, 0.35);
	}

	.nav-back-icon {
		font-size: 32rpx;
		color: rgba(248, 250, 252, 0.96);
	}

	.nav-title {
		font-size: 34rpx;
		color: rgba(255, 255, 255, 0.96);
		font-weight: 700;
	}

	.scroll {
		flex: 1;
		background: #0b1020;
	}

	.container {
		padding: 12rpx 24rpx 0 24rpx;
		box-sizing: border-box;
	}

	.search-wrap {
		margin-bottom: 12rpx;
	}

	.search-inner {
		height: 76rpx;
		border-radius: 38rpx;
		background: rgba(15, 23, 42, 0.95);
		border-width: 1rpx;
		border-style: solid;
		border-color: rgba(148, 163, 184, 0.35);
		display: flex;
		flex-direction: row;
		align-items: center;
		padding: 0 24rpx;
	}

	.search-icon {
		font-size: 28rpx;
		color: rgba(148, 163, 184, 0.9);
		margin-right: 10rpx;
	}

	.search-input {
		flex: 1;
		height: 76rpx;
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.96);
	}

	.search-placeholder {
		color: rgba(148, 163, 184, 0.9);
	}

	.tags {
		margin-top: 10rpx;
		height: 64rpx;
	}

	.tags-inner {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 64rpx;
	}

	.tag-chip {
		padding: 0 22rpx;
		height: 48rpx;
		border-radius: 24rpx;
		background: rgba(30, 41, 59, 0.9);
		margin-right: 12rpx;
		display: flex;
		align-items: center;
	}

	.tag-chip.active {
		background: rgba(88, 80, 236, 0.96);
	}

	.tag-text {
		font-size: 22rpx;
		color: rgba(226, 232, 240, 0.95);
	}

	.list {
		margin-top: 12rpx;
	}

	.prompt-card {
		border-radius: 24rpx;
		background: rgba(15, 23, 42, 0.96);
		border-width: 1rpx;
		border-style: solid;
		border-color: rgba(51, 65, 85, 0.7);
		padding: 18rpx 18rpx 16rpx;
		margin-bottom: 16rpx;
	}

	.card-head {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
	}

	.card-title-wrap {
		flex: 1;
		padding-right: 10rpx;
		overflow: hidden;
	}

	.card-title {
		display: block;
		font-size: 28rpx;
		color: rgba(248, 250, 252, 0.98);
		font-weight: 700;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.card-meta {
		margin-top: 4rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.card-meta-text {
		font-size: 22rpx;
		color: rgba(148, 163, 184, 0.9);
	}

	.card-dot {
		margin: 0 6rpx;
		font-size: 22rpx;
		color: rgba(148, 163, 184, 0.7);
	}

	.card-stat {
		align-items: flex-end;
	}

	.stat-number {
		font-size: 24rpx;
		color: rgba(129, 140, 248, 0.96);
		font-weight: 700;
		text-align: right;
	}

	.stat-label {
		font-size: 20rpx;
		color: rgba(148, 163, 184, 0.85);
	}

	.card-desc {
		margin-top: 10rpx;
		font-size: 24rpx;
		color: rgba(209, 213, 219, 0.96);
		line-height: 1.6;
	}

	.card-footer {
		margin-top: 12rpx;
		display: flex;
		flex-direction: column;
	}

	.card-tags {
		flex-direction: row;
		flex-wrap: wrap;
		display: flex;
	}

	.card-tag {
		font-size: 20rpx;
		color: rgba(129, 140, 248, 0.96);
		margin-right: 8rpx;
		margin-bottom: 4rpx;
	}

	.card-actions {
		margin-top: 10rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-end;
	}

	.btn {
		height: 56rpx;
		padding: 0 22rpx;
		border-radius: 18rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn + .btn {
		margin-left: 10rpx;
	}

	.btn.primary {
		background: linear-gradient(135deg, #6366f1, #8b5cf6);
	}

	.btn.ghost {
		border-width: 1rpx;
		border-style: solid;
		border-color: rgba(129, 140, 248, 0.7);
		background: transparent;
	}

	.btn-text {
		font-size: 22rpx;
		color: rgba(248, 250, 252, 0.98);
	}

	.empty {
		padding: 40rpx 0;
		align-items: center;
		justify-content: center;
	}

	.empty-text {
		font-size: 24rpx;
		color: rgba(148, 163, 184, 0.9);
		text-align: center;
	}

	.bottom-space {
		height: 80rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>

