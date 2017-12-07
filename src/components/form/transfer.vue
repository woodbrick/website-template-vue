<style>
  .multiple-select .el-transfer-panel{
    width: 42%;
  }
</style>
<template>
  <div class="multiple-select">
    <el-transfer
      filterable
      :titles="['可用选项', '提交选项']"
      :filter-method="filterMethod"
      filter-placeholder="输入搜索"
      v-model="selectOptions"
      :data="options" @change="change">
    </el-transfer>
  </div>
</template>
<script>
  export default {
    props: ['row', 'field', 'display'],
    data() {
      let options = this.getOptions()
      return {
        options: options,
        selectOptions: this.row[this.field.prop] || []
      }
    },
    watch: {
      row(newValue) {
        this.selectOptions = newValue[this.field.prop]
      }
    },
    methods: {
      getOptions() {
        return this.field.selectOptions.map(item => ({
          key: item.value,
          label: item.label
        }))
      },
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1
      },
      change(selected) {
        this.row[this.field.prop] = selected
      }
    }
  }
</script>
