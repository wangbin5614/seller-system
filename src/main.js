// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from "axios";
// import qs from "qs";
import ElementUI from 'element-ui';
// import { Loading } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './style/reset.css';
Vue.use(ElementUI);

import Breadcrumb from './components/breadcrumb/index';
Vue.component('Breadcrumb', Breadcrumb)

import echarts from 'echarts'
Vue.prototype.$echarts = echarts;

import preview from "vue-photo-preview";
import "vue-photo-preview/dist/skin.css";
var options = {
  // index: 0, //默认第一张
  escKey: true, // esc键盘按键事件
  bgOpacity: 0.7, // 背景透明度
  closeEl: true, // 关闭按钮
  captionEl: false, // 是否显示底部标题
  fullscreenEl: false, // 全屏按钮
  closeOnVerticalDrag: true //垂直拖动关闭画廊
};
Vue.use(preview, options);


import initAjax from './axios/index';
Vue.prototype.$get = initAjax('get');
Vue.prototype.$post = initAjax('post');
Vue.prototype.$delete = initAjax('delete');

Vue.prototype.getTime = function (val) {
  if (val) {
    let date = new Date(val);
    let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return date.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
  } else {
    return ''
  }
}

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});