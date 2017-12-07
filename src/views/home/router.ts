import Vue from 'vue'
import Router from 'vue-router'
import Hello from '../../components/Hello.vue'
import Swiper from '../../components/swiper.vue'

Vue.use(Router)

export default new Router(<Router.RouterOptions>{
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/swiper',
      name: 'swiper',
      component: Swiper
    }
  ]
})
