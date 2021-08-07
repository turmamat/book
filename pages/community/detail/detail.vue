<template>
	<view class="ideaDetail">
		<view class="ideaBy" v-if="requestInfo">
			<!-- 发布人信息 -->
			<view class="userInfo">
				<view class="left">
					<image :src="info.headPortrait" mode=""></image>
				</view>
				<view class="right">
					<view>{{info.ideaBy}}</view>
					<view>{{info.ideaTime}}</view>
				</view>
			</view>
			<view class="body">
				<!-- 标签 -->
				<view class="tabs" style="margin:20rpx 0;">
					<u-tag size="mini" @click="toSearch(tab)" v-for="tab in info.tabs" style="text-align: center;border-radius: 10rpx;" :text="tab" shape="square" />
				</view>
				<!-- 评论标题 -->
				<view  class="">
					{{info.ideaTitle}}
				</view>
				<!-- 评论内容 -->
				<view class="" @click="openInput(0)">
					{{info.ideaContent}}
				</view>
			</view>
			<view  style="text-align: right;">
				<!-- 评论 -->
				<view style="margin-right: 50rpx;display: inline-block;">
					<u-icon size="34rpx" name="chat" style="margin-right: 8rpx;"></u-icon>
					{{info.ideaReply}}
				</view>
				<!-- 点赞 -->
				<view style="display: inline-block;">
					<u-icon @click="thumbs(info._id)" :color="praise==true?'red':'inherit'"
					name="thumb-up" size="34rpx" style="margin-right: 8rpx;">
					</u-icon>{{info.ideaPraise}}
				</view>
			</view>
			
		</view>
		<!-- 发布的图片 -->
		<view class="ideaImg">
			<image @click="previewImage(url)" :src="url" mode="widthFix" v-for="url in info.ideaImg"></image>
		</view>
		<!-- 回复信息 -->
		<view class="reply" v-if="replys!=0">
			<view class="replyitem" v-for="(reply,index) in replys" :key="reply._id">
				<view class="baseinfo">
					<view class="img"><image :src="reply.headPortrait" mode=""></image></view>
					<view class="rigth">
						<view class="createBy">{{reply.userName}}</view>
						<view class="time">{{reply.time}}</view>
					</view>
				</view>
				<view class="content" @click="openInput(1,index)">
					{{reply.content}}
				</view>
				<!-- 查看回复信息 -->
				<view @click="lookReply(index)" class="child" v-if="reply.children&&reply.children.length!=0">
					查看{{reply.children.length}}条回复>>
				</view>
			</view>
		</view>
		<!-- 回复内容框开始 -->
		<u-popup z-index="8" class="popup" v-model="show" :closeable="true" length="80%" mode="bottom" border-radius="14">
			<view class="title">回复信息</view>
			<scroll-view scroll-y="true" style="height: 75%;">
					<view v-if="show" style="margin-bottom: 110rpx;">
						<view class="popupitem"  v-for="(child,childIndex) in replys[index].children">
							<view class="baseinfo">
								<view class="img"><image :src="child.headPortrait" mode=""></image></view>
								<view class="rigth">
									<view class="createBy">{{child.originator}}</view>
									<view class="time">{{child.time}}</view>
								</view>
							</view>
							<view class="content" @click="openInput(1,index,childIndex)">
								{{child.content}}
							</view>
						</view>
					</view>
			</scroll-view>
			
			
		</u-popup>
			<!-- 回复内容框结束 -->
		<view class="bom" v-show="openIssue==false">
			<input @click="openInput(-1,index)" disabled border placeholder="点击发表评论" class="bom-input"></input>
			<view class="">
				<u-icon class="thumb" @click="thumbs(info._id)" :color="praise==true?'red':'inherit'"
				name="thumb-up" size="44rpx" style="margin-right: 8rpx;">
				</u-icon>
				<u-icon class="collect" @click="collect1(info._id)" color="#ffaa00"
				:name="collect==true?'heart-fill':'heart'" size="44rpx" style="margin-right: 8rpx;">
				</u-icon>
			</view>
		</view>
		<view @touchend.prevent="" v-show="openIssue" class="issue">
			<view class="responerInfo">
				回复{{form.responder}}：{{form.responderContent}}
			</view>
			
			<view class="issue-main">
				<textarea  cursor-spacing="100"  v-model="content" @blur="hideIssue" :focus="focus" class="content" placeholder="我来评论" type="textarea"></textarea>
				<view class="btn">
					<view @touchend.prevent="release(type)">发表</view>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				id:"",
				// 是否显示回复内容
				show:false,
				requestInfo:false,
				info:{},
				// 控制回复信息是哪一条的
				index:0,
				content:"",
				replys:[],
				// 判断当前用户是否对该评论点赞
				praise:false,
				// 控制回复弹框的显示和隐藏
				openIssue:false,
				focus:false,
				form:{},
				responder:"",//回复人,
				responderContent:"",//回复内容
				controlOpenIssue:true,
				type:0,
				collect:false
			}
		},
		onShow() {
			// let db=uniCloud.database()
			// db.collection('PatchManage').doc('79550af2600a410a006b1add689a041d').get().then(res=>{
			// 	console.log(res.result.data[0])
			// })
		},
		onLoad(option) {
			// console.log(option.id)
			this.id=option.id
			this.praise=option.praise=='true'?true:false
			this.collect=option.collect=='true'?true:false
			// 获取评论的详细信息
			this.getIdeaDetail(this.id)
			this.getReply()
		},
		methods:{
			// 发布回复信息
			release(type){
				let data={}
				// console.log(this.index)
				if(this.content==''||this.content==undefined){
					this.toast('未输入任何评论信息')
					return
				}
				if(type==0){
					data.type=type
					data.ideaId=this.form.ideaId
					data.content=this.content
					data.userName=this.form.originator
					data.accountId=this.form.originatorId
					data.account=this.form.originator
					data.headPortrait=this.form.headPortrait
					uni.showLoading({})
					uniCloud.callFunction({
						name:"ideaReply",
						data:data
					}).then(res=>{
						this.form={}
						this.content=""
						uni.hideLoading()
						this.hideIssue()
						this.info.ideaReply++
						this.getReply()
					})
				}else{
					data.type=type;
					data.id=this.replys[this.index]._id
					this.form.content=this.content
					let obj=this.form
					data.obj=obj
					uniCloud.callFunction({
						name:"ideaReply",
						data:data
					}).then(res=>{
						this.form={}
						this.content=""
						obj.time=res.result
						// console.log(res.result)
						this.replys[this.index].children.unshift(obj)
						// uni.hideLoading()
						this.hideIssue()
					})
				}
				// console.log(this.replys[this.index].children)
				
			},
			// 失去焦点
			hideIssue(e){
				this.openIssue=false
				this.focus=false
				this.form={}
				// this.content=""
				// console.log(e)
				// 不能点击
				this.controlOpenIssue=true
			},
			// 显示发表回复框
			openInput(i,index,childIndex){
				// console.log(this.index)
				this.index=index 
				console.log(this.index)
				if(!this.controlOpenIssue){
					// console.log(123)
					// true时显示回复框
					this.controlOpenIssue=true
					return
				}
				this.controlOpenIssue=false
				this.openIssue=true
				this.focus=true
				let userInfo=uni.getStorageSync("userInfo");
				// let type=0
				// 判断用户是否登录
				if(!userInfo){
					uni.showModal({
					    title: '提示',
					    content: '您还没有登录,是否登录',
							confirmText:"去登录",
					    success: function (res) {
					        if (res.confirm) {
					            uni.redirectTo({
					            	url:"/pages/login/login"
					            })
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
					return
				}
				// console.log(i)
				this.form.originator=userInfo.userName
				this.form.originatorAccount=userInfo.account
				this.form.headPortrait=userInfo.headPortrait
				this.form.originatorId=userInfo.accountId
				// console.log(childIndex)
				if(i==0){
					this.form.responder=this.info.ideaBy
					this.form.responderContent=this.info.ideaContent
					this.form.responderAccount=this.info.account
					this.form.responderId=this.info.accountId
					this.form.ideaId=this.info.ideaId
					this.type=0
				}else if(i==1){
					// 点击回复内容
					if(childIndex!=undefined){
						this.form.responder=this.replys[this.index].children[childIndex].originator
						this.form.responderContent=this.replys[this.index].children[childIndex].content
						this.form.responderAccount=this.replys[this.index].children[childIndex].originatorAccount
						this.form.responderId=this.replys[this.index].children[childIndex].originatorId
					}else{
						// 点击回复面板的回复内容
						this.form.responder=this.replys[this.index].userName
						this.form.responderAccount=this.replys[this.index].account
						this.form.responderContent=this.replys[this.index].content
						this.form.responderId=this.replys[this.index].accountId
					}
					this.type=1
				}else{
					// 直接点击底部评论框
					if(this.show){
						// 弹出回复界面的
						console.log(this.index)
						this.form.responder=this.replys[this.index].userName
						this.form.responderAccount=this.replys[this.index].account
						this.form.responderContent=this.replys[this.index].content
						this.form.responderId=this.replys[this.index].accountId
						this.type=1
					}else{
						console.log(this.index)
						this.form.responder=this.info.ideaBy
						this.form.responderContent=this.info.ideaContent
						this.form.responderAccount=this.info.account
						this.form.responderId=this.info.accountId
						this.form.ideaId=this.info.ideaId
						this.type=0
					}
				}
				// this.form.responderAccount
				// this.form.responderId
				// console.log(this.form)
				// this.release(type)
			},
			collect1(id){
				let userInfo=uni.getStorageSync("userInfo");
				// 判断用户是否登录
				if(!userInfo){
					uni.showModal({
					    title: '提示',
					    content: '您还没有登录,是否登录',
							confirmText:"去登录",
					    success: function (res) {
					        if (res.confirm) {
					            uni.redirectTo({
					            	url:"/pages/login/login"
					            })
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
					return
				}
				this.collect=!this.collect
				// 判断是否加入收藏
				let type=this.collect?"add":"del"
				console.log(type)
				// console.log(userInfo.accountId)
				uniCloud.callFunction({
					name:'idea_collect',
					data:{
						id:id,
						type:type,
						accountId:userInfo.accountId
					}
				}).then(res=>{
					if(type=='add'){this.toast('已收藏')}
					if(type=='del'){this.toast('已取消收藏')}
					console.log(res)
				}).catch(err=>{
					this.collect=!this.collect
				})
			},
			// 点赞
			thumbs(id){
				let userInfo=uni.getStorageSync("userInfo");
				// 判断用户是否登录
				if(!userInfo){
					uni.showModal({
					    title: '提示',
					    content: '您还没有登录,是否登录',
							confirmText:"去登录",
					    success: function (res) {
					        if (res.confirm) {
					            uni.redirectTo({
					            	url:"/pages/login/login"
					            })
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
					return
				}
				this.praise=!this.praise
				// 点赞数加一还是减一
				if(this.praise){
					this.info.ideaPraise=this.info.ideaPraise+1
				}else{
					this.info.ideaPraise=this.info.ideaPraise-1
				}
				// 添加用户点赞信息或删除该用户的点赞信息
				let type=this.praise?"add":"del"
				console.log(type)
				console.log(this.info.ideaPraise)
				uniCloud.callFunction({
					name:'idea_thumbs-up',
					data:{
						id:id,
						type:type,
						accountId:userInfo.accountId?userInfo.accountId:"",
						ideaPraise:this.info.ideaPraise
					}
				}).then(res=>{
					console.log(res)
				})
			},
			// 获取回复信息
			getReply(){
				let db=uniCloud.database()
				db.collection('ideaReply').where({
					ideaId:this.id
				}).orderBy("id","desc").get().then(res=>{
					console.log(res)
					this.replys=res.result.data
				})
			},
			// 点击查看回复信息
			lookReply(index){
				this.show=true
				this.index=index
			},
			// 图片预览
			previewImage(url){
				let arr=[]
				arr.push(url)
				uni.previewImage({
				   urls: arr
				});
			},
			// 点击标签到搜索界面搜索图书
			toSearch(tab){
				uni.navigateTo({
					url:"/pages/search/search?keyWord="+tab
				})
			},
			// 获取评论的详细信息
			getIdeaDetail(){
				this.requestInfo=false
				let db=uniCloud.database()
				let collection=db.collection("shareIdea_table")
				collection.where({
					ideaId:this.id
				}).get().then(res=>{
					console.log(res.result.data[0])
					this.info=res.result.data[0]
					this.requestInfo=true
				}).catch(err=>{
					this.requestInfo=true
				})
			}
		},
		
	}
</script>

<style lang="less" scoped>
	.ideaDetail{
		
		.ideaBy{
			width: 690rpx;
			margin:0 auto;
			padding:20rpx 20rpx;
			border-radius: 15rpx;
			background: #FFFFFF;
			.userInfo{
				display: flex;
				.left{
					image{
						width:80rpx;
						height: 80rpx;
						border-radius: 40rpx;
					}
				}
				.right{
					margin-left:20rpx;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
				}
			}
			
		}
		.ideaImg{
			width: 690rpx;
			margin:0 auto;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			margin-top: 20rpx;
			image{
				// width: 420rpx;
				// height: 220rpx;
				border-radius: 10rpx;
				margin-bottom: 20rpx;
			}
		}
		
	.reply{
		background: #FFFFFF;
		width: 690rpx;
		margin:0 auto;
		margin-bottom: 120rpx;
		border-radius: 20rpx;
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		.replyitem{
			padding:20rpx 0;
			.baseinfo{
				display: flex;
				.img{
					image{
						margin-left: 20rpx;
						margin-right: 20rpx;
						width:80rpx;
						height: 80rpx;
						border-radius: 40rpx;
					}
				}
				.right{
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.name{
						flex: 1;
					}
					.time{
						flex: 1;
					}
				}
			}
			.content{
				// border-bottom: 1rpx solid #cccccc;
				margin-left:120rpx;
				margin-right: 30rpx;
				word-wrap: break-word;
				padding-bottom: 20rpx;
				font-size: 30rpx;
				letter-spacing: 2rpx;
				line-height: 36rpx;
			}
			.child{
				margin-left:120rpx;
				color:#00aaff;
				font-size: 26rpx;
			}
		}
	}
	.popup{
		.title{
			padding: 30rpx;
			text-align: center;
			font-size: 33rpx;
		}
		.popupitem{
			border-bottom: 1rpx solid #cccccc;
			padding: 20rpx 0;
			.baseinfo{
				display: flex;
				.img{
					image{
						margin-left: 20rpx;
						margin-right: 20rpx;
						width:80rpx;
						height: 80rpx;
						border-radius: 40rpx;
					}
				}
				.right{
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					.name{
						flex: 1;
					}
					.time{
						flex: 1;
					}
				}
			}
			.content{
				// border-bottom: 1rpx solid #cccccc;
				margin-left:120rpx;
				margin-right: 30rpx;
				word-wrap: break-word;
				padding-bottom: 20rpx;
				font-size: 30rpx;
				letter-spacing: 2rpx;
				line-height: 36rpx;
			}
		}
	}
	.bom{
			position: fixed;
			bottom: 0;
			background-color: #FFFFFF;
			width: 100%;
			z-index: 9;
			height: 110rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			// line-height: 100rpx;
			.bom-input{
				width: 500rpx;
				height: 70rpx;
				background-color: #eaeaea;
				// margin-top: 20rpx;
				// margin-left: 75rpx;
				border-radius: 30rpx;
				font-size: 28rpx;
				padding-left:30rpx;
			}
			.thumb{
				margin-left: 20rpx;
			}
			.collect{
				margin-left: 20rpx;
			}
		}
	}
	.issue{
		position: fixed;
		bottom: 0;
		background-color: #FFFFFF;
		width: 100%;
		z-index: 9;
		// height: 300rpx;
		padding:25rpx 30rpx;
		.responerInfo{
			padding-bottom: 20rpx;
			font-size: 26rpx;
			white-space:nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.issue-main{
			display: flex;
			// margin-bottom: 30rpx;
			// height: 200rpx;
			.content{
				width: 550rpx;
				height: 90rpx;
				border-radius: 30rpx;
				background-color: #f8f8f8;
				padding: 30rpx;
				font-size: 28rpx;
			}
			.btn{
				width: 140rpx;
				text-align: center;
				margin-left: 20rpx;
				align-self: flex-end;
				view{
					width: 120rpx;
					background: #ffaaff;
					color:#FFFFFF;
					font-weight: 500;
					font-size: 32rpx;
					padding:5rpx 20rpx;
					border-radius: 20rpx;
				}
			}
		}
	}
</style>
