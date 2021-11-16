<template>
   <div>
            <div class="pay-detail" v-show="selectUpton=='list'">
                <div class="box-bg"></div>
                <!-- 用户信息 -->
                <div class="user-info">
                        <div class="number">户号&nbsp;{{verNumber}}</div>
                        <div class="addr ov">
                            <p class="fl">{{addr}}</p>
                            <p class="fr">{{area}} m<sup style="font-size:0.2rem">2</sup></p>
                        </div>
                </div>
          

            <!-- 费用列表 -->
			<dl v-for="item in feeList" class="fee-list ">
				<dt class="ov">
					<p class="fee-name fl" >{{item.service_fee_name}}</p>
					<p class="fee-price fr" >￥{{item.totalFee.toFixed(2)}}</p>
				</dt>
				<dd class="ov" v-for="i in item.fee_detail">
					<p class="detail-date fl">{{i.service_fee_cycle}}</p>
					<p class="detail-price fr">{{i.fee_price}}</p>
				</dd>
			</dl>

            <!-- 优惠选项 -->
			<ul class="discount">
				<li class="ov" @click="uptonList" >
					<div class="fl">现金券 <span class="can-use">&nbsp;<strong>{{uptonNumber}}</strong>&nbsp;张可用&nbsp;</span></div>
					<div class="fr">{{uptonAmount}} &gt;</div> 
				</li>
				<li class="ov coupon">
					<span class="fl" >物业优惠</span>
					<span class="fr bigfont">￥{{reduceAmt}} </span>
				</li>
			</ul>

            <!-- 支付金额 -->
			<div class="payCount">
				<p class="fl">支付金额</p>
				<p class="fr bigfont">￥{{count}}</p>
			</div>

            <!-- 发票 -->
            <form  class="invoice">
                <div v-if="needInvoice == 'yes'" class="form-row">
					申请发票类型:&nbsp;&nbsp;
					 <input  type="radio" id="person" value="01" v-model="invoice_title_type">
  					 <label for="01" class="ty-label">个人</label>
					   <!-- show_com_flag  判断公司是否允许开具公司开票 -->
					 <input v-show="show_com_flag!=='0'" type="radio" id="company" value="02" v-model="invoice_title_type">
  					 <label v-show="show_com_flag!=='0' " for="02" class="ty-label">公司</label>
				</div>
                <div class="form-row" v-if="invoice_title_type == '02'&&needInvoice=='yes' ">
					<!-- <mt-field label="发票抬头" placeholder="发票抬头" v-model="invoice_title"></mt-field> -->
					<label class="t-label">发票抬头: <input type="text" placeholder="发票抬头" v-model="invoice_title" class="t-input"> </label>
				</div>
				<div class="form-row" v-if="invoice_title_type == '02'&&needInvoice=='yes' ">
					<!-- <mt-field label="公司税号" placeholder="公司税号" v-model="credit_code"></mt-field> -->
					<label class="t-label">公司税号: <input type="text" placeholder="公司税号" v-model="credit_code" class="t-input"> </label>
				</div>
                <h4 class="qufapiao" v-show="show_invoice_flag==0">支付后请前往物业管理处领取发票</h4>
				<h4 class="qufapiao" v-show="show_invoice_flag==1">申请的电子发票预计在3个工作日内通过短信发送至您手机上,请注意查收</h4>
            </form>
			<div class="card fs15 item" >
				<div class="ov fs13 " >
					<span  style="padding:9px 5px 5px 5px; float:left;">是否自动绑定为该房屋的业主：</span>
					<div class="ov" style="padding:0px 5px 5px 0px;">
						<label class="chendad " :class="{addse:bind_switch=='1'}" for="checkbox_a1"></label>
						<span>是&nbsp;&nbsp;</span>
						<input type="radio" id="checkbox_a1" name="flag" value="1" v-model="bind_switch" class="chk_1"  />

						<label for="checkbox_a2" class="chendad" :class="{addse:bind_switch=='0'}" ></label>
						<span>否</span>	
						<input type="radio" id="checkbox_a2" name="flag" value="0"  v-model="bind_switch" class="chk_1"  />
						</div>		
				</div>	
			</div>
            <!-- 支付按钮 -->
			<div style="height:1rem;"></div>
			<div class="pay-btn" @click="wechatPay">立即微信支付</div>
			<!-- <div class="pay-btn" @click="add">价格</div> -->
        </div>    

        <!-- 优惠券页面 -->
        <div class="upton-list" v-show="selectUpton=='youhui'">
           <!-- 可用券的数量 -->
			<div class="can-use">
				<p class="fl">可用现金券</p>
				<p class="fr">共{{uptonNumber}}个</p>
			</div>
            <div class="uptonDetail" v-for=" (item,index) in uptonData" @click="showIcon(index)">
				<i class="icon" :class="{iconShow:item.selected}" ></i>
				<div class="detail-left fl">
					<div class="upton-name">{{item.title}}</div>
					<p class="validity">{{item.leftDayDes}}</p>
					<span class="text">使用期限 {{item.useStartDateStr}}至{{item.useEndDateStr}}</span>
				</div>
				<div class="detail-right fr">
					<p class="upton-number">￥{{item.amount}}</p>
					<p class="upton-type">现金券</p>
				</div>
			</div>
			<!-- 提交按钮 -->
			<div class="btn" @click="submit">确定</div>
        </div>
   </div>
