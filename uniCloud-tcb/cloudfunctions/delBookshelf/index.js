'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// 删除书架书籍
	const db=uniCloud.database()
	const dbCmd=db.command
	let res=await db.collection('bookshelf').where({
		accountId:event.accountId
	}).update({
		books: dbCmd.pull({
				bookid:dbCmd.in(event.ids)
			})
	})
	//返回数据给客户端
	return res
};
