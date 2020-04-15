<template>
   <div id="word">
        <!-- load -->
        <div class="load6" id="LoadingBar" v-show="zshow">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
        <div id="fade" class="black_overlay" v-show="zshow">
        </div>
        <div id="phoneErro" v-show="duo">没有更多啦</div>
	    <!-- load -->
        <div id="zzmb" class="zzmb" style="display:none;position:fixed;" @click="hideImg"></div>
        <div id="divconf" class="divconf" style="display:block; position:fixed; z-index: 2147483647;" @click="hideImg"></div>
        <div class="category lite-divider">
            <div class="category_main">
                <div class="category_sub_main fl">
                    <router-link :to="{path:'/mysteward',query:{category:'2'}}" class="categorya">
                        <img class="category_img" src="../../assets/wuye/img_repair_60x60.png" v-show="category!=2"/>
                        <img class="category_img_hide" src="../../assets/wuye/03.png" v-show="category==2"/>
                        <div class="category_txt">报修</div>
                    </router-link>
                </div>

                <div class="category_sub_main fl">
                    <router-link :to="{path:'/mysteward',query:{category:'0'}}" class="categorya">
                        <img class="category_img" src="../../assets/wuye/img_education_60x60.png" v-show="category!=0"/>
                        <img class="category_img_hide" src="../../assets/wuye/01.png" v-show="category==0"/>
                        <div class="category_txt">服务需求</div>
                    </router-link>
                </div>

                <div class="category_sub_main fl">
                    <router-link :to="{path:'/mysteward',query:{category:'1'}}" class="categorya">
                        <img class="category_img" src="../../assets/wuye/img_education_60x60.png" v-show="category!=1"/>
                        <img class="category_img_hide" src="../../assets/wuye/02.png" v-show="category==1"/>
                        <div class="category_txt">意见建议</div>
                    </router-link>
                </div>
            </div>
        </div>

        <div v-show="threads_count==0">
		    <img class="adimg" src="../../assets/wuye/bg_publish.jpg"/>
	    </div>

        <!-- 评论  -->
        <div class=" p15 " style="border-bottom: 2px solid #d4cfc8;"  v-for="thread in threads">
                <div class="ov" style="width: 100%;">
                    <div><img class="fl thread-picture" :src="thread.userHead" /></div>
                    <div class="thread_user_name">{{thread.userName}}</div>
                    <div class="thread_user_addr">{{thread.userSectName}}</div>
                </div>
             <div class="ov pt15 pb15 fs13" style="color: #3b3937" @click="gotoDetail(thread.threadId)">{{thread.threadContent}}</div>   
            <!-- 图片 -->
            <div class="preview_img_layer" >
                <div v-for="(previewurl,index) in thread.previewLink">
                    <div class="sub_img_layer" @click="viewSrcImg(thread.threadId, index);" >
                        <img class="preview_img" :src="previewurl" />
                    </div>
                </div>
		    </div>

            <div class="fs13" style="color: #a6937c; line-height: 23px; width: 100%;">
                <img style="width: 13px; height: 13px;" src="../../assets/wuye/icon_time_gray.png"/>&nbsp;{{thread.formattedDateTime}}
                <div class="fr pr15 comment" style="text-align: right;" @click="gotoDetail(thread.threadId)" >
                    <img style="width: 13px; height: 13px;" src="../../assets/wuye/icon_comment_gray.png"/>&nbsp;{{thread.commentsCount}}
                </div>
            </div>
        </div>
        <div style="width: 100%; height: 35px;">&nbsp;</div>

        <div style="position: fixed; bottom:0.5px; width: 100%; color: white;" >
            <div class="submit-btn-black fs14 fl" @click="gotoindex" style="width: 25%">返回</div>
            <div class="submit-btn-orange2 fs14 fl" @click="publicnew" style="width: 73%">我要发布</div>
	    </div>
   </div>
</template>

