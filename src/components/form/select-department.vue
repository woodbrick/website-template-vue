<template>
  <div class="select-department">
    <el-select v-for="(select, index) in selectData" :key="index" v-model="select.model" placeholder="请选择" @change="change(index, select.model)">
      <el-option
        v-for="item in select.options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  export default {
    props: ['field', 'row'],
    data() {
      return {
        deptCode: this.row[this.field.prop],
        departmentData: null,
        selectData: [
        ]
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.getDepartmens()
      })
    },
    methods: {
      getDepartmens() {
        this.$resource('/thor/manage/department').get().then(res => {
          this.departmentData = res.data.data
          let options = this.getDepartmensFromParentCode('root')
          options.unshift({ value: 'root', label: '本级' })
          this.selectData.push({
            model: 'root',
            options: options
          })
          this.$emit('updateProp', this.field.prop, 'root')
        })
      },
      getDepartmensFromParentCode(parentCode) {
        let departments = []
        this.departmentData.map(department => {
          if (department.parentCode === parentCode) {
            departments.push({
              value: department.deptCode,
              label: department.name
            })
          }
        })
        return departments
      },
      change(index, value) {
        this.selectData.splice(index + 1, this.selectData.length - (index + 1))
        if (value === '' || value === 'root') {
          return
        }
        let options = this.getDepartmensFromParentCode(value)
        options.unshift({ value: '', label: '本级' })
        this.selectData.push({
          model: '',
          options: options
        })
        this.$emit('updateProp', this.field.prop, this.selectData[this.selectData.length - 1].model === 'root' ? 'root' : this.selectData[this.selectData.length - 2].model)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .select-department .el-select {
    display: block;
    margin-bottom: 10px;
  }
</style>
