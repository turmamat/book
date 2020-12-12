'use strict';

exports.main = async (event, context) => {
	const db = uniCloud.database();
	const collection = db.collection('user_table');
	
	const res = await collection.add(event)
	//event为客户端上传的参数
	console.log('event : ', event)
	
	//返回数据给客户端
	return res
};
