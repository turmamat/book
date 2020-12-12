<template>
	<view class="content">
		<button @click="addClound">
			add
		</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				obj:{
					name:"asda",
					tel:"1231wa"
				}
			}
		},
		onLoad() {

		},
		methods: {
			addClound(){
				console.log(JSON.stringify(this.obj))
				uniCloud.callFunction({
					name:"add",
					data:this.obj
				}).then(res=>{
					console.log(res.result)
				})
			}
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
