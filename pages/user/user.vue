<template>
	<view class="user">
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<view class="exit">
			<image src="../../static/icon/tuichu.png" mode="" @click="exit()"></image>
		</view>
		<!-- 登录状态 -->
		<view class="loginCondition">
			<view class="personInfo">
				<view class="userImg">
					<!-- <uni-icons type=""></uni-icons> -->
					<u-image width="100rpx" height="100rpx" class="img" :src="headPortrait" shape="circle"></u-image>
				</view>
				<view class="userInfo">
					<view class="name">{{name}}</view>
					<view v-if="!this.userInfo.userName" class="unnlogin">
						未登录，是否去<text @click="toLogin()">登陆</text>
					</view>
					<view class="me">{{signature}}</view>
				</view>
				
			</view>
			<view v-show="this.userInfo.userName" class="edit" @click="toEdit()">编辑资料</view>
		</view>
		<!-- 基本的读者板块 -->
		<view class="reader">
			<view class="reader-top">
				<!-- <view class="reader-item">
					<image src="../../static/icon/qiandao.png" mode=""></image>
					<text>签到</text>
				</view> -->
				<view class="reader-item" @click="jumpPage('/pages/readerRecord/readerRecord')">
					<image src="../../static/icon/yue.png" mode=""></image>
					<text>在读</text>
				</view>
				<view class="reader-item" @click="jumpPage('/pages/bookshelf/bookshelf')">
					<image src="../../static/icon/shujia.png" mode=""></image>
					<text>书架</text>
				</view>
				<!-- <view class="reader-item">
					<image src="../../static/icon/chongzhi.png" mode=""></image>
					<text>充值</text>
				</view> -->
				<view class="reader-item" @click="jumpPage('/pages/collect/collect')">
					<image src="../../static/icon/shouchang.png" mode=""></image>
					<text>收藏</text>
				</view>
			</view>
			<view class="reader-bom">
				<view class="reader-item" @click="jumpPage('/pages/idea/idea')">
					<image src="../../static/icon/xiangfa.png" mode=""></image>
					<text>想法</text>
				</view>
				<!-- <view class="reader-item">
					<image src="../../static/icon/shouchang.png" mode=""></image>
					<text>收藏</text>
				</view> -->
				<view class="reader-item" @click="jumpPage('/pages/bookshop/bookshop')">
					<image src="../../static/icon/shucheng.png" mode=""></image>
					<text>书城</text>
				</view>
				<view class="reader-item" @click="jumpPage('/pages/application/application')">
					<!-- pages/application/application -->
					<image src="../../static/icon/xssq.png" mode=""></image>
					<text>申请创作</text>
				</view>
			</view>
		</view>
		<!-- 作家板块 -->
		<view class="author" v-if="role=='author'">
			<view class="author-item" @click="jumpPage('/pages/user/mybook/mybook')">
				<image src="../../static/icon/wdcz.png" mode=""></image>
				<text>我的创作</text>
			</view>
			<view class="author-item" @click="jumpPage('/pages/user/uploadChapter/uploadChapter')">
				<image src="../../static/icon/sczj.png" mode=""></image>
				<text>上传章节</text>
			</view>
			
			<view class="author-item" @click="jumpPage('/pages/applicationBook/applicationBook')">
				<image src="../../static/icon/xssq.png" mode=""></image>
				<text>新书申请</text>
			</view>
		</view>
		<!-- 管理员管理板块 -->
		<view class="admin" v-if="role=='admin'">
			<view class="admin-item"  @click="jumpPage('/pages/bookCheck/bookCheck')">
				<image src="../../static/icon/sjsh.png" mode=""></image>
				<text>书籍审核</text>
			</view>
			<view class="admin-item"  @click="jumpPage('/pages/authorCheck/authorCheck')">
				<image src="../../static/icon/zjsp.png" mode=""></image>
				<text>作家审批</text>
			</view>
			<view class="admin-item">
				<image src="../../static/icon/jbxx.png" mode=""></image>
				<text>举报信息</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				name:"",
				signature:"",
				headPortrait:"",
				role:"",
				userInfo:{}
			}
		},
		onShow() {
			let userInfo=uni.getStorageSync("userInfo");
			
			if(userInfo){
				this.userInfo=userInfo
				this.name=userInfo.userName;
				this.headPortrait=userInfo.headPortrait;
				this.signature=userInfo.signature;
				this.role=userInfo.role
			}else{
				this.headPortrait="../../static/unlogin.png"
			}
		},
		methods:{
			jumpPage(url){
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
				uni.navigateTo({
					url:url
				})
			},
			toLogin(){
				this.userInfo={}
				this.name=""
				this.headPortrait="../../static/unlogin.png"
				this.signature=""
				this.role=""
				uni.removeStorageSync("userInfo")
				uni.redirectTo({
					url:"/pages/login/login"
				})
			},
			toEdit(){
				uni.navigateTo({
					url:"/pages/user/userinfo/userinfo"
				})
			},
			exit(){
				if(!uni.getStorageSync("userInfo")){
					this.toast("未登录")
					return
				}
				let self=this
				uni.showModal({
				    title: '提示',
				    content: '是否退出登录状态',
						confirmText:"退出",
				    success: function (res) {
				        if (res.confirm) {
				            self.userInfo={}
				            self.name=""
				            self.headPortrait="../../static/unlogin.png"
				            self.signature=""
				            self.role=""
				            uni.removeStorageSync("userInfo")
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
	.exit{
		display: flex;
		justify-content: flex-end;
		padding: 30rpx;
		image{
			width:35rpx;
			height:35rpx;
		}
	}
	.loginCondition{
		box-shadow: -8rpx 12rpx 7rpx #cccccc;
		background: linear-gradient(to right,#636363, #4d4a49);
		width: 710rpx;
		margin:0 auto;
		padding: 30rpx 0;
		border-radius: 15rpx;
		.edit{
			padding-left: 20rpx;
			font-size: 28rpx;
			color: #F29100;
			margin-top: 10rpx;
		}
		.personInfo{
			display: flex;
			color:#FFFFFF;
			padding: 0rpx 30rpx;
			// justify-content: center;
			align-items: center;
			.userImg{
				padding-right: 30rpx;
				.img{
					
				}
			}
			.userInfo{
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.name{
					padding-bottom: 20rpx;
				}
				.unnlogin{
					font-size: 32rpx;
					letter-spacing: 2rpx;
					text{
						margin-left: 8rpx;
						color:#46fff9;
						text-decoration: underline;
					}
				}
				.me{
					overflow: hidden;
				}
			}
		}
	}
	
	.reader{
		background-color: #FFF;
		box-shadow: -5rpx 5rpx 5rpx #cccccc;
		padding: 30rpx 10rpx;
		width:96%;
		margin:0 auto;
		border-radius: 20rpx;
		margin-top: 40rpx;
		// position: relative;
		// top: -40rpx;
		.reader-top{
			display: flex;
			align-items: center;
			justify-content: center;
			.reader-item{
				flex: 1;
				// background-color: red;
				text-align: center;
				image{
					width: 60rpx;
					height: 60rpx;
				}
				text{
					display: block;
				}
			}
		}
		.reader-bom{
			margin-top:20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			.reader-item{
				flex: 1;
				// background-color: red;
				text-align: center;
				image{
					width: 60rpx;
					height: 50rpx;
				}
				text{
					display: block;
				}
			}
		}
	}
	.author{
		box-shadow: -5rpx 5rpx 5rpx #cccccc;
		background-color: #FFF;
		padding: 30rpx 10rpx;
		width:96%;
		margin:0 auto;
		margin-top: 50rpx;
		border-radius: 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		.author-item{
			flex: 1;
			text-align: center;
			image{
				width: 60rpx;
				height: 60rpx;
			}
			text{
				display: block;
			}
		}
	}
	.admin{
		box-shadow: -5rpx 5rpx 5rpx #cccccc;
		display: flex;
		background-color: #FFF;
		padding: 30rpx 10rpx;
		width:96%;
		margin:0 auto;
		border-radius: 20rpx;
		margin-top: 50rpx;
		.admin-item{
			flex: 1;
			text-align: center;
			image{
				width: 60rpx;
				height: 60rpx;
			}
			text{
				display: block;
			}
		}
	}
</style>
