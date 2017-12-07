<style>
  .el-dialog div.el-dialog__body {
    padding-right: 50px;
  }
  .el-cascader {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
  .el-dialog__wrapper .el-dialog {
    min-width: 44rem;
  }
  .el-icon-information {
    position: absolute;
    top: .6rem;
    left: -140px;
  }
</style>
<template>
  <div class="paged-table">
    <el-dialog class="editor"
               title="编辑"
               :visible.sync="display"
               size="small"
               top="5%"
               :close-on-click-modal="false"
               :before-close="onClose">
      <el-form :model.sync="row" :rules="rules" ref="editForm">
        <el-form-item v-for="field in fields.filter(item => item.editorType)"
                      :label="field.label"
                      :prop="field.prop"
                      :key="field.prop"
                      v-show="!field.isHide || !field.isHide(row)"
                      label-width="140px">
          <component
            class="form-input"
            :is="field.editorType"
            :field="field"
            :row="row"
            :display="display"
            @updateProp="updateProp"></component>
          <el-tooltip class="item" effect="dark" v-show="field.editorDesc" :content="field.editorDesc" placement="left">
            <i class="el-icon-information"></i>
          </el-tooltip>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import Resource from '../utils/resource'
  import swal from 'sweetalert2'
  import {fetchData, FormArray} from '../utils/common'

  export default {
    name: 'model-editor',
    props: ['resourceConfig', 'fields', 'model', 'display'],
    data() {
      return {
        resource: new Resource(this.$resource(this.resourceConfig.url)),
        row: {},
        rules: FormArray.fromArray(this.fields)
          .mapToObject((ruleMap, field) => {
            if (!field.rules) return
            ruleMap[field.prop] = field.rules.map(rule => rule.toConfig(field))
          })
      }
    },
    watch: {
      model(model) {
        this.row = this.getFormData(model)
      },
      display(newValue) {
        if (!newValue) { // on close
          this.row = {}
        } else { // on display
          this.row = this.getFormData(this.model)
          this.$refs.editForm && this.$refs.editForm.resetFields()
        }
      }
    },
    methods: {
      getFormData(model) {
        let rModel = JSON.parse(JSON.stringify(model))
        let formData = {}
        this.fields.forEach(field => {
          formData[field.prop] = rModel[field.prop] || field.defaultValue
        })
        return formData
      },
      updateProp(key, value) {
        this.row[key] = value
      },
      submitForm() {
        this.$refs.editForm.validate((valid) => {
          if (valid) {
            this.submitRequest(this.row, this.row.id > 0 ? this.resource.update : this.resource.save)
          } else {
            console.warn('valid failed!!')
            return false
          }
        })
      },
      submitRequest(data, operation) {
        let formData = fetchData(this.fields.filter(field => !field.isDisable || !field.isDisable(data)), data)
        formData = Object.assign(formData, this.resourceConfig.submitParams)
        operation(this.trimSubmitData(formData))
          .then(resObj => {
            this.$emit('submit', formData)
          })
          .catch(res => {
            swal('操作失败', res.msgs, 'error')
          })
      },
      onClose() {
        this.$emit('close')
      },
      trimSubmitData(formData) {
        return formData
      }
    }
  }
</script>
