export const javaHb = new class {
	constructor() {
		this.appCheckAppVersion; //版本号变量[String]
		this.appCheckSystemType; //系统类型
	}
	plusReady() {
		let that = this;   
		// console.log(22) 
		plus.runtime.getProperty(plus.runtime.appid, function(inf) {
			// console.log(33) 
			that.appCheckAppVersion = inf.version;
			console.log(that.appCheckAppVersion,1)
			// console.log("start")
			uni.getSystemInfo({
			    success(res) {
						// console.log(res.platform);
						that.appCheckSystemType=res.platform
			    }
			});
			// that.appCheckSystemType = that.getCurrentSystem(); //系统类型
			// console.log("end")
			that.checkFun(); // 更新方法
		});
	}   

	/**
 	* 版本更新
 	*/ 
	checkFun() {
		// {type: this.appCheckSystemType}
		// console.log(11111) 
		let staus=this.appCheckSystemType=='android'?0:1;
		let db=uniCloud.database()
		db.collection('PatchManage').doc('79550af2600a410a006b1add689a041d').get().then(res=>{
			// console.log(res.result.data[0])
			this.checkJudge(res.result.data[0]);
		})
		// getPatchManage({device:staus}).then(res => {
		// 	console.log(res)
		// 	if(res.code ==  200) {
		// 		this.checkJudge(res.data);
		// 	} else {
		// 		Dialog({ message: res.msg });
		// 	}
		// })
	}
	/**
	 * 版本更新判断,若版本一致,则检查是否有补丁更新,若版本不一致,则进行大版本更新
	 * 
	 * @param {Object} data 版本更新信息
	 */
	checkJudge(data) {
		if(this.appCheckSystemType) { // 系统类型 "安卓"或者"苹果"
			// var appData = data[this.appCheckSystemType]; //获取当前系统的数据信息
			var appData = data; //获取当前系统的数据信息
			if(appData == null) {
				return;
			}
			this.checkWgtFun(appData);
		} else { //系统类型识别不了
			otherFun(data); // 手动下载
		}
	}
	/**
	 * 
	 * 补丁更新
	 * @param {Object} data	版本更新信息
	 */
	checkWgtFun(data) {
		let that = this;
		let appCheckAppVersionNum=0;
		let versionNum=0
		let power=1
		data.versionNum.split(".").forEach((val,index)=>{
			if(index==0){power=100}else if(index==1){power=10}else{power=1}
			versionNum+=parseInt(val)*power
		})
		that.appCheckAppVersion.split(".").forEach((val,index)=>{
			if(index==0){power=100}else if(index==1){power=10}else{power=1}
			// console.log(parseInt(val))
			appCheckAppVersionNum+=parseInt(val)*power
		})
		// console.log(appCheckAppVersionNum)
		// console.log(versionNum)
		
		if(appCheckAppVersionNum < versionNum) {
			// console.log(33)
			uni.showModal({
			    title: '版本更新',
			    content: '当前app版本号'+that.appCheckAppVersion+",发现新版本"+data.versionNum+","+data.remark+",是否升级",
					confirmText:"去升级",
			    success: function (res) {
			        if (res.confirm) {
			            that.downWgt(data.patchUrl);
			        } else if (res.cancel) {
			            console.log('用户点击取消');
			        }
			    }
			});
			// that.downWgt(data.patchUrl);
		}
	}
	/**
	 * 补丁下载，直接下载wgt文件
	 * @param {Object} wgtUrl	wgt文件补丁下载地址
	 */
	downWgt(wgtUrl) {
		let that = this;
		// console.log(wgtUrl)
		var downloader = plus.downloader.createDownload(wgtUrl, {}, function(d, status) {
			if(status == 200) {
				
				that.installWgt(d.filename); // 安装wgt包
			} else {
				plus.nativeUI.alert('补丁下载失败');
			}
		});
		downloader.start();
	}

	/**
	 * 补丁升级安装
	 * @param {Object} path wgt文件存放路径
	 */
	installWgt(path) {
		console.log(path)
		// plus.nativeUI.showWaiting('补丁升级中...');
		
		plus.runtime.install(path, {}, function() {
			console.log(123)
			plus.nativeUI.closeWaiting();
			console.log(3)
			plus.nativeUI.alert('补丁升级成功！', function() {
				plus.runtime.restart();
			});
		}, function(e) {
			plus.nativeUI.closeWaiting();
			console.log(e,'eeeeee')
			plus.nativeUI.alert('补丁升级失败');
		});
	}
}
