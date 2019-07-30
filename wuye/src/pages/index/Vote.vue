<template>
<div class="content">
    <div class="cont">
        <div class="head">
            <div class="device">
                     <img  src="../../assets/img/guangming.jpg">
            </div>
        </div>
        <div class="mian">
           <div>
                <ul>
                    <li>
                        <h2>满意度调查</h2>
                    </li>
                    <li>
                        <a href="https://www.wjx.cn/m/40072382.aspx">
                            <i></i>
                            华都大厦管理部 业户意见征询
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            
                        </a>
                    </li>
                </ul>
           </div>

           <div style="margin-top:50px;">
                <ul>
                    <li>
                        <h2>征询投票</h2>
                    </li>
                    <li>
                        <a href="https://www.wjx.cn/jq/43208271.aspx">
                            <i></i>
                            2019半年度业主意见征询表
                        </a>
                    </li>
                    <li></li>
                    <li></li>
                    
                </ul>
           </div>
        </div>
    </div>
</div>    
</template>

<script>
export default {
   data () {
       return {

       };
   },
   mounted() {
       	this.common.checkRegisterStatus();
   },

   components: {},

   methods: {},

   computed: {},
}
</script>

<style  scoped>
.content {
    position: absolute;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color:white;
}
.cont {
    background-color:white;
}
.device {
    width: 100%;
    height: 20%;
    margin: 0px auto;
    position: relative;
}
.device img {
    width:100%;
}
.mian {
    padding:0 15px;
    margin-bottom: 20px;
}
ul li {
    height: 50px;
    line-height: 50px;
    font-size:16px;
    border-bottom: 1px solid #ccc;
    font-family: '宋体';
    color:#000;
    padding-left:20px;
    padding-right:10px;
}
li h2 {
    font-size:20px;
    letter-spacing: 5px;       
}

ul li a {
    color:#000;
    font-family: '宋体';

}
ul li:nth-child(1) {
    padding-left: 0px;
}
i {
    height: 5px;
    width: 5px;
    border: 1px solid red;
    border-radius: 50%;
    display: inline-block;
    background-color: red;
}
</style>