<template>
	<view class="community">
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<view v-for="(idea,index) in ideas" class="community-item" :key="idea._id">
			<view class="ci-top">
				<view class="head">
					<image :src="idea.headPortrait" mode=""></image>
				</view>
				<view class="detail">
					<text class="name">{{idea.ideaBy}}</text>
					<text class="title">{{idea.ideaTime}}</text>
				</view>
			</view>
			<view class="ci-center">
				<view @click="toComment(idea.ideaId,idea.praise,idea.collect)">{{idea.ideaTitle}}</view>
				<text @click="toComment(idea.ideaId,idea.praise,idea.collect)">{{idea.ideaContent}}</text>
				<view class="imgbox">
					<view class="img" v-if="idea.ideaImg.length==2">
						<image @click="previewImage(idea.ideaImg)" style="height: 300rpx;" :src="imgurl" mode="aspectFill" v-for="imgurl in idea.ideaImg"></image>
					</view>
					<view class="img" v-if="idea.ideaImg.length==1">
						<image @click="previewImage(idea.ideaImg)" style="width: 400rpx;border-radius: 10rpx;" :src="imgurl" mode="aspectFill" v-for="imgurl in idea.ideaImg"></image>
					</view>
					<view class="img" v-if="idea.ideaImg.length>2">
						<image @click="previewImage(idea.ideaImg)" style="height: 300rpx;" :src="imgurl" mode="aspectFill" v-if="index<2" v-for="(imgurl,index) in idea.ideaImg"></image>
					</view>
				</view>
			</view>
			<view class="ci-bom" v-if="idea.ideaId">
				<!-- 评论 -->
				<view @click="toComment(idea.ideaId,idea.praise)"><u-icon size="34rpx" name="chat" style="margin-right: 8rpx;"></u-icon>{{idea.ideaReply}}</view>
				<!-- 点赞 -->
				<view><u-icon @click="thumbs(idea._id,index)" :color="idea.praise?'red':'inherit'" name="thumb-up" size="34rpx" style="margin-right: 8rpx;"></u-icon>{{idea.ideaPraise}}</view>
			</view>
		</view>
		<view class="release" @click="release()">
			+
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				ideas:[],
				total:1,
				pagesNum:1,
				praisecolor:"inherit"
			}
		},
		created() {
			this.total=1;
			this.pagesNum=1;
			this.ideas=[]
			this.getShareIdea()
		},
		onShow() {
			console.log(123214)
			// this.total=1;
			// this.pagesNum=1;
			// this.ideas=[]
			// this.getShareIdea()
		},
		onLoad() {
			uni.$on("updata",()=>{
				this.total=1;
				this.pagesNum=1;
				this.ideas=[]
				this.getShareIdea()
			})
		},
		onUnload() {  
		    // 移除监听事件  
		    uni.$off('updata');  
		 },
		// 下拉到底
		onReachBottom() {
			this.getShareIdea()
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.total=1;
			this.pagesNum=1;
			this.ideas=[]
			this.getShareIdea()
			
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
					            console.log('用户点击取消');
					        }
					    }
					});
					return
				}
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
			// 图片预览
			previewImage(url){
				console.log(url)
				uni.previewImage({
				   urls: url
				});
			},
			// 获取评论
			async getShareIdea(){
				const db = uniCloud.database();//代码块为cdb
				let userInfo=uni.getStorageSync("userInfo")
				if(this.total>(this.pagesNum-1)*10){
					uni.showLoading({
					    title: '加载中'
					});
					uniCloud.callFunction({
						name:"getshareIdea",
						data:{
							skip:10*(this.pagesNum-1),
							accountId:userInfo.accountId?userInfo.accountId:""
						}
					}).then(res=>{
						console.log(res.result)
						this.ideas=this.ideas.concat(res.result.comments);
						this.total=res.result.total
						this.pagesNum=this.pagesNum+1;
						uni.hideLoading()
						uni.stopPullDownRefresh()
					}).catch((err)=>{
							console.log(err)
							uni.hideLoading()
							uni.stopPullDownRefresh()
					  })
				}
				
			},
			// 社区评论详情
			toComment(id,praise,collect){
				uni.navigateTo({
					url:"/pages/community/detail/detail?id="+id+"&praise="+praise+"&collect="+collect
				})
			},
			// 去发布社区评论
			release(){
				uni.navigateTo({
					url:"/pages/community/idea/idea"
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
	.community{
		.community-item{
			width: 92%;
			margin:0 auto;
			border-radius: 30rpx;
			margin-top: 30rpx;
			padding: 20rpx 30rpx;
			background:#FFFFFF;
			.ci-top{
				display: flex;
				.head{
					margin-right: 15rpx;
					image{
						width: 70rpx;
						height: 70rpx;
						border-radius: 70rpx;
					}
				}
				.detail{
					display: flex;
					flex-direction: column;
					.name{
						
					}
					.title{
						
					}
				}
			}
			.ci-center{
				margin-top: 10rpx;
				text{
					
				}
				.imgbox{
					margin-top: 15rpx;
					border-radius: 10rpx;
					overflow: hidden;
					.img{
						display: flex;
						image{
							margin-right: 10rpx;
						}
						image:last-child{
							margin-right: 0rpx;
						}
					}
					
				}
			}
			.ci-bom{
				margin-top: 15rpx;
				display: flex;
				view{
					flex:1;
				}
				view:nth-child(2){
					text-align: right;
				}
			}
		}
	}
	.release{
		width: 100rpx;
		height: 100rpx;
		line-height: 100rpx;
		border-radius: 100rpx;
		text-align: center;
		background: #710000;
		position: fixed;
		bottom: 100rpx;
		right:30rpx;
		font-size: 60rpx;
		color:#FFFFFF;
	}
</style>
