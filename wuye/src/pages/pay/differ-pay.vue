<style scoped>
*{
    margin:0;padding:0;
}
.word{
    position: absolute;
    width:100%;
    height:100%;
    background:#eee;
}
.differ{
    width:100%;
    height:1.1rem;
    background:#eee;
    /* left:2%; */
    position:absolute;
    /* top:.3rem; */

}
.differ-l{
    width:45%;
    height:1.1rem;
    line-height:1.1rem;
    border:1px solid #eee;
    border-radius:5px;
    font-size:.26rem;
    background:white;
    color:#D01120;;
    text-align:center;
    margin-left:9px;

}
.differ-r{
    width:45%;
    height:1.1rem;
    line-height:1.1rem;
    font-size:.26rem;
    background:white;
    border:1px solid #eee;
    border-radius:5px;
    color:#D01120;
    float:right;
    text-align:center;
    margin-top: -1.15rem;
    margin-right:9px;
}
.main{       
        margin: 5px;
            overflow: hidden;
    
    } 
.featured {
    width: 48%;
    float: left;
    margin: 1%;
}
.featured  img {
    border-radius: 6px;
}

</style>


<template>
<div class="word">
    <div class="main">
        <div  class="featured" @click="wuyepay()">
		    	<img src="http://img.gm4life.cn/FvteEsek7oZMQXhKk9Q4fXj0uJrd" />
	    	</div>
            <div  class="featured">
               <a :href="'http://www.www0101.com/zjwxdata/ServerOut/wxapi.ashx?gn=gohome&appid=wxf59c6eb8ecb825ff&pwd=6CAE8B41F97A667&openid='+this.openid">
		    	<img src="http://img.gm4life.cn/Frv-7ImYVizqhxsaNgR2eR16uoBo" />
                </a>
	    	</div>
    </div>
</div>

</template>
<script>
let vm;
export default{
        data(){
            return{
                openid:this.$route.query.openid
            }
        },
        created(){
            vm=this;
        },
        mounted(){
           	// this.common.checkRegisterStatus();
        },
        methods:{
            wuyepay(){
                vm.$router.push({path:'/pay'})
            }
        },
        
    }
</script>