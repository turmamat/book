<template>
	<view class="userinfo">
		<view class="img">
			<image :src="headPortrait" mode=""></image>
			<view class="headPortrait" @click="changeHeadPortrait">
				点击更换头像
			</view>
		</view>
		<view class="info">
			<view class="">
				<text class="left">账号</text>
				<text class="center">{{account}}</text>
				<text class="right">
					<u-icon  class="icon" name="edit-pen" @click="edit('account')"></u-icon>
				</text>
			</view>
			<view class="">
				<text class="left">性别</text>
				<text class="center">{{sex}}</text>
				<text class="right">
					<u-icon  class="icon" name="edit-pen" @click="edit('sex')"></u-icon>
				</text>
			</view>
			<view class="">
				<text class="left">昵称</text>
				<text class="center">{{userName}}</text>
				<text class="right" >
					<u-icon name="edit-pen" @click="edit('userName')"></u-icon>
				</text>
			</view>
			<view class="">
				<text class="left">个性签名</text>
				<text class="center">{{signature}}</text>
				<text class="right">
					<u-icon  name="edit-pen" @click="edit('signature')"></u-icon>
				</text>
			</view>
		</view>
		<u-popup width="70%" v-model="show" mode="center" border-radius="10" class="pop">
			<view class="title">
				{{msg}}
			</view>
			<view class="main sex" v-if="msg=='更改性别'">
				<u-radio-group v-model="sex1" >
					<u-radio @change="radioChange" v-for="(item, index) in list" :key="index" 
							icon-size="0"
							:name="item.name">
							{{item.name}}
					</u-radio>
				</u-radio-group>
			</view>
			<view class="main username" v-if="msg=='更改昵称'">
				<u-input v-model="userName1" type="type" border placeholder="请输入昵称" maxlength="12" />
				<view style="margin-top: 15rpx;font-size: 18rpx;">限3-12字符昵称</view>
			</view>
			<view class="main username" v-if="msg=='更改个性签名'">
				<u-input v-model="signature1" type="textarea" border />
			</view>
			<view class="btn">
				<u-button @click="show=false">取消</u-button>
				<u-button @click="save()" type="primary">保存</u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				account:"",
				userName:"",
				headPortrait:"",
				headPortraitChange:"",
				signature:"",
				signature1:'',
				sex:"",
				sex1:"",
				userName1:"",
				show:false,
				msg:"",
				list: [{name: '男'},{name: '女'}],
			}
		},
		onLoad(option) {
			this.init()
			
		},
		created() {
			
		},
		methods:{
			init(){
				let userInfo=uni.getStorageSync("userInfo")
				console.log(userInfo)
				this.account=userInfo.account
				this.userName=userInfo.userName
				this.headPortrait=userInfo.headPortrait
				this.signature=userInfo.signature
				this.sex=userInfo.sex
				this.userName1=userInfo.userName
				this.signature1=userInfo.signature
				this.sex1=userInfo.sex
			},
			changeHeadPortrait(){
				let self=this
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    success: function (res) {
				        console.log(JSON.stringify(res.tempFilePaths));
								self.uploadImg(res.tempFilePaths)
								
				    }
				});
				
			},
			changeInfo(){
				uniCloud.callFunction({
					name:"changeUserInfo",
					data:{
						account:this.account,
						headPortrait:this.headPortraitChange
					}
				}).then(res=>{
					if(res.result.updated==1){
						this.toast("修改成功");
						let userInfo=uni.getStorageSync("userInfo")
						userInfo.headPortrait=this.headPortraitChange
						uni.setStorageSync("userInfo",userInfo)
						this.init()
					}
				})
			},
			// 上传图片到云存储
			async uploadImg(lists){
				let num=Math.floor(Math.random() * 100)
				let filename=new Date().getTime()+''+num
				const result = await uniCloud.uploadFile({
							filePath: lists[0],
							cloudPath: 'userImg/'+filename+".jpg",
				 }).then(res=>{
					 let arr=[]
					 console.log(res)
					 arr.push(res.fileID)
					 uniCloud.getTempFileURL({
					     fileList: arr
					 }).then(res1=>{
						 console.log(res1)
						 this.headPortraitChange=res1.fileList[0].tempFileURL
						 console.log(res1.fileList[0].tempFileURL)
						 this.changeInfo()
					 })
				 }).catch(err=>{
					 console.log(err)
				 });
			},
			radioChange(name){
				console.log(name)
			},
			save(){
				uniCloud.callFunction({
					name:"changeUserInfo",
					data:{
						account:this.account,
						sex:this.sex1,
						signature:this.signature1,
						userName:this.userName1
					}
				}).then(res=>{
					if(res.result.updated==1){
						this.show=false;
						this.toast("修改成功");
						let userInfo=uni.getStorageSync("userInfo")
						userInfo.sex=this.sex1;
						userInfo.signature=this.signature1;
						userInfo.userName=this.userName1
						uni.setStorageSync("userInfo",userInfo)
						this.init()
					}
				})
			},
			edit(type){
				if(type=="account"){
					this.toast("账号不可编辑")
				}else if(type=="sex"){
					this.show=true
					this.msg="更改性别"
				}
				else if(type=="userName"){
					this.show=true
					this.msg="更改昵称"
					
				}
				else if(type=="signature"){
					this.show=true
					this.msg="更改个性签名"
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.userinfo{
		background: #FFFFFF;
		.img{
			text-align: center;
			padding: 50rpx 0;
			image{
				width:200rpx;
				height: 200rpx;
				border-radius: 100rpx;
			}
		}
		.info{
			padding:0 30rpx;
			view{
				width: 100%;
				height: 100rpx;
				line-height: 100rpx;
				// border-top: 1rpx solid #C0C0C0;
				display: flex;
				.left{
					flex: 2;
				}
				.center{
					flex:5;
					text-align: left;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				.right{
					
				}
				
			}
			
		}
		.pop{
			
			.title{
				margin-top: 30rpx;
				text-align: center;
				// font-weight: bold;
				font-size: 38rpx;
			}
			.main{
				padding: 30rpx;
				margin: 0 auto;
				text-align: center;
				text-align: left;
			}
			.btn{
				display: flex;
				padding-bottom: 50rpx;
				padding-top:20rpx;
			}
		}
	}
</style>
