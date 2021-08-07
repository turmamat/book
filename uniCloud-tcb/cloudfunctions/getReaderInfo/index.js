'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// 获取用户阅读记录
	console.log('event : ', event)
	const db=uniCloud.database()
	let chapters=[]
	let chapterId=""
	await db.collection('bookChater').where({
		bookId:event.bookId
	}).get().then(res=>{
		
	})
	await db.collection('readerRecord').where({
		bookId:event.bookId,
		accountId:event.accountId
	}).get().then(res=>{
		
	})
	await db.collection('chapters').where({
		bookId:event.bookId,
		chapterId:chapterId
	}).get().then(res=>{
		
	})
	//返回数据给客户端
	return event
};
