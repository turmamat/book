'use strict';
exports.main = async (event, context) => {
	//收藏idea
	const db=uniCloud.database()
	const dbCmd = db.command
	// let num=Math.floor(Math.random() * 100)
	// let time=`${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`
	// let id=new Date().getTime()+''+num
	// 社区评论表
	const coll1=db.collection('shareIdea_table')
	// 收藏表
	const coll2=db.collection('idea_collect')
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
		res=await coll2.add({
			id:event.id,
			accountId:event.accountId,
			account:event.account
		})
	}
	console.log('event : ', event)
	//返回数据给客户端
	return event
};
