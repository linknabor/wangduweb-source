<template>
   <div class="p15 ">
        <div v-show="currentpage =='list'">
            <div class="dropdown-wrap" :class="{collapsed:dropdownCollapsed}" @click="toggleDropdown">
                    <span  v-show="selectedDropdown==''">账单筛选</span>
                    {{selectedDropdown.name}}
                    <div class="dropdown" v-show="!dropdownCollapsed">
                        <div class="dropdown-item no-border" v-for="(item,index) in dropdowns" @click="selectDropdown(index)" >{{item.name}}</div>
                    </div>
            </div>

            <div class="card"  v-for="(item,index) in paymentHises">
                 <div class="card-header">
                    <div class="ov" style="margin-bottom:25px">
                        <span class="fs15" style="color:#3b3937">{{item.tran_time}}</span>
                        <span class="fr fs18 highlight">¥&nbsp;{{item.bill_tran_amt}}</span>
                    </div>
                    <div class="ov fs13">
                        流水号：{{item.trade_water_id}}
                        <span class="fr">{{item.paymethodStr}}</span>
                    </div>
                 </div>
                <div class="fold-btn" @click="showDetail(index)">
                    <!-- <i :class="[{'moreIcon':!item.folded},{'topIcon':item.folded}]"  ></i> -->
                     <strong class="xiangqing">详情..</strong>
                </div>
            </div>
        </div>

        <div v-show="currentpage=='empty'">
                <div class="emptytip">没有缴费记录，快用微信进行缴费吧！</div>
        </div>

        <div v-show="currentpage=='detail'">
            <div class="info-wrap">
                <div class="input-wrap lite-divider">
                    <span class="fl fs15">交易时间</span>
                    <span class="fr fs14">{{payInfo.tran_time}}</span>
                </div>
                <div class="input-wrap lite-divider">
                    <span class="fl fs15">支付类型</span>
                    <span class="fr fs14">{{payInfo.paymethodStr}}</span>
                </div>
                <div class="input-wrap">
                    <span class="fl fs15">账单总金额</span>
                    <span class="fr fs14 highlight">¥&nbsp;{{payInfo.bill_tran_amt}}</span>
                </div>
            </div>

            <div class="p15" style="padding-bottom:50px" v-for="data in payInfofee_data">
                    <div class="card" style="padding:21px 10px">
                        <span class="card-title">户号&nbsp;{{data.ver_no}}</span>
                        <div class="ov fs13" style="margin-top:20px">
                            <span class="ib text-el" style="width:250px">{{data.cell_addr}}</span>
                            <span class="fr">{{data.cnst_area}}m</span>
                         </div>
                    </div>

                    <div class="card fs15" v-for="feename in data.fee_name">
                        <div class="ov item" style="border:none">
                                <span class="card-title">{{feename.service_fee_name}}</span>
                                <span class="fs15 fr highlight">¥{{feename.totalFee}}</span>
                            </div>
                        <div class="ov fs13 item" v-for="detail in feename.fee_detail">
                            {{detail.service_fee_cycle}}
                            <span class="fr">{{detail.fee_price}}</span>
                        </div>
                    </div>   
            </div>
            <a href="#" class="btn btn-fixed" @click="back">返回到列表</a>
        </div>
   </div>
</template>

