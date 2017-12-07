import Vue from 'vue'
import Router from 'vue-router'
import Base from './base.vue'
import Quota from './quota.vue'
import Module from './index-modules.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Base',
      component: Base,
      children: [
        {
          path: 'quota',
          name: '数据测试',
          component: Quota
        },
        {
          path: 'module',
          name: '模块测试',
          component: Module
        }
      ]
    }
  ]
})
