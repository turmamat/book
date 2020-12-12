<template>
	<form @submit="login" @reset="">
		<u-input v-model="userName" />
		<u-input v-model="password" type="password" />
		<button form-type="submit">用户登录</button>
	</form>
</template>

<script>
	export default{
		data(){
			return{
				userName:"",
				password:""
			}
		},
		methods:{
			login(){
				uniCloud.callFunction({
					name:"userLogin",
					data:{
						userName:this.userName,
						password:this.password
					}
				}).then(res=>{
					if(res.result.code==200){
						console.log(123)
						uni.switchTab({
							url:"../index/index"
						})
					}else{
						
					}
				})
			}
		}
	}
</script>

<style>
</style>
