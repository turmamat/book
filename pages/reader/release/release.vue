<template>
	<view class="release">
		<u-input placeholder="评论标题(可选)" class="title" v-model="title" />
		<u-input type="textarea" placeholder="尽情发挥你的想象" v-model="content" class="content"></u-input>
		<view class="score">
			<text >评分:</text>
			<u-rate  style="padding: 20rpx 0;" size="54" v-model="score"></u-rate>
		</view>

	</view>
</template>

<script>
	export default{
		data(){
			return{
				title:"",
				content:"",
				score:"",
				bookId:''
			}
		},
		onLoad(option) {
			this.bookId=option.bookid
		},
		methods:{
			vrification(){
				let userInfo=uni.getStorageSync("userInfo")
				if(this.content==''){
					this.toast("没有输入评论内容")
					return false
				}
				if(this.score==''){
					this.toast("请先评分再发布")
					return false
				}
				if(!userInfo){
					uni.showModal({
					    title: '提示',
					    content: '您还没有登录,无法发布评论',
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
					return false
				}
				return true
			}
		},
		onNavigationBarButtonTap(obj){
			if(obj.text=="发布"){
				if(!this.vrification()){return}
				let userInfo=uni.getStorageSync("userInfo")
				uniCloud.callFunction({
					name:"releaseComment",
					data:{
						account:userInfo.account,
						headPortrait:userInfo.headPortrait,
						accountId:userInfo.accountId,
						comentBy:userInfo.userName,
						comentTitle:this.title,
						commentContent:this.content,
						score:this.score,
						bookId:this.bookId
					}
				}).then(res=>{
					console.log(res)
					uni.redirectTo({
						url:"/pages/reader/allcomment/allcomment?id="+this.bookId
					})
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.release{
		padding:0rpx 30rpx;
		.title{
			border-bottom: 1rpx solid #f5f5f5;
			
		}
		.score{
			text{
				font-size: 36rpx;
				margin-right: 10rpx;
			}
		}
		.content{
			margin-top: 15rpx;
		}
	}
</style>
