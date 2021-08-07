'use strict';
exports.main = async (event, context) => {
	// 社区点赞
	//event为客户端上传的参数
	
	const db=uniCloud.database()
	const dbCmd = db.command
	// let num=Math.floor(Math.random() * 100)
	// let time=`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`
	// let id=new Date().getTime()+''+num
	// 社区评论表
	const coll1=db.collection('shareIdea_table')
	// 点赞表
	const coll2=db.collection('idea_thumbs-up')
	let res;
	if(event.type=="del"){
		coll1.doc(event.id).update({
			ideaPraise:event.ideaPraise
		})
		res=await coll2.where({
			accountId:event.accountId,
			id:event.id
		}).remove()
	}else{
		await coll1.doc(event.id).update({
			ideaPraise:event.ideaPraise
		})
		res=await coll2.add({
			id:event.id,
			accountId:event.accountId,
			account:event.account
		})
	}
	console.log('event : ', event)
	
	//返回数据给客户端
	return res
};
