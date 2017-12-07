<style>
  .multiple-select .el-select{
    width: 70%;
  }
  .multiple-select .btn-add {
    margin-left: 10px;
  }
  .multiple-select .el-tag {
    margin-right: 10px;
  }
</style>
<template>
  <div class="multiple-select">
    <div class="tag">
      <el-tag
        :key="tag.ename"
        type="gray"
        v-for="tag in tags"
        :closable="true"
        :close-transition="false"
        @close="closeTag(tag)">
        {{tag.name}}
      </el-tag>
    </div>
    <el-select v-model="optionValue" filterable placeholder="请选择" :disabled="field.isDisable && field.isDisable(row)">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled">
      </el-option>
    </el-select>
    <el-button class="btn-add" type="primary" @click="addTag">新增</el-button>
  </div>
</template>
<script>
  export default {
    props: ['row', 'field', 'display'],
    data() {
      return {
        options: this.loadOptions(),
        optionValue: ''
      }
    },
    watch: {
      display(isDisplay) {
        if (!isDisplay) {
          this.optionValue = ''
        }
      }
    },
    computed: {
      tags() {
        let tags = []
        this.options = JSON.parse(JSON.stringify(this.field.selectOptions.slice()))
        if (this.row[this.field.prop]) {
          this.row[this.field.prop].map(legendId => {
            this.options.map(option => {
              if (option.value === legendId) {
                tags.push({name: option.label, ename: option.ename})
                option.disabled = true
              }
            })
          })
        }
        return tags
      }
    },
    methods: {
      loadOptions() {
        let options = JSON.parse(JSON.stringify(this.field.selectOptions.slice()))
        if (this.row[this.field.prop]) {
          this.row[this.field.prop].map(legendId => {
            options.map(option => {
              (option.value === legendId) && (option.disabled = true)
            })
          })
        }
        return options
      },
      closeTag(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1)
        let legend = 0
        this.options.map(option => {
          if (option.ename === tag.ename) {
            legend = option.value
            option.disabled = false
          }
        })
        this.row[this.field.prop].splice(this.row[this.field.prop].indexOf(legend), 1)
      },
      addTag() {
        !this.row[this.field.prop] && (this.row[this.field.prop] = [])
        let value = this.optionValue
        if (value) {
          this.options.map(item => {
            if (item.value === value) {
              this.tags.push({name: item.label, ename: item.ename})
              item.disabled = true
            }
          })
          this.row[this.field.prop].push(value)
        }
        this.optionValue = ''
      }
    }
  }
</script>