<script>
let vm;
Date.prototype.format = function(fmt){
      var o = {
        "M+" : this.getMonth()+1,
        "d+" : this.getDate(),
        "h+" : this.getHours(),
        "m+" : this.getMinutes(),
        "s+" : this.getSeconds(),
        "q+" : Math.floor((this.getMonth()+3)/3),
        "S"  : this.getMilliseconds()
      };
      if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
      for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ?
                         (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
     return fmt;
}
var today = new Date();
	var threemonthago = (new Date(today.getTime()-92*24*3600000)).format('yyyy-MM-dd');
	var halfyearbefore = (new Date(today.getTime()-183*24*3600000)).format('yyyy-MM-dd');
	var oneyearbefore = (new Date(today.getTime()-365*24*3600000)).format('yyyy-MM-dd');
export default {
   data () {
       return {
           currentpage:'list',
           selectedDropdown:'',
           paymentHises:[],
           payInfo:{},
           payInfofee_data:[],
           dropdownCollapsed:true,
           startDate:'',
           dropdowns: [
            {
                name: '近三个月账单',
                startDate: threemonthago
            },
            {
                name: '近半年账单',
                startDate: halfyearbefore
            },
            {
                name: '近一年账单',
                startDate: oneyearbefore
            },
            {
                name: '全部账单',
                startDate: ''//根据需要传给后台的查询参数修改这些value
            }
        ],

       };
   },
   created() {
       vm=this;
   },
   mounted() {
       	this.common.checkRegisterStatus();
       this.query();//获取账单
   },

   components: {},

   methods: {
       toggleDropdown() {
           vm.dropdownCollapsed=!vm.dropdownCollapsed
       },
       selectDropdown(idx) {
            vm.selectedDropdown = vm.dropdowns[idx];
            if(vm.startDate!=vm.dropdowns[idx].startDate){
            	vm.startDate=vm.dropdowns[idx].startDate;
            	this.query();
            }
       },
       query() {
           let url="paymentHistory?startDate="+vm.startDate;
           vm.receiveData.getData(vm,url,'res',function() {
               if(vm.res.result !== null) {
                   vm.paymentHises=vm.res.result
               }
               if(vm.paymentHises.length==0) {
                          vm.currentpage='empty'
                   }else {
                       vm.currentpage="list"
                       }
               if(!vm.res.success) {
                   vm.currentpage='empty'
               }
           }) 
       },
       showDetail(index) {
           if(vm.paymentHises[index].trade_water_id == vm.payInfo.trade_water_id){
        		vm.currentpage='detail';
        	} else {
        		vm.payInfo={};
        		vm.getDetail(vm.paymentHises[index].trade_water_id);
        	}
       },
       getDetail(waterId) {
           let url="queryPaymentDetail/"+waterId;
           vm.receiveData.getData(vm,url,'res',function() {
                vm.currentpage='detail';
                vm.payInfo=vm.res.result;
                vm.payInfofee_data=vm.res.result.fee_data;
                if(!vm.res.success) {
                     alert(vm.res.message==''?"获取缴费记录失败！":vm.res.message)    
                    }
           })
       },
       back() {
           vm.currentpage='list';
       }
   },

   computed: {},
}
</script>

<style  scoped>

.p15 {
    padding:15px;
}
.xiangqing{height:20px;font-size:14px;padding-bottom:1px;border-bottom:1px solid #ccc;}
.dropdown-wrap {
    position: relative;
    padding: 15px 0;
    border-bottom: 1px solid #d4cfc8;
    background: url(../../assets/wuye/icon_top.png) no-repeat;
    background-size: 12px 7px;
    /* background-position: center right; */
    background-position: 70px;
    font-size: 14px;
}
.dropdown-wrap.collapsed {
    background-image: url(../../assets/wuye/icon_bottom.png);
}
.dropdown {
    position: absolute;
    top: 42px;
    width: 100%;
    border: 1px solid #d4cfc8;
    background-color: #fffff8;
    z-index: 1;
}
.dropdown-item {
    padding: 15px 0;
    margin: 0 15px;
    border-bottom: 1px solid #d4cfc8;
}
.no-border:last-child {
    border: none!important;
}
.card-header {
    border-bottom: 1px solid #d4cfc8;
    padding: 20px 10px;
}
 .card-content {
    border-bottom: 1px solid #d4cfc8;
    padding: 20px 10px 5px 10px;
    background: #fdfdef;
}
.card {
	margin-bottom: 15px;
	border: 1px solid #d4cfc8;
	border-radius: 3px;
	color: #666;
}
.card-title {
    font-size: 15px;
    color: #3b3937;
}
.text-el {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.ov {
    overflow: hidden;
    padding: 1px;
}
.item {
    padding: 20px 10px;
    border-top: 1px solid #d4cfc8;
}

.ib {
    display: inline-block;
}
.fs15 {
    font-size: 15px;
}
.fs13 {
    font-size: 13px;
}
.fs14 {
    font-size: 14px;
}
.fs18 {
    font-size: 18px;
}
.highlight {
    color: #d01120;
}
 .fold-btn {
    height: 32px;
    line-height: 32px;
    text-align: center;
}
.fold-btn i {
    display: inline-block;
}
.moreIcon {
    width: 15px;
    height: 3px;
}
.topIcon {
    width: 12px;
    height: 7px;
}
.emptytip{
    padding: 50px 0;
	text-align: center;
	font-size: 30px;
	background-position: 35px center;
	background-size: 35px;
	color: #d01120;
}
.info-wrap {
   padding: 4px;
    border-bottom: 5px solid #f9f9e9;
    font-size: 12px;
    color: #3b3937;
 }
.input-wrap {
    overflow: hidden;
    line-height: 45px;
 }
 .lite-divider {
    border-bottom: 1px solid #d4cfc8;
    padding-left: 15px;
}

.btn {
    display: block;
    margin: 15px;
    height: 44px;
    line-height: 44px;
    color: #fff!important;
    font-size: 15px;
    text-align: center;
    background-color: #d01120;
    border-radius: 3px;
    outline: none;
    border: none;
    text-decoration: none;
}
.btn-fixed {
    position: fixed;
    bottom: -15px;
    left: -15px;
    right: -15px;
}

</style>