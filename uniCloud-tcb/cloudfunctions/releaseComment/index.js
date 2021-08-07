'use strict';
exports.main = async (event, context) => {
	// 发布书籍评论
	//event为客户端上传的参数
	const db=uniCloud.database()
	const collection = db.collection('comment');
	let num=Math.floor(Math.random() * 100)
	let timezone = 8; //目标时区时间，东八区
	let offset_GMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
	let nowDate = new Date().getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
	let targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
	// console.log(new Date())
	let time=`${targetDate.getFullYear()}-${targetDate.getMonth()+1}-${targetDate.getDate()} ${targetDate.getHours()}:${targetDate.getMinutes()}`
	let commentId=new Date().getTime()+''+num
	const res = await collection.add({
		comentBy:event.comentBy,
		comentTitle:event.comentTitle,
		commentContent:event.commentContent,
		commentPraise:0,
		commentTime:time,
		score:event.score,
		commentId:commentId,
		headPortrait:event.headPortrait,
		account:event.account,
		commentReply:0,
		updataTime:commentId,
		accountId:event.accountId,
		bookId:event.bookId
	})
	let newScore;
	let replyNum;
	await db.collection('book').where({
		bookid:event.bookId
	}).get().then(res=>{
		console.log(res.data[0].score)
		replyNum=1
		if(res.data[0].replyNum){
			replyNum=res.data[0].replyNum
		}
		console.log(parseFloat(res.data[0].score)*replyNum+event.score)
		newScore=(parseFloat(res.data[0].score)*replyNum+event.score)/(replyNum+1)
		console.log(newScore+"newScore")
	})
	await db.collection('book').where({
		bookid:event.bookId
	}).update({
		replyNum:replyNum+1,
		score:newScore
	}).then(res=>{
		console.log(res+"updata")
	})
	// console.log('res : ', res)
	
	//返回数据给客户端
	return event.bookid
};
