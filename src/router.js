import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
     {
      path: '/admin',
      name: 'admin',
      component:  () => import('./views/admin/Work.vue')
    },
  ]
})
