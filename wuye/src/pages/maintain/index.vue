<template>
    <div class="addt">
        <div  class="category lite-divider" v-show="threadCategory>=2">
             <div class="category_main">
                 <div  class="category_sub_main fl">
                    <router-link :to="{path:'/maintain',query:{category:'2'}}" class="categorya">
                   <img class="category_img" src="../../assets/wuye/img_repair_60x60.png" v-show="threadCategory!=2"/>
					<img class="category_img_hide" src="../../assets/wuye/03.png" v-show="threadCategory==2"/> 
					<div class="category_txt">家庭维修</div>
                    </router-link>
                </div>

                <div  class="category_sub_main fl">
                    <router-link :to="{path:'/maintain',query:{category:'3'}}" class="categorya">
                    <img class="category_img" src="../../assets/wuye/img_education_60x60.png" v-show="threadCategory!=3"/>
					<img class="category_img_hide" src="../../assets/wuye/01.png" v-show="threadCategory==3"/>
					<div class="category_txt">公共部位维修</div>
                    </router-link>
                </div>
             </div>       
         </div>
            <div class="content_main">
                    <div id="zzmb" class="zzmb" style="display:none;position:fixed;"></div>
                    <div class="inner-input-wrap content_info">
                        <textarea @blur="fixScroll" class="inner-input content_input" placeholder="填写发布信息..." v-model="threadContent"></textarea>
                    </div>
                    <div>
                        <div class="content_limmit" >（限200字）</div>
                    </div>    
            </div>

            <div id="pic" class="pic_frame">
                
            </div>
            <div class="pl15 pr15">
                <div id="add" v-on:click="addPic"  class="add-pic-bg fl pl5"></div>
            </div>
            <div class="btn-fabu" v-on:click="addThread">
            <h2>发布</h2>
         </div>  

    </div>
</template>

<script>
let vm;
import wx from 'weixin-js-sdk';
export default {
   data () {
       return {
           threadCategory:this.$route.query.category,
           threadContent:'',
            threadTitle:"",
            uploadPicId:"",
            localIdsid:'',
            extraOpenId:window.localStorage.getItem('extraOpenId'),
       };
   },
   created() {
       vm=this;

     // 请求接口获取 后台返回的 微信配置项
        vm.common.checkRegisterStatus();

        let url = location.href.split('#')[0];
        vm.receiveData.wxconfig(vm,wx,['chooseImage'],url);
   },
   watch:{
      '$route' () {
         this.threadCategory=this.$route.query.category
	}
   },
   mounted() {
       this.wxdata();
       this.getOpenid();
   },

   components: {},

   methods: {
       getOpenid(){//有openid保存没有连接新值覆盖
        //    console.log(vm.$route.query.openId)
           if(vm.$route.query.openId) {
            //    console.log(window.localStorage.getItem('extraOpenId'))
               if(window.localStorage.getItem('extraOpenId')) {
                    window.localStorage.setItem('extraOpenId', vm.$route.query.openId);
               }else {
                    window.localStorage.setItem('extraOpenId', vm.$route.query.openId);
               }
              vm.extraOpenId=window.localStorage.getItem('extraOpenId');
           }
       },
        //ios中留白问题
        fixScroll() {
                let u = navigator.userAgent;
                let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                if (isiOS) {
                window.scrollTo(0,0);
                }
        },
       //微信初始化
       wxdata() {
         let url1 = "getUrlJsSign";
         vm.receiveData.postData(
            vm,
            url1,
            {url:window.location.href.split('#')[0]},
            'heheData',
            function(){
                let wd = vm.heheData.result;
                wx.config({
                    debug:false,
                    appId:wd.appId,
                    timestamp:wd.timestamp,
                    nonceStr:wd.nonceStr,
                    signature:wd.signature,
                    jsApiList:['chooseImage','previewImage','uploadImage','downloadImage','getLocalImgData']
                });
            }
        );
       },
        //上传图片
       addPic() {
            wx.chooseImage({
                count: 6, // 默认9
                sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                     vm.localIdsid=res.localIds;
                    console.log(localIds);
                    alert('已选择'+localIds.length+'张图片');
                   var html = "";
                   var pic_length = $("[name='pics']").length;
                   if(pic_length+localIds.length>6){
                       alert("所选图片超过6张。")
                       return false;
                   }
                      var i=0;
                    if(window.__wxjs_is_wkwebview) {//ios 环境
                         function addimage(i) {
                            //  setTimeout(function(){
                                wx.getLocalImgData({
                                    localId: localIds[i],
                                    success: function (res) {                                          
                                        var localData = res.localData;
                                        localData = localData.replace('jgp', 'jpeg');
                                            html = "<div name='pics' class=\"fl\" style=\"margin-right:5px;\"><img src=\""+localData+"\" style=\"height:100px;width:90px;\"/></div>"
                                            $("#pic").append(html);
                                        i++;  
                                        if(i<localIds.length) {
                                            // alert(i)
                                            addimage(i)
                                        }   
                                    },
                                    fail:function(res){
                                        alert(res);
                                    }
                                }) 
                            //  },100)  
                         }  
                         addimage(i); 
                           
                        }else {   
                                for(var i=0;i<localIds.length;i++){
                                    html = "<div name='pics' class=\"fl\" style=\"margin-right:5px;\"><img src=\""+localIds[i]+"\" style=\"height:100px;width:90px;\"/></div>"
                                    $("#pic").append(html);
                                }
                        }
                    if(pic_length+localIds.length >= 6){
                        $("#add").hide();
                    }
                },
                fail:function(err){
                    alert(err)
                }
            }); 
       },
       //上传图片到微信
       uploadToWechat (){
            var i = 0;
            var pics = $("[name='pics']");
            function upload(){
                var img = pics.eq(i).find("img");
                var id = img.attr("src");
                setTimeout(function(){
                    wx.uploadImage({
                        localId:  vm.localIdsid[i], // 需要上传的图片的本地ID，由chooseImage接口获得
                        isShowProgressTips: 1, // 默认为1，显示进度提示
                        success: function (res) {
                            var serverId = res.serverId; // 返回图片的服务器端ID
                            vm.uploadPicId+=serverId+",";
                            i++;
                            if(i<pics.length){
                                upload();
                            }else if(i==pics.length){
                                vm.saveThread();
                            }
                            
                        }
                    })
                },50);
            }
            upload();
        },
       saveThread:function(){
                let url2 = "thread/addThread";
                vm.receiveData.postData(
                    vm,
                    url2,
                    {
                        threadCategory:vm.threadCategory,
                        threadTitle:vm.threadTitle,
                        threadContent:vm.threadContent,
                        uploadPicId:vm.uploadPicId,
                        extraOpenId:vm.extraOpenId
                    },
                    'postData',
                    function(){
                        if(vm.postData.success) {
                             alert("发布成功");
                              vm.$router.push({path:'/mysteward',query:{'category':vm.threadCategory}});
                        }else {
                            alert(vm.postData.message);
                        }
                    }
                )
        },
         //提交
       addThread() {
           if(vm.threadContent==""){
                alert("请填写内容！");
                return false;
            }
             if(vm.threadContent.length>200){
                alert("发布字数不能超过200字节!");
                return false;
            }
            var pic_length = $("[name='pics']").length;
            $("#zzmb").show();
            if($(window).height()>$(document).height()){
                $(".zzmb").height($(window).height());
            }else{
                $(".zzmb").height($(document).height());
            }
            if(pic_length>0){
                this.uploadToWechat();
            }else{
                this.saveThread();
            }
       }

   },

   computed: {},
}
</script>

