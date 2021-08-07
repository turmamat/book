<template>
	<!-- 收藏 -->
	<view class="idea">
		<view class="top">
			<view @click="changeTab(0)" class="community">社区<text v-if="tabIndex==0"></text></view>
			<view @click="changeTab(1)" class="bookComment">书评<text v-if="tabIndex==1"></text></view>
		</view>
		<view class="idea-main">
			<view v-if="tabIndex==0" class="community">
				<u-empty style="margin-top: 300rpx;" v-show="requestData&&ideas.length==0" text="您未收藏任何社区心得" mode="search"></u-empty>
				<view class="communityItem" v-for="(idea,index) in ideas" :key="idea._id">
					<view class="baseInfo">
						<view class="left">
							<image :src="idea.headPortrait" mode=""></image>
						</view>
						<view class="right">
							<view class="ideaBy">{{idea.ideaBy}}</view>
							<view class="ideaTime">{{idea.ideaTime}}</view>
						</view>
					</view>
					<view @click="toComment(idea.ideaId,idea.praise,idea.collect)" class="ideaContent">{{idea.ideaContent}}</view>
					<view class="bom">
						<view @click="toComment(idea.ideaId,idea.praise,idea.collect)"><u-icon size="34rpx" name="chat" style="margin-right: 8rpx;"></u-icon>{{idea.ideaReply}}</view>
						<view style="margin-left:50rpx"><u-icon @click="thumbs(idea._id,index)" :color="idea.praise?'red':'inherit'" name="thumb-up" size="34rpx" style="margin-right: 8rpx;"></u-icon>{{idea.ideaPraise}}</view>
					</view>
				</view>
			</view>
			
			<view v-if="tabIndex==1" class="bookComment">
				<u-empty style="margin-top: 300rpx;" v-show="requestData&&comments.length==0" text="您未收藏任何书评" mode="search"></u-empty>
				
				<view class="bookCommentItem" @click="toCommentDetail(comment.bookInfo.bookid,comment.commentId,comment.praise,comment.collect)" v-for="comment in comments">
					<view class="baseInfo">
						<view class="left">
							<image :src="comment.headPortrait" mode=""></image>
						</view>
						<view class="right">
							<view class="ideaBy">{{comment.comentBy}}</view>
							<view class="ideaTime">{{comment.commentTime}}</view>
						</view>
					</view>
					<view class="content">
						<view class="bookName"><text>书名：</text>{{comment.bookInfo.bookName}}</view>
						<view class="score"><text>评分：</text><u-rate size="44" :current="comment.score" :disabled="true"></u-rate></view>
						<view class="commentContent"><text>评论内容：</text>{{comment.commentContent}}</view>
						<view class="reply" @click=""><u-icon size="42rpx" name="chat" style="margin-right: 8rpx;"></u-icon>{{comment.commentReply}}</view>
					</view>
				</view>
			</view>
			<view class="load" v-if="requestData!=true">
				<u-loading mode="flower" size="54"></u-loading>加载中
			</view>
			
			
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				ideas:[],
				comments:[],
				tabIndex:0,
				requestData:false
			}
		},
		created(){
			this.changeTab(0)
		},
		onShow() {
			this.changeTab(this.tabIndex)
		},
		methods:{
			changeTab(i){
				this.tabIndex=i
				if(i==0){
					this.getIdea()
				}else{
					this.getComment()
				}
			},
			// 获取发布的社区心得
			getIdea(){
				this.ideas=[]
				this.requestData=false
				const db=uniCloud.database()
				let userInfo=uni.getStorageSync('userInfo')
				uniCloud.callFunction({
					name:"getCollect",
					data:{
						accountId:userInfo.accountId,
						type:0
					}
				}).then(res=>{
					console.log(res)
					this.ideas=res.result.comments
					this.requestData=true
				})
			},
			// 获取书评
			getComment(){
				this.requestData=false
				this.comments=[]
				const db=uniCloud.database()
				let userInfo=uni.getStorageSync('userInfo')
				uniCloud.callFunction({
					name:"getCollect",
					data:{
						accountId:userInfo.accountId,
						type:1
					}
				}).then(res=>{
					console.log(res)
					this.comments=res.result.comments
					this.requestData=true
				})
			},
			toCommentDetail(bookId,id,praise,collect){
				uni.navigateTo({
					url:"/pages/reader/comment-detail/comment-detail?bookId="+bookId+"&commentId="+id+"&praise="+praise+"&collect="+collect
				})
			},
			// 社区评论详情
			toComment(id,praise,collect){
				uni.navigateTo({
					url:"/pages/community/detail/detail?id="+id+"&praise="+praise+"&collect="+collect
				})
			},
			// 点赞
			thumbs(id,index){
				let userInfo=uni.getStorageSync("userInfo");
				this.ideas[index].praise=!this.ideas[index].praise
				// 点赞数加一还是减一
				if(this.ideas[index].praise){
					this.ideas[index].ideaPraise=this.ideas[index].ideaPraise+1
				}else{
					this.ideas[index].ideaPraise=this.ideas[index].ideaPraise-1
				}
				// 添加用户点赞信息或删除该用户的点赞信息
				let type=this.ideas[index].ideaPraise?"add":"del"
				uniCloud.callFunction({
					name:'idea_thumbs-up',
					data:{
						id:id,
						type:type,
						accountId:userInfo.accountId?userInfo.accountId:"",
						ideaPraise:this.ideas[index].ideaPraise
					}
				}).then(res=>{
					console.log(res)
				})
				
				
			},
		}
	}
