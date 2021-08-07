<template>
	<view class="book-info">
		<view class="book-baseinfo" v-if="baseInfo.bookName">
			<view class="book-img">
				<image :src="baseInfo.img"></image>
			</view>
			<view class="book-base">
				<view class="bookName">{{baseInfo.bookName}}</view>
				<view>{{baseInfo.author}}</view>
				<view class="introduction">{{baseInfo.introduction}}</view>
				<u-rate size="44" :current="baseInfo.score" :disabled="true"></u-rate>
			</view>
		</view>
		<view class="book-operation" v-if="baseInfo.bookName">
			<!-- heart-fill -->
			<!-- <view><u-icon class="icon" size="32" name="heart"></u-icon>收藏</view>
			<view><image class="icon" src="../../../static/icon1/shujia.png" style="width:32rpx;height: 32rpx;"></image>加入书架</view>
			<view><u-icon class="icon" size="32" name="list-dot"></u-icon>目录</view> -->
		</view>
		<view class="book-comment" v-if="this.requestComment">
			<view class="comment-title">
				<text>评论</text>
				<view  @click="allComment">全部评论<u-icon name="arrow-right"></u-icon></view>
			</view>
			<view class="allcomment-item" v-for="(comment,index) in comments" :key="comment.commentId">
				<view class="left" @click="toCommentDetail">
					<image :src="comment.headPortrait" mode=""></image>
				</view>
				<view class="right">
					<view class="top">
						<text>{{comment.comentBy}}</text>
						<u-rate size="22" active-color="#d3d3d3" inactive-color="#e8e8e8" :current="comment.score" :disabled="true"></u-rate>
					</view>
					<view class="center">
						<view class="" @click="toCommentDetail(comment.commentId,comment.praise,comment.collect)">
							{{comment.commentContent}}
						</view>
					</view>
					<view class="bom">
						<view class="time">
							<text>{{comment.commentTime}}</text>
						</view>
						<view class="num">
							<text class="reply"><u-icon name="chat" style="margin-right: 10rpx;"></u-icon>{{comment.commentReply}}</text>
							<text class="praise"><u-icon  @click="thumbs(comment._id,index)" :color="comment.praise?'red':'inherit'" name="thumb-up" style="margin-right: 10rpx;"></u-icon>{{comment.commentPraise}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- <u-button type="info" class="btn" @click="allComment">点击查看全部评论</u-button> -->
		<view v-if="this.requestComment&&comments.length==0 " class="empty">
			<u-empty text="当前没有评论" mode="history"></u-empty>
			<text class="text" @click="toComment(id)">去评论</text>
		</view>
		<view class="fixed" :style="{top:windowHeight}"  v-if="requestBookshelf==true">
			<view class="left" v-if="addbookshelf==false" @click="addtoBookshelf">加入书架</view>
			<view class="left" v-if="addbookshelf" @click="toBookshelf">去书架</view>
			<view class="right" @click="toreader(id)">点击阅读</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				baseInfo:{},
				comments:[],
				id:"",
				// 是否加入书架
				addbookshelf:false,
				requestComment:false,
				// 判断是否加入书架接口请求完毕
				requestBookshelf:false,
				windowHeight:"",
				position:"fixed"
				
			}
		},
		methods:{
			// 点赞
			thumbs(id,index){
				let userInfo=uni.getStorageSync("userInfo");
				// 判断用户是否登录
				if(!userInfo){
					uni.showModal({
					    title: '提示',
					    content: '您还没有登录,是否登录',
							confirmText:"去登录",
					    success: function (res) {
					        if (res.confirm) {
					            uni.redirectTo({
					            	url:"/pages/login/login"
					            })
					        } else if (res.cancel) {
					            // console.log('用户点击取消');
					        }
					    }
					});
					return
				}
				this.comments[index].praise=!this.comments[index].praise
				// 点赞数加一还是减一
				if(this.comments[index].praise){
					this.comments[index].commentPraise=this.comments[index].commentPraise+1
				}else{
					this.comments[index].commentPraise=this.comments[index].commentPraise-1
				}
				// 添加用户点赞信息或删除该用户的点赞信息
				let type=this.comments[index].commentPraise?"add":"del"
				console.log(id)
				uniCloud.callFunction({
					name:'comment_thumbs-up',
					data:{
						id:id,
						type:type,
						accountId:userInfo.accountId?userInfo.accountId:"",
						commentPraise:this.comments[index].commentPraise,
						bookId:this.id
					}
				}).then(res=>{
					console.log(res)
				}).catch(err=>{
					// console.log(err)
				})
			},
			toCommentDetail(id,praise,collect){
				uni.navigateTo({
					url:"/pages/reader/comment-detail/comment-detail?bookId="+this.id+"&commentId="+id+"&praise="+praise+"&collect="+collect
				})
			},
			// 去书架
			toBookshelf(){
				uni.navigateTo({
					url:"/pages/bookshelf/bookshelf"
				})
			},
			// 去发布评价
			toComment(id){
				uni.navigateTo({
					url:"/pages/reader/release/release?bookid="+id
				})
			},
			// 阅读该书籍
			toreader(id){
				uni.navigateTo({
					url:"/pages/reader/reader?bookid="+id
				})
			},
			// 获取基本信息
			init(){
				const db = uniCloud.database();//代码块为cdb
				// 使用uni-clientDB
				db.collection('book').where({
					"bookid":this.id
				}).get({getOne:true}).then((res)=>{
						// console.log(res.result.data.img.toString())
						this.baseInfo=res.result.data
				    // res 为数据库查询结果
						uni.setNavigationBarTitle({
								title:this.baseInfo.bookName
						});
				  }).catch((err)=>{
						// console.log(err)
				  })
			},
			// 获取评论
			getComments(){
					let userInfo=uni.getStorageSync("userInfo")
					uniCloud.callFunction({
							name:"getComment",
							data:{
								skip:0,
								limit:3,
								accountId:userInfo.accountId?userInfo.accountId:"",
								bookid:this.id
							}
						}).then(res=>{
							// console.log(res.result)
							this.requestComment=true
							this.comments=res.result.comments;
						})
			},
			// 判断该书籍是否已经加入书架
			getBookshelf(){
				let userInfo=uni.getStorageSync("userInfo")
				if(!userInfo){
					this.requestBookshelf=true
					return
				}
				const db = uniCloud.database();
				db.collection("bookshelf").where({
					accountId:userInfo.accountId
				}).get().then(res=>{
					let arr=res.result.data[0].books?res.result.data[0].books:[]
					// console.log(res)
					arr.forEach(val=>{
						if(val.bookid==this.id){
							this.addbookshelf=true
						}
					})
					this.requestBookshelf=true
					console.log(this.requestBookshelf+"this.requestBookshelf")
				})
			},
			// 加入书架
			addtoBookshelf(){
				let userInfo=uni.getStorageSync("userInfo");
				// 判断用户是否登录
				if(!userInfo){
					uni.showModal({
					    title: '提示',
					    content: '您还没有登录,是否登录',
							confirmText:"去登录",
					    success: function (res) {
					        if (res.confirm) {
					            uni.redirectTo({
					            	url:"/pages/login/login"
					            })
					        } else if (res.cancel) {
					            // console.log('用户点击取消');
					        }
					    }
					});
					return
				}
				let obj={}
				obj.bookid=this.id;
				obj.bookName=this.baseInfo.bookName
				obj.img=this.baseInfo.img
				// console.log(obj)
				uniCloud.callFunction({
					name:"addBookshelf",
					data:{
						accountId:userInfo.accountId,
						obj:obj
					}
				}).then(res=>{
					// console.log(res)
					this.toast("已加入书架")
					this.addbookshelf=true
				})
			},
			allComment(){
				uni.navigateTo({
					url:"/pages/reader/allcomment/allcomment?id="+this.id
				})
			},
			
		},
		onLoad(option){
			this.id=option.id
			// 获取db引用
			let self=this
			uni.getSystemInfo({
				success(res) {
					// #ifdef APP-PLUS
					self.windowHeight=((res.windowHeight+res.statusBarHeight)*2-98)+"rpx"
					// #endif
					// #ifdef H5
					self.windowHeight=res.windowHeight+"px"
					// #endif
				}
			})
			this.init()
			this.getComments()
			this.getBookshelf()
			
		},
		onShow() {
			// this.windowHeight="100rpx"
			let self=this
			uni.getSystemInfo({
				success(res) {
					// console.log((res.windowHeight+res.statusBarHeight)*2)
					// #ifdef APP-PLUS
					self.windowHeight=((res.windowHeight+res.statusBarHeight)*2-98)+"rpx"
					// #endif
					// #ifdef H5
					self.windowHeight=res.windowHeight+"px"
					// #endif
					// console.log(res.windowHeight*2)
					
				}
			})
			this.init()
			this.getComments()
			this.getBookshelf()
		},
	}
