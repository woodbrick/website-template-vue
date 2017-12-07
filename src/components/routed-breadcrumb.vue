<style>
  div .bread {
    display: inline-block;
  }
  .breadcrumb {
    display: inline-block;
    margin-bottom: .5rem;
    font-size: 1rem;
  }
</style>
<template>
  <div class="bread">
    <el-breadcrumb class="breadcrumb" separator="/">
      <span class="el-breadcrumb__item" v-for="route in displayRoutes" :key="route.path">
        <span class="el-breadcrumb__item__inner"  @click="goToPage(route.path)">{{route.name}}{{route.tip}}</span>
        <span class="el-breadcrumb__separator">/</span>
      </span>
    </el-breadcrumb>
  </div>
</template>
<script>
  export default {
    computed: {
      displayRoutes() {
        let paths = this.$route.query.route_paths
        let names = this.$route.query.route_names

        if (paths && paths.length > 0 && names && names.length > 0) {
          this.$route.query.route_paths = paths = Array.isArray(paths) ? paths : [paths]
          this.$route.query.route_names = names = Array.isArray(names) ? names : [names]
          return paths.map((path, index) => ({
            path: path,
            name: names[index]
          })).concat([{
            name: this.$route.name
          }])
        } else {
          let rootPath = this.$route.matched[1].path.replace('/', '')
          let relativePath = this.$route.matched[2].path.replace(`/${rootPath}/`, '')
          let series = this.$route.meta.series
          let parentRoot = this.$router.options.routes[0].children.filter(item => item.path === rootPath)[0]
          if (parentRoot && series) {
            let seriesRoutes = parentRoot.children.filter(item => item.meta && item.meta.series === series)
            return this.getDisplayRoutes(seriesRoutes, rootPath, relativePath)
          } else {
            return [{
              name: this.$route.name
            }]
          }
        }
      },
      query() {
        return JSON.parse(JSON.stringify(this.$route.query))
      }
    },
    methods: {
      goToPage(path) {
        let paths = this.$route.query.route_paths
        let names = this.$route.query.route_names
        if (Array.isArray(paths) && Array.isArray(names)) {
          paths.every((item, index) => {
            if (item === path) {
              this.$route.query.route_paths = paths.slice(0, index)
              this.$route.query.route_names = names.slice(0, index)
              return false
            } else {
              return true
            }
          })
        }
        console.log(this.$route.query)
        this.$router.push({
          path: path,
          query: this.$route.query
        })
      },
      getDisplayRoutes(seriesRoutes, rootPath, relativePath) {
        let tipMap = this.$route.query.tip || {}
        let displayRoutes = []
        let params = this.$route.params
        seriesRoutes.every((route, index) => {
          let tip = tipMap[route.name] || ''
          let path = route.path
          Object.keys(params).forEach(key => {
            path = path.replace(':' + key, params[key])
          })
          displayRoutes.push({
            name: route.name,
            tip: tip && route.path !== relativePath ? '- ' + tip : '',
            path: `/${rootPath}/${path}`
          })
          return route.path !== relativePath
        })
        return displayRoutes
      }
    }
  }
</script>
