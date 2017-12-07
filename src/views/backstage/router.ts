import Vue from 'vue'
import Router from 'vue-router'
import Base from './base.vue'
import Issue from './issue.vue'

Vue.use(Router)

export default new Router(<Router.RouterOptions>{
  routes: [
    {
      path: '/',
      name: 'Base',
      component: Base,
      children: [
        {
          path: 'issue',
          name: 'Issue Manager',
          component: Issue
        }
      ]
    }
  ]
})
