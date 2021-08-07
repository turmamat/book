<template>
  <view class="content">
    <view class="list">
      <view class="tishi">若您忘记了密码，可在此重新设置新密码。</view>
      <view class="list-call">
        <image class="img" src="/static/shilu-login/1.png"></image>
        <input class="sl-input" type="number" v-model="phone" maxlength="11" placeholder="请输入手机号" />
      </view>
      <view class="list-call">
        <image class="img" src="/static/shilu-login/2.png"></image>
        <input class="sl-input" type="text" v-model="password" maxlength="32" placeholder="请输入新密码" :password="!showPassword" />
        <image class="img" :src="showPassword?'/static/shilu-login/op.png':'/static/shilu-login/cl.png'" @tap="display"></image>
      </view>
			<view class="list-call">
			  <image class="img" src="/static/shilu-login/2.png"></image>
			  <input class="sl-input" type="text" v-model="passwordAgain" maxlength="32" placeholder="请重新输入一遍新密码" :password="!showPasswordAgain" />
			  <image class="img" :src="showPasswordAgain?'/static/shilu-login/op.png':'/static/shilu-login/cl.png'" @tap="display('again')"></image>
			</view>
    </view>
    <view class="button-login" hover-class="button-hover" @tap="changePassword()">
      <text>修改密码</text>
    </view>

  </view>
</template>

<script>
  var _this, js;
  export default {
    data() {
      return {
        phone: '',
        showPassword: false,
				showPasswordAgain:false,
        password: '',
				passwordAgain:''
      }
    },
    onLoad() {
      _this = this;
    },
    computed: {
    },
    onUnload() {
      this.clear()
    },
    methods: {
      display(type) {
				if(type=="again"){
					this.showPasswordAgain=!this.showPasswordAgain
				}else{
					this.showPassword = !this.showPassword
				}
        
      },
      clear(){
      },
			changePassword(){
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
					name:"changeUserInfo",
					data:{
						account:this.phone,
						password:this.password
					}
				}).then(res=>{
					console.log(res)
					if(res.result.msg=="新旧密码一致，请重新修改密码"){
						this.toast("新旧密码一致，请重新修改密码")
					}else if(res.result.msg=="该用户不存在"){
						this.toast("该用户不存在")
					}else{
						this.toast("修改密码成功")
					}
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

  .tishi {
    color: #999999;
    font-size: 28rpx;
    line-height: 50rpx;
    margin-bottom: 50rpx;
  }

  .list {
    display: flex;
    flex-direction: column;
    padding-top: 50rpx;
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

  .button-login {
    color: #FFFFFF;
    font-size: 34rpx;
    width: 470rpx;
    height: 100rpx;
    background: linear-gradient(-90deg, rgba(63, 205, 235, 1), rgba(188, 226, 158, 1));
    box-shadow: 0rpx 0rpx 13rpx 0rpx rgba(164, 217, 228, 0.2);
    border-radius: 50rpx;
    line-height: 100rpx;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
    margin-top: 100rpx;
  }

  .button-hover {
    background: linear-gradient(-90deg, rgba(63, 205, 235, 0.8), rgba(188, 226, 158, 0.8));
  }

  .yzm {
    color: #FF7D13;
    font-size: 24rpx;
    line-height: 64rpx;
    padding-left: 10rpx;
    padding-right: 10rpx;
    width: auto;
    height: 64rpx;
    border: 1rpx solid rgba(255, 131, 30, 1);
    border-radius: 50rpx;
  }

  .yzms {
    color: #999999 !important;
    border: 1rpx solid #999999;
  }
</style>
