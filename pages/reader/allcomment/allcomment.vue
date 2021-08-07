<template>
	<view class="allcomment">
		<view class="allcomment-item" v-for="(comment,index) in comments" :key="comment.commentId">
			<view class="left">
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
						<text  @click="toCommentDetail" class="reply"><u-icon name="chat" style="margin-right: 10rpx;"></u-icon>{{comment.commentReply}}</text>
						<text class="praise"><u-icon @click="thumbs(comment._id,index)" :color="comment.praise?'red':'inherit'" name="thumb-up" style="margin-right: 10rpx;"></u-icon>{{comment.commentPraise}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="edit" @click="toComment">
			<u-icon size="44" name="edit-pen"></u-icon>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				bookId:"",
				comments:[],
				pagesNum:1,
				total:0
			}
		},
		onLoad(option) {
			this.bookId=option.id;
			// this.total=1;
			// this.pagesNum=1;
			// console.log(this.bookId)
			// this.getComment()
		},
		onShow() {
			this.total=1;
			this.pagesNum=1;
			this.comments=[]
			this.getComment()
		},
		onReachBottom(){
			this.getComment()
			console.log(this.total)
		},
		methods:{
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
					            console.log('用户点击取消');
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
				uniCloud.callFunction({
					name:'comment_thumbs-up',
					data:{
						id:id,
						type:type,
						accountId:userInfo.accountId?userInfo.accountId:"",
						commentPraise:this.comments[index].commentPraise,
						bookId:this.bookId
					}
				}).then(res=>{
					console.log(res)
				}).catch(err=>{
					console.log(err)
				})
				
				
			},
			getComment(){
				// 获取评论信息
				let userInfo=uni.getStorageSync("userInfo")
				if(this.total>(this.pagesNum-1)*10){
					uni.showLoading({
					    title: '加载中'
					});
					uniCloud.callFunction({
							name:"getComment",
							data:{
								skip:10*(this.pagesNum-1),
								limit:10,
								accountId:userInfo.accountId?userInfo.accountId:"",
								bookid:this.bookId
							}
						}).then(res=>{
							console.log(res.result)
							this.comments=this.comments.concat(res.result.comments);
							this.pagesNum=this.pagesNum+1;;
							// this.ideas=this.ideas.concat(res.result.comments);
							this.total=res.result.total
							// this.pagesNum=this.pagesNum+1;
							uni.hideLoading()
							uni.stopPullDownRefresh()
						}).catch((err)=>{
								console.log(err)
								uni.hideLoading()
								uni.stopPullDownRefresh()
							})
					}
			},
			toComment(){
				uni.navigateTo({
					url:"/pages/reader/release/release?bookid="+this.bookId
				})
			},
			toCommentDetail(id,praise,collect){
				uni.navigateTo({
					url:"/pages/reader/comment-detail/comment-detail?bookId="+this.bookId+"&commentId="+id+"&praise="+praise+"&collect="+collect
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.allcomment{
		padding:10rpx 30rpx;
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
			border-bottom: 1rpx solid #cccccc;
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
	.edit{
		position: fixed;
		bottom:80rpx;
		right:30rpx;
		width: 80rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		background: #8d8d8d;
		color:#FFFFFF;
	}
</style>
