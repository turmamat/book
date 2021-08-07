import Vue from 'vue'
import App from './App'
import uView from "uview"
//消息提示
Vue.prototype.toast = (msg)=>{
	uni.showToast({
	    title: msg,
	    duration: 2000,
			icon:"none"
	});
};
Vue.use(uView)
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
