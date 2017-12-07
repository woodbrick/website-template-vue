<style lang='less' type='text/less' rel='stylesheet/less'>
  .input-tags {
    .el-tag {
      margin-right: .5rem;
    }
    .el-input {
      width: 30%;
    }
    .el-input.index {
      width: 20%;
    }
    .el-table .cell, .el-table th>div {
      padding: 0 2px 0 16px;
    }
  }
</style>
<template>
  <div class="input-tags" ref="self">
    <div class="tag">
      <el-table :data="tags">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="识别码" prop="key"></el-table-column>
        <el-table-column label="名称" prop="value"></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="primary" icon="arrow-up"
                       :disabled="scope.row.key === tags[0].key"
                       @click="updateOrder(scope.$index, -1)" ></el-button>
            <el-button size="small" type="primary" icon="arrow-down"
                       :disabled="scope.row.key === tags[tags.length - 1].key"
                       @click="updateOrder(scope.$index, 1)"></el-button>
            <el-button @click="handleDelete(scope.$index, scope.row)"
                       size="small"
                       type="danger"
                       icon="delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-input v-model="key"
              placeholder="识别码"
              v-show="!field.isDisable || !field.isDisable(row)"
              @keyup.native.enter="addTag">
    </el-input>
    <el-input v-model="value" class="input-value"
              placeholder="名称"
              v-show="!field.isDisable || !field.isDisable(row)"
              @keyup.native.enter="addTag">
    </el-input>
    <el-input v-model="index"
              placeholder="序号"
              v-show="!field.isDisable || !field.isDisable(row)"
              @keyup.native.enter="addTag">
    </el-input>
    <el-button class="btn-add" type="primary" @click="addTag">新增</el-button>
  </div>
</template>
<script>
  export default {
    props: ['row', 'field', 'display'],
    data() {
      return {
        key: '',
        value: '',
        index: 1
      }
    },
    watch: {
      display(display) {
        if (display) {
          this.index = this.tags.length + 1
        }
      }
    },
    computed: {
      tags() {
        this.row[this.field.prop] = this.row[this.field.prop] || []
        return this.row[this.field.prop]
      }
    },
    methods: {
      closeTag(key) {
        this.tags.every((entry, index) => {
          if (entry.key === key) {
            this.tags.splice(index, 1)
            return false
          } else {
            return true
          }
        })
      },
      addTag() {
        if (!this.key || !this.value) return
        this.tags.splice(this.index - 1, 0, {
          key: this.key,
          value: this.value
        })
        this.key = ''
        this.value = ''
        this.index = this.tags.length + 1
        let dom = this.$refs.self.querySelector('input')
        dom.focus()
      },
      handleDelete(index) {
        this.tags.splice(index, 1)
      },
      updateOrder(index, position) {
        this.tags.splice(index + position, 0, this.tags.splice(index, 1)[0])
      }
    }
  }
</script>
