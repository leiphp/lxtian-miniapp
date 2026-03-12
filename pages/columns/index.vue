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
					v-for="c in categoryOptions"
					:key="c.id"
					class="chip"
					:class="c.name === activeCategory ? 'chip-active' : ''"
					@click="activeCategory = c.name"
				>
					<text class="chip-text">{{ c.name }}</text>
				</view>
			</view>
		</scroll-view>

		<!-- 列表 -->
		<scroll-view class="list" scroll-y>
			<view class="list-inner">
				<view v-for="item in filteredList" :key="item.id" class="card" @click="tapCard(item.id)">
					<view class="thumb">
						<image class="thumb-img" :src="item.cover" mode="aspectFill" />
					</view>

					<view class="card-main">
						<text class="tag">{{ item.tag }}</text>
						<text class="title">{{ item.title }}</text>
						<text class="desc">{{ item.desc }}</text>

						<view class="meta-row">
							<view class="meta-left">
								<text class="meta-icon">👁</text>
								<text class="meta-text">{{ item.views }}</text>
								<text class="meta-dot">·</text>
								<text class="meta-text">{{ item.author }}</text>
							</view>

							<view class="price price-free">
								<text class="price-text">阅读</text>
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
import { computed, ref, onMounted, watch } from 'vue'
import { getCategoryList } from '@/api/category.js'
import { getArticleList } from '@/api/article.js'

const categoryOptions = ref([{ id: 0, name: '全部' }])
const activeCategory = ref('全部')
const loading = ref(false)
const articleLoading = ref(false)

// 用文章接口数据驱动列表
const list = ref([])

const filteredList = computed(() => {
	if (activeCategory.value === '全部') return list.value
	return list.value.filter(i => i.category === activeCategory.value)
})

function shortCategoryName(name) {
	const n = String(name || '').trim()
	if (!n) return ''
	// “前端开发/后端开发/硬件开发” => “前端/后端/硬件”
	const idx = n.indexOf('开发')
	if (idx > 0) return n.slice(0, idx)
	return n.slice(0, 2)
}

function formatCount(n) {
	const num = Number(n || 0)
	if (!Number.isFinite(num)) return '0'
	if (num >= 10000) return (num / 10000).toFixed(1).replace(/\.0$/, '') + 'w'
	if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
	return String(num)
}

function currentCid() {
	if (activeCategory.value === '全部') return undefined
	const hit = categoryOptions.value.find(c => c.name === activeCategory.value)
	return hit?.id
}

async function fetchCategories() {
	loading.value = true
	try {
		const res = await getCategoryList({ page: 1, page_size: 10 })
		const rawList = res?.list ?? []
		categoryOptions.value = [
			{ id: 0, name: '全部' },
			...rawList.map((item) => ({ id: item.id, name: shortCategoryName(item.name) }))
		]
	} catch (e) {
		uni.showToast({ title: '分类加载失败', icon: 'none' })
	} finally {
		loading.value = false
	}
}

async function fetchArticles() {
	articleLoading.value = true
	try {
		const cid = currentCid()
		const res = await getArticleList({ page: 1, page_size: 6, cid })
		const rawList = res?.list ?? []
		list.value = rawList.map((a) => ({
			id: a.id,
			category: shortCategoryName(a.cname) || a.cname || '全部',
			tag: shortCategoryName(a.cname) || a.cname || '',
			title: a.title || '',
			desc: a.description || '',
			cover: a.path || '',
			views: formatCount(a.view_count),
			author: a.author || ''
		}))
	} catch (e) {
		uni.showToast({ title: '文章加载失败', icon: 'none' })
		list.value = []
	} finally {
		articleLoading.value = false
	}
}

onMounted(() => {
	fetchCategories()
	fetchArticles()
})

watch(activeCategory, () => {
	fetchArticles()
})

function goHome() {
	uni.switchTab({ url: '/pages/index/index' })
}

function tapSearch() {
	uni.showToast({ title: 'Search', icon: 'none' })
}

function tapCard(id) {
	if (!id) return
	uni.navigateTo({
		url: `/pages/article/detail?id=${id}`
	})
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
		background: #0b1020;
	}

	.list-inner {
		padding: 18rpx 24rpx 0 24rpx;
		box-sizing: border-box;
		background: #0b1020;
	}

	.card {
		display: flex;
		flex-direction: row;
		background: rgba(255, 255, 255, 0.06);
		border-radius: 28rpx;
		padding: 18rpx;
		margin-bottom: 18rpx;
		align-items: stretch;
	}

	.thumb {
		flex: 0 0 176rpx;
		width: 176rpx;
		height: 176rpx;
		border-radius: 24rpx;
		overflow: hidden;
		margin-right: 18rpx;
		background: rgba(255, 255, 255, 0.08);
	}

	.thumb-img {
		width: 100%;
		height: 100%;
		display: block;
	}

	.card-main {
		flex: 1;
		min-width: 0;
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
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.desc {
		margin-top: 8rpx;
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.55);
		line-height: 1.4;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		line-clamp: 2;
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
		background: #0b1020;
	}
</style>

