<template>
	<view class="authorCheck">
		<view v-for="record in records" class="records" @click="toDetail(record._id)">
			<view class="top">
				<view class="name">{{record.name}}</view>
				<view style="color: red;">{{record.type}}</view>
			</view>
			<view class="center">{{record.info}}</view>
			<view class="bom">{{record.time}}</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				records:[]
			}
		},
		created() {
			let db=uniCloud.database()
			db.collection('application').get().then(res=>{
				this.records=res.result.data
			})
		},
		methods:{
			toDetail(id){
				console.log(id)
				uni.navigateTo({
					url:"/pages/authorCheck/detail/detail?id="+id
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.authorCheck{
		width: 690rpx;
		margin-left: 30rpx;
	}
	.records{
		background-color: #FFFFFF;
		border-radius: 20rpx;
		margin-bottom: 20rpx;
		padding: 20rpx;
		.top{
			display: flex;
			justify-content: space-between;
			.name{
				font-weight: 500;
				font-size: 32rpx;
			}
		}
		.center{
			margin-top: 20rpx;
		}
		.bom{
			display: flex;
			justify-content: flex-end;
		}
	}
</style>
