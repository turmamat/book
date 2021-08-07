'use strict';
// 查询图书信息
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const db=uniCloud.database();
	const collection=db.collection("book")
	let res;
	const dbCmd = db.command
	if(event.keyWords==''){
		// 没有关键词时,返回全部
		res=await collection.limit(10).where({}).get()
	}else{
		// res=await collection.where({
		// 	bookName:new RegExp(event.keyWords+'+')
		// }).get()
		// 返回书名或作者有关键字的信息
		res=await collection.limit(10).where(dbCmd.or(
			{
				bookName:new RegExp(event.keyWords+'+')
			},{
				author:new RegExp(event.keyWords+'+')
			})
		).get()
	}
	//返回数据给客户端
	return res
};
