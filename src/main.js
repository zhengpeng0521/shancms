import Vue from 'vue'

// import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VCharts from 'v-charts'

import BaiduMap from 'vue-baidu-map'
import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog' // error log
import './permission' // permission control
import './mock' // simulation data

import moment from 'moment'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { contains } from './utils/arrayUtils'

import VueFullcalendar from 'fullcalendar' //eslint-disable-line
import 'fullcalendar/dist/locale/zh-cn'
import 'fullcalendar/dist/fullcalendar.css'

import * as filters from './filters' // global filters

// 通用版本引入
// import { axiosReport } from 'web-report'
// // 使用
// axiosReport({
//   domain: 'http://192.168.1.155:7001/api/v1/report/web',
//   add: {
//     appId: 'aBXeamE1558076362921'
//   }
// })

import global_ from './org.vue' // 定义全局org和tenantId

Vue.prototype.GLOBAL = global_

Vue.use(Element, {
  size: 'mini', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// 全局防点击事件添加
import repeatDely from '../src/directive/repeatdelay/index'

Vue.use(repeatDely)

Vue.use(BaiduMap, {
  ak: 'XpzcjaqlX0oCEYNGa4aR4LKtkmt4ncyb'
})
Vue.use(VCharts)

/**
 * 点击量打点指令
 * compName 模块名称
 * eventName 事件名称
 * v-log="{compName:'首页',eventName:'BANNER点击'}"
 */
Vue.directive('log', {
  bind(el, binding, vnode) {
    el.addEventListener('click', () => {
      const value = binding.value
      const compName = value.compName || ''
      const eventName = value.eventName || ''
      window.__ml && window.__ml.api && window.__ml.api(eventName, true, 0, 200, compName)
    })
  }
})

Vue.prototype.$moment = moment // 赋值使用
Vue.prototype.hasMenu = function(meunId) {
  return contains(store.getters.roles, meunId)
}
Vue.prototype.hasBtn = function(btnId) {
  return contains(store.getters.buttonAuth, btnId)
}

window.REPORT_URL = 'ss-stat-provider' // 报表服务
window.SYS_URL = 'ss-sys-provider' // 系统服务
window.SS_CRM = 'ss-crm-provider' // ss-crm服务
window.HOME_URL = 'ss-sys-provider' // 首页服务

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Vue.use(VueQuillEditor)
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
