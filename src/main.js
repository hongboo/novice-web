import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import store from './store/index'
import './assets/iconfont.css'
import '@/components/dm/renderer/register';
import '@/expend/register';
import VueDND from 'awe-dnd';

Vue.use(VueDND);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
