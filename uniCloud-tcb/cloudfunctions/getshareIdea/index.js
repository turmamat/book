'use strict';
exports.main = async (event, context) => {
	// 获取社区评论信息
	//event为客户端上传的参数
	const db = uniCloud.database();
	let result;
	let comments=[];
	let praise=[]
	let total;
	await	db.collection('shareIdea_table').count().then((res)=>{
			// console.log(res)
			total=res.total
			// res=res.result.data?res.result.data:[]
	  })
	await db.collection('shareIdea_table').orderBy("updataTime", "desc").orderBy("ideaPraise", "asc").skip(event.skip).limit(10).get().then((res)=>{
			// console.log(res)
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
	// console.log('event : ', event)
	
	//返回数据给客户端
	return result
};
