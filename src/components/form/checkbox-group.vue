<template>
  <el-checkbox-group v-model="row[field.prop]">
    <el-checkbox v-for="data in field.checkboxData" :label="data.id" :key="data.id">{{ data.text }}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
  export default {
    props: ['field', 'row'],
    watch: {
      row() {
        this.setEmptyModel()
      }
    },
    mounted() {
      this.setEmptyModel()
    },
    methods: {
      setEmptyModel() {
        if (this.row[this.field.prop] === undefined) {
          this.row[this.field.prop] = []
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
