<template>
  <!-- <div class="adds"> -->
   <div :class="{adds:carBillInfo.length==0}">
       <div :class="{main:carBillInfo.length>0}">
			<div v-if="carBillInfo.length == 0">
					<img  class="nohouse" src="../../assets/bg_nohouse.jpg" alt="">
			</div>
		
		<div v-else>
            <mt-loadmore 
			  	:bottomMethod="carLoadBottom" 
			  	:auto-fill = "false"
			  	:bottomAllLoaded = "carisLastPage"
				ref="loadmore"
			  >
			  	<Bill :bill-info="carBillInfo" @itemClick="itemClick"></Bill>
			</mt-loadmore>
            <div style="widtt:100%;height:0.92rem;"></div>
		</div>	
			  	<div class="btn-fixed">
		    		<div class="fl select-btn" v-show="quan" :class="{allSelected:carAllselect }" @click="allSelect(carBillInfo,'carAllselect')">全选&nbsp;</div>
		    		<div class="pay" @click="pay('carBillInfo','carAllPrice','carAllselect')">
		    			我要缴费
		    			<span>
		    				￥{{carAllPrice}}
		    			</span>
		    		</div>
        		</div>
 		</div>
	</div>		 
</template>

<script>
import wx from 'weixin-js-sdk';
import Bill from '../../components/bill.vue' 
let vm;
export default {
   data () {
       return {
           url : '/billList',
		   params : {
		  			startDate:'',
		  			endDate:'',
		  			payStatus: '02', //写死
		  			currentPage : 1, //页码
		  			totalCount : 0, //第几条开始
		  		},
           carBillInfo:[],//停车数组
           carisLastPage:false,//
           reduceMode:1,//减免方式
           pay_least_month:0,//最少支付月份
           carBillPage:1,//停车缴费页码
		   carAllselect:false,//停车缴费全选
		   permit_skip_pay:'1',
		   quan:false,
       };
   },
   created() {
       vm=this;
   },
   mounted() {
        //微信配置
       	this.common.checkRegisterStatus();
        
        //获取停车数据
        vm.receiveData.getData(vm, vm.url, 'data',function(){
		  		vm.reduceMode = vm.data.result.reduce_mode;//减免方式
		  		vm.carBillInfo = vm.data.result.car_bill_info;//停车缴费
				vm.pay_least_month = vm.data.result.pay_least_month; //最少支付月数 
				vm.permit_skip_pay=vm.data.result.permit_skip_pay;  
		},vm.params) ;
   },

   components: {Bill},

   methods: {
       //下拉刷新
       carLoadBottom() {
           //临时接收的数组
		  		let tempArr = null;
		  		//页码自增 
		  		vm.carBillPage+=1
				vm.params.currentPage = vm.carBillPage;
				//请求接口数据
				vm.receiveData.getData(
					vm,
					vm.url,
					'pageData2',
					function(){
		  				tempArr = vm.pageData2.result.car_bill_info;//停车缴费
		  				if(tempArr && tempArr.length > 0){
		  					vm.carBillInfo =vm.carBillInfo.concat(tempArr) //停车缴费
		  					vm.carAllselect = false;
		  				}else{
							  vm.carisLastPage = true;
							  vm.quan=true;
		  				}
		  			},vm.params)
		  		 vm.$refs.loadmore.onBottomLoaded()
       },
       //点击某个选中按钮 params1:被点击按钮的下标 params2:被点击按钮所属的数组
       itemClick(index,b) {
           let len = b.length
		  	//permit_skip_pay  0允许  1不允许
			if(vm.permit_skip_pay == '1') {
					if(b[index].selected){//选中状态下
						for(let i=index;i< len;i++){
							//后面的全部取消选中
							vm.$set(b[i],'selected',false);	
						}
						//某一个点击了取消后全选消失
						vm.carAllselect = false;
					}else{//未选中状态下，前面全部选中
						for(let j=index;j >= 0;j--){//
							vm.$set(b[j],'selected',true);	
						}
					}
			}else if(vm.permit_skip_pay == '0') {
				if(b[index].selected){//选中状态下
					vm.$set(b[index],'selected',false);	
					//某一个点击了取消后全选消失
					vm.carAllselect = false;
					//    console.log(vm.bAllSelect)
				}else{//未选中状态下，前面全部选中
						vm.$set(b[index],'selected',true);	
					}
			}	
       },
       //全选
       allSelect(arr,a) {
           if(vm[a] ){//取消全选
		  			for(let i in arr){
		  				vm.$set(arr[i],'selected',false);
		  			}
		  		}else{//全部选中
		  			for(let i in arr){
		  				vm.$set(arr[i],'selected',true);
		  			}
		  		}
		  		//取反
		  	vm[a] = !vm[a];
       },
       //我要缴费
       pay(list,allPrice,allselect){//第一个参数 账单数组，第二个参数 总价 第三个参数 是否全选,所有参数 string
            if( vm[allPrice] < 0.1){
		  			alert('请选择账单后支付');
		  			return
		  		}
		  		let selectedArr = [];
		  		if(vm[allselect] == true){
		  			//全部选中
		  			selectedArr = vm[list];
		  		}else{
		  			//只选中一部分
		  			for( let i in vm[list]){
		  				if(vm[list][i].selected){
		  					selectedArr.push(vm[list][i])
		  				}
		  			}
		  		}
		  		let bills="";
		  		let pay_addr = selectedArr[0].pay_addr;
		  		for(let i in selectedArr){
		  			if(selectedArr.length - 1 == i){
		  				bills+=selectedArr[i].bill_id;
		  			}else{
		  				bills+=selectedArr[i].bill_id+',';	
		  			}
		  			
		  		};
				if(vm.pay_least_month>0){
					if(vm.pay_least_month>selectedArr.length){
						alert("请至少选择"+vm.pay_least_month+"个月的账单进行支付。");
						return false;
					}
                }
                
           	let str = this.basePageUrlpay;
	  		let baseUrl=this.basePageUrl;
	  		let url = str +"gmpaymentdetails.html?#/?billIds="+bills+"&stmtId="+vm.stmtId+"&payAddr="+escape(pay_addr)+"&totalPrice="+vm[allPrice]+"&reduceMode="+vm.reduceMode+"&basePageUrl="+baseUrl;
        	window.location.href = url  
       }
   },

   computed: {
       //总价
       carAllPrice() {
           let ap = 0;
		  		for(let i in this.carBillInfo){
		  			if(this.carBillInfo[i].selected == true){
		  				ap+=Number(this.carBillInfo[i].fee_price)
		  			}
		  		}
		  		return parseFloat(ap).toFixed(2)
       }
   },
}
</script>

