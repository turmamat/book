<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview/index.scss";
</style>
<script>
	import { javaHb } from "@/utils.js";
	export default {
		mounted: function () {
			// #ifdef APP-PLUS
			setTimeout(() => {
							 try {
								 javaHb.plusReady();
							 } catch (error) {console.log(error)}
			}, 3000);
			// #endif
			 
		 },
		onLaunch: function() {
			// console.log('App Launch')
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	page{
		background: #f7f7f7;
	}
</style>
