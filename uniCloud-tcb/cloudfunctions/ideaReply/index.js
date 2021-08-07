'use strict';
// 社区的回复
exports.main = async (event, context) => {
	const db=uniCloud.database()
	const collection=db.collection("ideaReply")
	const dbCmd = db.command
	//event为客户端上传的参数
	// console.log('event : ', event)
	let res;
	let num=Math.floor(Math.random() * 100)
	let timezone = 8; //目标时区时间，东八区
	let offset_GMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
	let nowDate = new Date().getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
	let targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
	// console.log(new Date())
	let time=`${targetDate.getFullYear()}-${targetDate.getMonth()+1}-${targetDate.getDate()} ${targetDate.getHours()}:${targetDate.getMinutes()}`
	let id=new Date().getTime()+''+num
	console.log(time)
	// 0为评论的回复添加新的回复记录
	// 1是回复回复信息的,修改该回复信息下的children
	if(event.type==0){
		res = await collection.add({
			ideaId:event.ideaId,
			id:id,
			content:event.content,
			userName:event.userName,
			headPortrait:event.headPortrait,
			time:time,
			praise:0,
			account:event.account,
			accountId:event.accountId,
			children:[]
		})
		// 回复+1
		await db.collection('shareIdea_table').where({
			ideaId:event.ideaId
		}).update({
			ideaReply:dbCmd.inc(1)
		})
	}else if(event.type==1){
		event.obj.time=time
		await collection.doc(event.id).update({
			children:dbCmd.push(event.obj)
		})
		res=time
	}
	//返回数据给客户端
	return res
};
