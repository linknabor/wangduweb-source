import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/index'
import wuye from '@/pages/index/index'// 首页
import Vote from '@/pages/index/vote'// 首页
import Message from '@/pages/index/message'
import Pay from '@/pages/pay/pay'//缴费页面
import PayStop from '@/pages/pay/pay-stop'//停车缴费
import Differpay from '@/pages/pay/differ-pay'//区分缴费
import Paymentquery from '@/pages/paymentquery/paymentquery'//缴费查询
import Suggest from '@/pages/suggest/suggest'//用户评论
import Myhouse from '@/pages/house/myhouse'//绑定房子
import Addhouse from '@/pages/house/add-house'
import Bindhouse from '@/pages/house/bind-house'
import Mysteward from '@/pages/mysteward/index' // 业主意见
import threadDetail from '@/pages/mysteward/threadDetail'
import Maintain  from '@/pages/maintain/index'  //在线维修
import Register from '@/pages/register/register'// 注册


Vue.use(Router)

const router= new Router({
  // mode:'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component:Index,
      children:[
        {path:'',component:wuye},
   	  ]
    },
    {
      path:'',
      name:'wuye',
      component:wuye
    },
    {
      path:'/message',
      name:'message',
      component:Message,
      meta:{
        title:'资讯信息'
      }
    },
    
    {
      path:'/pay',
      name:'pay',
      component:Pay,
      meta:{
        title:'缴费页面'
      }
    },
    {
      path:'/pay-stop',
      name:'pay-stop',
      component:PayStop,
      meta:{
        title:'停车缴费'
      }
    },
    {
      path:'/differpay',
      name:'differpay',
      component:Differpay,
      meta:{
        title:''
      }
    },
    {
      path:'/paymentquery',
      name:'paymentquery',
      component:Paymentquery
    },
    {
      path:'/vote',
      name:'vote',
      component:Vote,
      meta:{
        title:''
      }
    },
    {
      path:'/suggest',
      name:'suggest',
      component:Suggest
    },
    {
      path:'/myhouse',
      name:'myhouse',
      component:Myhouse,
      meta:{
        title:'我的房子'
      }
    },
    {
      path:'/addhouse',
      name:'addhouse',
      component:Addhouse,
      meta:{
        title:'添加房子'
      }
    },
    {
      path:'/bindhouse/:number',
      name:'bindhouse',
      component:Bindhouse,
      meta:{
        title:'绑定房子'
      }
    },
    {
      path:'/mysteward',
      name:'mysteward',
      component:Mysteward,
      
    },
    {
      path:'/maintain',
      name:'maintain',
      component:Maintain,
      
    },
    {
      path:'/threadDetail',
      name:'threadDetail',
      component:threadDetail
    },
    {
      path:'/register',
      name:'/register',
      component:Register,
      meta:{
        title:'注册'
      }
    }

  ]
})
router.beforeEach((to, from, next) => {
    //动态改变title
    changeTitle(to.meta.title)
    next();
});
//动态改变title
function changeTitle(title) {
    title = title ? title : '光明悦生活';
    window.document.title = title;
}
export default router