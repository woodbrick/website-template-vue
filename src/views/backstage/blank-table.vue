<style>
  .blank-page {
    padding: 1rem;
  }
  .table-route {
    text-decoration: none;
  }
  .filter-form {
    margin-top: 1rem;
  }
</style>
<template>
  <div class="blank-page">
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    name: 'blank'
  }
</script>
