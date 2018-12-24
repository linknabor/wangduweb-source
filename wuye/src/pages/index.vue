<style scoped>

/* .footer{width: 100%;height: 58px;background-color: #fff; position:fixed;bottom: 0px;box-shadow: 0 0 5px rgba(0,0,0,.2);}
.footer li{width: 25%;float: left;text-align: center;height: 100%;}
.footer a{color:#777;font-size: 10px;position: relative;height: 100%; */
/* padding-top: 10px; */
    /* display: block;
}
.footer span{letter-spacing: 0.1rem; font-family: Microsoft YaHei, Tohoma, Arial,   微软雅黑;}
.icon{width: 100%;height: 30px;position: relative; margin-bottom: 5px;}
.icon-box{width: 30%;height: 23px;position: absolute;left: 35%;top:6px;}
.icon-box img{width:100%;height: 100%;margin:auto;} */


/* 新导航栏 */
.fixed {
    width: 100%;
    left: 0;
    position: fixed;
    top: auto;
    bottom: 0;
    z-index: 99;
     line-height: 1.5;
}
.sub-nav.nav-b5 {
    /* height: 48px; */
    overflow: hidden;
    margin: 0;
    padding: 0;
    background: #fff;
    border-top: 1px solid #ddd;
    /* box-shadow: 0 -3px 3px rgba(0, 0, 0, .1); */
    margin: 0;
}

.sub-nav.nav-b5 dd {
    margin: 0 0 0 0;
    text-align: center;
    border-right: 0px solid #ccc;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -o-box-sizing: border-box;
    box-sizing: border-box;
     width: 25%;
    font-size: 14px;
     float: left;
    display: inline;
    font-family: Helvetica, STHeiti STXihei, Microsoft JhengHei,Microsoft YaHei, Arial;
    font-weight: normal;
    color: #999999;
}

.sub-nav .nav-b5-relative {
    position: relative;
    padding: 2px 0;
}
.nav-b5-relative span {
    font-size: 13px;
}
.sub-nav a {
      text-decoration: none;
    color: #333;
    font-family: "微软雅黑", "Helvetica Neue", "Helvetica", Helvetica, Arial,
 sans-serif;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    outline: none;
}
.nav-b5-relative img {
    width: 28px;
    height: 28px;
    text-align: center;
    margin: 2px auto;
    display: block;
    border: 0 none;
    vertical-align: top;
}

</style>

<template>
	<div class="index">
		<router-view class="contetn" ></router-view>
    <!-- <footer class="footer">
      <ul>
        <li >
          <a href="http://www.gm4life.cn/guangming/weixin/home/index.html?state=123#/">
            <div class="icon">
              <div class="icon-box">
                <img src="../assets/imgs/fuwu.png"  alt="tt">
              </div>             
            </div>
            <span class="foot-span">悦服务</span>
          </a>
        </li>
        <li >
          <a href="http://www.gm4life.cn/yueshop/index.php?s=/wap">
            <div class="icon">
              <div class="icon-box">
                <img src="../assets/imgs/shangc.png"  alt="tt">
              </div>              
            </div>
            <span class="foot-span">悦商城</span>
          </a>
        </li>
        <li >
          <a href="http://wuye.gm4life.cn/wangdu/weixin/wuye/index.html?state=123#/">
            <div class="icon">
              <div class="icon-box">
                <img src="../assets/imgs/shequ-check.png"  alt="tt">
              </div>              
            </div>
            <span class="foot-span">悦社区</span>
          </a>
        </li>
        <li >
          <a href="http://www.gm4life.cn/yueshop/wap/member.html">
            <div class="icon">
              <div class="icon-box">
                <img src="../assets/imgs/yez.png"  alt="tt">
              </div>             
            </div>
            <span class="foot-span">用户中心</span>
          </a>
        </li>
      </ul>
    </footer>			 -->

    <div class="fixed bottom">
	<div class="distribution-tip" id="distribution-tip" style="display: none;"></div>
	<dl class="sub-nav nav-b5">
		<dd id="buttom_home">
			<a href="http://www.gm4life.cn/guangming/weixin/home/index.html?state=123#/">
				<div class="nav-b5-relative">
					<img src="../assets/imgs/fuwu.png"/>
					<span>悦服务</span>
				</div>
			</a>
		</dd>
		<dd id="buttom_classify">
			<a href="http://www.gm4life.cn/yueshop/index.php?s=/wap">
				<div class="nav-b5-relative">
					<img src="../assets/imgs/shangc.png"/>
					<span>悦商城</span>
				</div>
			</a>
		</dd>
    	<dd id="buttom_classify">
			<a href="http://wuye.gm4life.cn/wangdu/weixin/wuye/index.html?state=123#/">
				<div class="nav-b5-relative">
					<img src="../assets/imgs/shequ-check.png"/>
					<span>悦社区</span>
				</div>
			</a>
		</dd>
    	<dd id="buttom_classify">
			<a href="http://www.gm4life.cn/yueshop/wap/member.html">
				<div class="nav-b5-relative">
					<img src="../assets/imgs/yez.png"/>
					<span>用户中心</span>
				</div>
			</a>
		</dd>
	</dl> 
</div>
	</div>
</template>

<script>
  import cookie from 'js-cookie'
	export default{
    mounted(){
       
    }
	}
</script>
<style scoped>
.index {
  height: 100%;
}

</style>
