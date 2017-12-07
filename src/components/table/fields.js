import TableRoute from './table-route.vue'
let TableSpan = {
  template: '<span class="table-span">{{row[field.prop]}}</span>',
  props: ['row', 'field']
}
let TableUrl = {
  template: '<a class="table-url" :href="row[field.prop]" target="_blank">{{row[field.prop]}}</a>',
  props: ['row', 'field']
}
let TableImg = {
  template: '<img class="table-img" :src="row[field.prop]" style="height: 6rem; width: 8rem;"/>',
  props: ['row', 'field']
}
let TableSwitch = {
  template: `<el-switch class="table-switch" v-model="row[field.prop]" on-value="1" off-value="0"
              :disabled="field.isDisable && field.isDisable(row)" @change="submitProp(field.prop, row[field.prop])"></el-switch>`,
  props: ['row', 'field', 'index'],
  methods: {
    submitProp(key, value) {
      this.$emit('submitProp', this.index, this.row, key, value)
    }
  }
}
let TableSelectSpan = {
  template: `<span><span v-for="item in options" v-if="item.value === row[field.prop]">{{item.label}}</span></span>`,
  props: ['row', 'field', 'index'],
  data() {
    return {
      options: this.getOptions()
    }
  },
  methods: {
    getOptions() {
      let options = []
      this.getIteration(this.field.selectOptions, options)
      return options
    },
    getIteration(data, options) {
      data.map(item => {
        if (item.children) {
          options.push({value: item.value, label: item.label})
          this.getIteration(item.children, options)
        } else {
          options.push({value: item.value, label: item.label})
        }
      })
    }
  }
}
export {
  TableSpan,
  TableUrl,
  TableImg,
  TableSwitch,
  TableRoute,
  TableSelectSpan
}
