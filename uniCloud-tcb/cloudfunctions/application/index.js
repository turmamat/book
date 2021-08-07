'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// reader提交申请成为author
	console.log('event : ', event)
	// 笔名
	// 简介
	// 姓名
	// 电话
	//状态
	let timezone = 8; //目标时区时间，东八区
	let offset_GMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
	let nowDate = new Date().getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
	let targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
	// console.log(new Date())
	let time=`${targetDate.getFullYear()}-${targetDate.getMonth()+1}-${targetDate.getDate()}`
	const db=uniCloud.database()
	await db.collection('application').where({
		accountId:event.accountId
	}).get().then(async res=>{
		if(res.data.length!=0){
			await db.collection('application').where({
				accountId:event.accountId
			}).update({
				biming:event.biming,
				type:event.type,
				info:event.info,
				name:event.name,
				phone:event.phone,
				time:time,
				status:0
			})
		}else{
			await db.collection('application').add({
				accountId:event.accountId,
				biming:event.biming,
				type:event.type,
				info:event.info,
				name:event.name,
				phone:event.phone,
				time:time,
				status:0
			})
		}
	})
	
	//返回数据给客户端
	return event
};
