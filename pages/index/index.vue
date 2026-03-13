<template>
	<view class="page">
		<scroll-view class="scroll" scroll-y>
			<view class="container">
				<view class="topbar">
					<view class="topbar-left">
						<text class="welcome">Welcome to</text>
						<text class="brand">雷小天博客</text>
					</view>
					<view class="topbar-right">
						<view class="circle-btn" @click="tapNotify">
							<text class="circle-text">🔔</text>
						</view>
						<view class="circle-btn" @click="tapProfile">
							<text class="circle-text">👤</text>
						</view>
					</view>
				</view>

				<view class="search-wrap">
					<view class="search-inner">
						<text class="search-icon">⌕</text>
						<input
							class="search-input"
							placeholder="Search AI tools & intelligence..."
							placeholder-class="search-placeholder"
							confirm-type="search"
							@confirm="onSearch"
						/>
					</view>
				</view>

				<view class="featured" @click="tapFeatured">
					<view class="featured-left">
						<text class="featured-label">FEATURED TOOL</text>
						<text class="featured-title">Generative Era 2.0</text>
						<text class="featured-desc">Master the latest AI workflows with our curated guides.</text>
						<view class="featured-btn">
							<text class="featured-btn-text">Explore Now</text>
						</view>
					</view>
					<view class="featured-right">
						<view class="burst"></view>
					</view>
				</view>

				<view class="quick-row">
					<view
						v-for="item in quickList"
						:key="item.id"
						class="quick-item"
						@click="tapQuick(item.id)"
					>
						<view class="quick-icon">
							<image class="quick-icon-img" :src="item.icon" mode="aspectFit" />
						</view>
						<text class="quick-text">{{ item.text }}</text>
					</view>
				</view>

				<view class="section-head">
					<text class="section-title">Hot AI Tools</text>
					<text class="section-action" @click="tapSeeAll">See All</text>
				</view>

				<scroll-view class="hot-scroll" scroll-x>
					<view class="hot-inner">
						<view
							v-for="item in hotTools"
							:key="item.id"
							class="tool-card"
							@click="tapTool(item.id)"
						>
							<view class="tool-thumb">
								<image class="tool-img" :src="item.img" mode="aspectFill" />
							</view>
							<text class="tool-title">{{ item.title }}</text>
							<text class="tool-subtitle">{{ item.subtitle }}</text>
						</view>
					</view>
				</scroll-view>

				<view class="section-head">
					<text class="section-title">Recommended</text>
					<text class="section-action" @click="tapFilter">Filter</text>
				</view>

				<view
					v-for="item in recommended"
					:key="item.id"
					class="rec-card"
					@click="tapRecommended(item.id)"
				>
					<image class="rec-img" :src="item.img" mode="aspectFill" />
					<view class="rec-main">
						<text class="rec-title">{{ item.title }}</text>
						<text class="rec-subtitle">{{ item.subtitle }}</text>
					</view>
				</view>

				<view class="bottom-space"></view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onPullDownRefresh } from '@dcloudio/uni-app'
import { getArticleList } from '@/api/article.js'

const quickList = ref([
	{ id: 'column', icon: '/static/icon/home-column.png', text: 'Column' },
	{ id: 'library', icon: '/static/icon/home-ailibrary.png', text: 'AI Library' },
	{ id: 'shop', icon: '/static/icon/home-shop.png', text: 'Shop' },
	{ id: 'more', icon: '/static/icon/home-more.png', text: 'More' }
])

const hotTools = ref([
	{ id: 'flux', title: 'Flux Pro', subtitle: 'Image Generation', img: '/static/example/fluxpro.png' },
	{ id: 'claude', title: 'Claude 3.5', subtitle: 'Language Model', img: '/static/example/claude3.5.png' },
	{ id: 'suno', title: 'Suno', subtitle: 'Audio & Music', img: '/static/example/claude3.5.png' }
])
// 首页推荐文章（types=1，仅取前 3 条）
const recommended = ref([])

async function fetchRecommended() {
	try {
		const res = await getArticleList({ page: 1, page_size: 3, types: 1 })
		const list = res?.list || []
		recommended.value = list.slice(0, 3).map((item) => ({
			id: item.id,
			title: item.title || '',
			subtitle: item.description || item.brief || '',
			img: item.path || '/static/logo.png'
		}))
	} catch (e) {
		uni.showToast({ title: '推荐文章加载失败', icon: 'none' })
	}
}

function onSearch(e) {
	const keyword = (e?.detail?.value || '').trim()
	if (!keyword) return
	uni.showToast({ title: 'Search: ' + keyword, icon: 'none' })
}

onMounted(() => {
	fetchRecommended()
})

onPullDownRefresh(() => {
	fetchRecommended().finally(() => {
		uni.stopPullDownRefresh()
	})
})

function tapNotify() {
	uni.showToast({ title: 'Notifications', icon: 'none' })
}
function tapProfile() {
	uni.showToast({ title: 'Profile', icon: 'none' })
}
function tapFeatured() {
	uni.showToast({ title: 'Explore featured', icon: 'none' })
}
function tapQuick(id) {
	if (id === 'column') {
		uni.switchTab({ url: '/pages/columns/index' })
		return
	}
	if (id === 'library') {
		uni.switchTab({ url: '/pages/shelf/index' })
		return
	}
	if (id === 'shop') {
		uni.navigateTo({ url: '/pages/shop/index' })
		return
	}
	uni.showToast({ title: id, icon: 'none' })
}
function tapTool(id) {
	uni.showToast({ title: 'Open: ' + id, icon: 'none' })
}
function tapRecommended(id) {
	if (!id) return
	uni.navigateTo({ url: `/pages/article/detail?id=${id}` })
}
function tapSeeAll() {
	uni.showToast({ title: 'See All', icon: 'none' })
}
function tapFilter() {
	uni.showToast({ title: 'Filter', icon: 'none' })
}
</script>