<script>
let vm;
let isloadPage=false;
export default {
   data () {
       return {
           category:this.$route.query.category,
           threads_count:0,
           threads:[],//评论数据
           userSectId:0,
           zshow:true,
           duo:false,
           page:0,
       };
   },
   created() {
       vm=this;
   },
   mounted() {
        // 请求接口获取 后台返回的 微信配置项
        vm.common.checkRegisterStatus();
       vm.getThreadList();
       vm.getOpenid();
       window.addEventListener('scroll',vm.getscroll);

   },
   watch:{
        '$route' () {
            this.category=this.$route.query.category
            vm.getThreadList();
           
        }
    },

   methods: {
        getOpenid(){//有openid保存没有连接新值覆盖
            // console.log(vm.$route.query.openId)
           if(vm.$route.query.openId) {
                // console.log(window.localStorage.getItem('extraOpenId'))
               if(window.localStorage.getItem('extraOpenId')) {
                    window.localStorage.setItem('extraOpenId', vm.$route.query.openId);
               }else {
                    window.localStorage.setItem('extraOpenId', vm.$route.query.openId);
               }
           }
       }, 
       //初始数据
       getThreadList() {
           vm.page=0;
           let  filter='n';
           let url="thread/getThreadList/n/0";
           vm.receiveData.postData( vm, url,
           {
               'threadCategory' :vm.category,
               'filter':filter
           },
            'hehe',
            function(){
                if(vm.hehe.success) {
                    vm.zshow=false;
                    // vm.threads = vm.hehe.result;
                    vm.threads = vm.hehe.result[0];
                    vm.userSectId = vm.hehe.result[1];
                    vm.threads_count = vm.hehe.result[0].length;
                }else {
                    alert("加载消息失败！");
                     vm.zshow=false;
                }
               vm.page++;
            })
       },
       getscroll() {
            var st = $(window).scrollTop();
            var ad=window.innerHeight
            var hd=$('#word').height();
            if( st+ad >=hd && !isloadPage) {
                isloadPage=true;
              vm.loadNextPage();
            }
       },
       loadNextPage() {
           let filter='n';
           let url="thread/getThreadList/"+filter+"/"+vm.page;
           vm.receiveData.postData( vm, url,
            {
                threadCategory :vm.category,
			    filter : filter
            },
            'data',
            function(){
                // vm.data.result[0].length
                if(vm.data.result[0].length ==0) {
                    vm.duo=true;
                    setTimeout(() => {
                         vm.duo=false;
                    }, 1000);
                }else { 
                    // vm.data.result[0]
                   vm.threads= vm.threads.concat(vm.data.result[0]);
                   vm.userSectId = vm.data.result[1];
                    isloadPage = false;
                }
                vm.page++; 
            })
       },

       //点击图片
       viewSrcImg(threadId, index) {
           vm.refreshImages(threadId, index)
       },
       //图片
        refreshImages(threadId, index) {
            let url="thread/getImgDetail/"+threadId+"/"+index;
            vm.receiveData.getData(vm,url,'data',function(){
                var map = vm.data.result;
                var url = map.imgUrl;
                var width = map.width;
                var height = map.height;
                
                var srcWidth = 0;
                var srcHeight = 0;

                if(""!=width&&"undefined"!=width){
				    srcWidth = parseInt(width);
                }else{
                    alert("请检查图片是否上传成功。");
                }
                if(""!=height&&"undefined"!=height){
				    srcHeight = parseInt(height);
                }else{
                    alert("请检查图片是否上传成功。");
                }
                var html = "<div id=\"imgDetail\" style=\"align:center\"><img src=\""+url+"\"/></div>";
                $("#zzmb").show("slow");
                
                $("#divconf").html(html);
                $("#divconf").show("slow");
                
                if($(window).height()>$(document).height()){
        		    $(".zzmb").height($(window).height());
                }else{
                    $(".zzmb").height($(document).height());
                }

                var screenHeight = $(window).height();
                var screenWidth = $(window).width();
                
                var adjHeight = 0;	//缩放调整后图片高度
                var adjWidth = 0;	//缩放调整后图片宽度
                
                var top = 0;
                var hasLeft = false;

                /*
        	 * 图片展示一共三种情况
        	 * 1.横图，即图片宽度>图片高度，则宽度取100%，高度等比缩放
        	 * 2.纵图，即图片宽度<=图片高度，这其中又分2种情况
        	 * 1)图片横向宽度撑满后（即宽取屏幕宽度），高度等比缩放后>屏幕高度的
        	 * 2)图片横向宽度撑满后，高度等比缩放后<=屏幕高度的
        	 */

              //情况1，横图
        	if(srcWidth>srcHeight){
        		if(srcWidth>screenWidth){
        			adjHeight = screenWidth/srcWidth*srcHeight;
        			adjWidth = screenWidth;
        		}else{
        			hasLeft = true;
        			adjHeight = srcHeight;
        			adjWidth = srcWidth;
        		}
        	}else if(srcWidth<=srcHeight){
        		if(srcWidth>screenWidth){
        			adjHeight = screenWidth/srcWidth*srcHeight;
        			if(adjHeight>screenHeight){
        				adjWidth = screenHeight/srcHeight*srcWidth;
        				adjHeight = screenHeight
        			}else{
        				adjWidth = screenWidth;
        			}
        		}else{
        			if(srcHeight>screenHeight){
        				adjWidth = screenHeight/srcHeight*srcWidth;
        				adjHeight = screenHeight
        			}
        		}
            }
            
            var top = screenHeight/2 - adjHeight/2;
        	var left = 0;
        	if(hasLeft){
        		left = screenWidth/2 - adjWidth/2;
        	}

        	$("#divconf").css("top", top);
        	$("#divconf").css("left", left);
			
			})
        },
        hideImg: function(){
        	
        	$("#zzmb").hide("slow");
        	$("#divconf").hide("slow");
        },
        //点击跳转
        gotoDetail(threadId) {
            this.$router.push({path:'/threadDetail',query:{'threadId':threadId}})
        },
        //点击返回
        gotoindex() {
            // location.href='https://test.e-shequ.com/guangming/weixin/wuye/index.html?v=20160229#/';
             this.$router.push({path:'/'})
        },
        //点击发布
        publicnew() {
            if(vm.userSectId == 0 || vm.userSectId=='' || vm.userSectId==null)
        	{
        		alert("您暂未绑定房屋，请前往“我是业主”\r\n进行操作，感谢！");
        		return;
        	}else
        	{
               this.$router.push({path:'/maintain',query:{'category':vm.$route.query.category}})
        	}
        }
   },

   computed: {},
}
</script>

