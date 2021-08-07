<template>
	<!-- 书籍审核详情 -->
	<view class="application" v-if="loading==true">
		<u-form :model="form" ref="uForm" class="form">
				<u-form-item label-width="140" label="书名:"><u-input disabled v-model="form.bookName" /></u-form-item>
				<u-form-item label-width="140" label="类型:">
					<text>{{bookType}}</text>
				</u-form-item>
				<u-form-item label-width="140" label="作品图片:">
					<image class="img" v-show="imgUrl!=''" :src="imgUrl" mode=""></image>
				</u-form-item>
				<u-form-item label-width="140" label="简介:">
					<u-input disabled border type="textarea" v-model="form.introduction" />
				</u-form-item>
				<view class="btn" v-show="form.status==0">
					<u-button  @click="success()" type="success">审核通过</u-button>
					<u-button  @click="fail()" type="error">驳回申请</u-button>
				</view>
				<u-button style="margin-top: 100rpx;" disabled="" v-show="form.status==1"  type="success">已审核</u-button>
				<u-button style="margin-top: 100rpx;" disabled="" v-show="form.status==-1"  type="error">已驳回</u-button>
			</u-form>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				form:{},
				_id:"",
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
		onLoad(option) {
			let db=uniCloud.database()
			let userInfo=uni.getStorageSync('userInfo')
			this._id=option.id
			db.collection('applicationBook').where({
				_id:option.id
			}).get().then(res=>{
				this.loading=true
				console.log(res)
				this.form=res.result.data[0]
				this.bookType=this.form.type
				this.imgUrl=this.form.img
				if(this.form.status==1){
					this.statusText="审核通过"
				}
				if(this.form.status==-1){
					this.statusText="已驳回"
				}
				if(this.form.status==0){
					this.statusText="确认审核"
				}
			})
		},
		methods:{
			success(){
				// "bookName":event.bookName,
				// "author":event.author,
				// "img":event.img,
				// "introduction":event.introduction,
				// "type":event.type
				let userInfo=uni.getStorageSync('userInfo')
				console.log(this.form)
				uniCloud.callFunction({
					name:"applicationBook",
					data:{
						accountId:userInfo.accountId,
						coding:"changeStatus",
						status:1,
						_id:this._id,
						bookName:this.form.bookName,
						author:this.form.author,
						img:this.form.img,
						introduction:this.form.introduction,
						type:this.form.type
					}
				}).then(res=>{
					console.log(res)
					this.$set(this.form,'status',1)
				})
			},
			fail(){
				let userInfo=uni.getStorageSync('userInfo')
				uniCloud.callFunction({
					name:"applicationBook",
					data:{
						accountId:userInfo.accountId,
						coding:"changeStatus",
						status:-1,
						_id:this._id
					}
				}).then(res=>{
					console.log(res)
					this.$set(this.form,'status',-1)
					console.log(this.form.status)
					this.$forceUpdate()
				})
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
	.btn{
		display: flex;
		margin-top: 100rpx;
	}
</style>
