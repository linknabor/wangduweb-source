// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

/*自己添加的开始  引入mint-ui 和 axios*/
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import $ from 'jquery'
import axios from 'axios';
//axios.defaults.withCredentials=true; //存储cookie？
import VueAxios from 'vue-axios';

import './assets/css/normalize.css'
import './assets/css/base.css'
import './assets/js/rem.js'

Vue.prototype.HOST = '/api' //代理

import {common,MasterConfig,getUrlParam,reLogin} from './common.js'

Vue.prototype.reLogin = reLogin;
Vue.prototype.common = common;
Vue.prototype.getUrlParam = getUrlParam;
Vue.prototype.baseUrl = MasterConfig.C('baseUrl');
Vue.prototype.basePageUrl = MasterConfig.C('basePageUrl');
Vue.prototype.basePageUrlpay = MasterConfig.C('basePageUrlpay');

import cookie from 'js-cookie'
import receiveData from './receiveData.js'
Vue.prototype.receiveData = receiveData;
Vue.use(MintUI)
var axiosInstance = axios.create({
    transformRequest: [function (data) {
        data = JSON.stringify(data);
        return data;
    }],
    headers: {
          // 'Content-Type':"text/html; charset=UTF-8",
        //   'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
        'Content-Type':"application/json",
        'Accept': 'application/json',
        // 'Content-Type':'application/json;charset=UTF-8'
    },
    
    // baseURL: 'http://wuye.gm4life.cn/wangdu/wechat/hexie/wechat/',
    baseURL:Vue.prototype.baseUrl,
    withCredentials:true,
    transformResponse: [function (data) {//数据转换
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
    }
)

Vue.use(VueAxios, axiosInstance);
Vue.config.productionTip = false;
Vue.config.debug=false;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
