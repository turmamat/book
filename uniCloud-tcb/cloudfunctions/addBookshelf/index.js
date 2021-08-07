'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// 加入书架功能
	const db=uniCloud.database()
	const dbCmd=db.command
	let record;
	let add=false
	let books
	await db.collection("bookshelf").where({
		accountId:event.accountId
	}).get().then(res=>{
		record=res.data[0]?res.data[0]:{},
		console.log(record.books)
		books=record.books?record.books:[]
		for(let i=0;i<books.length;i++){
			if(books[i].bookid==event.obj.bookid){
				add=true
				return
			}
		}
		
	})
	// 判断是否有返回书架信息,没有的话添加一条该用户的书架记录
	if(!record._id){
		await db.collection("bookshelf").add({
			accountId:event.accountId,
			books:[]
		}).then(res=>{
			console.log(res)
		})
	}
	// 判断是否已加入书架,没有就加入
	if(add==false){
		await db.collection('bookshelf').where({
			accountId:event.accountId
		}).update({
			books: dbCmd.push(event.obj)
		})
	}
	
	//返回数据给客户端
	return event
};
