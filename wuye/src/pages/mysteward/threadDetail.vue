<template>
   <div style="margin-bottom:10px;">
        <div id="zzmb" class="zzmb" style="display:none;position:fixed;" @click="hideImg"></div>
        <div id="divconf" class="divconf" style="display:block; position:fixed; z-index: 2147483647;" @click="hideImg"></div>
        <div style="padding-top: 15px" class="ov pl15 pb15 fs14">
            <div class="fl">
                <img class="fl comment-post-picture" :src="thread.userHead" />
            </div>
            <div class="thread_user_head">{{thread.userName}}</div>
        </div>
        <div class="ov pl15 pr15">
            <!-- 图片 -->
		<div class="" v-for="(thumbnailurl,index) in thumbnailurls" >
                <div class="ov pb15 fs14" @click="viewSrcImg(thread.threadId,index)">
                    <img class="fl attach-picture" :src="thumbnailurl" />
                    </div>
        </div>

        </div>
        <div class="ov pl15 pb15 fs13" style="color: #3b3937">{{thread.threadContent}}</div>
        <div class="ov pl15 pb15 fs13 fl" style="color: #a6937c; line-height: 23px">
            <img style="width: 13px; height: 13px;" src="../../assets/wuye/icon_time_gray.png"/>&nbsp;{{thread.formattedDateTime}}
        </div>
        <div class="avatar-wrap rel ov fr" v-show="thread.isThreadOwner == 'true'">
            <div class="fs13 pr15" style="color: #a6937c; text-align: right; line-height: 23px" @click="delThread">删除</div>
        </div>
        <div class="pt15 divider">&nbsp;</div>
        <!-- -------- -->
        <div id="total_comments" class="comments_title comment-lite-divider">
            <div class="fl" style="line-height: 15px; color: #888">评论</div>
        </div>

        <div class="comment-item p15" v-for="(comment,index) in comments">
            <div style="width: 100%; min-height: 100px; float: left; padding-left: 15px; overflow: hidden;" class="pt15" >
                <div class="pb15 fs14 fl" style="width: 20%;">
                    <img class="fl comment-reply-picture" :src="comment.commentUserHead"/>
                </div>
                <div style="width: 80%" class="fl">
                    <div class="comments_user_name" >{{comment.commentUserName}}</div>
                    <div style="color: #3b3937; word-wrap:break-word;overflow:hidden;" class="fs13">{{comment.commentContent}}</div>
                    <!-- ------------ -->
                    <div class="preview_img_layer" >
                        <!-- v-for="(items,index) in comment.previewLink" -->
                        <div v-for="(items,index) in comment.previewLink">
                            <div class="sub_img_layer" @click="viewSrcImg(items.threadId, index);" >
                                <img class="preview_img" :src="items" />
                                <!-- <img class="preview_img" src="../../assets/bg_nohouse.jpg" alt=""> -->
                                </div>
                        </div>
                    </div>
                    <!-- ------------ -->
                    <div style="color: #888;" class="fl15 fs12 pt15 fl">
                        <img style="width: 12px; " src="../../assets/wuye/icon_time_gray.png"/>&nbsp;
                        {{comment.fmtCommentDateTime}}
                    </div>
                    <div class="pt15 fs12" style="color: #a6937c; float: right;">
                         <div class="fr" v-show="comment.isCommentOwner == 'true'">
       					        <div class="fs12 pr15" style="color: grey; text-align: right"  @click="delComment(comment,index)">删除</div>
  					    </div>   
                    </div>   
                    <div class="fl">&nbsp;</div> 
                </div>
                <div style="width: 100%;" class="comment-lite-divider fl">&nbsp;</div>
            </div>  
        </div>    
        <div class="butt">
            <div id="input" class="fl" style="top:10px; background-color: white; width: 98%; text-align: center; border:1px;margin-left:2%;">
                <textarea name="comment_content" class="comment_input inner-input "    placeholder="回复" v-model="commentContent"></textarea>
                <div class="submit-btn ov fs14 fl" @click="saveComment" style="width:20%; color: white;">发送</div>	
            </div>  
        </div>  
        <!-- 上传图片 -->
        <div style="overflow:hidden; margin-top:10px;">
            <div id="pic" class="pic_frame">
                    
            </div>
            <div class="pl15 pr15">
                    <div id="add" v-on:click="addPic"   class="add-pic-bg fl pl5"></div>
            </div>
        </div>
   </div>
</template>

