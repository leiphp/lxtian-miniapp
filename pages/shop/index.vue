<template>
	<view class="page">
		<view class="nav">
			<text class="nav-title">AI 商城</text>
		</view>

		<scroll-view class="scroll" scroll-y>
			<view class="container">
				<view class="filter-row">
					<view
						v-for="tab in tabs"
						:key="tab"
						class="filter-pill"
						:class="tab === activeTab ? 'filter-pill-active' : ''"
						@click="activeTab = tab"
					>
						<text class="filter-text">{{ tab }}</text>
					</view>
				</view>

				<view class="product"
					v-for="item in filteredList"
					:key="item.id"
					@click="tapProduct(item.id)"
				>
					<view class="thumb">
						<view class="thumb-ph"></view>
					</view>
					<view class="product-main">
						<text class="product-tag">{{ item.tag }}</text>
						<text class="product-title">{{ item.title }}</text>
						<text class="product-desc">{{ item.desc }}</text>

						<view class="product-meta">
							<text class="meta-left">{{ item.badge }}</text>
							<view class="price-row">
								<text class="price">{{ item.price }}</text>
								<text class="old-price" v-if="item.oldPrice">{{ item.oldPrice }}</text>
							</view>
						</view>
					</view>
					<view class="cta">
						<view class="cta-btn">
							<text class="cta-text">购买</text>
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

const tabs = ref(['全部', '课程', '工具包', '模板'])
const activeTab = ref('全部')

const products = ref([
	{
		id: 'pack-pro',
		type: '工具包',
		tag: 'AI 提示词包',
		title: '商业设计场景提示词全集',
		desc: '覆盖海报、电商、品牌等 80+ 真实项目场景，拿来即用。',
		price: '¥199',
		oldPrice: '¥299',
		badge: '限时 7 折'
	},
	{
		id: 'course-ops',
		type: '课程',
		tag: '运营课程',
		title: 'AI 辅助广告投放系统课',
		desc: '拆解从创意生成到 A/B 测试的全流程自动化方案。',
		price: '¥299',
		oldPrice: '',
		badge: '热门'
	},
	{
		id: 'tpl-notion',
		type: '模板',
		tag: '知识库模板',
		title: 'AI 知识库 Notion 模板',
		desc: '预置 Prompt、案例与复盘结构，一键搭建团队 AI 知识库。',
		price: '¥69',
		oldPrice: '',
		badge: '即用型'
	}
])

const filteredList = computed(() => {
	if (activeTab.value === '全部') return products.value
	return products.value.filter(p => p.type === activeTab.value)
})

function tapProduct(id) {
	uni.showToast({ title: 'Open: ' + id, icon: 'none' })
}
</script>

<style>
	.page {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background: #0b1020;
	}

	.nav {
		height: 96rpx;
		display: flex;
		align-items: flex-end;
		padding: 0 24rpx;
		box-sizing: border-box;
	}

	.nav-title {
		font-size: 34rpx;
		color: rgba(255, 255, 255, 0.92);
		font-weight: 700;
	}

	.scroll {
		flex: 1;
	}

	.container {
		padding: 12rpx 24rpx 0 24rpx;
		box-sizing: border-box;
	}

	.filter-row {
		margin-top: 12rpx;
		margin-bottom: 16rpx;
		display: flex;
		flex-direction: row;
	}

	.filter-pill {
		height: 56rpx;
		padding: 0 24rpx;
		border-radius: 28rpx;
		background: rgba(255, 255, 255, 0.06);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 12rpx;
	}

	.filter-pill-active {
		background: #6d4bff;
	}

	.filter-text {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.85);
		font-weight: 600;
	}

	.product {
		margin-bottom: 18rpx;
		padding: 18rpx;
		border-radius: 24rpx;
		background: rgba(255, 255, 255, 0.06);
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		box-sizing: border-box;
	}

	.thumb {
		width: 140rpx;
		height: 140rpx;
		border-radius: 20rpx;
		overflow: hidden;
		margin-right: 16rpx;
	}

	.thumb-ph {
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.12);
	}

	.product-main {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.product-tag {
		font-size: 20rpx;
		color: #a88bff;
	}

	.product-title {
		margin-top: 6rpx;
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.95);
		font-weight: 700;
	}

	.product-desc {
		margin-top: 8rpx;
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.6);
		line-height: 1.4;
	}

	.product-meta {
		margin-top: 12rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.meta-left {
		font-size: 20rpx;
		color: rgba(255, 255, 255, 0.6);
	}

	.price-row {
		display: flex;
		flex-direction: row;
		align-items: baseline;
	}

	.price {
		font-size: 26rpx;
		color: #ffd36b;
		font-weight: 700;
		margin-right: 8rpx;
	}

	.old-price {
		font-size: 20rpx;
		color: rgba(255, 255, 255, 0.4);
		text-decoration: line-through;
	}

	.cta {
		margin-left: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cta-btn {
		min-width: 96rpx;
		height: 52rpx;
		border-radius: 26rpx;
		background: #6d4bff;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cta-text {
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.95);
		font-weight: 700;
	}

	.bottom-space {
		height: 40rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}
</style>