</script>

<style lang="scss" scoped>
	.book-info{
		// padding-bottom: 100rpx;
		// background-color: red;
		height: 100%;
	}
	.book-baseinfo{
		display: flex;
		padding:10rpx 30rpx;
		.book-img{
			flex: 1;
			image{
				width: 90%;
				height: 300rpx;
			}
		}
		.book-base{
			flex: 2;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			.bookName{
				font-size: 42rpx;
				font-weight: bold;
				letter-spacing: 3rpx;
			}
			.introduction{
				overflow:hidden; 
				text-overflow:ellipsis;
				display:-webkit-box; 
				-webkit-box-orient:vertical;
				-webkit-line-clamp:3;
			}
		}
	}
	.book-operation{
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 15rpx 30rpx;
		font-size: 35rpx;
		view{
			.icon{
				margin-right: 10rpx;
			}
			flex:1;
			text-align: center;
		}
	}
	.book-comment{
		padding: 0 30rpx;
		margin-top: 30rpx;
		margin-bottom: 30rpx;
		// padding: 0 30rpx;
		.comment-title{
			display: flex;
			width: 100%;
			margin-bottom: 30rpx;
			text:nth-child(1){
				flex:1;
				font-size: 32rpx;
				text-align: left;
				font-weight: 600;
			}
			text:nth-child(2){
				flex:1;
				text-align:right;
			}
		
		
		}
	}
	.allcomment-item{
		padding-top: 30rpx;
		display: flex;
		.left{
			image{
				width: 70rpx;
				height: 70rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}
		}
		.right{
			flex: 1;
			padding-bottom: 30rpx;
			// border-bottom: 1rpx solid #cccccc;
			.top{
				
			}
			.center{
				margin-top: 10rpx;
			}
			.bom{
				margin-top: 15rpx;
				display: flex;
				.time{
					flex: 1;
				}
				.num{
					flex: 1;
					display: flex;
					justify-content: center;
					text{
						flex:1;
						text-align: right;
					}
				}
			}
		}
	}
	.btn{
		width: 690rpx;
		 // margin-bottom: 100rpx;
	}
	.empty{
		// width: 1000%;
		margin-top: 100rpx;
		font-size: 36rpx;
		.text{
			display: block;
			text-align: center;
			color: #FF9900;
			letter-spacing: 3rpx;
		}
	}
	.fixed{
		position: fixed;
		// top: 1472rpx;
		display: flex;
		width: 100%;
		background: #cccccc;
		height: 100rpx;
		justify-content: space-around;
		align-items: center;
		font-size: 38rpx;
		letter-spacing: 5rpx;
		font-weight: 500;
		.left{
			background: #FFFFFF;
			color:#ff5500;
			width: 300rpx;
			border-radius: 40rpx;
			height: 70rpx;
			line-height: 70rpx;
			text-align: center;
		}
		.right{
			background: #ff5500;
			color:#FFFFFF;
			width: 300rpx;
			border-radius: 40rpx;
			height: 70rpx;
			line-height: 70rpx;
			text-align: center;
		}
	}
</style>
