<template>
	<view class="search">
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<uni-nav-bar @clickLeft="backLast" :border="false" background-color="#f7f7f7" left-icon="back">
			<view class="">
				<u-search @custom="search" style="width: 650rpx;" placeholder="输入书名或作者进行搜索" v-model="keyWords"></u-search>
			</view>
		</uni-nav-bar>
		<view class="search-item" v-for="book in books" @click="tobookInfo(book.bookid)">
			<div class="img"><image :src="book.img" mode=""></image></div>
			<view class="bookinfo">
				<view class="bookName">
					<div class="name">{{book.bookName}}</div>
					<text class="type">{{book.type}}</text>
				</view>
				<view class="introduction">{{book.introduction}}</view>
				<view class="author">{{book.author}}</view>
				
			</view>
			<!-- <view>{{book.type}}</view> -->
		</view>
		<u-empty style="margin-top: 300rpx;" v-show="request&&books.length==0" text="找不到相关作者或书籍" mode="search"></u-empty>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				keyWords:"",
				books:[],
				request:false,
				styleInput:{
					width:"460rpx"
				},
				bg:"#f7f7f7"
			}
		},
		onLoad(option) {
			if(option.keyWord){
				this.keyWords=option.keyWord
			}
		},
		methods:{
			backLast(){
				uni.navigateBack({
					delta:1
				})
			},
			tobookInfo(bookid){
				uni.navigateTo({
					url:"/pages/reader/book-baseinfo/book-baseinfo?id="+bookid
				})
			},
			search(){
				console.log("123")
				uniCloud.callFunction({
					name:"query",
					data:{
						keyWords:this.keyWords
					}
				}).then(res=>{
					console.log(res.result.data)
					this.request=true
					this.books=res.result.data?res.result.data:[]
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.search{
		.status_bar {
		      height: var(--status-bar-height);
		      width: 100%;
		  }
		.search-item{
			display: flex;
			align-items: center;
			padding:5rpx 30rpx;
			background-color: #FFFFFF;
			border-bottom: 1rpx solid #f5f5f5;
			.img{
				image{
					width: 120rpx;
					height: 180rpx;
				}
			}
			.bookinfo{
				display: flex;
				height: 100%;
				flex-direction: column;
				justify-content: space-between;
				margin-left: 20rpx;
				.author{
					font-size: 22rpx;
					// color: #cccccc;
					margin-top: 8rpx;
				}
				.introduction{
					display:-webkit-box;
					-webkit-box-orient:vertical;
					-webkit-line-clamp:2;
					word-break:break-all;
					overflow:hidden;
					color: #7d7d7d;
					margin-top: 10rpx;
				}
				.bookName{
					display: flex;
					align-items: center;
					padding-top: 20rpx;
					.name{
						font-size: 28rpx;
						font-weight: 450rpx;
					}
					.type{
						margin-left:auto;
						background: #aa5500;
						display: inline-block;
						padding: 0 10rpx;
						color:#FFFFFF;
						border-radius: 10rpx;
					}
				}
			}
		}
	}
</style>
