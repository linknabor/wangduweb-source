import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/index'
import Success from '@/pages/success'
import Personnel from '@/pages/personnel'
Vue.use(Router)

const router= new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      meta:{
        title:'缴费详情'
      }
    },
    {
      path: '/success',
      name: 'success',
      component: Success,
      meta:{
        title:'缴费成功'
      }
    },
    {
      path:'/personnel',
      name:'personnel',
      component:Personnel,
      meta:{
        title:''
      },
    }
  ]
});
router.beforeEach((to, from, next) => {
    //动态改变title
    changeTitle(to.meta.title)
    next();
});
//动态改变title
function changeTitle(title) {
    title = title ? title : '光明悦社区';
    window.document.title = title;
};
export default router