<style  scoped>
a{color:black}
/*查询缴费*/

.query-data{
	height: 100%;
	padding: 0.25rem 1.2rem;
	margin-bottom: 0.2rem;
}
.virtual-input{
	width:3.4rem;
	border:1px solid #4c4c4c;
	border-radius: 5px;
	padding-left: 0.2rem;
	display: inline-block;
	height: 0.5rem;
}
.input-row{
	padding-bottom: 0.3rem;
	font: 0.26rem/0.5rem "";
	color: #a6937c;
	height: 0.5rem;
}
.top2{
	position: relative;
	top: -0.2rem;

}
.adds {
	height: 100%;
	background-color:#fff;
}
.btn-fixed{
	position: fixed;
	color: #fff;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0.92rem;
    line-height: 0.92rem;
    text-align: center;
}
.nohouse {
	width: 100%;
	height: auto;
}
.select-btn{
	padding-left: 36px;
    background: url('../../assets/wuye/icon_unselect_white.png') no-repeat;
    background-color: rgba(0,0,0,0.6);
    background-size: 16px;
    background-position: 15px center;
    height: 0.92rem;
    line-height: 0.92rem;
}

.allSelected{
	background: url('../../assets/wuye/icon_selected_white.png') no-repeat;
	 background-color: rgba(0,0,0,0.6);
    background-size: 16px;
    background-position: 15px center;

}

.pay{
	overflow: hidden;
	background: #D01120;
	text-align: center;	
}	

.main{
	margin:0 0.3rem;
	
}
</style>