<template>
  <span @click="goToPage" :style="getStyle()">
    <span v-html="getPrefix()"></span> {{row[field.prop]}}
  </span>
</template>
<script>
  export default {
    props: ['row', 'field'],
    methods: {
      goToPage() {
        if (this.field.isRoute && !this.field.isRoute(this.row)) {
          return
        } else if (typeof this.field.route === 'function') {
          this.field.route(this.row)
        } else if (typeof this.field.route === 'string') {
          this.$router.push(this.field.route.replace(':id', this.row['id']))
        }
      },
      getStyle() {
        if (!this.field.isRoute || this.field.isRoute(this.row)) {
          return 'cursor: pointer; color: #20a0ff'
        } else {
          return ''
        }
      },
      getPrefix() {
        if (!this.field.isRoute || this.field.isRoute(this.row)) {
          return '<i class="el-icon-message">&nbsp</i>'
        } else {
          return '<i class="el-icon-document"></i>'
        }
      }
    }
  }
</script>
