<template>
<div :class="{addhouses:dataArr.length==0}">
   <div class="myhouse">
	   <div id="login" v-show="login"></div> 
       <div class="nohouse" v-if="dataArr.length == 0"></div>
       <ul class="house-list" v-else>
           <li v-for="(i,index) in dataArr">
				<p>
					<span class="fl huzhu">{{i.sect_name}} {{i.city_name}}</span>
					<i  @click="del(i,index)" class="fr del-icon" ></i>
				</p>
				<p>
					<span class="fl">{{i.cell_addr}}</span> 
					<span class="fr">{{i.cnst_area}}平米</span>
				</p>
				<p>{{i.ver_no}}（户号）</p>
			</li>
       </ul>
	   <div style="height:0.98rem;width:100%;"></div>
       <mt-button  size="large" class="bottomBtn" @click.native="addHouse" >添加房子</mt-button>
   </div>
</div>   
</template>

<script>
import { MessageBox, Toast } from 'mint-ui';
let vm;
export default {
   data () {
       return {
		   dataArr:[],
		   login:true,
       };
   },
   created() {
       vm=this;
   },
   mounted() {
	   	this.common.checkRegisterStatus();
	   vm.showList()
   },

   components: {},

   methods: {
       	showList(){
	  		let url = '/hexiehouses';
		  	vm.receiveData.getData(vm,url,'data',function(){
		  		if(vm.data.result != null){
			  		vm.dataArr = vm.data.result		  			
		  		}else{
		  			vm.dataArr = []
				}
				vm.login=false; 
		  	})
          },
          //添加房子
          addHouse() {
              	this.$router.push("/addhouse")
          },
        //删除
         del(value,index) {
             MessageBox.confirm('确定要删除吗?').then(action => {
				//删除数组下的改对象
				vm.dataArr.splice(index,1)
		  		let url='/hexiehouse/delete/'+ value.mng_cell_id;
		  		vm.receiveData.getData(vm, url, 'delData',function(){
		  			Toast({
					  message: '删除成功',
					  position: 'top',
					  duration: 1000
					});
		  		})
			}).catch(reject =>{//点击了取消
				return
			})
         }
   },

   computed: {},
}
</script>

<style  scoped>
.addhouses {
	height:100%;
	background-color:#fff;
}
    .myhouse{         
		font-size: 0.26rem; 
	}
	.nohouse{   
		/* width:100%;
		height:auto;       */
		height:11.1rem;         
		background: url('../../assets/bg_nohouse.jpg') no-repeat center center;
		background-size: cover;         
		-moz-background-size:100% 100%;     

	}
    .house-list{
		list-style: none;
		padding: 0;
		margin-top: 0.1rem;
	}
	.house-list li{
		padding:0 0.26rem 0.3rem;
		overflow: hidden;
		border-bottom: 0.2rem solid #f6f7f2;
	}

	.house-list li p{
		height: 0.7rem;
		line-height: 0.7rem;
		margin:0;
		overflow: hidden;
	}
    .huzhu{font-size: 0.34rem;font-weight: bold;}
	.bottomBtn{
		font-size: 0.3rem;         
		position: fixed;         
		bottom: 0.02rem;
		height: 0.98rem;         
		background-color:#d01120;         
		color:white;     
	}
    .del-icon{
		background: url('../../assets/wuye/icon_cancel.png') no-repeat center;
		background-size: cover;
		width: 25px;
		height: 25px;
		margin-top: 5px;
	}
	#login {
		background: rgba(0,0,0,0.5);
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		position: fixed; 
		z-index:10000000;
	}
</style>