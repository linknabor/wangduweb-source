<template>
   <div class="reg">
       <div id="zzmb" class="zzmb" v-show="zzmb"></div>
       <div id="phoneAjax" class="hidden"  v-show="zzmb"> 
		     <img src="../../assets/img/c3d7f369-4a5e-4c4a-9fb9-a4b9d274c7e1.gif" style="width:40px;height40px;vertical-align: middle;"> 
	   </div>

       <div class="divider"></div>
            <div class="info-wrap">
                    <div class="input-wrap lite-divider">
                        <span class="fl fs15">用户名</span>
                        <input placeholder="请输入用户名" class="fr fs14 hidden-input pr15" v-model="user.name"/>
                    </div>
                    <div class="input-wrap lite-divider">
                        <span class="fl fs15">手机号</span>
                        <input type="tel" placeholder="请输入手机号码" class="fr fs14 hidden-input pr15" v-model="user.tel"/>
                    </div>
                   <div class="input-wrap lite-divider">
                        <input placeholder="输入验证码" class="fl fs14 hidden-input" style="padding-bottom: 15px;text-align: left;margin-bottom: 6px;" v-model="captcha"/>
                        <span class="fr btn-plain" style="margin-top: 10px;" :class="{useless:yzmstr!='获取验证码'&&yzmstr!='重新获取'}" @click="getCaptcha">{{yzmstr}}</span>
                   </div> 
                    <div style="width:100%;height:90px;clear:both">
                            &nbsp;
                    </div>
                    <div class="btn-fixed">
                            <div class="submit-btn ov fs16" @click="save">保存</div>
                    </div> 
		    </div>
   </div>
</template>

<script>
let vm;
import axios from 'axios';
export default {
   data () {
       return {
            omeFrom:"",
            user:{},
            yzmtime : 60,
            yzmstr:"获取验证码",
            captcha: '',
            zzmb:false,
            isClick: false,
            comeFrom:''
       };
   },
   created() {
       vm=this;
   },
   mounted() {
       vm.getUserInfo();
       vm.getComeFrom()
   },

   methods: {
        getUserInfo() {
            var n = "GET",
            a = "userInfo",
            i = null,
            e = function(n) {
                vm.user = n.result;
                if(vm.common.hasRegister()) {
                    vm.$router.push({path:'/'})
                }
            },
            r = function() {};
            vm.common.invokeApi(n, a, i, null, e, r)
        },
        getCaptcha() {
            var reg = /^1[3-9][0-9]\d{8}$/;
            if(!reg.test(vm.user.tel)) {
                alert('请输入正确的手机号')
                return
            }
            if(vm.yzmstr=="获取验证码"||vm.yzmstr=="重新获取"){
	       		vm.yzmstr="获取中";
	       		vm.yzmreq();
	       	}
        },
        yzmreq() {
            vm.receiveData.postData(vm,'getyzm',{mobile:vm.user.tel},'res',function(){
                vm.yzmtime=60;
                var tt=setInterval(function() {
                    vm.yzmstr=vm.yzmtime+'秒后重新获取';
                    vm.yzmtime--;
                    if(vm.yzmtime<=0) {
                        vm.yzmstr='重新获取'
                    }
                },1000);
                var ss = setTimeout(function(){clearInterval(tt);}, 61*1000);
                if(!vm.res.success) {
                    alert("验证码已下发，请查收短信");
                    vm.yzmtime = 60;
                    vm.yzmstr="重新获取";
                }
                });
        },
        //保存
        save() {
            if(!(/^1[3-9][0-9]\d{4,8}$/.test(vm.user.tel))) {
        		alert("请填写正确的手机号！");
        		return;
        	}
        	if(vm.captcha=='') {
    			alert('请输入验证码！');
    			return;
            }
            vm. zzmb=true;
            if(vm.isClick == true) {
                alert('请勿重复提交')
            }
            vm.isClick=true;
            vm.simpleRegister();
        },
        simpleRegister() {
             vm.receiveData.postData(vm,'simpleRegister',{mobile:vm.user.tel,name:vm.user.name,yzm:vm.captcha},'res',function(){
                if(vm.res.success) {
                        vm.common.updateUserStatus(vm.res.result);
                            var forwardPage = "";
                            if(vm.comeFrom){
                                forwardPage = vm.comeFrom;
                            } else {
                                forwardPage =vm.basePageUrl+"wuye/index.html";
                            }
                            alert("注册成功。");
                            location.href = forwardPage;
                }else {
                     vm.zzmb=false;
                    vm.isClick=false;
                       alert(vm.res.message==null?"验证码不正确或信息保存失败，请重试！":vm.res.message)
                }
                });
        },
         getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r != null) return unescape(r[2]); return ""; //返回参数值
        },
         getComeFrom(){
                vm.comeFrom=vm.getUrlParam("comeFrom") || vm.$route.query.comeFrom ;
            }
   },

}
</script>

<style  scoped>
.reg {
    background-color: #fffff8;
    padding-bottom: 1px;
    height:100%;
}
.zzmb {
    z-index: 100000;
    position: fixed;
    top: 0;
    left: 0;
    -moz-opacity: 0.65;
    opacity: 0.65;
    filter: alpha(opacity=65);
    background: #000;
    width: 100%;
    height: 100%;
    display: block;
}
#phoneAjax {
    position: fixed;
    top: 20%;
    left: 50%;
    width: 60px;
    height: 60px;
    line-height: 60px;
    margin-left: -30px;
    text-align: center;
    background-color: black;
    -moz-opacity: .8;
    opacity: .80;
    filter: alpha(opacity=80);
    z-index: 1998;
    overflow: auto;
    -moz-border-radius: 15px;
    -webkit-border-radius: 15px;
}
.info-wrap {
    padding: 4px;
    border-bottom: 5px solid #f9f9e9;
    font-size: 12px;
    color: #3b3937;
}
.input-wrap {
    overflow: hidden;
    line-height: 45px;
}
 .lite-divider {
    border-bottom: 1px solid #d4cfc8;
    padding-left: 15px;
}
.fs15 {
    font-size: 15px;
}
.hidden-input {
    height: 20px;
    margin-top: 12px;
    border: none;
    outline: none;
    background-color: transparent;
    text-align: right;
}
.fs14 {
    font-size: 14px;
}
.pr15 {
    padding-right: 15px;
}
.btn-plain {
    display: inline-block;
    padding: 0 20px;
    height: 27px;
    line-height: 27px;
    color: #3b3937;
    border-radius: 3px;
    border: 1px solid #bfbfbf;
}
.btn-fixed {
    position:fixed;
    color: #fff;
    left: 3%;
    right: 3%;
    bottom: 10px;
}
.submit-btn {
    height: 44px;
    line-height: 44px;
    background: #d01120;
    text-align: center;
}
.fs16 {
    font-size: 16px;
}
.ov {
    overflow: hidden;
    padding: 1px;
}
.useless {
	  background-color: #D7D5D4;
}

</style>