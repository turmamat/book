<template>
	<!-- 书架 -->
	<view class="bookshelf">
		<view class="book" v-if="requestBooks==true&&books.length!=0">
			<view class="bookitem" v-for="(book,index) in books">
				<image @longpress="manageBook()" @click="toreading(book.bookid,index)" class="img" :src="book.img" mode=""></image>
				<u-checkbox  v-model="book.checked" @change="changeStaus(index)" v-show="manage" class="select" shape="circle"  active-color="#F29100"></u-checkbox>
				<view class="bookname">{{book.bookName}}</view>
			</view>
		</view>
		<view class="null" v-if="requestBooks==true&&books.length==0">
			<u-empty style="margin-top: 300rpx;"  text="书架空空如也" mode="search"></u-empty>
			<view class="btn" @click="toBookshop">去书城</view>
		</view>
		<view class="popup" v-show="manage">
			<view class="popup-main">
				<view @click="allSelect">
					<u-checkbox size="38rpx" v-model="checked" shape="circle" active-color="#F29100">全选</u-checkbox>
				</view>
				<view @click="del">
					<image src="../../static/icon1/del.png" style="width: 38rpx;height: 38rpx;margin-right: 5rpx;" mode=""></image>
					<text>删除</text>
				</view>
				
				<view @click="cancle">
					<image src="../../static/icon1/cancle.png" style="width: 38rpx;height: 38rpx;margin-right: 5rpx;" mode=""></image>
					<text>取消</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				books:[],
				requestBooks:false,
				manage:false,
				checked:false
			}
		},
		onLoad() {
			this.init()
		},
		onShow() {
			this.init()
		},
		onPullDownRefresh() {
			this.init()
		},
		// 去搜索图书
		onNavigationBarSearchInputClicked(){
			uni.navigateTo({
				url:"/pages/search/search"
			})
		},
		methods:{
			init(){
				let db=uniCloud.database()
				let collection=db.collection('bookshelf')
				let userInfo=uni.getStorageSync("userInfo")
				this.requestBooks=false
				collection.where({
					accountId:userInfo.accountId
				}).get().then(res=>{
					res.result.data[0].books.forEach(val=>{
						val.checked=false
						console.log(val)
					})
					this.books=res.result.data[0].books
					this.requestBooks=true
					uni.stopPullDownRefresh()
				})
			},
			changeStaus(i){
				console.log(this.books[i].checked)
				this.books[i].checked=!this.books[i].checked
			},
			// 去书城
			toBookshop(){
				uni.navigateTo({
					url:"/pages/bookshop/bookshop"
				})
			},
			cancle(){
				this.manage=false
			},
			// 删除书架书籍
			async del(){
				let userInfo=uni.getStorageSync("userInfo")
				let ids=[]
				let arr=this.books.filter(val=>{
					return val.checked==true
				})
				if(arr.length==0){
					this.toast("未选择要删除书籍")
					return
				}
				arr.forEach(val=>{
					ids.push(val.bookid)
				})
				uniCloud.callFunction({
					name:"delBookshelf",
					data:{
						accountId:userInfo.accountId,
						ids:ids
					}
				}).then(async (res)=>{
					console.log(res)
					await this.init()
					this.manage=false
					this.toast("删除书籍成功")
				})
				console.log(ids)
			},
			// 是否全部勾选
			allSelect(){
				if(this.checked){
					this.books.forEach(val=>{
						val.checked=true
					})
				}else{
					this.books.forEach(val=>{
						val.checked=false
					})
				}
				
			},
			toreading(bookid,i){
				// this.manage=true
				if(this.manage==false){
					uni.navigateTo({
						url:"/pages/reader/reader?bookid="+bookid
					})
				}else{
					this.changeStaus(i)
					return
				}
				
			},
			manageBook(){
				this.manage=true
				uni.vibrateShort({
				    success: function () {
				        console.log('success');
				    }
				});
			}
		},
		created() {
			
		}
	}
</script>

<style scoped lang="less">
	.bookshelf{
		// color: #F29100;
	}
	.book{
		display: flex;
		width: 100%;
		padding: 30rpx;
		flex-wrap: wrap;
		
		.bookitem{
			text-align: center;
			width: 230rpx;
			margin-bottom: 50rpx;
			position: relative;
			.img{
				width: 200rpx;
				height:280rpx;
			}
			.select{
				position: absolute;
				right:-10rpx;
				z-index: 10;
			}
			.bookname{
				margin-top: 10rpx;
				font-weight: 500;
				font-size: 32rpx;
			}
		}
	}
	.popup{
		position: fixed;
		background: #FFFFFF;
		bottom: 0rpx;
		width: 100%;
		height: 100rpx;
		font-size: 32rpx;
		.popup-main{
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			view{
				flex: 1;
				text-align: center;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
	.null{
		display: flex;
		justify-content: center;
		flex-direction: column;
		.btn{
			margin: 30rpx auto;
			width: 240rpx;
			padding: 10rpx 0;
			background: #ff557f;
			text-align: center;
			border-radius: 30rpx;
			font-size: 36srpx;
			color:#FFFFFF;
		}
	}
</style>
