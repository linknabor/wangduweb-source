<template>
   <div>
       
   </div>
</template>

<script>
let vm;
export default {
   data () {
       return {
       };
   },
     created(){
        vm = this;
    },
   mounted() {
       vm.query(); 
   },

   components: {},

   methods: {
       query() {
           var o = vm.gercode().code;
           var appid =/127|test|localhost/.test(location.origin)?'wxa48ca61b68163483':'wx5b1a7c252c3cbc26';
           var baseurl = /127|test|localhost/.test(location.origin)?'https://test.e-shequ.com/wangdu/weixin/':'http://wuye.gm4life.cn/wangdu/weixin/';
           var requrl = baseurl+"/wuye/index.html?#/blank";
           if(o == undefined) {
               location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid="+
               appid+"&redirect_uri="+encodeURIComponent(requrl)+"&response_type=code&scope=snsapi_base&state=123#wechat_redirect";
           }else {
            let url=/127|test|localhost/.test(location.origin)?'https://test.e-shequ.com/guangming/wechat/hexie/wechat':
             'https://www.gm4life.cn/guangming/wechat/hexie/wechat';
             url+="/authorize/"+o;
            vm.receiveData.postData( vm, url,
            null,
            'res',
            function(){
                    if(vm.res.success) {
                        var openid =vm.res.result.openid;
                        location.href =baseurl+ "wuye/index.html?openid="+openid+"#/";;
                    }else {
                        alert('请刷新重试');
                    }
                })
           }
       },
       gercode() {
        var e = location.search,
        o = {};
        if ("" === e || void 0 === e) return o;
        e = e.substr(1).split("&");
        for (var n in e) {
            var t = e[n].split("=");
            o[t[0]] = t[1]
        }
        return o.from && delete o.code,
        o
       }
   },

   computed: {},
}
</script>

<style  scoped>
</style>