import FormImg from './img.vue'
import FormSelectDepartment from './select-department.vue'
import FormRadioTree from './radio-tree.vue'
import FormMultipleSelect from './multiple-select.vue'
import FormCheckboxGroup from './checkbox-group.vue'
import FormInputList from './input-list.vue'
import FormTransfer from './transfer.vue'
let FormInput = {
  template: `
    <el-input
      v-model="row[field.prop]"
      auto-complete="off"
      :disabled="field.isDisable && field.isDisable(row)">
      <template v-if="field.editorSuffix" slot="append">{{field.editorSuffix}}</template>
      <template v-if="field.editorPrefix" slot="prepend">{{field.editorPrefix}}</template>
    </el-input>`,
  props: ['row', 'field']
}
let FormTextarea = {
  template: `
    <el-input
      type="textarea"
      :rows="2"
      v-model="row[field.prop]"
      auto-complete="off"
      :disabled="field.isDisable && field.isDisable(row)"></el-input>
  `,
  props: ['row', 'field']
}
let FormRadio = {
  template: `
    <div>
      <el-radio v-for="option in field.editorOptions"
                class="radio"
                v-model="row[field.prop]"
                :disabled="field.isDisable && field.isDisable(row)"
                :key="option.value"
                :label="option.value">{{option.key}}</el-radio>
    </div>
  `,
  props: ['row', 'field']
}
let FormSwitch = {
  template: `
    <el-switch
      v-model="row[field.prop]"
      on-value="1"
      off-value="0"
      @change="updateProp"
      :disabled="field.isDisable && field.isDisable(row)"></el-switch>
  `,
  props: ['row', 'field'],
  methods: {
    updateProp(newValue) {
      this.$emit('updateProp', this.field.prop, newValue)
    }
  }
}
let FormSelect = {
  template: `
    <el-select v-model="row[field.prop]" placeholder="请选择" filterable
      :disabled="field.isDisable && field.isDisable(row)" >
      <el-option
        v-for="item in field.selectOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  `,
  props: ['row', 'field', 'display'],
  watch: {
    display(display) {
      if (display) {
        let key = this.row[this.field.prop]
        this.change(key)
      }
    }
  },
  mounted() {
    let key = this.row[this.field.prop]
    this.change(key)
  },
  methods: {
    change(value) {
      if (typeof this.field.editorChange === 'function') {
        this.field.editorChange(value, this.row)
      }
    }
  }
}
let FormCascaderSelect = {
  template: `
    <el-cascader
      v-model="value"
      :disabled="field.isDisable && field.isDisable(row)"
      :options="field.selectOptions"
      :show-all-levels="!field.isDisable || !field.isDisable(row)"
      filterable
      change-on-select
      @change="change">
    </el-cascader>
  `,
  props: ['row', 'field', 'display'],
  data() {
    return {
      value: this.getValue()
    }
  },
  watch: {
    row() {
      this.value = this.getValue()
    }
  },
  methods: {
    getValue() {
      let value = []
      let data = this.row[this.field.prop]
      if (data) {
        value.push(data.split('_')[0])
        data.split('_').reduce((pre, current, index) => {
          if (index === 0) {
            return current
          } else {
            pre = [pre, current].join('_')
            value.push(pre)
            return pre
          }
        })
      } else if (this.field.defaultValue) {
        this.row[this.field.prop] = this.field.defaultValue
        value.push(this.field.defaultValue)
      }
      return value
    },
    change(arr) {
      this.row[this.field.prop] = arr[arr.length - 1]
    }
  }
}
let LastFormCascaderSelect = {
  template: `
    <el-cascader
      v-model="value"
      :disabled="field.isDisable && field.isDisable(row)"
      :options="field.selectOptions"
      :show-all-levels="false"
      filterable
      @change="change">
    </el-cascader>
  `,
  extends: FormCascaderSelect
}
let FormNumber = {
  template: `
    <el-input-number
      v-model="row[field.prop]"
      :min="field.min || 1"
      :max="field.max || 999"
      :disabled="field.isDisable && field.isDisable(row)"></el-input-number>
  `,
  props: ['row', 'field']
}
export {
  FormImg,
  FormInput,
  FormTextarea,
  FormRadio,
  FormSwitch,
  FormSelect,
  FormCascaderSelect,
  LastFormCascaderSelect,
  FormNumber,
  FormSelectDepartment,
  FormRadioTree,
  FormMultipleSelect,
  FormCheckboxGroup,
  FormInputList,
  FormTransfer
}
