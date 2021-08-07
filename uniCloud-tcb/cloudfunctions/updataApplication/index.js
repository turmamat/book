'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	// 审核通过后更改角色为author
	if(event.type==1){
		const db=uniCloud.database()
		await db.collection('application').doc(event.id).update({
			status:1
		})
		await db.collection('userinfo').doc(event.accountId).update({
			role:"author"
		})
	}
	if(event.type==-1){
		const db=uniCloud.database()
		await db.collection('application').doc(event.id).update({
			status:-1
		})
	}
	
	//返回数据给客户端
	return event
};
