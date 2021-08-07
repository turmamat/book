<template>
	<view class="chapter" v-if='loading==true'>
		<u-form :model="form" ref="uForm" class="form">
				<u-form-item label-width="140" label="章节名:"><u-input placeholder="请输入章节名" v-model="form.chapterName" /></u-form-item>
				<u-form-item label-width="140" label="章节内容:"></u-form-item>
				<editor id="editor" border class="container" placeholder="请输入章节内容" @ready="onEditorReady"></editor>
				<!-- <u-input laceholder="请输入图书简介" border type="textarea" v-model="form.introduction" /> -->
				<view class="btn">
					<u-button  @click="save()">保存章节</u-button>
					<u-button  @click="upload()" type="success">上传章节</u-button>
				</view>
				
			</u-form>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				form:{},
				bookid:"",
				editorCtx:"",
				bookName:"",
				text:"",
				loading:false
			}
		},
		onLoad(option) {
			this.bookid=option.id
			this.bookName=option.bookName
			let userInfo=uni.getStorageSync("userInfo")
			let db=uniCloud.database()
			db.collection("saveChapter").where({
				bookid:this.bookid,
				accountId:userInfo.accountId,
			}).get().then(res=>{
				this.loading=true
				if(res.result.data.length!=0){
					this.$set(this.form,'chapterName',res.result.data[0].chapterName)
					this.text=res.result.data[0].chapterContent
					console.log(res)
				}
				
			})
		},
		methods:{
			onEditorReady() {
			  uni.createSelectorQuery().select('#editor').context((res) => {
			     this.editorCtx = res.context
					 this.editorCtx.format("textIndent","2em")
					 this.editorCtx.setContents({
						 html:this.text
					 })
			  }).exec()
			},
			async save(){
				let chapterContent=''
				let self=this
				let userInfo=uni.getStorageSync("userInfo")
				await this.editorCtx.getContents({
					success:(res)=>{
						chapterContent=res.html=='<p><br></p>'?"":res.html
						console.log(chapterContent)
						uniCloud.callFunction({
							name:"saveChapter",
							data:{
								accountId:userInfo.accountId,
								bookName:self.bookName,
								bookid:self.bookid,
								chapterContent:chapterContent,
								chapterName:self.form.chapterName
							}
						}).then(res=>{
							// console.log(res)
							self.toast("保存成功")
						})
					}
				})
				
				
			},
			upload(){
				let chapterContent=''
				let self=this
				let userInfo=uni.getStorageSync("userInfo")
				this.editorCtx.getContents({
					success(res){
						chapterContent=res.html=='<p><br></p>'?"":res.html
						if(self.form.chapterName==undefined||self.form.chapterName==""){
							self.toast("未填写章节名")
							return
						}
						if(chapterContent==""){
							self.toast("未填写章节内容")
							return
						}
						uniCloud.callFunction({
							name:"uploadChapter",
							data:{
									accountId:userInfo.accountId,
									bookName:self.bookName,
									bookid:self.bookid,
									chapterContent:chapterContent,
									chapterName:self.form.chapterName
							}
						}).then(res=>{
							console.log(res)
							self.toast("上传成功")
							uni.navigateTo({
								url:"/pages/user/uploadChapter/uploadChapter"
							})
						})
					}
				})
				
			}
		},
	}
</script>

<style lang="less" scoped>
	.chapter{
		.form{
			padding:0 30rpx;
		}
		.btn{
			display: flex;
			margin-top: 100rpx;
		}
		.container{
			border: 1rpx solid #C0C0C0;
			padding: 15rpx;
		}
	}
</style>
