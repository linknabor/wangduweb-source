<template>
<div id="divwuye"  @scroll="getscroll">
   <div class="main">
	   <div id="phoneAjax" v-show="showp"> 
			<img src="../../assets/img/c3d7f369-4a5e-4c4a-9fb9-a4b9d274c7e1.gif" style="width:40px;height:40px;vertical-align: middle;">
		</div>
        <mt-navbar id="navBar"  v-model="selected">
	    	<mt-tab-item id="b">物业缴费</mt-tab-item>
			<mt-tab-item id="c">查询缴费</mt-tab-item>
	    	<mt-tab-item id="a">账单缴费</mt-tab-item>
	    </mt-navbar>
        <mt-tab-container v-model="selected">
            <mt-tab-container-item id="a">
                <!-- 账单缴费开始-->
                <div class="lite-divider">
                    <input placeholder="输入账单号可快速缴费" class="hidden-input" style="text-align:left;" v-model="stmtId">
                    <div class="scan-icon" @click="show"></div>
                </div>
                <mt-button class="subBtn" size="large" @click.native="submit" >提交</mt-button>
            <div id="word">
			  		<Bill :bill-info="quickBillInfo"  @itemClick="itemClick"></Bill>
           </div>
				<div slot="bottom" class="mint-loadmore-bottom">
					<!-- :class="{ 'is-rotate ': bottomStatus === 'drop' }" -->
					<span v-show="bottomStatus !== 'loading'" >上拉刷新</span>
					<span v-show="bottomStatus === 'loading'">
						<mt-spinner type="snake"></mt-spinner>
					</span>
				</div>	 

			
            <div style="width:100%;height:0.92rem;"></div>
            <div class="btn-fixed" v-show="zhangdan">
	    		<div class="fl select-btn" v-show="quan1" :class="{allSelected:quickAllselect}"   @click="allSelect(quickBillInfo,'quickAllselect')">全选&nbsp;</div>
	    		<div class="pay"   @click="pay('quickBillInfo','quickAllPrice','quickAllselect')">
	    			我要缴费
	    			<span>
	    				￥{{quickAllPrice}}
	    			</span>
	    		</div>
    		</div> 
                <!-- 账单缴费结束 -->
            </mt-tab-container-item>
            
             <!-- 物业缴费 -->
             <mt-tab-container-item id="b">
              <div id="word">
			  		<Bill :bill-info="billInfo" @itemClick="itemClick"></Bill>
                  </div>
				<div slot="bottom" class="mint-loadmore-bottom">
					<!-- :class="{ 'is-rotate ': bottomStatus === 'drop' }" -->
					<span v-show="bottomStatus !== 'loading'" >上拉刷新</span>
					<span v-show="bottomStatus === 'loading'">
						<mt-spinner type="snake"></mt-spinner>
					</span>
				</div>	 
			 	<div style="width:100%;height:0.92rem;"></div>
		    	<div class="btn-fixed">
		    		<div class="fl select-btn" v-show="quan2" :class="{allSelected:bAllSelect }" @click="allSelect(billInfo,'bAllSelect')">全选&nbsp;</div>
		    		<div class="pay" @click="pay('billInfo','allPrice','bAllSelect')">
		    			我要缴费
		    			<span>
		    				￥{{allPrice}}
		    			</span>
		    		</div>
        		</div>
            </mt-tab-container-item>

             <!-- 查询缴费 -->
             <mt-tab-container-item id="c">
              <div class="query-data">
                    <div class="input-row">
                        小区： 
                        <select class="virtual-input"  v-model="sect" @change="sectSelect($event)">
							<!-- <option value="0">请选择</option> -->
                            <option v-for="item in sectList" :value="item.id"  :key="item.id">{{item.name}}</option>	
                        </select>
			  	    </div>
                    <div class="input-row">
                        楼宇：
                        <select class="virtual-input"  v-model="build" @change="buildSelect($event)">
							<!-- <option value="0">请选择</option> -->
                            <option  v-for="item in buildList" :value="item.id"  :key="item.id" >{{item.name}}</option>	
                        </select>
			  	    </div>
                     <div class="input-row">
                        门牌：
                        <select class="virtual-input" v-model="unit" @change="unitSelect($event)">
							<!-- <option value="0">请选择</option> -->
                            <option   v-for="item in unitList" :value="item.id"  :key="item.id" >{{item.name}}</option>	
                        </select>
			  	    </div>
                    <div class="input-row">
                        室号： 
                        <select class="virtual-input"  v-model="house" @change="houseSelect($event)">
							<!-- <option value="0">请选择</option> -->
                            <option   v-for="item in houseList" :value="item.id"  :key="item.id" >{{item.name}}</option>	
                        </select>
			  	    </div>      
              </div>
			<div id="word">
		
			  	<Bill :bill-info="queryBillInfo" @itemClick="itemClick"></Bill>
                </div>
				<div slot="bottom" class="mint-loadmore-bottom">
					<!-- :class="{ 'is-rotate ': bottomStatus === 'drop' }" -->
					<span v-show="bottomStatus !== 'loading'" >上拉刷新</span>
					<span v-show="bottomStatus === 'loading'">
						<mt-spinner type="snake"></mt-spinner>
					</span>
				</div>

			
           
			<div style="widtt:100%;height:0.92rem;"></div>
			<div class="btn-fixed">
	    		<div class="fl select-btn" v-show="quan3" :class="{allSelected:queryAllselect }" @click="allSelect(queryBillInfo,'queryAllselect')">全选&nbsp;</div>
	    		<div class="pay" @click="pay('queryBillInfo','queryAllPrice','queryAllselect')">
	    			我要缴费
	    			<span>
	    				￥{{queryAllPrice}}
	    			</span>
	    		</div>
       		</div>
			 </mt-tab-container-item>
        </mt-tab-container>
   </div>
   </div>