</template>

<script>
let vm;
import wx from 'weixin-js-sdk';
import cookie from 'js-cookie';
import { Base64 } from 'js-base64';
export default {
   data () {
       return {
            selectUpton:'list',
            verNumber:'',//户号
			addr:'',//地址
            area:'',//面积
            feeList:'',//费用列表
            uptonData:[],
            uptonNumber:0,//优惠劵数量
            couponId:'',//优惠券id
            uptonAmount:'未使用',
            upronAmountNumber:0,////优惠券金额 数量
            mianBill:'0',//优惠的账单id
            mianAmt:0.00,
            show_invoice_flag:'0',
            show_com_flag:'0',//是否允许开具公司发票
            reduceAmt:'0',//减免合计
            count:0,//实际支付金额
            needInvoice:'yes',//是否需要发票
            routeParams:{
					billIds : this.$route.query.billIds,//id 集合
					stmtId:this.$route.query.stmtId,//扫码数据
					totalPrice:this.$route.query.totalPrice,//合计金额
					reduceMode:this.$route.query.reduceMode,//减免方式
                },
            invoice_title_type:'01',//公司或个人    
            invoice_title:'',//发票抬头
			credit_code:'',//公司税号
			invoiceType:'person',//公司或个人
			payAddr:"",
			bind_switch:"1",
			tel:cookie.get('tel')

       };
   },
   created() {
       vm=this;
    //    this.directRightUrl();
			if(vm.routeParams.stmtId == " "){
				vm.routeParams.stmtId = ""
			}
       vm.calcReduceAmt()
   },
   watch:{
			needInvoice:function(){
				if(this.needInvoice == 'yes'){
					vm.invoice_title_type='01'
					console.log('yes')
				}else{
					console.log('no')
					vm.invoice_title_type=''
				}
			},
			
		},
   mounted() {
	//    this.initSession4Test();

		this.common.checkRegisterStatus();
			
       this.getBillDetail();
	   this.updateCouponStatus();
   },

   methods: {

       	initSession4Test(){
            let url = 'http://wuye.gm4life.cn/wangdu/wechat/hexie/wechat/initSession4Test/105';
                vm.receiveData.getData(vm,url,'Data',function(){
            });
        },
        	// 重定向到正确的url
			directRightUrl () {
			  let paths = window.location.href.split('#')
			  paths[1] = paths[1] || '/'
			  // 老式的#!分隔跳转
			  if (paths[0].charAt(paths[0].length - 1) !== '?') {
			    paths[0] = `${paths[0]}?`
			  }
			  if (paths[1].charAt(0) === '!') {
			     paths[1] = paths[1].substr(1)
			  }
			  let url = `${paths[0]}#${paths[1]}`
			  if (window.location.href !== url) {
			  	console.log(url);
			    window.location.href = url
			  }
			},
       //获取账单
       getBillDetail() {
           let url = "http://wuye.gm4life.cn/wangdu/wechat/hexie/wechat/getBillDetail";
           let params={
	  				billId :vm.routeParams.billIds,
	  				stmtId :vm.routeParams.stmtId
	  			}
		   vm.receiveData.getData(vm,url,'data',function(){
			//    console.log(vm.data)
               if(vm.data.result !== null) {
                    vm.show_com_flag=vm.data.result.show_com_flag;
                    vm.show_invoice_flag = vm.data.result.show_invoice_flag;
                    let useDate = vm.data.result.fee_data[0];
                    if(vm.data.result.mianBill) {
                        vm.mianBill = vm.data.result.mianBill;
                    }
                    if(vm.data.result.mianAmt) {
                        vm.mianAmt = vm.data.result.mianAmt;
                    }
                    //户号
	  				vm.verNumber = useDate.ver_no;
	  				//地址
	  				vm.addr = useDate.cell_addr;
	  				//面积
	  				vm.area = useDate.cnst_area;
	  				//费用列表
					  vm.feeList = useDate.fee_name;
					//地址
					 vm.payAddr= useDate.cell_addr;
					 
               }


            },params)
       },
       //获取优惠券
       updateCouponStatus() {
           let url2 = 'http://wuye.gm4life.cn/wangdu/wechat/hexie/wechat/updateCouponStatus';
	  		vm.receiveData.getData(vm,url2,'temp',function(){	  			
	  		    //更新后 获取优惠劵
	  			let url3 = 'http://wuye.gm4life.cn/wangdu/wechat/hexie/wechat/getCouponsPayWuYe';
	  			vm.receiveData.getData(vm,url3,'uptonDatas',function(){
	  				vm.uptonData = vm.uptonDatas.result;
	  				vm.uptonNumber = vm.uptonDatas.result.length;
	  			})
	  		});
       },
    
        //点击优惠券
       uptonList() {
           if(vm.uptonNumber == 0){//无优惠券
					return
				}else{
					vm.selectUpton = 'youhui';	
				}

       },
       //选择优惠券
       showIcon(index) {
           if(vm.uptonData[index].selected){
					vm.$set(vm.uptonData[index],'selected',false);
				}else{
					vm.$set(vm.uptonData[index],'selected',true);
					for(let i in vm.uptonData){
						if(i != index && vm.uptonData[i].selected == true){
							vm.$set(vm.uptonData[i],'selected',false);
							break;							
						}
					}
				}
       },
       //优惠券选中确定
       submit() {
           		let flag = false;
				for(let i in vm.uptonData){
					if(vm.uptonData[i].selected == true){
						flag = true;
						vm.couponId = vm.uptonData[i].id;//优惠券id
						vm.uptonAmount = '￥' + vm.uptonData[i].amount+'元';//优惠券额度
						vm.upronAmountNumber = vm.uptonData[i].amount;
						vm.count = vm.routeParams.totalPrice;//传过来的合计金额
						vm.count -= vm.uptonData[i].amount
						vm.count = vm.count.toFixed(2);//金额
						if(vm.count < 0 ){
							vm.count = 0;
						}
					}
					if(!flag){
						vm.uptonAmount = "未使用";
						vm.upronAmountNumber = 0,
						vm.couponId = '';
						vm.calcReduceAmt();
					}
					vm.selectUpton = 'list';
                };
       },
       calcReduceAmt() {
           				//实际支付的钱
				vm.count = vm.routeParams.totalPrice;//传过来的合计金额
				let reduced_amt = 0;//减少的钱
				let reduce_rate = 0;//减少到角还是分减少到角还是分
				if ("0" == vm.routeParams.reduceMode) {	//不减免 
					return;
				}else if ("1" == vm.routeParams.reduceMode) {	//四舍五入至元
					reduce_rate = "1";
					reduced_amt=Math.round(vm.count*reduce_rate)/reduce_rate;
					vm.hasReduce = "1";
				}else if ("2" == vm.routeParams.reduceMode) {	//表示四舍五入至角
					reduce_rate = "10";
					reduced_amt=Math.round(vm.count*reduce_rate)/reduce_rate;
					vm.hasReduce = "1";
				}else {
					return;
				}
				vm.count = reduced_amt.toFixed(2);//合计
				vm.reduceAmt = parseFloat(vm.routeParams.totalPrice) - parseFloat(vm.count);
				vm.reduceAmt = vm.reduceAmt.toFixed(2);//减少的钱
					
       },
       wechatPay() {

           if(this.needInvoice=="yes"){
					if(this.invoice_title_type=="02"){
						if(this.invoice_title==""){
							alert("请填写发票抬头信息");
							return;
						};
						if(this.credit_code==""){
							alert("请填写发票公司税号信息");
							return;
						}
					}
				};
                $('.box-bg').css("display",'block');
            let url = "http://wuye.gm4life.cn/wangdu/wechat/hexie/wechat/getPrePayInfo?billId="+vm.routeParams.billIds+"&stmtId="+vm.routeParams.stmtId+"&couponUnit="+vm.upronAmountNumber+"&couponNum=1&couponId="+vm.couponId+"&mianBill="+vm.mianBill+"&mianAmt="+vm.mianAmt+"&reduceAmt="+vm.reduceAmt+"&invoice_title_type="+this.invoice_title_type+"&credit_code="+this.credit_code+"&invoice_title="+this.invoice_title;
            
            this.axios.post(url,{},).then((res) => {
				let wd = JSON.parse(res.data);
				
			
					if(wd.success == false){
                        alert(wd.message);
                        $('.box-bg').css("display",'none');
                        return;
                    }
                    wx.config({
		                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		                    appId: wd.result.appid, // 必填，公众号的唯一标识
		                    timestamp: wd.result.timestamp, // 必填，生成签名的时间戳
		                    nonceStr: wd.result.noncestr, // 必填，生成签名的随机串
		                    signature: wd.result.paysign,// 必填，签名，见附录1
		                    jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                        });
                    wx.chooseWXPay({
						 	"appId":wd.result.appid,
			                "timestamp":wd.result.timestamp,
			                "nonceStr":wd.result.noncestr,
			                "package":wd.result.packageValue,
			                "signType":wd.result.signtype,
                            "paySign":wd.result.paysign,
                            
                              success: function (res) {
                                      let reqUrl = "http://wuye.gm4life.cn/wangdu/wechat/hexie/wechat/noticePayed?billId="+vm.routeParams.billIds+"&stmtId="+vm.routeParams.stmtId+"&tradeWaterId="+wd.result.trade_water_id+"&packageId="+wd.result.packageId+"&feePrice="+vm.routeParams.totalPrice+"&bind_switch="+vm.bind_switch;
                                      if(vm.uptonAmount != "未使用"){
                                            reqUrl += "&couponId="+vm.couponId;
                                        }
                                     
                                vm.receiveData.postData(vm,reqUrl,{},'reqUrlData',function(){
									
										//跳转
										vm.$router.push({path:'/success',query:{'payAddr':Base64.encode(vm.payAddr),'totalPrice':Base64.encode(vm.count),'state':Base64.encode(vm.tel)}})

											// var forwardUrl = "http://wuye.gm4life.cn/wangdu/weixin/";
											// forwardUrl += "wuye/index.html?state=123#/paymentquery";
											// window.location.href = forwardUrl;
								
					  			})	
                              },
                              
			          	    fail:function(res) {
								  console.log(JSON.stringify(res))
								//   alert(JSON.stringify(res))
								//   alert("appId:"+wd.result.appid+",timestamp:"+wd.result.timestamp+",nonceStr:"+wd.result.noncestr+":package:"+wd.result.packageValue+",signType:"+wd.result.signtype+",paySign:"+wd.result.paysign)
			          	    },
			          	    cancel:function(res){
			          	    	alert('支付取消');
			          	    	$('.box-bg').css("display",'none');
							}
                    })    
            }).catch(
					function(err){
						console.log(err);
					}
				)
					
					
       }

   },

   components: {},
   computed: {},
}
</script>

