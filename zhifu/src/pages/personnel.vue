<template>
   <div class="code">
       <div class="title">{{sectName}}</div>
       <div class="contemt">
           <!-- <img src="../assets/logo.png" alt=""> -->
           <img :src="image" alt="">
       </div>
       <div class="content-marg">
            <div class="contant" v-for="(item,i) in cycleArrs" :key="i">
                <span>{{item.fee_name}}</span><br>
                <span>{{item.cycle_date}}</span>
            </div>
       </div>
       <div class="fonter content-marg">
           <span>支付金额:{{realityAmt | keepTwoNum}}</span>
       </div>
       
   </div>
</template>

<script>
let vm;
export default {
   data () {
       return {
           billId:this.$route.query.billId,
           stmtId:this.$route.query.stmtId,
           realityAmt:'',//实际支付金额
           image:'',//图片,
           sectName:'',//项目名称三林宛
           cycleArrs:[//账期 
            // {
            //     fee_name:'商品房物业管理费',
            //     cycle_date:'2020年1月-2020年3月'
            // },
            // {
            //     fee_name:'商品房物业管理费',
            //     cycle_date:'2020年1月-2020年3月'
            // },
            // {
            //     fee_name:'商品房物业管理费',
            //     cycle_date:'2020年1月-2020年3月'
            // }
           ]
       };
   },
   created() {
       vm = this;
   },
   mounted() {
    vm.query();
   },

   components: {},

   methods: {
    query() {
        let url ='/getDiscounts';
        let pType;
        if(vm.payType  >= 1){
            pType = 1;
        }else {
            pType = vm.payType;
        }
        let data = {
            isQrcode:'1',
            billId:vm.billId,
            stmtId:vm.stmtId,
            payType:'0',  //0微信,1卡
            payFeeType:'01', //01管理费，02停车费
            // regionName:vm.regionname, //定位地区
        };
        vm.receiveData.postData(vm,url,data,'res',function(){
            if(vm.res.success) {
                vm.realityAmt = vm.res.result.reality_amt;//实际支付金额
                vm.sectName = vm.res.result.sect_name;//项目名称
                vm.cycleArrs = vm.res.result.cycle_arrs;//账期
                vm.image = 'data:image/png;base64,'+vm.res.result.image;
            }else {
                alert(vm.res.messages)
            }
            
        })
        }

   },
   filters:{
       keepTwoNum:function(value) {
           value = Number(value);
           return   value.toFixed(2);
       }
    },
   computed: {},
}
</script>

<style  scoped>
.code {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #D01120;
    color:#fff;
}
.title {
    margin-top: 1.5rem;
    margin-bottom: 0.4rem;
    text-align: center;
    font-size: 0.5rem;
    letter-spacing: 2px;
}
.contemt {
    margin:0 20% 0.3rem 20%;
}
img {
    width: 100%;
}
.contant {
    margin:0 20% 0.1rem 20%;
}
.content-marg {
    margin-bottom: 0.4rem;
}
.contant span {
    display: inline-block;
    font-size: 0.3rem;
    line-height: 0.45rem;
}
.fonter {
    text-align: center;
    font-size: 0.35rem;
}
</style>