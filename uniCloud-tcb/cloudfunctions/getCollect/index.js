'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// 获取收藏
	const db = uniCloud.database();
	const dbcmd=db.command
	let result;
	let comments=[];
	let praise=[]
	let total;
	if(event.type==0){
		//返回社区收藏
		let ids=[]
		await	db.collection('idea_collect').where({
			accountId:event.accountId
		}).get({
			getCount:true
		}).then((res)=>{
				let arr=res.data?res.data:[]
				arr.forEach(val=>{
					ids.push(val.id)
				})
				console.log(ids)
		  })	
			
		await db.collection('shareIdea_table').where({
			_id:dbcmd.in(ids)
		}).get({getCount:true}).then((res)=>{
				comments=res.data
		  })
			for(let i=0;i<comments.length;i++){
					comments[i].collect=true
					// 是否点赞
					await	db.collection('idea_thumbs-up').where({
								accountId:event.accountId,
								id:comments[i]._id
						}).get().then(res=>{
							if(res.data.length!=0){
								comments[i].praise=true
							}else{
								comments[i].praise=false
							}
						})
			}
			let obj={}
			obj.total=total;
			obj.comments=comments
			result=obj
	}else{
		//返回书评
		let ids=[]
		await	db.collection('comment_collect').where({
			accountId:event.accountId
		}).get({
			getCount:true
		}).then((res)=>{
				let arr=res.data?res.data:[]
				arr.forEach(val=>{
					ids.push(val.id)
				})
				console.log(ids)
		  })	
			
		await db.collection('comment').where({
			_id:dbcmd.in(ids)
		}).get({getCount:true}).then((res)=>{
				comments=res.data
		  })
			for(let i=0;i<comments.length;i++){
				await db.collection('book').where({
					bookid:comments[i].bookId
				}).get().then((res)=>{
						comments[i].bookInfo=res.data[0]
				  })
					comments[i].collect=true
					// 是否点赞
					await	db.collection('comment_thumbs-up').where({
								accountId:event.accountId,
								id:comments[i]._id,
								bookId:comments[i].bookId
						}).get().then(res=>{
							if(res.data.length!=0){
								comments[i].praise=true
							}else{
								comments[i].praise=false
							}
						})
			}
			let obj={}
			obj.total=total;
			obj.comments=comments
			result=obj
	}
	//返回数据给客户端
	return result
};
