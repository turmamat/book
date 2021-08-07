'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	let timezone = 8; //目标时区时间，东八区
	let offset_GMT = new Date().getTimezoneOffset(); // 本地时间和格林威治的时间差，单位为分钟
	let nowDate = new Date().getTime(); // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
	let targetDate = new Date(nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000);
	// console.log(new Date())
	let time=`${targetDate.getFullYear()}-${targetDate.getMonth()+1}-${targetDate.getDate()}`
	const db=uniCloud.database()
	let num=Math.floor(Math.random() * 100)
	let id=new Date().getTime()+''+num
	let author=''
	let authorType=''
	let phone=''
	await db.collection('application').where({
		accountId:event.accountId
	}).get().then(res=>{
		author=res.data[0].name
		authorType=res.data[0].type
		phone=res.data[0].phone
		console.log(res)
	})
	if(event.coding=='add'){
		await db.collection('applicationBook').add({
			accountId:event.accountId,
			bookName:event.bookName,
			bookid:id,
			type:event.type,
			introduction:event.introduction,
			img:event.img,
			createTime:time,
			status:0,
			phone:phone,
			authorType:authorType,
			author:author
		})
	}
	if(event.coding=="updata"){
		await db.collection('applicationBook').doc(event._id).update({
			accountId:event.accountId,
			bookName:event.bookName,
			bookid:id,
			type:event.type,
			introduction:event.introduction,
			img:event.img,
			createTime:time,
			status:0,
			phone:phone,
			authorType:authorType,
			author:author
		})
	}
	if(event.coding=='changeStatus'){
		await db.collection('applicationBook').doc(event._id).update({
			status:event.status
		})
		if(event.status==1){
			await uniCloud.callFunction({
				name:'newBook',
				data:{
					bookName:event.bookName,
					author:event.author,
					img:event.img,
					introduction:event.introduction,
					type:event.type,
					_id:event._id
				}
			})
		}
	}
	//返回数据给客户端
	return event
};