</template>

<script>
let vm;
let isloadPage=false;
import wx from 'weixin-js-sdk';
import Bill from '../../components/bill.vue' 
import { Loadmore} from 'mint-ui';
import { Spinner } from 'mint-ui';
export default {
   data () {
       return {
           sectList:[],//小区列表
            buildList:[],//楼宇列表
            unitList:[],//门牌列表
            houseList:[],//室号列表
            sect:'',//小区id
            build:'',//楼宇id
            unit:'',//门牌id
            house:'',//室号id
           stmtId:'',//快捷缴费 扫描出来的账单号
           selected:'b', //选项卡 默认选中
		   quickisLastPage:false,//快捷缴费是否为最后一页
		   queryisLastPage:false,
           bisLastPage:false,//物业是否为最后一页
           url : '/billList',
	  	   params : {
	  			startDate:'',
	  			endDate:'',
	  			payStatus: '02', //写死
	  			currentPage : 1, //页码
	  			totalCount : 0, //第几条开始
              },
           quickBillpage:1,  
		   billPage :1, // 物业缴费页码 
		   queryBillPage:1,//查询页码
           quickBillInfo:[],//快捷查询数据
		   billInfo:[],//物业缴费
		   queryBillInfo : [],//查询缴费数据
           reduceMode :1,//减免金额的方式
           pay_least_month:0,//月份
           quickAllselect:false,//快速缴费全选
		   bAllSelect:false,//物业缴费全选
		   queryAllselect:false,//查询全选
		   quan1:false,
		   quan2:false,
		   quan3:false,
		   permit_skip_pay:'1',
		   showp:false,
		   zhangdan:false,
		   bottomStatus:'',
       };
   },
    created(){
	  	vm = this;
	  },
   mounted() {
	   
   
	     //微信配置
		this.common.checkRegisterStatus();
	  	let url = location.href.split('#')[0]
		vm.receiveData.wxconfig(vm,wx,['scanQRCode'],url);
		
       	//请求物业缴费首屏数据
	  	vm.receiveData.getData(vm, vm.url, 'data',function(){
	  		vm.billInfo = vm.data.result.bill_info;//物业缴费
			vm.pay_least_month = vm.data.result.pay_least_month;
			vm.reduceMode = vm.data.result.reduce_mode;//减免方式
			vm.permit_skip_pay=vm.data.result.permit_skip_pay;//判断跳跃付款 
          },vm.params);
          //查询缴费 小区数据
	  	vm.receiveData.getData(vm,'/getSect','sectList',function(){
			  vm.sectList = vm.sectList.result;
			  vm.sectList.unshift({id:'0',name:'请选择'})
			 
		  });
		 
   },

   components: {
       Bill
   },
    watch: {
    selected(newv,old){
      isloadPage=false;
    }
  },

   methods: {
	  
	    handleBottomChange(status) {
			  vm.bottomStatus= status
		  },
       	//调用微信扫一扫接口, 成功 数据返回到stmtId,显示在input上
	  	show(){
	  	 	vm.receiveData.scan(vm,wx,'stmtId');
          },
          //快捷查询提交
          submit() {
            if(vm.stmtId == "" || vm.stmtId.length != 18){
	  			alert('请输入正确账单号');
	  			return ;
	  		}
			// vm.showp=true;
			 isloadPage=false; //重置加载状态
			vm.quickAllselect = false;//重置加载状态
	  		vm.quickBillpage = 1;
	  		let url = "quickPayBillList/"+vm.stmtId+"/"+vm.quickBillpage+"/"+vm.params.totalCount;
	  		vm.receiveData.getData(
	  			vm,
	  			url,
	  			'quickData',
	  			function(){
	  				if( vm.quickData.result && vm.quickData.result.bill_info.length>0){
						vm.zhangdan=true;
						vm.quickBillInfo = vm.quickData.result.bill_info;
						vm.reduceMode = vm.quickData.result.reduce_mode;
						vm.pay_least_month = vm.quickData.result.pay_least_month;
						vm.permit_skip_pay=vm.quickData.result.permit_skip_pay;//判断跳跃付款
						
	  				}else{
	  					alert('未查询到数据')
					  }
					// vm.showp=false;
	  			}
	  		)
		  },
		  //分页 
		 getscroll(e) {
			var st = e.srcElement.scrollTop;
			// console.log(st);
			var ad=window.innerHeight
			var hd=$('#word').height();
			// console.log(st+ad)
			if( st+ad >=hd && !isloadPage) {
				isloadPage=true;
				if(vm.selected=='a'){
					vm.quickloadBottom();
				}else if(vm.selected=='b') {
					vm.loadBottom();
				}else {
					vm.queryLoadBottom();
				}
			}
       },  	
        ///点击某个选中按钮 params1:被点击按钮的下标 params2:被点击按钮所属的数组
        itemClick(index,b) {
            let len = b.length;
	  		if (b[index].pay_status!="02") {
	  			return;
              }
              
            //permit_skip_pay  0允许  1不允许
			if(vm.permit_skip_pay == '1') {
				if(b[index].selected){//选中状态下
					for(let i=index;i< len;i++){
						//后面的全部取消选中
						vm.$set(b[i],'selected',false);	

					}
					//某一个点击了取消后全选消失
					vm.bAllSelect = false;
					vm.queryAllselect=false;
					vm.quickAllselect=false;
					//    console.log(vm.bAllSelect)
				}else{//未选中状态下，前面全部选中
					for(let j=index;j >= 0;j--){//
						vm.$set(b[j],'selected',true);	
						
					}
				}
			}else if(vm.permit_skip_pay == '0'){
				if(b[index].selected){//选中状态下
					vm.$set(b[index],'selected',false);	
					//某一个点击了取消后全选消失
					vm.bAllSelect = false;
					vm.queryAllselect=false;
					vm.quickAllselect=false;
					//    console.log(vm.bAllSelect)
				}else{//未选中状态下，前面全部选中
						vm.$set(b[index],'selected',true);	
					}
			}
          },
        //快捷缴费上拉加载数据
        quickloadBottom(){
			
            //临时接收的数组
	  		let tempArr = null;
	  		//页码加1
	  		// vm.quickBillpage +=1;
  			let url = "quickPayBillList/"+vm.stmtId+"/"+vm.quickBillpage+"/"+vm.params.totalCount;
	  		//请求接口数据
	  		vm.receiveData.getData(
	  			vm,
	  			url,
	  			'pageData3',
	  			function(){
	  				tempArr = vm.pageData3.result.bill_info;
	  				if( tempArr && tempArr.length > 0){
	  					vm.quickBillInfo =vm.quickBillInfo.concat(tempArr) //快捷缴费
						  vm.quickAllselect = false;
						  vm.quickBillpage += 1;
                          isloadPage=false;
	  				}else{
						//   vm.quickisLastPage = true;
						  vm.quan1=true;
	  				}
	  			})
			//   this.$refs.loadmore1.onBottomLoaded();  	
			  
        },
        //物业下拉加载
        loadBottom() {
			
            		//临时接收的数组
  			let tempArr = null;
	  		//页码自增 
	  		// vm.billPage += 1;
			vm.params.currentPage = vm.billPage;
			//请求接口数据
			vm.receiveData.getData(
				vm,
				vm.url,
				'pageData',
				function(){
					vm.billPage += 1;
	  				tempArr = vm.pageData.result.bill_info;//物业缴费
	  				if(tempArr && tempArr.length > 0){
	  					
	  					vm.billInfo =vm.billInfo.concat(tempArr) //物业缴费
						  vm.bAllSelect = false;
						   isloadPage=false;
	  				}else{
						//   vm.bisLastPage = true;
							vm.quan2=true;
	  				}
	  			},
	  			vm.params
	  		)
			//   this.$refs.loadmore2.onBottomLoaded(); 	
		
		},
		//查询缴费
		queryLoadBottom() {
			
			let tempArr = null;
	  		//页码加1
	  		// vm.queryBillPage += 1;
	  		vm.params.currentPage = vm.queryBillPage;
	  		let url = 'billList';
	  		vm.receiveData.getData(vm,url,'pageData4',function(){
				  
	  			tempArr = vm.pageData4.result.bill_info;
	  			if( tempArr && tempArr.length > 0){
  					vm.queryBillInfo =vm.queryBillInfo.concat(tempArr) //快捷缴费
					  vm.queryAllselect = false;
					  vm.queryBillPage+=1;
                       isloadPage=false;
	  			}else{
					//   vm.queryisLastPage = true;
					  vm.quan3=true;
	  			}
			},vm.params)
			// this.$refs.loadmore3.onBottomLoaded();
		
		},
        //点击全选
        allSelect(arr,a) {
            	if(vm[a] ){//取消全选
	  			for(let i in arr){
	  				vm.$set(arr[i],'selected',false);
	  			}
	  		}else{//全部选中
	  			for(let i in arr){
			  		if(vm.$set(arr[i],'selected',true)){
  						vm.$set(arr[i],'selected',true);
  					}
	  			}
	  		}
	  		//取反
	  		vm[a] = !vm[a];
        },
        //点击账单缴费按钮
        //第一个参数 账单数组，第二个参数 总价 第三个参数 是否全选,所有参数 string
        pay(list,allPrice,allselect) {
			if( vm[allPrice] < 0.01){
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
			//   pay_cell_addr
	  		for(let i in selectedArr){
	  			if(selectedArr.length - 1 == i){
					  bills+=selectedArr[i].bill_id;
	  			}else{
					  bills+=selectedArr[i].bill_id+',';
	  			}	  			
	  		}
			if(vm.pay_least_month>0){
				if(vm.pay_least_month>selectedArr.length){
					alert("请至少选择"+vm.pay_least_month+"个月的账单进行支付。");
					return false;
				}
			}
				// console.log(escape(pay_addr))
				// console.log(pay_addr)
			let str = 'http://wuye.gm4life.cn/wangdu/weixin/pay/';
	  		let baseUrl='http://wuye.gm4life.cn/wangdu/weixin/';
	  		let url = str +"gmpaymentdetails.html?#/?billIds="+bills+"&stmtId="+vm.stmtId+"&payAddr="+escape(pay_addr)+"&totalPrice="+vm[allPrice]+"&reduceMode="+vm.reduceMode+"&basePageUrl="+baseUrl;
        	window.location.href = url;
		},
		 //获取小区
        sectSelect(event) {
			vm.sect= event.target.value;
			vm.getCellMng(vm.sect, "", "", '03');//楼宇 
			// vm.getCellMng(vm.sect, "0", "", '02');//门牌
			// vm.getCellMng(vm.sect, "0", "0", '01');//室号
		},
		//获取楼区
		buildSelect(event) {
			vm.build = event.target.value;
	  		vm.getCellMng(vm.sect,vm.build,'','02');
		},
		//门牌
		unitSelect(event) {
			vm.unit = event.target.value;
	  		vm.getCellMng(vm.sect,vm.build,vm.unit,'01');
		},
		//室号
		houseSelect(event){
			vm.queryBillInfo= [];//清空查询账单列表
    		vm.queryBillPage = 1;//页码重置
			vm.queryisLastPage=false;//是否最后一页重置
			isloadPage=false;//重置加载状态
			vm.showp=true;
			vm.queryBillList();
		},
		//请求查询缴费 账单列表
		queryBillList(){
			let url = 'billList';
			vm.params.house_id = vm.house;
			vm.params.currentPage = 1;
			vm.receiveData.getData(vm,url,'queryBillInfoData',function(){
				vm.showp=false;
				vm.queryBillInfo = vm.queryBillInfoData.result.bill_info;
				vm.permit_skip_pay=vm.queryBillInfoData.result.permit_skip_pay;//判断跳跃付款
				if(vm.queryBillInfo.length==0){
					alert("未查询到账单")
				}
				console.log('我是减免方式:'+vm.queryBillInfoData.result.reduce_mode+'我把他赋值给'+vm.reduceMode)
				vm.pay_least_month = vm.queryBillInfoData.result.pay_least_month;
				vm.reduceMode=vm.queryBillInfoData.result.reduce_mode;  //从新赋值减免方式
			},vm.params)
		},
        //定义公共获取小区数据
        getCellMng(sect_id,build_id,unit_id,data_type){
			vm.showp=true;
			let url = 'getcellbyid';
			let params = {
				sect_id, 
				build_id,
				unit_id,
				data_type 
            };
			vm.receiveData.getData(vm,url,'queryInfo',function(){
				let InfoList = vm.queryInfo.result;
				vm.queryBillInfo  = [];//清空查询账单列表
				if ("03"==data_type) {
				 	vm.buildList = InfoList.build_info;
				 	vm.buildList.unshift({id:'0',name:'请选择'})
					vm.getCellMng(vm.sect, "", "", '02');//门牌
					vm.getCellMng(vm.sect, "", "", '01');//室号
				 	vm.build = '';
		  			vm.unit = '';
		  			vm.house = '';
					vm.unitList = [];
					vm.houseList = [];
				}else if("02"==data_type){
					vm.unitList= InfoList.unit_info;
					vm.unitList.unshift({id:'0',name:'请选择'})
					if(vm.unitList.length==1){
			  			vm.getCellMng(vm.sect,vm.build,vm.unit,'01');
			  		}
			  		vm.unit = '';
			  		vm.house = '';
					vm.houseList = [];
				}else if("01"==data_type){
					vm.houseList = InfoList.house_info;
					vm.houseList .unshift({id:'0',name:'请选择'})
				}
				vm.showp=false;
			},params)
            
        },
       
   },

   computed: {
       //快捷缴费总价
       quickAllPrice() {
           let ap = 0;
	  		for(let i in this.quickBillInfo){
	  			if(this.quickBillInfo[i].selected == true && this.quickBillInfo[i].pay_status=="02"){
	  				ap+=Number(this.quickBillInfo[i].fee_price)
	  			}
	  		}
	  		return parseFloat(ap).toFixed(2)
       },
       //物业总价
       allPrice() {
	  		let ap = 0;
	  		for(let i in this.billInfo){
	  			if(this.billInfo[i].selected == true ){
	  				ap+=Number(this.billInfo[i].fee_price)
	  			}
	  		}
	  		return parseFloat(ap).toFixed(2)
		  },
	   queryAllPrice() {
		   let ap = 0;
	  		for(let i in this.queryBillInfo){
	  			if(this.queryBillInfo[i].selected == true){
	  				ap+=Number(this.queryBillInfo[i].fee_price)
	  			}
	  		}
	  		return parseFloat(ap).toFixed(2)
		  }
   },
}
</script>
<style>
	.mint-tab-item-label{
		font-size: 0.3rem;
	}
</style>
<style  scoped>
.mint-loadmore-bottom span {
    display: inline-block;
    -webkit-transition: .2s linear;
    transition: .2s linear;
    vertical-align: middle
}
 
.mint-loadmore-bottom span.is-rotate {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg)
}
.main{
 		margin:0 0.3rem;
 	}
