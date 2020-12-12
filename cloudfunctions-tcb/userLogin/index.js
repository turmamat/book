'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const db = uniCloud.database();
	const collection = db.collection('user_table');
	const res = await collection.where({
		userName:event.userName
	}).get()
	let msg=res.data.length==0?"用户不存在":"";
	let code=res.data.length==0?401:200;
	if(res.data.length!=0){
		if(res.data[0].password==event.password){
			msg="success"
			code=200
		}else{
			msg="密码有误"
			code=401
		}
	}
	console.log(res)
	let obj={}
	obj.code=code
	obj.msg=msg
	//返回数据给客户端
	return obj
};
