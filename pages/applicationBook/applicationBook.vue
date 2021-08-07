<template>
	<!-- 申请创作 -->
	<view class="application" v-if="loading==true">
		<text v-if="form.status==-1" style="color: red;margin-left: 30rpx;">申请失败!!!</text>
		<u-form :model="form" ref="uForm" class="form">
				<u-form-item label-width="140" label="书名:"><u-input :disabled="this.form.status!=undefined&&this.form.status!=-1" placeholder="请输入书名" v-model="form.bookName" /></u-form-item>
				<u-form-item label-width="140" label="类型:">
					<text class="imgtext" @click="selectType">{{bookType}}</text>
					<u-select v-model="show" @confirm="confirm" :list="list"></u-select>
				</u-form-item>
				<u-form-item label-width="140" label="作品图片:">
					<image class="img" v-show="imgUrl!=''" :src="imgUrl" mode=""></image>
					<text class="imgtext" @click="changeHeadPortrait">{{imgText}}</text>
				</u-form-item>
				<u-form-item label-width="140" label="简介:">
					<u-input maxlength="1000" :disabled="this.form.status!=undefined&&this.form.status!=-1" laceholder="请输入图书简介" border type="textarea" v-model="form.introduction" />
				</u-form-item>
				<u-button v-show="this.form.status==undefined" style="margin-top: 100rpx;" @click="submit" type="success">确认新书</u-button>
				<u-button v-show="this.form.status==1" disabled style="margin-top: 100rpx;" type="success">审核通过</u-button>
				<u-button v-show="this.form.status==-1" style="margin-top: 100rpx;" @click="submit" type="success">重新申请</u-button>
				<u-button v-show="this.form.status==0" disabled style="margin-top: 100rpx;" type="success">审核中</u-button>
				<u-button v-show="this.form.status==1" style="margin-top: 100rpx;" @click="newbook" type="error">另开新书</u-button>
			</u-form>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				form:{},
				statusText:"提交申请",
				loading:false,
				imgUrl:"",
				imgText:"上传图片",
				show:false,
				bookType:"请选择作品类型",
				list: [
					{value: '1',label: '末世危机'},
					{value: '2',label: '玄幻小说'},
					{value: '3',label: '悬疑/推理小说'},
					{value: '4',label: '科幻小说'},
					{value: '5',label: '都市小说'},
				],
			}
		},
		onShow() {
			let db=uniCloud.database()
			let userInfo=uni.getStorageSync('userInfo')
			db.collection('applicationBook').where({
				accountId:userInfo.accountId
			}).orderBy('bookid','desc').get().then(res=>{
				this.loading=true
				if(res.result.data.length!=0){
					this.form=res.result.data[0]
					this.bookType=this.form.type
					this.imgUrl=this.form.img
				}
			})
		},
		methods:{
			confirm(e){
				console.log(e)
				this.bookType=e[0].label
			},
			submit(){
				if(this.form.bookName==''||this.form.bookName==undefined){
					this.toast("未输入图书名")
					return 
				}
				if(this.form.introduction==''||this.form.introduction==undefined){
					this.toast("未输入简介内容")
					return 
				}
				if(this.bookType=='请选择作品类型'||this.bookType==undefined){
					this.toast("未选择作品类型")
					return 
				}
				if(this.imgUrl==''||this.imgUrl==undefined){
					this.toast("未上传作品图片")
					return 
				}
				this.form.type=this.bookType
				this.form.img=this.imgUrl
				console.log(this.form)
				let userInfo=uni.getStorageSync('userInfo')
				let coding=this.form.status==-1?"updata":"add"
				uniCloud.callFunction({
					name:'applicationBook',
					data:{
						accountId:userInfo.accountId,
						coding:coding,
						_id:this.form._id,
						bookName:this.form.bookName,
						introduction:this.form.introduction,
						type:this.form.type,
						img:this.form.img
					}
				}).then(res=>{
					console.log(res)
					this.$set(this.form,'status',0)
				})
			},
			newbook(){
				this.form={}
				this.imgUrl=""
				this.imgText="上传图片",
				this.bookType="请选择作品类型"
			},
			selectType(){
				if(this.form.status==0||this.form.status==1){
					return
				}
				this.show=true
			},
			changeHeadPortrait(){
				let self=this
				if(this.form.status==0||this.form.status==1){
					return
				}
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    success: function (res) {
				        console.log(JSON.stringify(res.tempFilePaths));
								self.uploadImg(res.tempFilePaths)
				    }
				});
				
			},
			// 上传图片到云存储
			async uploadImg(lists){
				let num=Math.floor(Math.random() * 100)
				let filename=new Date().getTime()+''+num
				const result = await uniCloud.uploadFile({
							filePath: lists[0],
							cloudPath: 'book/text'+filename+".jpg",
				 }).then(res=>{
					 let arr=[]
					 console.log(res)
					 arr.push(res.fileID)
					 uniCloud.getTempFileURL({
					     fileList: arr
					 }).then(res1=>{
						 console.log(res1)
						 this.imgUrl=res1.fileList[0].tempFileURL
						 this.imgText="更改图片"
						 // console.log(res1.fileList[0].tempFileURL)
					 })
				 }).catch(err=>{
					 console.log(err)
				 });
			}
		}
	}
</script>

<style scoped lang="less">
	.application{
		.form{
			padding:0 30rpx;
		}
	}
	.img{
		width: 120rpx;
		height: 160rpx;
		margin-right: 20rpx;
	}
	.imgtext{
		color:#2B85E4;
	}
</style>
