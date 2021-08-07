<template>
	<!-- 书城 -->
	<view class="bookshop">
		<u-tabs-swiper @change="changeType" :current="tabIndex" ref="tabs" :list="list"></u-tabs-swiper>
		<view class="book">
			<view class="bookmain">
				<view class="bookitem" @click="tobookInfo(book.bookid)" v-for="book in books">
					<view class="left">
						<image :src="book.img"></image>
					</view>
					<view class="right">
						<view class="bookName">{{book.bookName}}</view>
						<view class="introduction">{{book.introduction}}</view>
						<view class="author">{{book.author}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				list:[
					{"name":"全部"},
					{"name":"末世危机"},
					{"name":"玄幻小说"},
					{"name":"悬疑/推理小说"},
					{"name":"科幻小说"},
					{"name":"都市小说"}
				],
				books:[],
				tabIndex:0
			}
		},
		onNavigationBarSearchInputClicked(){
			uni.navigateTo({
				url:"/pages/search/search"
			})
		},
		created() {
			this.tabIndex=0
			this.getTypeBook(this.list[0].name)
		},
		methods:{
			changeType(index){
				this.tabIndex=index
				// console.log(this.list[index].name)
				this.getTypeBook(this.list[index].name)
			},
			tobookInfo(bookid){
				uni.navigateTo({
					url:"/pages/reader/book-baseinfo/book-baseinfo?id="+bookid
				})
			},
			getTypeBook(type){
				let db=uniCloud.database()
				this.books=[]
				if(type=="全部"){
					db.collection("book").get().then(res=>{
						this.books=res.result.data
						console.log(res)
					})
				}else{
					db.collection("book").where({
						type:type
					}).get().then(res=>{
						this.books=res.result.data
						console.log(res)
					})
				}
				
			}
		}
	}
</script>

<style scoped lang="less">
	.book{
		.bookmain{
			
			.bookitem{
				display: flex;
				align-items: center;
				padding:5rpx 30rpx;
				background-color: #FFFFFF;
				border-bottom: 1rpx solid #f5f5f5;
				.left{
					image{
						width: 120rpx;
						height: 180rpx;
					}
				}
				.right{
					margin-left: 20rpx;
					.bookName{
						font-size: 36rpx;
						font-weight: 500rpx;
					}
					.author{
						font-size: 26rpx;
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
				}
			}
		}
	}
</style>