<style  scoped>
	.addse:after {
		content: '\2713';
		position: absolute;
		top: 0px;
		left: 0px;
		color: #D01120;
		width: 100%;
		text-align: center;
		font-size: 1.4em;
		padding: 1px 0 0 0;
		vertical-align: text-top;
	}
	.chendad{
		background-color: #FFF;
		border: 1px solid #C1CACA;
		width:20px;
		height: 20px;
		border-radius: 5px;
		display: inline-block;
		position: relative;
		margin-right: 2px;
		top: 5px;
	}
	.chk_1 {
		display: none;
	}

	.pay-detail{
		padding:0.3rem;
	}
    .box-bg {
        width: 100%;
        opacity: .5;
        height: 100%;
        position: fixed;
	    background-color: #666;
        top: 0;
        left: 0;
        z-index: 100;
        display: none
        }
    .user-info{
		padding:0.2rem;
		border:1px solid #cecdc9;
		border-radius: 5px;
		height: 1.7rem;
		font-size: 14px;
		line-height: 32px;
	} 
    .user-info .number{
		font:0.28rem/0.8rem "";
		color: #000;
	}
	.user-info .addr{
		font:0.26rem/0.6rem "";
		color: #5b5b5b;
	}  
    .ov {
        overflow: hidden;
    } 
	.card {
		margin-bottom: 15px;
		border: 1px solid #d4cfc8;
		border-radius: 3px;
		color: #666;
		margin-top: 20px;
	}
	.fs15{
		font-size: 15px;
	} 
	.fs13  {
		font-size:13px;
	}
	.item {
 		padding:20px 10px;
        border-top: 1px solid #d4cfc8;
	}
    .fee-list{
		border:1px solid #cecdc9;
		border-bottom: none;
		border-radius: 5px;
		margin-top: 0.3rem;
	}
    .fee-list dt,.fee-list dd{
		padding: 0 0.2rem;
		border-bottom:1px solid #cecdc9;
		margin: 0;
		line-height:1.2rem;
		height: 1.2rem;
	}
	.fee-list dt p,.fee-list dd p{
		margin:0;
	}
	.fee-list dt .fee-price{
		color: #d01120;
	}
	.fee-list dd{
		color: #7d7d7d;
	}
    	.discount{
		padding: 0;
		background-color: #f6f7f1;
		border:1px solid #cecdc9;
		border-bottom: none;
		list-style: none;
		margin-top: 0.3rem;
	}
	.discount li{
		padding: 0 0.2rem;
		height: 1rem;
		line-height: 1rem;
		border-bottom:1px solid #cecdc9;
	}
	.discount .can-use{
		/*display: inline-block;*/
		width: 1.35rem;
		height: 0.45rem;
		border:1px solid #d01120;
		color:#d01120;
		font:0.22rem/0.45rem "";
		text-align: center;
		letter-spacing: 2px;
	}
    .coupon{
		color: #d01120;
	}
    .bigfont{
		font-size: 0.32rem;
		-font-weight: bold;
	}
    .payCount{
		padding: 0 0.2rem;
		height: 1rem;
		line-height: 1rem;
		background-color: #f6f7f1;
		color: #d01120;
		border:1px solid #cecdc9;
		margin-top: 0.3rem;
	}
    /* 优惠券 */
    .upton-list {
		padding: 0.3rem 0.3rem;
    }
    .upton-list .can-use{
		font:0.26rem/1rem "";
		font-size: 0.3rem;
		height: 0.6rem;
		border-bottom: 1px solid #878787;
		padding: 10px 10px;
	}
    	.uptonDetail{
		position: relative;
		background:url("../assets/images/bg_courtesy_card.png") no-repeat;
		background-size: 100% 2.15rem;
		margin:0.3rem 0;
		height: 2.15rem;
		padding:0 0.3rem 0 0.4rem;
	}
	.icon{
		background:url('../assets/images/icon_select.png');
		background-size: cover;
		position:absolute;
		width: 0.4rem;
		height: 0.4rem;
		top: 50%;
		margin-top: -0.2rem;
		margin-left: -0.6rem;
	}
	.iconShow{
		background:url('../assets/images/icon_selectted.png');
		background-size: cover;
		z-index: 5;
	}
	.detail-left{
		padding-top: 0.35rem;
	}
	.detail-right{
		padding-top: 0.6rem;
		text-align: center;
	}	
	.detail-left .upton-name{
		/*font:0.34rem/0.78rem "";*/
		color: #d01120;
		font-size: 0.4rem;
		font-weight: 600;
		letter-spacing: 0.08rem;
	}
	.detail-left .validity{
		width: 1.7rem;
		height: 0.4rem;
		line-height: 0.4rem;
		text-align: center;
		border:1px solid #d01120;
		border-radius: 10px;
		color: #d01120;
		margin-top: .1rem;
		margin-bottom: 0.2rem;
	}
	.detail-left .text{
		width: 4.9rem;
		font-size: .2rem;
	}

	.detail-right .upton-number{
		font:0.466rem/0.8rem "";
		color: #fff;
		font-size: .5rem;
	}
	
	.detail-right .upton-type{
		font: 0.3rem/0.6rem "";
		color: #fff;
		font-size: 0.28rem;
		letter-spacing: 0.04rem;
		margin-top: .1rem;
	}
	.btn{
		background-color:#D01120; 
		color:#fff;
		width: 6.7rem;
		height: 0.75rem;
		line-height: 0.75rem;
		text-align: center;
		border-radius: 10px;
		position: fixed;
		bottom: 0.5rem;
		-left: 0.4rem;
		margin: 0 auto;
	}

	.pay-btn{
		background-color: #D01120;
		position: fixed;
		left: 0;
		bottom: 0;
		bottom: 0;
		z-index: 3;
		width: 100%;
		height: 0.9rem;
		text-align: center;
		color: #fff;
		line-height: 0.9rem;
	}
    /* 发票 */
    .invoice{
	border:1px solid #cecdc9;
	padding-top: 0.5rem;
	margin-top: 0.6rem;
	padding-left: 1rem;
}
.invoice .ty-label{
	padding: 0 0.2rem;
}
.form-row{
	padding-bottom: 0.4rem;
}
.t-label{padding: 20px;font-size: 14px;}
.t-input{margin-left: 8px;border: none;font-size: 12px;outline: none;}
.mint-cell-wrapper{
	border:none;
}
.qufapiao{color: red;margin-bottom: .2rem;}
.box-bg {width: 100%;opacity: .5;height: 100%;position: fixed;
	    background-color: #666;top: 0;left: 0;z-index: 100;display: none}
</style>