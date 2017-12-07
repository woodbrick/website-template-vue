<style>
  .swal2-container, .swal2-modal {
    z-index: 9999;
  }
</style>
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
  import '../../less/global.less'
  import 'sweetalert2/dist/sweetalert2.min.css'
  export default {
    name: 'backstage'
  }
</script>