<style  scoped>
.load6 {
    margin: 100px auto 0;
    width: 150px;
    top: 25%;
    left: 25%;
    width: 50%;
    text-align: center;
    position: fixed;
    z-index: 1002;
    overflow: auto;
}

.load6>div {
    width: 30px;
    height: 30px;
    background-color: #FF8A00;
    border-radius: 100%;
    display: inline-block;
    -webkit-animation: bouncedelay 1.4s infinite ease-in-out;
    animation: bouncedelay 1.4s infinite ease-in-out;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
}
.load6 .bounce1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
}
.load6 .bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
}
@-webkit-keyframes bouncedelay{
    0%,80%,100%{-webkit-transform:scale(0.0)}
    40%{-webkit-transform:scale(1.0)}}
@keyframes bouncedelay{
    0%,80%,100%{transform:scale(0.0);-webkit-transform:scale(0.0)}
    40%{transform:scale(1.0);-webkit-transform:scale(1.0)}}

.black_overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    z-index: 1001;
    -moz-opacity: .8;
    opacity: .80;
    filter: alpha(opacity=80);
}
.zzmb {
    z-index: 100000;
    position: absolute;
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

/* 三个导航 */
.category{
    background-color: #f7f7f1;
    height: 90px;
    overflow-x: hidden;
}
.lite-divider {
    border-bottom: 1px solid #d4cfc8;
}
.category_main{
    width: 96%;
    margin: 0px 0% 0px 4%;
    overflow-x: hidden;
}
.category_sub_main{
    margin: 15px 0% 15px 7%;
    text-align: center;
    width: 22%
}

.category_img{
	     	width: 50%;
	     	height: 30px;
    	}
.category_img_hide{
	     	width: 50%;
	     	height: 30px;
    	}
.category_txt{
			padding: 7px 0px 0px 0px;
			font-size: 12px;
			color: #999;
		}	
.adimg {
        width: 100%;
        height: auto;
} 
/* 评论数据       */
.p15 {
    padding: 15px;
    font-size: 13px;
}
.ov {
    overflow: hidden;
    padding: 1px;
}
.thread-picture {
    width: 42px;
    height: 42px;
    margin-right: 15px;
    border: 1px solid #d4cfc8;
    border-radius: 42px;
}
.thread_user_name{
    font-size: 14px;
    margin-top: 10.5px;
    color: #3b3937;
    height: 21px;
    line-height: 21x;
    width: 45%;
    float: left;
}

.thread_user_addr{
    margin: 10.5px 0px 0px 0px;
    color: #666; 
    float: left;
    font-size: 12px;
    height: 21px;
    line-height: 21x;
    text-align: right;
    width: 33%;
}
.fs13 {
    font-size: 13px;
}
.pb15 {
    padding-bottom: 15px;
}
.pt15 {
    padding-top: 15px;
}
.preview_img_layer {
    float: left;
    width: 100%;
}
.sub_img_layer{
    float:left;
    padding-bottom:15px;
    width: 32%;
    margin-right: 1%;
}
.preview_img{
    width: 100%;
    height: 94px;
}
.pr15 {
    padding-right: 15px;
}
.submit-btn-black {
    height: 35px;
    margin-left: 1%;
    line-height: 35px;
    background: #3b3738;
    text-align: center;
}
.fs14 {
    font-size: 14px;
}
.submit-btn-orange2 {
    height: 35px;
    margin-right: 0;
    line-height: 35px;
    background: #D01120;
    text-align: center;
}
#phoneErro {
    margin: 100px auto 0;
    top: 25%;
    left: 25%;
    width: 50%;
    text-align: center;
    height: 60px;
    line-height: 60px;
    background-color: black;
    -moz-opacity: .8;
    opacity: .80;
    filter: alpha(opacity=80);
    position: fixed;
    z-index: 1999;
    overflow: auto;
    color: white;
    -moz-border-radius: 15px;
    -webkit-border-radius: 15px;
    font-size: 14px;
}
img {
    max-width: 100%;
    height: auto;
}
.categorya {
     text-decoration: none;
    color: #333;
    font-size: 14px;
    display: inline-block
} 
</style>