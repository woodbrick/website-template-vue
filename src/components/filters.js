let FilterSelect = {
  template: `
    <div class="filter">
      <span class="label">{{filter.label}}</span>
      <el-select v-model="value" placeholder="请选择" @change="search">
        <el-option
          v-for="item in filter.options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
  `,
  props: ['filter'],
  data() {
    return {
      value: ''
    }
  },
  methods: {
    search() {
      console.log(this.filter.propName, this.value)
      this.$emit('search', this.filter.propName, this.value)
    }
  }
}
let FilterInput = {
  template: `
    <div class="filter">
      <span class="label">{{filter.label}}</span>
      <el-input auto-complete="off" v-model="value" @keyup.native.enter="search" style="display: inline-block; width: 10rem"></el-input>
    </div>
  `,
  props: ['filter'],
  data() {
    return {
      value: ''
    }
  },
  methods: {
    search() {
      this.$emit('search', this.filter.propName, this.value)
    }
  }
}
export {
  FilterSelect,
  FilterInput
}
