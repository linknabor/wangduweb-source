<template>
   <div class="wuye">
         <swiper :options="swiperOption" ref="mySwiper">
            <swiper-slide>
                <div class="ban1">
                    <router-link to="/" >
                        <img src="http://img.gm4life.cn/1.jpg" alt="tt">
                    </router-link>                  
                </div> 
            </swiper-slide>
            <!-- <div class="swiper-pagination" slot="pagination"></div>        -->
        </swiper>
    <div class="jiugongge">
            <ul>
                <li class="jgg_li">
                    <router-link :to="{path:'/differpay',query:{'openid':this.openid}}" class="link">
                        <div class="jgg_img">
                            <img src="../../assets/img/wuye.png" alt="tt">
                        </div>
                        <span class="jgg-span">物业缴费</span>
                    </router-link>
                </li>
                  <li class="jgg_li" >    
                    <!-- <router-link to="/pay-stop" class="link"> -->
                    <div  class="link" @click="cart">
                        <div class="jgg_img">
                            <img src="../../assets/img/tc.png" alt="tt">
                        </div>
                        <span class="jgg-span">停车缴费</span>
                    </div> 
                    <!-- </router-link> -->
                </li>
                <li class="jgg_li" >
                     <router-link to="/Paymentquery" class="link">                     
                        <div class="jgg_img">
                            <img src="../../assets/img/jf.png" alt="tt">
                        </div>
                        <span class="jgg-span">缴费查询</span>
                     </router-link>
                </li>
                <!-- <li class="jgg_li" >
                    <router-link to="/myhouse" class="link">
                        <div class="jgg_img">
                            <img src="../../assets/wuye/wsyz1.png" alt="tt">
                        </div>
                        <span class="jgg-span">我是业主</span>
                    </router-link>
                </li> -->
                <li class="jgg_li" >
                    <router-link to="/vote" class="link">
                        <div class="jgg_img">
                            <img src="../../assets/img/zx.png" alt="tt">
                        </div>
                        <span class="jgg-span">征询投票</span>
                    </router-link>
                </li>
                <li class="jgg_li">
                     <div  class="link" @click="gotoThread">
                        <div class="jgg_img">
                            <img src="../../assets/img/wx.png" alt="tt">
                        </div>
                        <span class="jgg-span">便民维修</span>
                     </div>
                </li>
                <li class="jgg_li" >
                    <router-link :to="{path:'/mysteward',query:{category:'2'}}" class="link">
                        <div class="jgg_img">
                            <img src="../../assets/img/yj.png" alt="tt">
                        </div>
                        <span class="jgg-span">业主意见</span>
                    </router-link>
                </li>

            </ul>
    </div>
    <div style="width:100%;height:7px;"></div>
    <div class="inner">
        <div class="section3_notice">通知及公告</div>
        <div class="section3_divider"></div>
        <div class="tab">
        		<span class="notice-tab-title" v-for="(tab,index) in tabs" :class="{active:tab.active}" :key="index" @click="changeTab(index)">{{tab.name}}</span>
    	</div>
        <div v-show="tabs[0].active">
            <div class="section3_zixuns" v-for="zixun in zixuns1" @click="jumpToDetail(zixun.id)" :key="zixun.id">
					<div class="section3_sub_main_left">
                    <img class="section3_sub_img" :src="zixun.smallImage"/>
                    </div>
                   
					<div class="section3_sub_main_right">
						<div class="section3_sub_title">{{zixun.title}}</div>
						<div class="section3_sub_content">{{zixun.summary}}</div>
					</div>
			</div>
        </div>

         <div v-show="tabs[1].active">
            <div class="section3_zixuns" v-for="zixun in zixuns2" :key="zixun.id" @click="jumpToDetail(zixun.id)">
					<div class="section3_sub_main_left">
                    <img class="section3_sub_img" :src="zixun.smallImage"/>
                    </div>
					<div class="section3_sub_main_right">
						<div class="section3_sub_title">{{zixun.title}}</div>
						<div class="section3_sub_content">{{zixun.summary}}</div>
					</div>
			</div>
        </div>

         <div v-show="tabs[2].active">
            <div class="section3_zixuns" v-for="zixun in zixuns3" :key="zixun.id" @click="jumpToDetail(zixun.id)">
					<div class="section3_sub_main_left">
                    <img class="section3_sub_img" :src="zixun.smallImage"/>
                    </div>
					<div class="section3_sub_main_right">
						<div class="section3_sub_title">{{zixun.title}}</div>
						<div class="section3_sub_content">{{zixun.summary}}</div>
					</div>
			</div>
        </div>

    </div>     
     <div style="width:100%;height:60px;background:white;"></div>    
    <div class="zzmm" v-show="login">
         <img src="https://www.gm4life.cn/yueshop/template/wap/default/public/images/mask_load.gif" alt="">
    </div> 
   </div>