<style>
	.page {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: #0b1020;
		box-sizing: border-box;
		padding-top: constant(safe-area-inset-top);
		padding-top: env(safe-area-inset-top);
	}

	.scroll {
		flex: 1;
		background: #0b1020;
	}

	.container {
		padding: 32rpx;
		box-sizing: border-box;
		background: #0b1020;
	}

	.topbar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-top: 12rpx;
		margin-bottom: 28rpx;
	}

	.topbar-left {
		display: flex;
		flex-direction: column;
	}

	.welcome {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.65);
	}

	.brand {
		margin-top: 6rpx;
		font-size: 44rpx;
		color: #ffffff;
		font-weight: 700;
	}

	.topbar-right {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.circle-btn {
		width: 64rpx;
		height: 64rpx;
		border-radius: 32rpx;
		background: rgba(255, 255, 255, 0.08);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 16rpx;
	}

	.circle-text {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.85);
	}

	.search-wrap {
		margin-bottom: 24rpx;
	}

	.search-inner {
		height: 72rpx;
		border-radius: 36rpx;
		background: rgba(15, 23, 42, 0.9);
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
		margin-right: 12rpx;
	}

	.search-input {
		flex: 1;
		height: 72rpx;
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.92);
	}

	.search-placeholder {
		color: rgba(148, 163, 184, 0.9);
	}

	.featured {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		border-radius: 28rpx;
		padding: 24rpx;
		background: linear-gradient(135deg, #0d33f2 0%, #8b5cf6 100%);
		margin-bottom: 24rpx;
		overflow: hidden;
	}

	.featured-left {
		flex: 1;
		margin-right: 16rpx;
	}

	.featured-label {
		font-size: 20rpx;
		color: rgba(255, 255, 255, 0.8);
		font-weight: 700;
		letter-spacing: 1px;
	}

	.featured-title {
		margin-top: 10rpx;
		font-size: 36rpx;
		color: #fff;
		font-weight: 800;
	}

	.featured-desc {
		margin-top: 10rpx;
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.8);
		line-height: 1.45;
	}

	.featured-btn {
		margin-top: 16rpx;
		height: 56rpx;
		padding: 0 24rpx;
		border-radius: 28rpx;
		background: rgba(255, 255, 255, 0.92);
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.featured-btn-text {
		font-size: 24rpx;
		color: #1a2bff;
		font-weight: 700;
	}

	.featured-right {
		width: 180rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.burst {
		width: 140rpx;
		height: 140rpx;
		border-radius: 70rpx;
		background: rgba(255, 255, 255, 0.15);
	}

	.quick-row {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-bottom: 24rpx;
	}

	.quick-item {
		width: 160rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.quick-icon {
		width: 84rpx;
		height: 84rpx;
		border-radius: 24rpx;
		background: rgba(255, 255, 255, 0.08);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.quick-icon-img {
		width: 44rpx;
		height: 44rpx;
	}

	.quick-text {
		margin-top: 10rpx;
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.7);
	}

	.section-head {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-top: 10rpx;
		margin-bottom: 14rpx;
	}

	.section-title {
		font-size: 30rpx;
		color: rgba(255, 255, 255, 0.92);
		font-weight: 700;
	}

	.section-action {
		font-size: 22rpx;
		color: #5c7cff;
		font-weight: 600;
	}

	.hot-scroll {
		height: 340rpx;
		margin-bottom: 12rpx;
	}

	.hot-inner {
		display: flex;
		flex-direction: row;
		padding-bottom: 10rpx;
	}

	.tool-card {
		width: 280rpx;
		border-radius: 24rpx;
		background: rgba(255, 255, 255, 0.06);
		padding: 18rpx;
		margin-right: 18rpx;
		box-sizing: border-box;
	}

	.tool-thumb {
		height: 180rpx;
		border-radius: 18rpx;
		background: rgba(255, 255, 255, 0.08);
		overflow: hidden;
	}

	.tool-img {
		width: 100%;
		height: 100%;
	}

	.tool-title {
		margin-top: 14rpx;
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.9);
		font-weight: 700;
	}

	.tool-subtitle {
		margin-top: 6rpx;
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.55);
	}

	.rec-card {
		display: flex;
		flex-direction: row;
		align-items: center;
		border-radius: 24rpx;
		background: rgba(255, 255, 255, 0.06);
		padding: 16rpx;
		margin-bottom: 16rpx;
		box-sizing: border-box;
	}

	.rec-img {
		width: 96rpx;
		height: 96rpx;
		border-radius: 20rpx;
		background: rgba(255, 255, 255, 0.08);
		margin-right: 16rpx;
	}

	.rec-main {
		flex: 1;
		overflow: hidden;
	}

	.rec-title {
		display: block;
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.92);
		font-weight: 700;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.rec-subtitle {
		display: block;
		margin-top: 6rpx;
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.55);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.bottom-space {
		height: 60rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		background: #0b1020;
	}
</style>
