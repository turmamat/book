<template>
	<!-- 申请创作 -->
	<view class="application" v-if="loading==true">
		<view class="nonull" v-if="records.length!=0">
			<view v-for="record in records" class="record">
				<view class="left">
					<image :src="record.img" mode=""></image>
				</view>
				<view class="right">
					<view class="baseinfo">
						<text class="name">{{record.bookName}}</text>
						<text class="type">{{record.type}}</text>
					</view>
					<view>{{record.introduction}}</view>
					<view class="time">{{record.createTime}}</view>
				</view>
			</view>
		</view>
		<view class="null" v-if="records.length==0">
			<u-empty style="margin-top: 300rpx;"  text="您还没有任何作品" mode="search"></u-empty>
			<u-button type="success" style="width: 200rpx;" @click="toApplication">去申请图书</u-button>
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
			let userInfo=uni.getStorageSync('userInfo')
			db.collection('applicationBook').where({
				accountId:userInfo.accountId,
				status:1
			}).get().then(res=>{
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
			toApplication(){
				uni.navigateTo({
					url:"/pages/applicationBook/applicationBook"
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
				.time{
					display: flex;
					justify-content: flex-end;
				}
			}
		}
	}
</style>