.mint-navbar .mint-tab-item{
	 	border-bottom: 1px solid #cdcdcb;
	 }

.mint-navbar .mint-tab-item.is-selected{
	 	border-bottom: 1px solid #D01120;
	 	margin-bottom: 0;
	 	color:#D01120;
	 }
.lite-divider{
		border-bottom: 1px solid #d4cfc8;
		/* padding-left: 0.15rem; */
		overflow: hidden;
		padding: 1px;
		margin-top:35px;
	}
.hidden-input{
		height: 0.4rem;
		margin-top: 0.4rem;
		width: 4rem;
		background: black;
		border: none;
		outline: none;
		background-color: transparent;
		font-size: 0.28rem;
		padding: 0 0.15rem 0.15rem;
	}

.scan-icon{
		float: right;
		display: inline-block;
		height: 0.4rem;
		width: 0.4rem;
		background: url('../../assets/wuye/icon_scan.png') ;
		background-size: cover;
		margin-top: 10px;
	} 
.subBtn{
		height: 0.88rem;
		line-height: 0.88rem;
		background-color: #D01120;
		font-size: 0.3rem;
		color: white;
		width: 6rem;
		margin: 0.6rem auto 0;
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
	#phoneAjax {
		position: fixed;
		top: 20%;
		left: 50%;
		width: 60px;
		height: 60px;
		line-height: 60px;
		margin-left: -30px;
		text-align: center;
		background-color: #ccc;
		-moz-opacity: .8;
		opacity: .80;
		filter: alpha(opacity=80);
		z-index: 1998;
		overflow: auto;
		-moz-border-radius: 15px;
		-webkit-border-radius: 15px
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
a{color:black}
	/*查询缴费*/
	
.query-data{
		/*height: 100%;*/
		padding: 0.25rem 1.2rem;
		/*margin-bottom: 0.2rem;*/
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
	#divwuye {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
}   

</style>