</template>

<script>
let vm;
import { MessageBox } from 'mint-ui';
import {swiper,swiperSlide} from 'vue-awesome-swiper'
export default {
    name:'index',
   data () {
       return {
            zixuns1:[],
            zixuns2:[],
            zixuns3:[],
            openid:'',
            login:true,
            userSectId:0,
              swiperOption:{
                notNextTick:true,
                autoplay:false,
                autoplay:false,
                // {
                //     disableOnInteraction:false,
                //     delay:20000000
                // },
                pagination: {
                el: '.swiper-pagination'
                },
                loop: false,
            },
            tabs: [
                    {
                        name: '物业公告',
                        active: true
                    },
                    {
                        name: '业委会公告',
                        active: false
                    },
                    {
                        name: '居委会公告',
                        active: false
                    }
                 ],          
       };
   },
     created(){
        vm = this;
    },
   mounted() {
    //    let url = '/initSession4Test/18079';
    //             vm.receiveData.getData(vm,url,'Data',function(){
    //         });
      
       let n = "GET",
        a = "userInfo",
        i = null,
        e = function(n) {
            if(n.success&&n.result==null) {
                vm.reLogin();
                return
            }
            vm.login=false;
            vm.userSectId = n.result.sect_id;
            vm.openid=n.result.openid;
          vm.message();
        },
        r = function() {   
            vm.login=false;  
            alert('获取用户信息失败')
        };
        this.common.invokeApi(n, a, i, null, e, r);
        this.common.initWechat(['onMenuShareTimeline','onMenuShareAppMessage']);
   },
   methods: {
        gotoThread() {
            if(vm.userSectId ==0 || vm.userSectId=='' || vm.userSectId==null)
        	{
        		alert("您暂未绑定房屋，请前往“我是业主”\r\n进行操作，感谢！");
        		// return;
        	}else {
             	vm.$router.push({path:'/maintain',query:{'category':'2'}})
            }
        },
        //停车
        cart() {
            MessageBox('该功能暂未开放','尽请期待!');
        },
        message:function () {
            var page = 0;
            let n = "GET",
                a = "messages/"+page,
                i = null,
                e = function(n){
                  //console.log(JSON.stringify(n));
                  vm.zixuns1 = n.result[0];
			      vm.zixuns2 = n.result[1];
                  vm.zixuns3 = n.result[2];
                  page++;
                },
                r = function(){
                };
            this.common.invokeApi(n,a,i,null,e,r);

      
        },
        
        //点击切换资讯
        changeTab(index) {
            for(var i=0; i<vm.tabs.length;i++) {
                vm.tabs[i].active = false;
            }
             vm.tabs[index].active = true;
        },
        jumpToDetail(mid) {
            if(mid==29){
    		   window.location.href="https://mp.weixin.qq.com/s/3N-yinJvq0jDJmh6fd6scw";
    	   }else if(mid==30){
    		   window.location.href="https://mp.weixin.qq.com/s/WTgWmG5lknKExBmOsughmQ";
    	   }else if(mid==31){
    		   window.location.href="https://mp.weixin.qq.com/s/-6gMOUi3vWJMRraOqtC2wQ";
		   }else if(mid==76){
			   window.location.href="http://mp.weixin.qq.com/s/LoJjEaaQ0xhi2wD7uuJVJQ";	
		   }else if(mid==78){
			   window.location.href="http://mp.weixin.qq.com/s/28gpc3gW7byK6k3kQHqX8A";
		   }else if(mid==79){
			   window.location.href="http://mp.weixin.qq.com/s/Em3EJ6lo4V8eITXpPcA3LQ";
		   }else if(mid==86){
			   window.location.href="http://m.eqxiu.com/s/kg2hoy34?from=singlemessage&isappinstalled=0";
		   }else if(mid==110){
			   window.location.href="http://mp.weixin.qq.com/s/4Ool8tH0lvij5PE8j14QMA";
		   }else if(mid==112){
			   window.location.href="http://mp.weixin.qq.com/s/gQGtpj_taPUXddQNh_EJWA";
		   }else if(mid==189){
			   window.location.href="http://mp.weixin.qq.com/s/8hjgD4eu7fhQHx8mKK9TRA";
		   }else if(mid==190){
			   window.location.href="http://mp.weixin.qq.com/s/L6OoaaJmRD72NHsUtRdqig";
       	   }else if(mid==197){
			   window.location.href="https://mp.weixin.qq.com/s/X34PcEoCP-GizVczTC73nA";
		   }else if(mid==198){
			   window.location.href="https://mp.weixin.qq.com/s/JEE5Yyx5ugzF8-WzrkVF4g";
		   }else if(mid==225){
			   window.location.href="https://mp.weixin.qq.com/s/f-N1W8U1Q3Py-vTC_TjR6Q";
		   }else{
    		   vm.$router.push({path:'/message',query:{'messageID':mid}})
    	   }
        },
       
   },
   components: {
        swiper,
        swiperSlide
   },



   computed: {},
}
</script>

