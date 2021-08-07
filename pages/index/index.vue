<template>
	<view class="content">
		<view class="header">
			<view class="bookshop" @click="skip('/pages/bookshop/bookshop')">
				<view class="text">书城<u-icon style="margin-left: 5rpx;" name="arrow-right" size="30"></u-icon></view>
			</view>
			<view class="bookshelf" @click="skip('/pages/bookshelf/bookshelf')">
				<view class="text">书架<u-icon style="margin-left: 5rpx;" name="arrow-right" size="30"></u-icon></view>
			</view>
			<view class="readerRecord" @click="skip('/pages/readerRecord/readerRecord')">
				<view class="text">在读<u-icon style="margin-left: 5rpx;" name="arrow-right" size="30"></u-icon></view>
			</view>
		</view>
		<!-- 书籍分类 -->
		<view class="theclassify" v-for="classifion in classifions">
			<view class="title">
				分类•{{classifion.type}}
			</view>
			<view class="main">
				<view class="bookInfo" @click="tobookInfo(book.bookid)" v-for="book in classifion.bookList">
					<view class="left">
						<image alt="123" class="img" :src="book.img" mode=""></image>
					</view>
					<view class="right">
						<view class="name">
							{{book.bookName}}
						</view>
						<view class="author">
							{{book.author}}
						</view>
					</view>
				</view>
				
			</view>
		</view>
		<!-- 书籍 -->
		<view class="thebook" @click="tobookInfo(book.bookid)" v-for="book in books">
			<view class="top">
				<view class="left">
					<image alt="123" :src="book.img" mode="widthFix" ></image>
				</view>
				<view class="right">
					<view class="info">
						<view class="bookName">{{book.bookName}}</view>
						<view class="classify"><view>{{book.type}}</view></view>
					</view>
					<view class="author">
						{{book.author}}
					</view>
				</view>
			</view>
			<view class="hr"></view>
			<view class="bom">
				{{book.introduction}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pagesNum:1,
				classifions:[],
				books:[],
				total:0
			}
		},
		onLoad() {
			
		},
		onReachBottom() {
			this.init()
		},
		onPullDownRefresh() {
			this.pagesNum=1;
			this.getType()
		},
		created() {
			this.getType()
		},
		onNavigationBarSearchInputClicked(){
			uni.navigateTo({
				url:"/pages/search/search"
			})
		},
		methods: {
			
			async init(){
				let db=uniCloud.database()
				let collection=db.collection('book')
				if(this.total>(this.pagesNum-1)*10){
					uni.showLoading({
						title: '加载中',
						mask: false
					});
					collection.skip(10*(this.pagesNum-1)).limit(10).get().then(res=>{
						// console.log(this.pagesNum)
						this.pagesNum=this.pagesNum+1;
						// console.log(this.pagesNum)
						this.books=this.books.concat(res.result.data)
						uni.hideLoading()
						uni.stopPullDownRefresh()
					}).catch(err=>{
						uni.hideLoading()
						uni.stopPullDownRefresh()
					})
				}else{
					uni.hideLoading()
					uni.stopPullDownRefresh()
				}
				
				
			},
			async getType(){
				let db=uniCloud.database()
				let collection=db.collection('book')
				await collection.count().then(res=>{
					console.log(res.result.total)
					this.total=res.result.total
					this.init()
				})
				uniCloud.callFunction({
					name:'getBookType'
				}).then(res=>{
					// console.log(res)
					this.classifions=res.result
				})
			},
			tobookInfo(id){
				uni.navigateTo({
					url:"/pages/reader/book-baseinfo/book-baseinfo?&id="+id
				})
			},
			// 跳转页面
			skip(url){
				uni.navigateTo({
					url:url
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.content{
		padding:0 30rpx;
	}
	.header{
		// color: #FFFFFF;
		margin-bottom: 20rpx;
		margin-top: 10rpx;
		display: flex;
		justify-content: space-between;
		.bookshop{
			flex: 1;
			text-align: center;
			font-size: 32rpx;
			.text{
				margin: 0 auto;
				padding: 10rpx 0rpx;
				width: 160rpx;
				border-radius: 30rpx;
				// background:#8ffff2;
				background:rgba(255, 170, 0, 0.6);
				
			}
		}
		.bookshelf{
			flex: 1;
			text-align: center;
			font-size: 32rpx;
			.text{
				// display: inline-block;
				margin: 0 auto;
				padding: 10rpx 0rpx;
				width: 160rpx;
				border-radius: 30rpx;
				background:#8ffff2;
				background:rgba(170, 170, 127, 0.6)
				// opacity: 0.6;
				// color:#FFFFFF;
			}
		}
		.readerRecord{
			flex: 1;
			text-align: center;
			font-size: 32rpx;
			.text{
				margin: 0 auto;
				padding: 10rpx 0rpx;
				width: 160rpx;
				border-radius: 30rpx;
				// background:#8ffff2;
				background:rgba(255, 170, 127, 0.6)
			}
		}
	}
.theclassify{
		width:690rpx;
		background: #FFFFFF;
		margin-bottom: 50rpx;
		border-radius: 30rpx;
		padding: 30rpx;
		.title{
			margin-bottom: 30rpx;
			font-size: 40rpx;
			letter-spacing: 4rpx;
		}
		.main{
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			.bookInfo{
				width: 50%;
				display: flex;
				align-items: center;
				margin-bottom: 15rpx;
				.left{
					.img{
						width:110rpx;
						height: 150rpx;
					}
				}
				.right{
					display: flex;
					flex-direction: column;
					margin-left: 30rpx;
					.name{
						width: 180rpx;
						font-size: 32rpx;
						font-weight: 500;
						overflow: hidden;//盒子溢出隐藏
						text-overflow:ellipsis;//文字溢出显示省略号
						white-space: nowrap;//文字不换行
					}
					.author{
						width: 180rpx;
						margin-top: 10rpx;
						font-size: 26rpx;
						font-weight:500;
						color: #7d7d7d;
						overflow: hidden;//盒子溢出隐藏
						text-overflow:ellipsis;//文字溢出显示省略号
						white-space: nowrap;//文字不换行
					}
				}
			}
		}
	}
.thebook{
	width:690rpx;
	background: #FFFFFF;
	margin-bottom: 50rpx;
	border-radius: 30rpx;
	padding: 30rpx 0;
	.top{
		width:100%;
		height: 150rpx;
		display: flex;
		align-items: center;
		padding: 0rpx 30rpx;
		.left{
			image{
				width: 100rpx;
				height: 100rpx;
			}
		}
		.right{
			margin-left: 40rpx;
			width: 100%;
			.info{
				width: 100%;
				display: flex;
				align-items: center;
				.bookName{
					flex: 1;
					max-width: 280rpx;
					font-size: 36rpx;
					font-weight: 400;
					letter-spacing: 5rpx;
					overflow: hidden;//盒子溢出隐藏
					text-overflow:ellipsis;//文字溢出显示省略号
					white-space: nowrap;//文字不换行
				}
				.classify{
					// flex: 1;
					// flex-basis: 280rpx;
					// width: 100%;
					margin-left: auto;
					view{
						max-width: 200rpx;
						font-size: 32rpx;
						padding: 5rpx 15rpx;
						border-radius: 10rpx;
						margin-left: 30rpx;
						color: #FFFFFF;
						background: #aa5500;
						overflow: hidden;//盒子溢出隐藏
						text-overflow:ellipsis;//文字溢出显示省略号
						white-space: nowrap;//文字不换行
					}
				}
			}
			.author{
				color: #7d7d7d;
				margin-top: 20rpx;
				letter-spacing: 3rpx;
			}
		}
	}
	.hr{
		width:690rpx;
		display: block;
		height: 1rpx;
		background: #cccccc;
		margin-top: 30rpx;
		margin-bottom: 15rpx;
	}
	.bom{
		padding: 0rpx 30rpx;
		overflow:hidden;
		text-overflow:ellipsis;
		display:-webkit-box; 
		-webkit-box-orient:vertical;
		-webkit-line-clamp:4;
		font-size: 32rpx;
		line-height: 74rpx;
		letter-spacing: 2rpx;
	}
}
</style>
