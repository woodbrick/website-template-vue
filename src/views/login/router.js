import Vue from 'vue'
import Router from 'vue-router'
import LoginPage from './login-page.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'LoginPage',
      component: LoginPage
    }
  ]
})
