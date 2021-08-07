'use strict';
exports.main = async (event, context) => {
	// 新建书籍
	//event为客户端上传的参数
	const db=uniCloud.database()
	let num=Math.floor(Math.random() * 100)
	let timezone = 8; //目标时区时间，东八区
	let offset_GMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
	let nowDate = new Date().getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
	let targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
	// console.log(new Date())
	let time=`${targetDate.getFullYear()}-${targetDate.getMonth()+1}-${targetDate.getDate()} ${targetDate.getHours()}:${targetDate.getMinutes()}`
	let id=new Date().getTime()+''+num
	let result;
	await db.collection('book').add({
		bookid:id,
		chapter:0,
		bookName:event.bookName,
		author:event.author,
		createTime:time,
		img:event.img,
		introduction:event.introduction,
		replyNum:0,
		score:5,
		type:event.type
	}).then(res=>{
		console.log("res")
		result=res.id
	})
	await db.collection('bookChater').add({
		bookid:id,
		bookName:event.bookName,
		chapters:[],
		img:event.img
	}).then(res=>{
		console.log(res.data)
		result=res
	})
	await uniCloud.callFunction({
		name:"uploadChapter",
		data:{
				bookName:event.bookName,
				bookid:id,
				chapterContent:event.introduction,
				chapterName:"简介"
		}
	})
	await db.collection('applicationBook').doc(event._id).update({
		bookid:id
	})
	//返回数据给客户端
	return id
};
