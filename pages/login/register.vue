<template>
  <view class="content">
    <view class="header">
      <image src="../../static/shilu-login/133.png"></image>
    </view>
    <view class="list">
      <view class="list-call">
        <image class="img" src="/static/shilu-login/1.png"></image>
        <input class="sl-input" v-model="phone" type="number" maxlength="11" placeholder="手机号" />
      </view>
      <view class="list-call">
        <image class="img" src="/static/shilu-login/2.png"></image>
        <input class="sl-input" v-model="password" type="text" maxlength="32" placeholder="登录密码" :password="!showPassword" />
        <image class="img" :src="showPassword?'/static/shilu-login/op.png':'/static/shilu-login/cl.png'" @tap="display"></image>
      </view>
			<view class="list-call">
			  <image class="img" src="/static/shilu-login/2.png"></image>
			  <input class="sl-input" v-model="passwordAgain" type="text" maxlength="32" placeholder="再次输入密码" :password="!showPasswordAgain" />
			  <image class="img" :src="showPasswordAgain?'/static/shilu-login/op.png':'/static/shilu-login/cl.png'" @tap="display('again')"></image>
			</view>
    </view>
    <view class="button-login" hover-class="button-hover" @tap="register">
      <text>确定注册</text>
    </view>
  </view>
</template>

<script>
  var _this, js;
  export default {
    onLoad() {
      _this = this;
    },
    data() {
      return {
        phone: '',
        password: '',
        showPassword: false,
				showPasswordAgain:false,
				passwordAgain:''
      };
    },
    methods: {
      display(type) {
        if(type=="again"){
        	this.showPasswordAgain=!this.showPasswordAgain
        }else{
        	this.showPassword = !this.showPassword
        }
      },
      register() {
        if (this.phone.length != 11) {
          uni.showToast({
            icon: 'none',
            title: '手机号不正确'
          });
          return;
        }
        if (this.password.length < 6) {
          uni.showToast({
            icon: 'none',
            title: '密码长度至少为六位'
          });
          return;
        }
					
				if(this.passwordAgain!=this.password){
					uni.showToast({
					  icon: 'none',
					  title: '两次密码输入不一致'
					});
					return;
				}
				uniCloud.callFunction({
					name:"register",
					data:{
						account:this.phone,
						password:this.password
					}
				}).then(res=>{
					if(res.result=="注册成功"){
						this.toast("注册成功")
						let self=this
						setTimeout(()=>{
							uni.navigateTo({
								url:"/pages/login/login",
							})
						},2000)
						// uni.navigateTo({
						// 	url:"/pages/login/login",
						// })
					}else{
						this.toast("注册失败，该账号已存在")
					}
					
					console.log(res)
				})
      }
    }
  }
</script>

<style>
  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

.header {
		margin-top: 130rpx;
    margin-left: auto;
    margin-right: auto;
  }

  .header image {
    width: 406rpx;
    height: 300rpx;
    /* border-radius: 50%; */
  }

  .list {
    display: flex;
    flex-direction: column;
    /* padding-top: 50rpx; */
    padding-left: 70rpx;
    padding-right: 70rpx;
  }

  .list-call {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 100rpx;
    color: #333333;
    border-bottom: 0.5px solid #e2e2e2;
  }

  .list-call .img {
    width: 40rpx;
    height: 40rpx;
  }

  .list-call .sl-input {
    flex: 1;
    text-align: left;
    font-size: 32rpx;
    margin-left: 16rpx;
  }

  .yzm {
    color: #FF7D13;
    font-size: 24rpx;
    line-height: 64rpx;
    padding-left: 10rpx;
    padding-right: 10rpx;
    width: auto;
    height: 64rpx;
    border: 1rpx solid #FFA800;
    border-radius: 50rpx;
  }

  .yzms {
    color: #999999 !important;
    border: 1rpx solid #999999;
  }

  .button-login {
    color: #FFFFFF;
    font-size: 34rpx;
    width: 470rpx;
    height: 100rpx;
    line-height: 100rpx;
    background: linear-gradient(-90deg, rgba(63, 205, 235, 1), rgba(188, 226, 158, 1));
    box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(164, 217, 228, 0.2);
    border-radius: 50rpx;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    margin-top: 100rpx;
  }

  .button-hover {
    background: linear-gradient(-90deg, rgba(63, 205, 235, 0.8), rgba(188, 226, 158, 0.8));
  }

  .agreement {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 30rpx;
    margin-top: 80rpx;
    color: #FFA800;
    text-align: center;
    height: 40rpx;
    line-height: 40rpx;
  }

  .agreement image {
    width: 40rpx;
    height: 40rpx;
  }
</style>
