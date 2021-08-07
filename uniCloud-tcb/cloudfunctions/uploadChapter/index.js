'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// 上传章节
	console.log('event : ', event)
	let num=Math.floor(Math.random() * 100)
	let timezone = 8; //目标时区时间，东八区
	let offset_GMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
	let nowDate = new Date().getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
	let targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
	// console.log(new Date())
	let time=`${targetDate.getFullYear()}-${targetDate.getMonth()+1}-${targetDate.getDate()} ${targetDate.getHours()}:${targetDate.getMinutes()}`
	let id=new Date().getTime()+''+num
	const db=uniCloud.database()
	const dbCmd = db.command
	let obj={}
	obj.chapterName=event.chapterName
	obj.chapterId=id
	await db.collection('bookChater').where({
		bookid:event.bookid
	}).update({
		chapters: dbCmd.push(obj)
	})
	await db.collection('chapters').add({
		bookName:event.bookName,
		bookid:event.bookid,
		chapterContent:event.chapterContent,
		chapterId:id,
		chapterName:event.chapterName,
		price:100,
		time:time
	})
	// await db.collection('chapters').add({
	// 	bookName:event.bookName,
	// 	bookid:event.bookid,
	// 	chapterContent:event.chapterContent,
	// 	chapterId:id,
	// 	chapterName:event.chapterName,
	// 	price:100,
	// 	time:time
	// })
	await db.collection('saveChapter').where({
		bookid:event.bookid,
		accountId:event.accountId,
	}).remove()
	
	//返回数据给客户端
	return event
};
