<template>
	<!-- 申请创作 -->
	<view class="application" v-if="loading==true">
		<text v-if="form.status==-1" style="color: red;margin-left: 30rpx;">申请失败!!!</text>
		<u-form :model="form" ref="uForm" class="form">
				<u-form-item label-width="140" label="姓名:"><u-input :disabled="statusCode" placeholder="请输入姓名" v-model="form.name" /></u-form-item>
				<u-form-item label-width="140" label="笔名:"><u-input :disabled="statusCode" placeholder="请输入笔名" v-model="form.biming" /></u-form-item>
				<u-form-item label-width="140" label="联系方式:"><u-input :disabled="statusCode" placeholder="请输入联系方式" v-model="form.phone" /></u-form-item>
				<u-form-item label-width="140" label="类型:">
					<u-radio-group v-model="type" v-show="statusCode==false">
						<u-radio  v-for="(item, index) in list" :key="index" 
								icon-size="0"
								:name="item.name">
								{{item.name}}
						</u-radio>
					</u-radio-group>
					<u-input v-show="statusCode==true" disabled  v-model="form.type" />
				</u-form-item>
				<u-form-item label-width="140" label="简介:">
					<u-input laceholder="请输入个人简介(100字以内)" :disabled="statusCode"  maxlength="100" border type="textarea" v-model="form.info" />
				</u-form-item>
				<u-button :disabled="statusCode" style="margin-top: 100rpx;" @click="confirm" type="success">{{status}}</u-button>
				
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
				status:"立即申请",
				statusCode:false,
				loading:false
			}
		},
		onShow() {
			let db=uniCloud.database()
			let userInfo=uni.getStorageSync('userInfo')
			db.collection('application').where({
				accountId:userInfo.accountId
			}).get().then(res=>{
				console.log(res.result)
				this.loading=true
				if(res.result.data.length!=0){
					this.form=res.result.data[0]
					this.status="申请中"
					this.statusCode=true
					if(res.result.data[0].status==1){
						this.status="申请成功"
					}
					if(res.result.data[0].status==-1){
						this.status="重新申请"
						this.statusCode=false
					}
				}
			})
		},
		methods:{
			confirm(){
				if(this.form.name==''||this.form.name==undefined){
					this.toast("未输入姓名")
					return 
				}
				if(this.form.biming==''||this.form.biming==undefined){
					this.toast("未输入笔名")
					return 
				}
				if(this.form.phone==''||this.form.phone==undefined){
					this.toast("未输入联系方式")
					return 
				}
				if (this.form.phone.length != 11) {
					this.toast("手机号码格式不正确")
				  return;
				}
				if(this.form.info==''||this.form.info==undefined){
					this.toast("未输入简介内容")
					return 
				}
				this.form.type=this.type
				console.log(this.form)
				let userInfo=uni.getStorageSync('userInfo')
				uniCloud.callFunction({
					name:'application',
					data:{
						accountId:userInfo.accountId,
						phone:this.form.phone,
						name:this.form.name,
						type:this.form.type,
						biming:this.form.biming,
						info:this.form.info
					}
				}).then(res=>{
					console.log(res)
					this.status="申请中",
					this.statusCode=true
					this.form.status=0
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
</style>
