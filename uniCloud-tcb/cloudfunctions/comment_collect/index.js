'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// 收藏
	const db=uniCloud.database()
	const dbCmd = db.command
	// let num=Math.floor(Math.random() * 100)
	// let time=`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`
	// let id=new Date().getTime()+''+num
	// 图书评论表
	const coll1=db.collection('comment')
	// 图书收藏记录表
	const coll2=db.collection('comment_collect')
	let res;
	// 删除收藏记录
	if(event.type=="del"){
		res=await coll2.where({
			accountId:event.accountId,
			id:event.id,
			bookId:event.bookId
		}).remove()
	}else{
		await coll2.where({
			id:event.id,
			accountId:event.accountId,
			account:event.account,
			bookId:event.bookId
		}).get().then(async (res1)=>{
			console.log(res1)
			if(res1.data.length==0){
				// 添加点赞记录
				res=await coll2.add({
					id:event.id,
					accountId:event.accountId,
					account:event.account,
					bookId:event.bookId
				})
			}
		})
		
	}
	// console.log('event : ', event)
	
	//返回数据给客户端
	return res
};
