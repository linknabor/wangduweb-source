<template>
   <div class="bindhouse">
       	<ul  v-show="canAddhouse ">
			<li>{{data.sect_name}}&nbsp;{{data.city_name}}</li>
			<li>
				<span class="fl">{{data.cell_addr}}</span>
				<span class="fr">{{data.cnst_area}}平米</span>
			</li>
			<li>
				{{data.mng_cell_id}}(户号)
			</li>
		</ul>
    <mt-button  size="large" class="bottomBtn" @click.native="addHouse" >绑定房子</mt-button>    
   </div>
</template>

<script>
let vm;
import { MessageBox } from 'mint-ui';
export default {
   data () {
       return {
        data:{
	  			name:'',
	  		},
	  	axiosParams:{
        		number: this.$route.params.number
			},
		canAddhouse:false,
		flag:"",
       };
   },
     created(){
	  	vm = this;
	  },
   mounted() {
       this.addtian();
   },

   components: {},

   methods: {
       addtian() {
	  	 let url = '/hexiehouse?stmtId='+ this.axiosParams.number;
  		vm.receiveData.getData(vm,url,'response',function(){
			if(vm.response.success) {
				vm.flag="1";
				if(vm.response.result== null) {
					vm.data={}
					alert('未查询到该房屋')
					vm.canAddhouse=false;
				}else {
					vm.data = vm.response.result
					vm.canAddhouse=true;
				}
			}else {
				alert(vm.response.message ==null?'未查询到该房屋':vm.response.message)
			}
			  
  		})
       },
       //绑定房子
       addHouse() {
			if(vm.flag!="1"){  
				return
			}
			let  wuye_myhouse={
				url: /127|test/.test(location.origin)?'test.e-shequ.com':
					/uat/.test(location.origin)?'uat.e-shequ.com':
					'wuye.gm4life.cn'       //提示框网址
			} 
           	let stmtId = this.axiosParams.number;
	  		let url2 = '/addhexiehouse?stmtId='+stmtId+'&houseId='+this.data.mng_cell_id+'&mng_cell_id='+this.data.mng_cell_id;
	  		vm.receiveData.postData(vm,url2,this.data,'res',function(){
				if(vm.res.success) {
					if(vm.res.result !== null) {
                    MessageBox.alert('添加房子成功',wuye_myhouse.url).then( action =>{
	  						vm.$router.push("/myhouse")
	  					})
					}
					if(vm.res.result == null) {
						MessageBox.alert('添加房子失败',wuye_myhouse.url).then( action =>{
								vm.$router.push("/myhouse")
						})
					}
				}else {
					MessageBox.alert(vm.res.message).then( action =>{
						vm.$router.push("/addHouse")
	  				})
				}	
			  })
       }
   },

   computed: {},
}
</script>

<style  scoped>
	.bottomBtn{
		font-size: 0.3rem;
		position: fixed;
		bottom: 0;
		height: 0.9rem;
		line-height: 0.9rem;
		background-color:#d01120;
		color:white;
	}
	ul{
		margin: 0.1rem 0 0;
		padding: 0;
	}
	ul li{
		line-height: 0.7rem;
		color: #000;
		padding: 0.1rem 0.15rem;
		list-style: none;
		overflow: hidden;
	}
	.fr{
		float: right;
		
	}
</style>