<script>
let vm;
let once=true;
import wx from 'weixin-js-sdk';
export default {
   data () {
       return {
            threadId:this.$route.query.threadId,
            thread : {},
            comments : [],
            uploadPicId : '',
            thumbnailurls: [],
            commentContent:'',
            localIdsid:'',
       };
   },
   created() {
       vm=this;
   },
   mounted() {
        // 请求接口获取 后台返回的 微信配置项
        // vm.common.checkRegisterStatus();
       
       this.wxdata() 
       this.getThread();
      
   },
   methods: {
       getThread() {
           let url= "thread/getThreadByThreadId";
           vm.receiveData.postData( vm, url,
            {
                threadId:vm.threadId,
            },
            'data',
            function(){
                if(vm.data.success) {
                    vm.thread = vm.data.result;
                    vm.comments = vm.thread.comments;
                    vm.thumbnailurls = vm.thread.thumbnailLink;
                    vm.updateUnreadComments();
                }else {
                       alert(vm.data.message==null?"获取信息失败，请重试！":vm.data.message);
                }
            })
       },
       updateUnreadComments() {
           let url="thread/updateUnreadComment/"+vm.thread.userId+"/"+vm.thread.threadId;
           vm.receiveData.postData( vm, url,{},'data', function(){
                console.log(JSON.stringify(vm.data));
            })
       },
       //点击图片
       viewSrcImg(threadId,index) {
           vm.refreshImages(threadId, index);
       },
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
       //隐藏图片
       hideImg() {
             $("#zzmb").hide("slow");
        	 $("#divconf").hide("slow");
       },
    //    删除
    delThread() {
         let url='thread/deleteThread';
           vm.receiveData.postData( vm, url,{threadId : vm.threadId},'data', function(){
               if(vm.data.success) {
                   alert('删除成功');
                    vm.$router.push({path:'/mysteward',query:{'category':'2'}})
               }else {
                    alert(vm.data.message==null?"发布信息保存失败，请重试！":vm.data.message);
                } 
                
               
            })
    },
     //回复删除
   delComment(comment,index) {
       let url="thread/deleteComment";
        vm.receiveData.postData( vm, url,{commentId : comment.commentId,threadId: comment.threadId},'data', function(){
               if(vm.data.success) {
                     vm.comments.splice(index,1);
               }else {
                    alert(vm.data.message==null?"发布信息保存失败，请重试！":vm.data.message);
               }
            })
   },
   saveComment() {
        if(vm.commentContent==""){
				alert("回复内容不为空。");
				return false;
        }
        var pic_length = $("[name='pics']").length;
       
        if(pic_length>0){
            this.uploadToWechat();
        }else{
            this.saveThread();
        }    
        //限制回复 
        if(once) {
        let url="thread/addComment";
        vm.receiveData.postData( vm, url,{commentContent : vm.commentContent,threadId:vm.threadId},'data', function(){
               if(vm.data.success){
                vm.comments.push(vm.data.result)
                    vm.commentContent="";
                once=false;
               }else{
                   alert(vm.data.message==null?"发布信息保存失败，请重试！":vm.data.message);
               }              
            })
        }else {
            alert('不可回复，请从新报修')
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
                count: 3, // 默认9
                sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                     vm.localIdsid=res.localIds;
                    // console.log(localIds);
                    alert('已选择'+localIds.length+'张图片');
                   var html = "";
                   var pic_length = $("[name='pics']").length;
                   if(pic_length+localIds.length>3){
                       alert("所选图片超过3张。")
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
                    if(pic_length+localIds.length >= 3){
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
                        threadCategory:'2',
                        threadTitle:'',
                        threadContent:vm.commentContent,
                        uploadPicId:vm.uploadPicId
                    },
                    'postData',
                    function(){
                        if(vm.postData.success) {
                            //  alert("发布成功");
                        }else {
                            alert(vm.postData.message);
                        }
                    }
                )
        },
   },
  
   computed: {},
}
</script>

<style  scoped>
.ov {
    overflow: hidden;
    padding: 1px;
}
.fs14 {
    font-size: 14px;
}
.pl15 {
    padding-left: 15px;
}
.pb15 {
    padding-bottom: 15px;
}

.comment-post-picture {
    width: 42px;
    height: 42px;
    margin-right: 15px;
    border: 1px solid #d4cfc8;
    border-radius: 42px;
}
.thread_user_head {
    float: left;
    margin-top: 10.5px;
    font-size: 14px;
    color: #393b37;
}
.fs13 {
    font-size: 13px;
}
.fs12 {
    font-size: 12px;
}
.rel {
    position: relative;
}
.pr15 {
    padding-right: 25px;
}
.pt15 {
    padding-top: 15px;
}
.divider {
    border-bottom: 5px solid #f9f9e9;
}
.comments_title{
    margin: 15px 4% 0px 4%;
    height: 15px;
}
.comment-lite-divider {
    border-bottom: 1px solid #d4cfc8;
    /* margin-left: 20%; */
}
p15 {
    padding: 15px;
    font-size: 13px;
}
.comment-reply-picture {
    width: 35px;
    height: 35px;
    margin-right: 15px;
    border: 1px solid #d4cfc8;
    border-radius: 35px;
}
.comments_user_name {
    font-size: 14px;
    color: #3b3937;
    margin: 5px 0px 15px 0px;
}
.comment_input {
    text-align: left;
    float: left;
    overflow: hidden;
    width: 70%;
}
.inner-input {
    display: block;
    height: 35px;
    line-height: 35px;
    outline: none;
    border: 1px solid #d4cfc8;
    border-radius: 4px;
    padding: 0 10px;
    vertical-align: middle;
    font-size: 15px;
}
.submit-btn {
    height: 35px;
    margin-left: 1%;
    line-height: 35px;
    background: #D01120;
    text-align: center;
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
.comment-item {
    overflow: hidden;
}
.butt {
     overflow: hidden;
}
.add-pic-bg {
    background-image: url('../../assets/wuye/bg.png');
    height: 100px;
    width: 95px;
}
.pic_frame {
    width: 94%;
    margin: 0px 0% 0px 6%;
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
</style>