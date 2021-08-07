<template>
	<!-- 申请创作 -->
	<view class="application" v-if="this.form.name">
		<u-form :model="form" ref="uForm" class="form">
				<u-form-item label-width="140" label="姓名:"><u-input disabled placeholder="请输入姓名" v-model="form.name" /></u-form-item>
				<u-form-item label-width="140" label="笔名:"><u-input disabled placeholder="请输入笔名" v-model="form.biming" /></u-form-item>
				<u-form-item label-width="140" label="联系方式:"><u-input disabled placeholder="请输入联系方式" v-model="form.phone" /></u-form-item>
				<u-form-item label-width="140" label="类型:">
					<!-- <u-radio-group v-model="type" v-show="statusCode==false">
						<u-radio  v-for="(item, index) in list" :key="index" 
								icon-size="0"
								:name="item.name">
								{{item.name}}
						</u-radio>
					</u-radio-group> -->
					<u-input disabled  v-model="form.type" />
				</u-form-item>
				<u-form-item label-width="140" label="简介:">
					<u-input laceholder="请输入个人简介(100字以内)" disabled maxlength="100" border type="textarea" v-model="form.info" />
				</u-form-item>
				<view class="btn" v-if="changeStatus==false">
					<u-button  @click="seccess" type="success">审核通过</u-button>
					<u-button  @click="fail" type="error">驳回申请</u-button>
				</view>
				<u-button v-if="changeStatus==true" style="margin-top: 100rpx;"  :type="statusText=='审核通过'?'success':'error'">{{statusText}}</u-button>
			</u-form>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				form:{},
				list: [{name: '职业作家'},{name: '兼职写作'}],
				type:"职业作家",
				id:"",
				changeStatus:false,
				statusText:"审核通过",
				accountId:""
			}
		},
		onLoad(option) {
			let db=uniCloud.database()
			this.id=option.id
			db.collection('application').doc(option.id).get().then(res=>{
				this.form=res.result.data[0],
				this.accountId=this.form.accountId
				if(this.form.status==1){
					this.changeStatus=true
					this.statusText="审核通过"
				}
				if(this.form.status==-1){
					this.changeStatus=true
					this.statusText="已驳回"
				}
			})
		},
		methods:{
			seccess(){
				uniCloud.callFunction({
					name:"updataApplication",
					data:{
						id:this.id,
						type:1,
						accountId:this.accountId
					}
				}).then(res=>{
					this.changeStatus=true
					this.statusText="审核通过"
					this.toast('已审核通过')
				})
			},
			fail(){
				uniCloud.callFunction({
					name:"updataApplication",
					data:{
						id:this.id,
						type:-1
					}
				}).then(res=>{
					this.changeStatus=true
					this.statusText="已驳回"
					this.toast('已驳回')
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
	.btn{
		display: flex;
		margin-top: 100rpx;
	}
</style>
