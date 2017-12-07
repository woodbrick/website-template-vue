<style lang="less" type="text/less" rel="stylesheet/less">
  @import "../../less/defination";
  .base {
    display: flex;
    height: 100%;

    .left-nav {
      flex: 2;

      .el-menu {
        height: 100%;
      }
    }
    .content-box {
      flex: 10;
    }
  }
</style>
<template>
  <div class="base">
    <div class="left-nav">
      <el-menu :default-active="$route.path" theme="dark" :router="true">
        <template v-for="route in routes">
          <template v-if="!route.children">
            <el-menu-item :index="route.path" :key="route.path">
              {{route.name}}
            </el-menu-item>
          </template>
          <template v-else>
            <el-submenu :index="route.path">
              <template slot="title">{{route.name}}</template>
              <el-menu-item v-for="subRoute in route.children"
                            :index="subRoute.path"
                            :key="subRoute.path">{{subRoute.name}}</el-menu-item>
            </el-submenu>
          </template>
        </template>
      </el-menu>
    </div>
    <div class="content-box">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      let baseRoute = this.$router.options.routes.filter(item => item.path === '/')[0]
      return {
        routes: this.mapRoute(baseRoute)
      }
    },
    methods: {
      mapRoute(baseRoute) {
        return baseRoute.children.map(route => ({
          name: route.name,
          path: `/${baseRoute.path}/${route.path}`.replace('///', '/'),
          children: route.children ? this.mapRoute(route) : false
        }))
      }
    }
  }
</script>
