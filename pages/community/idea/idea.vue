<template>
	<view class="release">
		<view class="bookAuthor">
			书籍/作者：
			<u-tag class="tags" :type="tabType[index]" mode="dark" v-for="(t,index) in this.tabs" :text="t" closeable  @close="tagClick(index)" />
			<u-button v-if="tabs.length<=3" class="tags" type="primary" size="mini" @click="openModel">添加标签</u-button>	
		</view>
		<u-input placeholder="标题(可选)" class="title" v-model="title" />
		
		<u-input type="textarea" placeholder="尽情分享你的心得" v-model="content" class="content"></u-input>
		<!-- <view class="score">
			<text >评分:</text>
			<u-rate  style="padding: 20rpx 0;" size="44" v-model="score"></u-rate>
		</view> -->
		<u-upload max-count="3" ref="uUpload" upload-text="" @on-choose-complete="uploadImg" :auto-upload="false" @on-remove="removeImg"></u-upload>
		<u-modal @confirm="addTab" class="model" title="添加标签名" v-model="show" :show-cancel-button="true">
				<u-form style="padding:30rpx">
					<u-form-item label="标签名:" label-width="120rpx">
						<u-input class="tab" v-model="tab" maxlength="8" border placeholder="标签可以是书籍名或作者" />
					</u-form-item>
				</u-form>
		</u-modal>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				title:"",
				content:"",
				fileList: [],
				cloudIds:[],
				score:"",
				show:false,
				tab:"",
				tabs:[],
				tabType:["success","warning","error","info","primary"]
			}
		},
		methods:{
			tagClick(index){
				this.tabs.splice(index,1)
			},
			openModel(){
				this.show=true
			},
			addTab(){
				if(this.tab==""){
					this.toast("请添加标签名")
					this.show=true
					return
				}
				this.tabs.push(this.tab)
				this.tab=""
				this.show=false
			},
			// 上传图片到云存储
			async uploadImg(lists, name){
				console.log(lists)
				this.fileList=[]
				this.cloudIds=[]
				for(let i=0;i<lists.length;i++){
					let num=Math.floor(Math.random() * 100)
					let filename=new Date().getTime()+''+num
					const result = await uniCloud.uploadFile({
								filePath: lists[i].url,
								cloudPath: 'upload/'+filename+".jpg",
					 }).then(res=>{
						 let arr=[];
						 arr.push(res.fileID)
						 this.cloudIds.push(res.fileID)
						 uniCloud.getTempFileURL({
						     fileList: arr
						 }).then(res1=>{
							 console.log(res1.fileList[0].tempFileURL)
							 this.fileList.push(res1.fileList[0].tempFileURL)
							 console.log(this.fileList)
						 })
					 }).catch(err=>{
						 console.log(err)
					 });
				}
			},
			async getUrl(){
				let result = await uniCloud.getTempFileURL({
				    fileList: this.fileList
				});
				console.log(result.fileList[0].tempFileURL)
			},
			removeImg(index, lists, name){
				console.log(index, lists, name)
				let ids=[]
				ids.push(this.cloudIds[index])
				uniCloud.callFunction({
					name:"removeImage",
					data:{
						ids:ids
					}
				}).then(res=>{
					this.fileList.splice(index,1)
					this.cloudIds.splice(index,1)
					console.log(this.fileList)
				}).catch(err=>{
					console.log(err,"123")
				})
			},
			vrification(){
				let userInfo=uni.getStorageSync("userInfo")
				if(this.content==''){
					this.toast("没有输入评论内容")
					return false
				}
				if(this.title.length!=0&&this.title.length<6){
					this.toast("标题文字至少为六位")
					return false
				}
				if(this.tabs.length===0){
					this.toast("请至少添加一个标签")
					return false
				}
				if(!userInfo){
					uni.showModal({
					    title: '提示',
					    content: '您还没有登录,无法发布心得',
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
				console.log(`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`)
				let userInfo=uni.getStorageSync("userInfo")
				console.log(this.fileList)
				uniCloud.callFunction({
					name:"releaseIdea",
					data:{
						account:userInfo.account,
						headPortrait:userInfo.headPortrait,
						accountId:userInfo.accountId,
						ideaBy:userInfo.userName,
						ideaTitle:this.title,
						ideaContent:this.content,
						tabs:this.tabs,
						ideaImg:this.fileList
					}
				}).then(res=>{
					uni.switchTab({
						url:"/pages/community/community",
						success() {
							uni.$emit('updata')
						}
					})
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.release{
		padding:0rpx 30rpx;
		.bookAuthor{
			.tags{
				margin-right: 20rpx;
				margin-bottom: 20rpx;
			}
		}
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
	.model{
		padding: 0 20rpx;
		.tab{
			width: 200rpx;
		}
	}
</style>
