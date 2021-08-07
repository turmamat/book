'use strict';
exports.main = async (event, context) => {
	// 注册账号
	//event为客户端上传的参数
	console.log('event : ', event)
	const db=uniCloud.database()
	const collection=db.collection("userinfo")
	let msg
	await collection.add({
		account:event.account,
		password:event.password,
		userName:event.account,
		role:"reader",
		headPortrait:"https://7463-tcb-pko5yqgb8bfjobuecbade-03b550-1304438654.tcb.qcloud.la/userImg/touxiang.png",
		money:0,
		sex:"无"
	}).then(async (res)=>{
		let userInfo=await db.collection("userinfo").where({account:event.account}).get()
		// console.log(userInfo.data[0]._id)
		await db.collection("bookshelf").add({
			accountId:userInfo.data[0]._id,
			books:[]
		}).then(res1=>{
			msg="注册成功"
			console.log(res1)
		})
	}).catch(err=>{
		msg="注册失败"
	})
	//返回数据给客户端
	return msg
};
