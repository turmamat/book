<template>
	<view class="Box" style="">
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<!-- 网页背景开始 -->
		<view class="pagbg anmt" :style="{backgroundColor:pageBg}"></view>
		<view class="zhongMenu"  @click.prevent="dianjile()"></view>
		<!-- 网页背景结束 -->
		<!-- 带返回键的导航栏开始 -->
		<view class="topBox anmt" :style="{color:fontColor,backgroundColor:menuBg,top:show?'0':'-150px'}">
			<view :style="{height:statusBarHeight}"></view>
			<!-- <view style="height: 40upx;"></view> -->
			<view style="height: 100upx;line-height: 100upx;text-overflow: ellipsis;display: flex;" class="tMain">
				<image src="../../static/yueduBack.png" class="back" @click="back()"></image>
				<text style="font-size: 24upx;text-align: center;flex: 1;margin-right: 80rpx;">{{section_title}}</text>
			</view>
		</view>
		<!-- 带返回键的导航栏结束 -->
		<!-- 菜单开始 -->
		<view class="bottomBox anmt" :style="{color:fontColor,backgroundColor:menuBg,bottom:show?'0':'-180px'}">
			<view style="width: 100%;font-weight: 500;font-size: 44rpx;display: flex;text-align: center;padding-top: 30rpx;" class="ddd">
				<view @click="last()" style="text-align: left;margin-left: 100rpx;">
					<view style="font-size: 28rpx;">上一章</view>
				</view>
				<view @click="next()" style="text-align: right;margin-right: 100rpx;">
					<view style="font-size: 28rpx;">下一章</view>
				</view>
			</view>
			<view style="overflow: hidden;">
				<view style="float: left;width: 50%;overflow: hidden;">
					<view style="float: left;width: 30%;line-height: 70upx;text-align: center;font-size: 24upx;">字体</view>
					<view style="float: left;width: 70%;height: 70upx;display: flex;align-content: center;justify-content: center;">
						<slider style="width: 100%;" :value="size" min="28" max="50" @changing="changeFontSize" @change="changeFontSize" :activeColor="fontColor" :backgroundColor="pageBg" :block-color="fontColor" block-size="20" />
					</view>
				</view>
				<view style="float: left;width: 50%;overflow: hidden;">
					<view style="float: left;width: 30%;line-height: 70upx;text-align: center;font-size: 24upx;">间距</view>
					<view style="float: left;width: 70%;height: 70upx;display: flex;align-content: center;justify-content: center;">
						<slider style="width: 100%;" :value="lineHeight" min="50" max="80" @changing="changeLineHeight" @change="changeLineHeight" :activeColor="fontColor" :backgroundColor="pageBg" :block-color="fontColor" block-size="20" />
					</view>
				</view>
			</view>
			<view style="overflow: hidden;">
				<view style="float: left;width: 15%;line-height: 100upx;text-align: center;font-size: 24upx;">背景</view>
				<view style="float: left;width: 85%;height: 100upx;display: flex;">
					<view class="sekuai" v-for="(item,index) in zhutiList" @tap="qiehuan(index)" :key="item.name" :style="{backgroundColor:item.pageBg,borderColor:dqzhuti==index?item.fontColor:'rgba(0,0,0,0)'}" v-if="index!=1&&index!=2"></view>
				</view>
			</view>
			<view style="width: 100%;display: flex;" class="ddd">
				<view @click="mulu()">
					<view><text class="tficon">&#xe671;</text></view>
					<view>目录</view>
				</view>
				<view @click="qiehuan(dqzhuti==1?0:1)">
					<view><text class="tficon">{{dqzhuti==1?'&#xe699;':'&#xe612;'}}</text></view>
					<view>{{dqzhuti==1?'白天':'夜间'}}</view>
				</view>
				<view @click="qiehuan(dqzhuti==2?0:2)" :style="dqzhuti==2?'color:green':''">
					<view><text class="tficon">&#xe639;</text></view>
					<view>护眼</view>
				</view>
			</view>
		</view>
		<!-- 菜单结束 -->
		<!-- 顶部开始 -->
		<view class="anmt" :style="{color:fontColor,backgroundColor:show?menuBg:pageBg,position:'fixed',top:'0',left:'0',zIndex:'6',width:'100%',fontSize:'3vw',zIndex:'20'}">
			<!-- 书名章节开始 -->
			<view v-show="!show" style="height: 40upx;line-height: 40upx;padding: 0 5vw;padding-top:20rpx">
				<view style="float: left;width: 300upx;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" v-text="bookName"></view>
				<view v-text="section_title" style="float: right;width: 300upx;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;text-align: right;"></view>
			</view>
			<!-- 书名章节结束 -->
		</view>
		<!-- 顶部结束 -->
		<!-- 小说正文开始 -->
		<view @click="dianjile()"  class="sview" :style="{paddingTop:'calc(50rpx)',zIndex:zindex,color:textColor,fontSize:forUpx(size)+'px',lineHeight:forUpx(lineHeight)+'px'}">
			<!-- <text selectable="true">{{content_text}}</text> -->
			<rich-text  :selectable="true" :nodes="content_text"></rich-text>
			<!-- <u-parse  :selectable="false" :tag-style="style"  :html="content_text"></u-parse> -->
			<view class="unload" v-if="content_text==' '">
				加载中
			</view>
			<!-- {{content_text}} -->
		</view>
		<!-- 小说正文结束 -->
		<!-- 目录 -->
		<u-popup class="chapterList" length="550rpx" v-model="menuShow">
			<view class="status_bar">
				<!-- 这里是状态栏 -->
			</view>
			<view class="title">
				{{bookName}}
			</view>
			<view v-for="(chapter,index) in chapters" class="chapter">
				<view @click="getChapterContent(chapter.chapterId,index)">{{chapter.chapterName}}</view>
			</view>
		</u-popup>
	</view>