<style  scoped>
.addt {
    background-color: #fffff8;
    padding-bottom: 1px;
    height:100%;
}
.category{
	 		background-color: #f7f7f1;
	 		height: 90px;
	 		overflow-x: hidden;
 		}
.lite-divider {
    border-bottom: 1px solid #d4cfc8;
}
.category_main{
	     	width: 92%;
	     	margin: 0px 0% 0px 4%;
	     	overflow-x: hidden;
    	}
       
.category_sub_main{
	    	margin: 15px 0% 15px 15%;
	    	text-align: center;
	    	width: 25%
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
.content_main{
			width: 94%;
			margin: 5% 0% 5% 6%;
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
.content_info {
    width: 98%;
    margin: 30px 0% 0px 0%;
}

.inner-input-wrap {
    position: relative;
    padding: 6px 0;
}

.inner-input {
    display: block;
    height: 120px;
    width: 90%;
    outline: none;
    border: 1px solid #d4cfc8;
    border-radius: 4px;
    padding: 0 10px;
    vertical-align: middle;
    font-size: 15px;
    padding-top: 10px;
}
.content_limmit{
			width: 89%;
			margin: 0px 0% 0px 5%;
			text-align: right;
			color: gray;
		}
.pic_frame {
    width: 94%;
    margin: 0px 0% 0px 6%;
}
.pl15 {padding-left: 15px;}
.pr15 {padding-right: 15px;}
.add-pic-bg {
    background-image: url('../../assets/wuye/bg.png');
    height: 100px;
    width: 95px;
}
.btn-fabu{
    position: fixed;
    width: 90%;
    height: 50px;
    bottom: 0;
    left: 5%;
    right: 5%;
    background-color:#D01120;
    line-height: 50px; color: white;}
    h2{text-align: center;letter-spacing: 0.05rem;font-size: 15px;}

.categorya {
     text-decoration: none;
    color: #333;
    font-size: 14px;
    display: inline-block
} 
</style>