// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

/*引入mint-ui 和 axios*/
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(MintUI)



//引入初始样式
import './assets/css/base.css'
import './assets/css/normalize.css'
import './assets/js/rem'
import $ from 'jquery'
import cookie from 'js-cookie'


import {common,MasterConfig,getUrlParam,reLogin} from './common.js'

Vue.prototype.reLogin = reLogin;
Vue.prototype.common = common;
Vue.prototype.getUrlParam = getUrlParam;
Vue.prototype.baseUrl = MasterConfig.C('baseUrl');
Vue.prototype.basePageUrl = MasterConfig.C('basePageUrl');
Vue.prototype.basePageUrlpay = MasterConfig.C('basePageUrlpay');



import receiveData from './receiveData.js'
Vue.prototype.receiveData = receiveData;

var axiosInstance = axios.create({
  transformRequest: [function (data) {
      data = JSON.stringify(data);
      return data;
  }],
  headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
     
      'Accept': 'application/json',

      //  'Content-Type':'appliaction/json',
     'Content-Type':'application/json;charset=UTF-8'
      // 'Origin': 'http://10.0.8.62:85'


  },
  // baseURL: 'http://wuye.gm4life.cn/wangdu/wechat/hexie/wechat/',
  baseURL:Vue.prototype.baseUrl,
  // 可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL

  withCredentials:true,//表示跨域请求时是否需要使用凭证
  transformResponse: [function (data) {//数据转换
    // data = JSON.stringify(data);
    return data;
  }],
});
//创建axios拦截器 给请求头加cookie

axiosInstance.interceptors.request.use(
  config => {
    
      if( !cookie.get('session')){//没有seesion 判断  暂时跳过直接在首页就存seesion
        
      }else{//在请求头加 session
        config.headers.Cookie =`${ cookie.get('Cookie') }`
      }

       return config
  },
  err => {
      return Promise.reject(err)
  },

  
)

Vue.use(VueAxios, axiosInstance);


Vue.config.productionTip = false//阻止启动生产消息
Vue.config.debug=true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
