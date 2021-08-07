'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const db=uniCloud.database()
	await db.collection('saveChapter').where({
		accountId:event.accountId,
		bookid:event.bookid
	}).get().then(async res=>{
		console.log(res)
		if(res.data.length!=0){
			await db.collection('saveChapter').where({
				accountId:event.accountId,
				bookid:event.bookid
			}).update({
				accountId:event.accountId,
				bookName:event.bookName,
				bookid:event.bookid,
				chapterContent:event.chapterContent,
				chapterName:event.chapterName
			})
		}else{
			await db.collection('saveChapter').add({
				accountId:event.accountId,
				bookName:event.bookName,
				bookid:event.bookid,
				chapterContent:event.chapterContent,
				chapterName:event.chapterName
			})
		}
	})
	
	//返回数据给客户端
	return event
};
