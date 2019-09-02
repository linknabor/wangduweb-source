<template>
   <div>
       <div class="lite-divider" style="margin-top:35px;margin-left:15px;margin-right:15px;">
            <input placeholder="请输入账单号" class="hidden-input" style="text-align:left;" v-model="number">
            <div class="scan-icon" @click="show"></div>
        </div>
        <mt-button class="subBtn" size="large" @click.native="submit">提交</mt-button>
   </div>
</template>

<script>
let  vm;
import wx from 'weixin-js-sdk';
import { MessageBox } from 'mint-ui';
export default {
   data () {
       return {
           number:''
       };
   },
   created() {
       vm=this;
   },
   mounted() {
	   this.common.checkRegisterStatus();
     let url = location.href.split('#')[0];
    	  vm.receiveData.wxconfig(vm,wx,['scanQRCode'],url);
  	 },

   components: {},

   methods: {
       //扫码
       show() {
          vm.receiveData.scan(vm,wx,'number') 
       },
       //提交
       submit() {
           var reg = /^\d{18}$/
			if(reg.test(this.number)){//为数字即通过
				vm.addtian();
	  	 	}else{
	  	 		MessageBox.alert('请输入正确账单号');
	  	 	}
	   },
	   addtian() {
			let url = '/hexiehouse?stmtId='+ vm.number;
			vm.receiveData.getData(vm,url,'response',function(){
				if(vm.response.success) {
					if(vm.response.result== null) {
						alert('未查询到该房屋')
					}else {
						vm.$router.push('/bindhouse/' + vm.number);
					}
				}else {
					alert(vm.response.message ==null?'未查询到该房屋':vm.response.message)
				}
				
			})
       	}
	   
   },

   computed: {},
}
</script>

<style  scoped>
	.lite-divider{
		border-bottom: 1px solid #d4cfc8;
		padding-left: 0.15rem;
		overflow: hidden;
		padding: 1px;
	}
	.hidden-input{
		height: 0.4rem;
		margin-top: 0.4rem;
		width: 4rem;
		-background: black;
		border: none;
		outline: none;
		background-color: transparent;
		font-size: 0.28rem;
		padding: 0 0.15rem 0.15rem;
	}

	.scan-icon{
		float: right;
		display: inline-block;
		height: 0.4rem;
		width: 0.4rem;
		background: url('../../assets/wuye/icon_scan.png') no-repeat center ;
		background-size: cover;
		margin-top: 10px;
	}
	.subBtn{
		height: 0.88rem;
		line-height: 0.88rem;
		background-color: #d01120;
		font-size: 0.3rem;
		color: white;
		width: 6.9rem;
		margin: 0.6rem auto 0;
	}
</style>