<template>
   <div class="success">
        <div class="brand-tip highlight" style="padding-left: 35%">支付成功！</div>

        <div class="top-info lite-divider">
		    <div id="content" class="item">
               
		    </div>
        </div>

        <div class="top-info lite-divider">
            <div class="item">
                <label>房屋地址</label><span class="value">{{payAddr}}</span>
            </div>
            <div class="item">
                <label>支付金额</label><span class="value">¥&nbsp;{{totalPrice}}</span>
            </div>
	    </div>

        	<div style="height: 4rem;"></div>
            <div class="main_btn">
                <div class="sub_btn1">
                    <div class="btn" @click="viewAnnoucement">领取礼包</div>
                </div>
                <div class="sub_btn2">
                    <div class="btn" @click="goback">返回</div>
                </div>
            </div>
	
   </div>
</template>

<script>
let vm;
import cookie from 'js-cookie';
import { Base64 } from 'js-base64';
export default {
   data () {
       return {
           totalPrice:Base64.decode(this.$route.query.totalPrice),
           state:Base64.decode(this.$route.query.state),
           payAddr: Base64.decode(this.$route.query.payAddr),
           tel:cookie.get('tel')
       };
   },
   created() { vm=this},
   mounted() {
       this.common.checkRegisterStatus();
   },

   components: {},

   methods: {
       viewAnnoucement() {
        if(vm.state ==  vm.tel ) {
              var url="http://wuye.gm4life.cn/wangdu/wechat/hexie/wechat/getOutsidCoupon";
           this.axios.post(url,{}).then(
            function (add) {
                // console.log(add)
                var res=JSON.parse(add.data)
                console.log(res)
                if(res.code== '-6') {
                    alert(res.message)
                }else if(res.code == '1') {
                    window.location.href="http://"+res.url;
                }else {
                    alert(res.message)
                }
            }
           ).catch(
               function(err) {
                   console.log(err)
               }
           )
        }else {
             location.href="http://wuye.gm4life.cn/wangdu/weixin/wuye/index.html?state=123#/";
        }

        
         
       },
       goback() {
           location.href="http://wuye.gm4life.cn/wangdu/weixin/wuye/index.html?state=123#/";
       }

   },

   computed: {},
}
</script>

<style  scoped>
.success {
    font-family: "微软雅黑";
    background: #ffffff;
}
.brand-tip {
  padding: 30px 0;
    padding-left: 145px;
    font-size: 30px;
    background: url("../assets/images/icon_selected.png") no-repeat;
    background-position: 35px center;
    background-size: 35px;  
}
.highlight {
    color: #D01120;   
}
.top-info {
   padding-top: 20px;
    padding-bottom: 5px;
    margin: 0 10px; 
}
.lite-divider {
    border-bottom: 1px solid #d4cfc8;
    padding-left: 15px;
}
.item {
    overflow: hidden;
    margin-bottom: 15px;
    font-size: 13px;
    color: #666;
    /* margin-top: 5px; */
}
label {
    display: inline-block;
    width: 60px;
    margin-top: 3px;
}
label:after {
    content: " :";
}
.value {
    float: right;
    display: block;
    margin-left: 15px;
    color: #a6937c;
    width:70%;
    margin-top: 3px;
}
.btn {
		    display: block;
		    margin: 10px;
		    height: 44px;
		    line-height: 44px;
		    color: #fff!important;
		    font-size: 15px;
		    text-align: center;
		    background-color: #D01120;
		    border-radius: 3px;
		    outline: none;
		    border: none;
		    text-decoration: none;
		}
		
		.main_btn{
		
			width: 100%;
			height: 60px;
		}
		
		.sub_btn1{
			
			float: left;
			width: 46%;
			margin-left: 4%
		}
		
		.sub_btn2{
			
			float: left;
			width: 46%;
			margin-right: 4%
		}
		
</style>