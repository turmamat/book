'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// 添加阅读记录
	
	// console.log('event : ', event)
	const db=uniCloud.database()
	let type;
	let num=Math.floor(Math.random() * 100)
	let timezone = 8; //目标时区时间，东八区
	let offset_GMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
	let nowDate = new Date().getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
	let targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
	// console.log(new Date())
	let time=`${targetDate.getFullYear()}-${targetDate.getMonth()+1}-${targetDate.getDate()} ${targetDate.getHours()}:${targetDate.getMinutes()}`
	let recordId=new Date().getTime()+''+num
	await db.collection('readerRecord').where({
		accountId:event.accountId,
		bookid:event.bookid
	}).get().then(res=>{
		type=res.data.length==0?'add':'update'
	})
	console.log(type)
	if(type=='add'){
		console.log(123)
		await db.collection('readerRecord').add({
			accountId:event.accountId,
			bookid:event.bookid,
			chapterName:event.chapterName,
			chapterIndex:event.chapterIndex,
			bookName:event.bookName,
			bookImg:event.bookImg,
			updateTime:time,
			recordId:recordId
		}).then(res=>{
			console.log(456)
			console.log(res)
		})
	}else{
		await db.collection('readerRecord').where({
			accountId:event.accountId,
			bookid:event.bookid
		}).update({
			chapterName:event.chapterName,
			chapterIndex:event.chapterIndex,
			updateTime:time,
			recordId:recordId
		})
	}
	
	
	//返回数据给客户端
	return event
};
