'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// 发布心得
	const db=uniCloud.database()
	const collection = db.collection('shareIdea_table');
	let num=Math.floor(Math.random() * 100)
	let timezone = 8; //目标时区时间，东八区
	let offset_GMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
	let nowDate = new Date().getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
	let targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
	// console.log(new Date())
	let time=`${targetDate.getFullYear()}-${targetDate.getMonth()+1}-${targetDate.getDate()}`
	let ideaId=new Date().getTime()+''+num
	const res = await collection.add({
		ideaBy:event.ideaBy,
		ideaTitle:event.ideaTitle,
		ideaContent:event.ideaContent,
		accountId:event.accountId,
		ideaPraise:0,
		ideaTime:time,
		updataTime:ideaId,
		ideaId:ideaId,
		ideaImg:event.ideaImg,
		tabs:event.tabs,
		headPortrait:event.headPortrait,
		account:event.account,
		ideaReply:0
	})
	console.log('event : ',res)
	
	//返回数据给客户端
	return event
};
