'use strict';
exports.main = async (event, context) => {
	// 删除上传的图片
	let result = await uniCloud.deleteFile({
	    fileList: event.ids
	});
	//event为客户端上传的参数
	console.log('event : ', event)
	
	
	//返回数据给客户端
	return event
};
