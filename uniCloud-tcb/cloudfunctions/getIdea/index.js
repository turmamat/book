'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// 获取想法
	const db = uniCloud.database();
	let result;
	let comments=[];
	let praise=[]
	let total;
	if(event.type==0){
		//返回社区心得
		await	db.collection('shareIdea_table').count().then((res)=>{
				total=res.total
		  })
		await db.collection('shareIdea_table').orderBy("updataTime", "desc").where({
			accountId:event.accountId
		}).get().then((res)=>{
				comments=res.data
		  })
			for(let i=0;i<comments.length;i++){
				if(event.accountId==""){
					comments[i].praise=false
					comments[i].collect=false
				}else{
					// 是否收藏
					await	db.collection('idea_collect').where({
								accountId:event.accountId,
								id:comments[i]._id
						}).get().then(res=>{
							if(res.data.length!=0){
								comments[i].collect=true
							}else{
								comments[i].collect=false
							}
						})
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
			}
			let obj={}
			obj.total=total;
			obj.comments=comments
			result=obj
	}else{
		//返回书评
		await	db.collection('comment').count().then((res)=>{
				total=res.total
		  })
		await db.collection('comment').orderBy("updataTime", "desc").where({
			accountId:event.accountId
		}).get().then((res)=>{
				comments=res.data
		  })
			for(let i=0;i<comments.length;i++){
				await db.collection('book').where({
					bookid:comments[i].bookId
				}).get().then((res)=>{
						comments[i].bookInfo=res.data[0]
				  })
				if(event.accountId==""){
					comments[i].praise=false
					comments[i].praise=false
				}else{
					await	db.collection('comment_thumbs-up').where({
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
			}
			let obj={}
			obj.total=total;
			obj.comments=comments
			result=obj
	}
	//返回数据给客户端
	return result
};