</template>
<script>
let interval,dianliangInter;
import zhuti from '../../zhuti'
export default{
	data(){
		return{
			zindex:5,
			section_title:'',//章节标题
			//正文
			content_text:'',
			show:false,//菜单display
			dqzhuti:0,//当前主题
			zhutiList:zhuti.data,//主题列表
			fontColor:'rgb(100,103,120)',//菜单字体颜色
			pageBg:'rgb(247,247,247)',//页面背景色
			menuBg:'#fff',//菜单背景色
			textColor:'#000',//富文本文字颜色
			statusBarHeight: '',
			Dindex:'',//当前章节索引
			bookName:'',//书名
			bookId:'',//本书ID
			battery:'',//电量
			systemTime:'',//系统时间
			size:uni.getStorageSync('fontsize')?uni.getStorageSync('fontsize'):40,//正文字体大小
			lineHeight:uni.getStorageSync('lineHeight')?uni.getStorageSync('lineHeight'):70,//正文行间距
			menuShow:false,
			chapters:[],
			chapterNum:0,
			style: {p: 'user-select: text;-webkit-user-select: text;'},
			addbookshelf:false,
			bookImg:""
		}
	},
	onUnload() {
		//页面卸载的时候将通知栏显示出来
		// #ifdef APP-PLUS
		plus.navigator.setFullscreen(false);
		// #endif
		uni.hideLoading();
		this.listerUnload()
		
	},
	created() {
		var this_ = this;
		// #ifdef APP-PLUS
		//获取状态栏高度给顶部占位节点
		plus.navigator.setFullscreen(true);
		// #endif
		var zt = uni.getStorageSync('zhuti');//主题索引
		if(zt){
			this.dqzhuti = zt;
			this.fontColor=zhuti.data[zt].fontColor;//菜单字体颜色
			this.pageBg=zhuti.data[zt].pageBg;//页面背景色
			this.menuBg=zhuti.data[zt].menuBg;//菜单背景色
			this.textColor=zhuti.data[zt].textColor;//富文本文字颜色
		}else{
			this.dqzhuti = 0;
			this.fontColor=zhuti.data[0].fontColor;//菜单字体颜色
			this.pageBg=zhuti.data[0].pageBg;//页面背景色
			this.menuBg=zhuti.data[0].menuBg;//菜单背景色
			this.textColor=zhuti.data[0].textColor;//富文本文字颜色
		}
		uni.getSystemInfo({
			success: res=>{
				// console.log(res.statusBarHeight)
				this.statusBarHeight = res.statusBarHeight + 'rpx';
			}
		})
	},
	onShow() {
		//页面显示的时候将通知栏隐藏掉
		// console.log("123")
		// #ifdef APP-PLUS 
		// plus.navigator.setFullscreen(true);
		// #endif
		// this.text()
	},
	onHide() {
		// console.log("123")
		//页面隐藏的时候将通知栏显示出来
		// #ifdef APP-PLUS 
		plus.navigator.setFullscreen(false);
		// #endif
	},
	onLoad(option) {
		// #ifdef APP-PLUS 
		plus.navigator.setStatusBarStyle('dark');
		plus.navigator.setStatusBarBackground('#FF0000');
		// #endif
		this.bookId=option.bookid
		const db=uniCloud.database()
		let userInfo=uni.getStorageSync("userInfo")
		db.collection('readerRecord').where({
			accountId:userInfo.accountId,
			bookid:this.bookId
		}).get().then(res=>{
			// console.log(res)
			if(res.result.data.length!=0){
				this.chapterNum=res.result.data[0].chapterIndex?res.result.data[0].chapterIndex:0
			}
			this.getData()
		})
		
	},
	// 触发安卓系统返回键时的事件
	onBackPress(options) {  
	  if (options.from === 'backbutton') { 
				this.back()
				return true;  
		}  
	},
	
	methods:{
		// 判断该书籍是否已经加入书架
		async getBookshelf(){
			let userInfo=uni.getStorageSync("userInfo")
			if(!userInfo){
				return
			}
			const db = uniCloud.database();
			await db.collection("bookshelf").where({
				accountId:userInfo.accountId
			}).get().then((res)=>{
				let arr=res.result.data[0].books?res.result.data[0].books:[]
				// console.log(res)
				arr.forEach(val=>{
					// console.log(this.addbookshelf)
					if(val.bookid==this.bookId){
						this.addbookshelf=true
					}
				})
			})
		},
		// 加入书架
		addtoBookshelf(){
			let userInfo=uni.getStorageSync("userInfo");
			let obj={}
			obj.bookid=this.bookId
			obj.bookName=this.bookName
			obj.img=this.bookImg
			// console.log(obj)
			uniCloud.callFunction({
				name:"addBookshelf",
				data:{
					accountId:userInfo.accountId,
					obj:obj
				}
			}).then(res=>{
				// console.log(res)
				this.toast("已加入书架")
				this.addbookshelf=true
			})
		},
		// 监听页面卸载,将阅读章节记录保存
		listerUnload(){
			// console.log("listerUnload")
			let userInfo=uni.getStorageSync("userInfo")
			uniCloud.callFunction({
				name:"readerRecord",
				data:{
					accountId:userInfo.accountId,
					bookid:this.bookId,
					chapterName:this.chapters[this.chapterNum].chapterName,
					chapterIndex:this.chapterNum,
					bookName:this.bookName,
					bookImg:this.bookImg
				}
			})
			// console.log(this.chapterNum)
			// console.log(this.chapters[this.chapterNum].chapterName)
		},
		// 根据bookid获取章节,书名信息
		getData(){
			let db=uniCloud.database()
			db.collection('bookChater').where({
				bookid:this.bookId
			}).get().then(res=>{
				// console.log(res.result)
				this.chapters=res.result.data[0].chapters?res.result.data[0].chapters:[]
				this.getChapterContent(this.chapters[this.chapterNum].chapterId,this.chapterNum)
				// this.section_title=this.chapters[this.chapterNum].chapterName
				this.bookName=res.result.data[0].bookName
				this.bookImg=res.result.data[0].img
				
			})
		},
		// 根据章节id获取章节内容
		getChapterContent(chapterId,index){
			let db=uniCloud.database()
			this.content_text=" "
			// console.log(index)
			db.collection('chapters').where({
				bookid:this.bookId,
				chapterId:chapterId
			}).get().then(res=>{
				// console.log(res.result.data[0].chapterContent)
				let str=res.result.data[0].chapterContent.replace(/\n/g, '</p><p>')
				// let str=res.result.data[0].chapterContent
				this.content_text=`<p>${str}</p>`
				this.section_title=this.chapters[index].chapterName
				this.chapterNum=index
				this.menuShow=false
			})
		},
		//修改正文字体大小
		changeFontSize(e){
			this.size = e.detail.value;
			uni.setStorageSync('fontsize',e.detail.value);
		},
		//修改正文行间距
		changeLineHeight(e){
			this.lineHeight = e.detail.value;
			uni.setStorageSync('lineHeight',e.detail.value);
		},
		// 点击上一章
		last(){
			if(this.chapterNum==0){
				this.toast("已经是第一章了")
			}else{
				this.chapterNum--;
				this.section_title=this.chapters[this.chapterNum].chapterName
				this.getChapterContent(this.chapters[this.chapterNum].chapterId,this.chapterNum)
			}
		},
		// 点击下一章
		next(){
			if(this.chapterNum==this.chapters.length-1){
				this.toast("已经是最后章了")
			}else{
				this.chapterNum++;
				this.section_title=this.chapters[this.chapterNum].chapterName
				this.getChapterContent(this.chapters[this.chapterNum].chapterId,this.chapterNum)
			}
		},
		// 点击目录,显示章节信息
		mulu(){
			this.menuShow=true
		},
		// 返回上一页触发事件
		async back(){
			let a=await this.getBookshelf()
			// 判断用户是否登录
			// console.log(a)
			if(!this.addbookshelf){
				// console.log(this.addbookshelf)
				let self=this
				// console.log("123")
				uni.showModal({
				    title: '提示',
				    content: '为方便下次阅读,是否将该图书加入书架?',
						confirmText:"加入",
				    success:async function (res) {
				        if (res.confirm) {
				           await self.addtoBookshelf()
									 // self.toast("已加入书架")
				        } else if (res.cancel) {
				            // console.log('用户点击取消');
				        }
								uni.navigateBack({delta:1});
								// uni.reLaunch({
								// 	url:"/pages/reader/book-baseinfo/book-baseinfo"
								// })
				    }
				});
			}else{
				uni.navigateBack({delta:1});
				
			}
		},
		dianjile(){
			// console.log(123)
			this.show=!this.show;
			if(this.show){
				this.zindex=5;
			}else{
				this.zindex=10
			}
			// console.log(this.zindex)
		},
		//切换主题
		qiehuan(e){
			this.fontColor=zhuti.data[e].fontColor;//菜单字体颜色
			this.pageBg=zhuti.data[e].pageBg;//页面背景色
			this.menuBg=zhuti.data[e].menuBg;//菜单背景色
			this.textColor=zhuti.data[e].textColor;//富文本文字颜色
			uni.setStorageSync('zhuti',e);
			this.dqzhuti=e;
		},
		getTimes(){
			var times = new Date();
			this.systemTime = (times.getHours()<10?'0'+times.getHours():times.getHours()) + ':' + (times.getMinutes()<10?'0'+times.getMinutes():times.getMinutes());
		},
		forUpx(e){
			return uni.upx2px(e)
		}
	}
}
</script>
<style lang="less" scoped>
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
	@font-face {font-family: "iconfont";
	  src: url('../../font/dianliang.ttf') format('truetype');
	}
	.iconfont {
	  font-family: "iconfont" !important;
	  font-style: normal;
	  -webkit-font-smoothing: antialiased;
	  -moz-osx-font-smoothing: grayscale;
	}
	.icon-80dianliang:before {
	  content: "\e617";
	}
	.pagbg{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		
	}
	.zuizhong.active{
		opacity: 1;
		position: fixed;
		width: 100upx;
		text-align: center;
		font-size: 30upx;
		font-weight: bold;
		color: #ec706b;
		transform: translateX(50%) scale(0.7);
		right: 80upx;
		-webkit-transition: all 0.5s;
		z-index: 9
	}
	.zuizhong{
		opacity: 0;
		position: fixed;
		width: 100upx;
		text-align: center;
		font-size: 20upx;
		font-weight: bold;
		color: #ec706b;
		right: 80upx;
		transform: translateX(50%)  scale(0.1);
		-webkit-transition: all 0.5s;
		transition: all 0.5s;
		z-index: 9
	}
	.quanquan{
		-webkit-box-shadow: rgba(0,0,0,0.12) 0px 3px 13px 1px;
		box-shadow: rgba(0,0,0,0.12) 0px 3px 13px 1px;
		position: fixed;
		right: 70upx;
		z-index: 9;
		border-radius: 50%;
		overflow: hidden;
		transform: translateX(50%) scale(0.5);
	}
	.back{
		width: 40upx;
		height: 40upx;
		margin: 0 40upx;
	}
	.sview{
		width: calc(100% - 40upx);
		font-size: 45upx;
		line-height: 90upx;
		position: relative;
		text-indent:calc(2em + 12upx);
		margin: 0 auto;
		z-index: 5;
		white-space:normal;
		word-break:break-all;
		word-wrap:break-word;
		overflow: hidden;
		padding: 0 20upx 100upx;
		.unload{
			width: 100%;
			height: 100%;
			text-align: center;
			margin: 0 auto;
			margin-top:300rpx;
			text-indent: 0;
		}

	}
	.titlee{
		width: 100%;
		font-size: 45upx;
		line-height: 65upx;
		position: relative;
		z-index: 5;
		padding: 0 20upx 50upx;
		text-indent:-2.3em;
	}
	.tMain{
		display: flex;
		align-items:center;
	}
	page{
		letter-spacing:6upx;
	}
	.topBox{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		opacity: 1;
		z-index: 9;
	}
	.bottomBox{
		padding: 0 0 20upx 0;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		opacity: 1;
		z-index: 9;
	}
	.bottomBox .ddd>view{
		width: 100%;
		text-align: center;
		font-size: 24upx;
		line-height: 40upx;
	}
	.bottomBox .ddd image{
		width: 40upx;
		height: 40upx;
	}
	@font-face {font-family: "ydiconfont";
	  src: url('https://at.alicdn.com/t/font_1282539_9h0uwv1sxps.ttf') format('truetype'); /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
	}
	.tficon{
		font-family: ydiconfont;
		font-size: 34upx;
	}
	.guanggao{
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 6;
		width: 100%;
	}
	.dianxin{
		position: absolute;
		top: 32.5%;
		left: 11%;
		width: 72%;
		height: 35%;
	}
	.dLiang{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: block;
	}
	.anmt{
		transition: all 0.5s;
	}
	.sekuai{
		width: 150upx;
		height: 100upx;
		background-color: #EC706B;
		border-radius: 12upx;
		border: 5upx solid #000;
		transform: scale(0.4);
		margin: -10upx -35upx 0;
	}
	.zhongMenu{
		top: 50%;
		position: fixed;
		left: 0;
		width: 100%;
		height: 50%;
		transform: translateY(-50%);
		z-index: 9;
	}
	.chapterList{
		width: 100%;
		
		.title{
			width: 100%;
			text-align: center;
			height: 110rpx;
			line-height: 80rpx;
			font-size: 32rpx;
			padding-top:20rpx;
			background-color: #cccccc;
		}
		.chapter{
			display: flex;
			justify-content: space-between;
			height: 80rpx;
			align-items: center;
			line-height: 80rpx;
			view{
				width: 100%;
				padding:0 30rpx;
				overflow: hidden;//盒子溢出隐藏
				text-overflow:ellipsis;//文字溢出显示省略号
				white-space: nowrap;//文字不换行
				border-top: 1rpx solid #cccccc;
			}
		}
	}
</style>