<style  scoped>
.zzmm {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 999999;
    top: 0;
    left: 0;
    text-align: center;
}
.zzmm img {
    text-align: center;
    color: #000000;
    font-size: 50px;
    position: relative;
    top: 50%;
}
.wuye{font-family: PingFangSC-Regular;width: 100%;
height: 100%;
      background-color:#fff;font-size: 14px;text-align: center}
a{color: #000;}
.ban1{width: 100%;}
.ban1 img{width: 100%; opacity: 0.7}
.jiugongge{width: 100%;
height: 208px;
background-color: white;}
.jgg_li{float: left;width: 33%;height: 104px; text-align: center;letter-spacing: 1.31px;font-size: 16px;font-family:PingFangSC-Regular;}
.jgg_img{margin: 15px auto 3px;}
.jgg_img img{width: 54px;}
.jgg-span{color: black;}
.inner{width: 100%;
/* height: 350px; */
overflow: hidden; background-color: white;}
.inner1{width: 80%;height: 20px; margin:15px auto 15px;line-height: 20px;}
.spanl{font-size: 18px;letter-spacing: 1.38px;}
.spanr{font-size: 12px;letter-spacing: 1.12px;opacity: 0.5;color: #171717;padding-top: 3px;}
.title_li{width: 86%;height: 100px;overflow: hidden;margin: 0 auto;}
.title_li div{float: left;}
.title_img{width: 30%;height:85px;}
.title_img img{width: 100%;height:100%;margin:auto;}
.title_news{font-size: 14px; width: 70%;height: 85px; text-align: left;}
.title_news span{padding: 0 20px;color: black;}
.xiaxian{height:1px;width:100%;background-color:#ccc; margin-top: 7px;}

h6{text-align: right; padding: 0 15px;font-size: 11px;color:rgba(0,0,0,0.63);letter-spacing: 0.9px;}
/* 资讯 */
.section3_notice{
        	margin: 15px 0px 15px 4%;
            font-size: 15px;
            color: #000000;
            text-align: left
        }
.section3_divider{
        	border-bottom: 1px solid #e5e2dd;
        }    
.notice-tab-title {
    display: inline-block;
    width: 33%;
    color: #a6937c;
    font-size: 12px;
    text-align: center;
    padding: 15px 0;
    border-bottom: 1px solid #d4cfc8;
}   
.notice-tab-title.active {
    color: #47B3FF;
    border-color: #47B3FF;
}     
 .section3_zixuns{
            /* padding: 10px 0px 10px 4%; */
            height: 105px;
            border-bottom: 1px solid #d4cfc8;
        }
.section3_sub_main_left{
            height: 105px;
            float: left;
        }
        
.section3_sub_main_right{
            height: 105px;
            float: left;
            width: 60%;
            margin-left: 6%;
            text-align:left;
        }  
.section3_sub_img{
            width: 100px;
            height: 75px;
            margin: 15px 0px 15px 0px;
            float: left;
        }
 .section3_sub_title{
        
            /* height: 16px; */
            margin: 16px 0px 0px 0px;
            font-size: 15px;
            color: #000000;
            letter-spacing: 1.14px;
            line-height: 20px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
             /*! autoprefixer: off */
            -webkit-box-orient: vertical;
            /* autoprefixer: on */
            overflow: hidden;   
        }
.section3_sub_content{    
            /* height: 59px; */
            margin: 5px 0px 0px 0px;
            font-size: 13px;
            color: #a1a1a1;
            line-height: 20px;
            letter-spacing: 1.14px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
             /*! autoprefixer: off */
            -webkit-box-orient: vertical;
            /* autoprefixer: on */
            overflow: hidden;
        }        
</style>