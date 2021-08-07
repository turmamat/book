'use strict';
// 更改用户信息
exports.main = async (event,context) => {
	//event为客户端上传的参数
	console.log('event : ', event.sex)
	const db=uniCloud.database()
	const collection=db.collection("userinfo");
	let res={};
	// 修改密码
	if(event.password){
		let user;
		await collection.where({
			account:event.account
		}).get().then(res=>{
			user=res.data[0]?res.data[0]:{}
		})
		if(user.account){
			if(user.password==event.password){
				res.msg="新旧密码一致，请重新修改密码"
			}else{
				await collection.where({
					account:event.account
				}).update({
					password:event.password
				}).then(res1=>{
						res.msg="修改成功"
					})
			}
		}else{
			res.msg="该用户不存在"
		}
	}else if(event.headPortrait){
		res=await collection.where({
			account:event.account
		}).update({
			headPortrait:event.headPortrait
		})
		
		
	}else if(event.sex){
		res=await collection.where({
			account:event.account
		}).update({
			sex:event.sex,
			signature:event.signature,
			userName:event.userName
		})
	}else if(event.role){
		res=await collection.where({
			account:event.account
		}).update({
			role:event.role
		})
	}else if(event.money){
		res=await collection.where({
			account:event.account
		}).update({
			money:event.money
		})
	}
	//返回数据给客户端
	return res
};
