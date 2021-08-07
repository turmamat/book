<template>
	<!-- 阅读记录 -->
	<view class="readerRecord">
		<view class="records" v-if="requestRecords==true&&records.length!=0">
			<view class="record"  @click="toReader(record.bookid)" v-for="record in records" :key="record.bookid">
				<view class="img">
					<image :src="record.bookImg" mode=""></image>
				</view>
				<view class="right">
					<view class="top">
						<view class="bookName">{{record.bookName}}</view>
						<view class="chapterName">上次阅读：<text>{{record.chapterName}}</text></view>
					</view>
					<view class="bom">
						<view class="time">{{record.time}}</view>
						<view class="btn"><text>继续阅读</text></view>
					</view>
				</view>
			</view>
		</view>
		<view class="null" v-if="requestRecords==true&&records.length==0">
			<u-empty  text="您还未阅读过任何书籍" mode="search"></u-empty>
			<view class="btn" @click="toBookshop">去书城</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				records:[],
				requestRecords:false
			}
		},
		created(){
			this.init()
		},
		onShow() {
			this.records=[]
			this.init()
		},
		methods:{
			init(){
				const db=uniCloud.database()
				this.requestRecords=false
				let userInfo=uni.getStorageSync('userInfo')
				db.collection('readerRecord').orderBy('recordId','desc').where({
					accountId:userInfo.accountId
				}).get().then(res=>{
					let arr=res.result.data?res.result.data:[]
					let nowTime=new Date().getTime()
					arr.forEach(val=>{
						let updateTime=new Date(val.updateTime).getTime()
						let IntervalTime=nowTime-updateTime
						// let minute,hour,day,month;
						let time;
						if(IntervalTime/60000<60){
							time=parseInt(IntervalTime/60000)==0?'刚刚':parseInt(IntervalTime/60000)+"分钟前"
						}else if(60<IntervalTime/60000 && IntervalTime/60000<(60*24)){
							time=parseInt(IntervalTime/(60000*60))+"小时前"
						}else if(60*24<IntervalTime/60000 && IntervalTime/60000<(60*24*30)){
							time=parseInt(IntervalTime/(60000*60*24))+"天前"
						}else if(60*24*30<IntervalTime/60000 && IntervalTime/60000<(60*24*365)){
							time=parseInt(IntervalTime/(60000*60*24*30))+"月前"
						}
						val.time=time
						// console.log(time)
					})
					this.requestRecords=true
					this.records=arr
					console.log(this.records)
					
				})
			},
			// 去书城
			toBookshop(){
				uni.navigateTo({
					url:"/pages/bookshop/bookshop"
				})
			},
			// 跳转到阅读界面继续阅读
			toReader(id){
				uni.navigateTo({
					url:"/pages/reader/reader?bookid="+id
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.record{
		display: flex;
		border-bottom: 1rpx #cccccc solid;
		padding: 15rpx 30rpx;
		.img{
			image{
				width: 155rpx;
				height: 200rpx;
			}
		}
		.right{
			flex:1;
			margin-left: 30rpx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.top{
				.bookName{
					font-size: 35rpx;
					font-weight: 600;
				}
				.chapterName{
					margin-top: 15rpx;
					font-size: 28rpx;
					text{
						text-decoration: underline;
						color:#007bff;
					}
				}
			}
			.bom{
				display: flex;
				.time{
					flex:1;
				}
				.btn{
					flex:1;
					margin-left: auto;
					text-align: right;
					text{
						display: inline-block;
						// width: 120rpx;
						background: #aa5500;
						color:#FFFFFF;
						border-radius:20rpx;
						padding:10rpx 30rpx;
					}
				}
			}
		}
	}
	.null{
		display: flex;
		justify-content: center;
		flex-direction: column;
		margin-top: 300rpx;
		.btn{
			margin: 30rpx auto;
			width: 240rpx;
			padding: 10rpx 0;
			background: #ff557f;
			text-align: center;
			border-radius: 30rpx;
			font-size: 36srpx;
			color:#FFFFFF;
		}
	}
</style>