</script>

<style scoped lang="less">
	.idea{
		.top{
			display: flex;
			width: 100%;
			font-size: 38rpx;
			.community{
				flex: 1;
				margin: 0 auto;
				text-align: center;
				letter-spacing: 2rpx;
				text{
					margin: 10rpx auto;
					display: block;
					width: 50rpx;
					height: 6rpx;
					background: #000000;
				}
			}
			.bookComment{
				flex:1;
				margin: 0 auto;
				text-align: center;
				letter-spacing: 2rpx;
				text{
					margin: 10rpx auto;
					display: block;
					width: 50rpx;
					height: 5rpx;
					background: #000000;
				}
			}
		}
	}
	.idea-main{
		padding:0 30rpx;
		.community{
			margin-bottom: 50rpx;
			.communityItem{
				background: #FFFFFF;
				margin-bottom: 20rpx;
				border-radius: 10rpx;
				padding: 20rpx;
				.baseInfo{
					display: flex;
					.left{
						image{
							width: 70rpx;
							height: 70rpx;
							border-radius: 10rpx;
						}
					}
					.right{
						margin-left: 20rpx;
						.ideaBy{
							font-size: 32rpx;
							font-weight: 500;
						}
						.ideaTime{
							font-size: 22rpx;
							color:rgba(0, 0, 0, 0.8)
						}
					}
				}
				.ideaContent{
					margin:20rpx  0;
					overflow:hidden;
					text-overflow:ellipsis;
					display:-webkit-box; 
					-webkit-box-orient:vertical;
					-webkit-line-clamp:2;
					font-size: 30rpx;
					line-height: 40rpx;
				}
				.bom{
					display: flex;
					width: 100%;
					justify-content: flex-end;
					.reply{
						
					}
					.praise{
						margin-left: 50rpx;
					}
				}
			}
		}
		.bookComment{
			.bookCommentItem{
				background: #FFFFFF;
				margin-bottom: 20rpx;
				border-radius: 10rpx;
				padding: 20rpx;
				.baseInfo{
					display: flex;
					.left{
						image{
							width: 70rpx;
							height: 70rpx;
							border-radius: 10rpx;
						}
					}
					.right{
						margin-left: 20rpx;
						.ideaBy{
							font-size: 32rpx;
							font-weight: 500;
						}
						.ideaTime{
							font-size: 22rpx;
							color:rgba(0, 0, 0, 0.8)
						}
					}
				}
				.content{
					.bookName{
						font-size: 36rpx;
						font-weight: 500;
					}
					.score{
						font-size: 32rpx;
						font-weight: 500;
						margin:10rpx 0;
					}
					.commentContent{
						font-size: 32rpx;
					}
					.reply{
						display: flex;
						align-items: center;
						justify-content: flex-end;
					}
				}
			}
		}
	}
	.load{
		display: flex;
		align-items: center;
		margin:0 auto;
		justify-content: center;
		font-size: 36rpx;
	}
</style>
