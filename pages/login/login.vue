<template>
  <view class="content">
    <view class="header">
      <image src="../../static/shilu-login/133.png"></image>
    </view>
    <view class="list">
      <view class="list-call">
        <image class="img" src="/static/shilu-login/1.png"></image>
        <input class="sl-input" v-model="phone"  maxlength="11" placeholder="输入手机号" />
      </view>
      <view class="list-call">
        <image class="img" src="/static/shilu-login/2.png"></image>
        <input class="sl-input" v-model="password" type="text" maxlength="32" placeholder="输入密码" password="true" />
      </view>
    </view>

    <view class="button-login" hover-class="button-hover" @tap="login()">
      <text>登录</text>
    </view>

    <view class="agreenment">
      <navigator url="forgetPW" open-type="navigate">忘记密码</navigator>
      <text>|</text>
      <navigator url="register" open-type="navigate">注册账户</navigator>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        phone: 'admin',
        password: '123456'
      };
    },
    methods: {
      login() {
				uniCloud.callFunction({
					name:"userLogin",
					data:{
						account:this.phone,
						password:this.password
					}
				}).then(res=>{
					if(res.result.code==200){
						let userInfo={}
						// console.log(res.result)
						userInfo.userName=res.result.userName;
						userInfo.role=res.result.role;
						userInfo.account=res.result.account;
						userInfo.sex=res.result.sex;
						userInfo.headPortrait=res.result.headPortrait;
						userInfo.signature=res.result.signature;
						userInfo.accountId=res.result.accountId;
						uni.setStorageSync("userInfo",userInfo)
						uni.switchTab({
							url:"/pages/index/index"
						})
					}else{
						this.toast(res.result.msg)
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
		padding-top: 250rpx;
  }

  .header {
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

  .agreenment {
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

  .agreenment text {
    font-size: 24rpx;
    margin-left: 15rpx;
    margin-right: 15rpx;
  }
</style>
