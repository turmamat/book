
'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
// 通过审核时
	if(event.type==1){
		const db=uniCloud.database()
		await db.collection('applicationBook').doc(event.id).update({
			status:1
		})
		await uniCloud.callFunction({
			name:'newBook',
			data:{
				"bookName":event.bookName,
				"author":event.author,
				"img":event.img,
				"introduction":event.introduction,
				"type":event.type
			}
		})
	}
	// 审核驳回时
	if(event.type==-1){
		const db=uniCloud.database()
		await db.collection('applicationBook').doc(event.id).update({
			status:-1
		})
	}
	//返回数据给客户端
	return event
};
