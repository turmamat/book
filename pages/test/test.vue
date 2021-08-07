<template>
	<view class="Box">
		<!-- <button type="default" @click="reader">读取文件</button>
		{{content}} -->
		
		<button type="default" @click="del">删除</button>
		<button type="error" @click="addnewbook">手动添加一本新图书</button>
		<button type="default" @click="addLocaltionChapter">添加本地章节</button>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				content:"",
				chapters:[],
				img:"",
				title:"",
				bookid:"book3145494"
			}
		},
		mounted() {
		},
		methods:{
			reader(){
				uni.request({
				    url: 'https://7463-tcb-pko5yqgb8bfjobuecbade-03b550-1304438654.tcb.qcloud.la/bookInfo/'+this.bookid+'/'+this.bookid+'.json',
				    success: (res) => {
							this.content=res.data.context
							this.img=res.data.img
							this.title=res.data.title
							this.chapters=res.data.chapters
				      console.log(res.data);
							uniCloud.callFunction({
								name:"newBook",
								data:{
									"bookName":this.title,
									"author":"战神霸婿",
									"img":this.img,
									"introduction":this.content,
									"type":"悬疑/推理小说"
								}
							}).then(res=>{
								console.log(res.result)
								this.addChapter(res.result)
							})
				    }
				});
			},
			async addtoChapter(i,id){
				await uni.request({
					url:"https://7463-tcb-pko5yqgb8bfjobuecbade-03b550-1304438654.tcb.qcloud.la/bookInfo/"+this.bookid+"/chapter/"+this.chapters[i].chapterid+".json",
					success:async (res)=> {
						// console.log(res.data.chapter)
						let ret=res.data.chapter?res.data.chapter:''
					  if(ret!=''){
							await uniCloud.callFunction({
								name:"uploadChapter",
								data:{
										bookName:this.title,
										bookid:id,
										chapterContent:ret,
										chapterName:this.chapters[i].chapter
								}
							}).then(res=>{
								console.log(i)
							})
						}
					}
				})
			},
			addChapter(id){
				for(let i=0;i<this.chapters.length;i++){
					setTimeout(()=>{
						this.addtoChapter(i,id)
					},1000*i)
				}
			},
			
			async del(){
				// 清理全部数据
				// "bookid":"161190427615654"
				const db = uniCloud.database()
				let bookid='162830499123515'
				await db.collection('book').where({
				  bookid: bookid
				}).remove().then(res=>{
					console.log(res)
				})
				await db.collection('bookChater').where({
				  bookid: bookid
				}).remove()
				await db.collection('chapters').where({
				  bookid: bookid
				}).remove()
				
			},
			// 手动新增一本新的图书
			addnewbook(){
				uniCloud.callFunction({
					name:"newBook",
					data:{
						"bookName":'恐怖复苏',
						"author":"老佛",
						"img":'https://dss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=4139843464,2828492391&fm=179&app=35&f=JPEG?w=267&h=357&s=BDA0E51445486AEE6EF4CDC90300A0B3',
						"introduction":`“我叫杨间，当你看到这句话的时候我已经死了......”一张诡异的羊皮卷，一只窥视黑暗的眼睛，这是一个活下来的人经历的故事。`,
						"type":"灵异小说"
					}
				}).then(res=>{
					console.log(res.result)
				})
			},
			// 获取章节信息
			async addLocaltionChapter(){
				uni.request({
					url:"https://7463-tcb-pko5yqgb8bfjobuecbade-03b550-1304438654.tcb.qcloud.la/a.json",
					success:async (res)=> {
						console.log(res.data)
						this.chapters=res.data
						for(let i=0;i<this.chapters.length;i++){
							await this.loadLocaltion(i,"162830599280037")
						}
					}
				})
				
			},
			// 导入章节
			async loadLocaltion(i,id){
				 await uniCloud.callFunction({
				 	name:"uploadChapter",
				 	data:{
				 		bookName:'恐怖复苏',
				 		bookid:id,
				 		chapterContent:this.chapters[i].chapterContent,
				 		chapterName:this.chapters[i].chapterName
				 	}
				 }).then(res=>{
				 	console.log(i)
				 })
			},
		}
	}
</script>

<style>
	
</style>
