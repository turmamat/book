<template>
	<!-- 管理员审核书籍 -->
	<view class="application" v-if="loading==true">
		<view class="nonull" v-if="records.length!=0">
			<view v-for="record in records" class="record" @click="toDetail(record._id)">
				<view class="left">
					<image :src="record.img" mode=""></image>
				</view>
				<view class="right">
					<view class="baseinfo">
						<text class="name">{{record.bookName}}({{record.author}})</text>
						<text class="type">
						{{record.status==0?"未审核":(record.status==1?"已审核":"已驳回")}}
						</text>
					</view>
					<view class="introduction">{{record.introduction}}</view>
					<view class="time">{{record.createTime}}</view>
				</view>
			</view>
		</view>
		<view class="null" v-if="records.length==0">
			<u-empty style="margin-top: 300rpx;"  text="还未有作家上传新作品" mode="search"></u-empty>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				loading:false,
				records:[]
			}
		},
		onShow() {
			let db=uniCloud.database()
			db.collection('applicationBook').get().then(res=>{
				this.loading=true
				if(res.result.data.length==0){
					this.records=[]
				}else{
					this.records=res.result.data
				}
				console.log(res)
			})
		},
		methods:{
			toDetail(id){
				console.log(id)
				uni.navigateTo({
					url:"/pages/bookCheck/detail/detail?id="+id
				})
			},
		}
	}
</script>

<style scoped lang="less">
	.application{
		.form{
			padding:0 30rpx;
		}
	}
	.nonull{
		.record{
			width: 690rpx;
			border-radius: 10rpx;
			margin-left: 30rpx;
			padding: 20rpx;
			background-color: #FFFFFF;
			display: flex;
			margin-bottom: 20rpx;
			.left{
				image{
					width: 120rpx;
					height: 180rpx;
				}
			}
			.right{
				flex: 1;
				margin-left: 30rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.baseinfo{
					display: flex;
					justify-content: space-between;
				}
				.introduction{
					overflow:hidden;
					text-overflow:ellipsis;
					display:-webkit-box; 
					-webkit-box-orient:vertical;
					-webkit-line-clamp:3;
					margin:10rpx 0;
				}
				.time{
					display: flex;
					justify-content: flex-end;
				}
			}
		}
	}
</style>
