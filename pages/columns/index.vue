<template>
	<view class="page">
		<!-- 顶部导航 -->
		<view class="nav">
			<view class="nav-btn" @click="goHome">
				<text class="nav-icon">←</text>
			</view>
			<text class="nav-title">专栏</text>
			<view class="nav-btn" @click="tapSearch">
				<text class="nav-icon">⌕</text>
			</view>
		</view>

		<!-- 分类筛选 -->
		<scroll-view class="chips" scroll-x>
			<view class="chips-inner">
				<view
					v-for="c in categories"
					:key="c"
					class="chip"
					:class="c === activeCategory ? 'chip-active' : ''"
					@click="activeCategory = c"
				>
					<text class="chip-text">{{ c }}</text>
				</view>
			</view>
		</scroll-view>

		<!-- 列表 -->
		<scroll-view class="list" scroll-y>
			<view class="list-inner">
				<view
					v-for="item in filteredList"
					:key="item.id"
					class="card"
					@click="tapCard(item.id)"
				>
					<view class="thumb">
						<!-- 先用纯色占位，等你从 Figma 导出真实封面再替换 -->
						<view class="thumb-ph"></view>
					</view>

					<view class="card-main">
						<text class="tag">{{ item.tag }}</text>
						<text class="title">{{ item.title }}</text>
						<text class="desc">{{ item.desc }}</text>

						<view class="meta-row">
							<view class="meta-left">
								<text class="meta-icon">👥</text>
								<text class="meta-text">{{ item.users }}</text>
								<text class="meta-dot">·</text>
								<text class="meta-text">{{ item.lessons }}</text>
							</view>

							<view class="price" :class="item.priceType === 'free' ? 'price-free' : ''">
								<text class="price-text">{{ item.priceText }}</text>
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
import { computed, ref } from 'vue'

const categories = ref(['全部', 'AI 绘画', '编程开发', '产品经理', '运营实战'])
const activeCategory = ref('全部')

const list = ref([
	{
		id: 'mj',
		category: 'AI 绘画',
		tag: 'AI 绘画',
		title: 'Midjourney 商业提示词全...',
		desc: '从零到一掌握顶级商业绘图逻辑，解锁 AIG 商业价值潜力。',
		users: '1.2k',
		lessons: '18讲',
		priceType: 'paid',
		priceText: '¥199'
	},
	{
		id: 'py',
		category: '编程开发',
		tag: '编程开发',
		title: 'Python 自动化办公实战',
		desc: '用代码双手，零基础也能快速上手的职场进阶必备技能课。',
		users: '856',
		lessons: '12讲',
		priceType: 'free',
		priceText: 'FREE'
	},
	{
		id: 'pm',
		category: '产品经理',
		tag: '产品经理',
		title: 'AI 时代的产品方法论',
		desc: '重塑产品思维，深度学习如何将 AI 能力融入到业务闭环中。',
		users: '4.9',
		lessons: '16讲',
		priceType: 'paid',
		priceText: '¥299'
	},
	{
		id: 'ops',
		category: '运营实战',
		tag: '运营实战',
		title: '私域流量与 AI 转化手册',
		desc: '利用 AI 工具搭建高效私域转化体系，实现业务爆发式增长。',
		users: '628',
		lessons: '10讲',
		priceType: 'paid',
		priceText: '¥159'
	}
])

const filteredList = computed(() => {
	if (activeCategory.value === '全部') return list.value
	return list.value.filter(i => i.category === activeCategory.value)
})

function goHome() {
	uni.switchTab({ url: '/pages/index/index' })
}

function tapSearch() {
	uni.showToast({ title: 'Search', icon: 'none' })
}

function tapCard(id) {
	uni.showToast({ title: 'Open: ' + id, icon: 'none' })
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
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.nav-btn {
		width: 72rpx;
		height: 72rpx;
		border-radius: 36rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.nav-icon {
		font-size: 36rpx;
		color: rgba(255, 255, 255, 0.9);
	}

	.nav-title {
		font-size: 34rpx;
		color: rgba(255, 255, 255, 0.92);
		font-weight: 700;
	}

	.chips {
		height: 96rpx;
		padding: 0 24rpx;
		box-sizing: border-box;
	}

	.chips-inner {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 96rpx;
	}

	.chip {
		height: 64rpx;
		padding: 0 28rpx;
		border-radius: 32rpx;
		background: rgba(255, 255, 255, 0.06);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 16rpx;
	}

	.chip-active {
		background: #6d4bff;
	}

	.chip-text {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.85);
		font-weight: 600;
	}

	.list {
		flex: 1;
	}

	.list-inner {
		padding: 18rpx 24rpx 0 24rpx;
		box-sizing: border-box;
	}

	.card {
		display: flex;
		flex-direction: row;
		background: rgba(255, 255, 255, 0.06);
		border-radius: 28rpx;
		padding: 18rpx;
		margin-bottom: 18rpx;
	}

	.thumb {
		width: 176rpx;
		height: 176rpx;
		border-radius: 24rpx;
		overflow: hidden;
		margin-right: 18rpx;
	}

	.thumb-ph {
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.12);
	}

	.card-main {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.tag {
		font-size: 20rpx;
		color: #a88bff;
		font-weight: 700;
	}

	.title {
		margin-top: 8rpx;
		font-size: 30rpx;
		color: rgba(255, 255, 255, 0.92);
		font-weight: 800;
		line-height: 1.25;
	}

	.desc {
		margin-top: 8rpx;
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.55);
		line-height: 1.4;
	}

	.meta-row {
		margin-top: 14rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.meta-left {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.meta-icon {
		font-size: 22rpx;
		margin-right: 8rpx;
		opacity: 0.75;
	}

	.meta-text {
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.45);
	}

	.meta-dot {
		margin: 0 10rpx;
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.35);
	}

	.price {
		min-width: 118rpx;
		height: 52rpx;
		padding: 0 22rpx;
		border-radius: 26rpx;
		background: #6d4bff;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.price-free {
		background: #16c784;
	}

	.price-text {
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.92);
		font-weight: 800;
	}

	.bottom-space {
		height: 40rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>

