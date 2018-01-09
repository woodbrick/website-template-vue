<style lang="less">
.node-tree {
  .prefix {
    margin-right: 2px;
  }
  .el-tree {
    padding: 0;
    margin-top: 1rem;
    margin-bottom: 6rem;
    border: none;
  }
  .tree-operation {
    float: right;
    width: 240px;
    margin-top: -2px;
  }
  .el-tree-node__content {
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid rgb(225, 225, 225);
    display: flex;
    justify-content: space-between;
    padding-top: 4px;
    padding-bottom: 4px;
    .el-tree-node__expand-icon {
      align-self: center;
      &.expanded {
        transform: rotate(45deg);
      }
    }
  }
  .el-tree-node {
    white-space: normal;
  }
  .tree-toggle {
    margin-top: 1rem;
  }
  .el-button--small {
    padding: 5px 7px;
    font-size: 14px;
  }
  .row {
    font-size: 16px;
    flex: 1;
    display: flex;
    .data {
      flex: 1;
    }
  }
}
</style>
<template>
  <div class="node-tree">
    <el-input
      v-if="searchable"
      placeholder="输入关键字进行过滤"
      v-model="filterText"
      icon="search">
    </el-input>
    <el-button
      v-if="searchable"
      class="tree-toggle"
      type="primary"
      @click="toggleAllNode">
      {{isExplanded ? '收起所有' : '展开所有'}}
    </el-button>
    <el-tree
      ref="nodeTree"
      :indent="20"
      :data="treeData"
      :node-key="nodeKey"
      default-expand-all
      :expand-on-click-node="true"
      :filter-node-method="filterNode"
      :render-content="renderContent">
    </el-tree>
  </div>  
</template>
<script>
export default {
  name: 'node-tree',
  props: {
    nodeKey: String,
    treeData: Array,
    searchable: Boolean,
    add: Function,
    edit: Function,
    delete: Function,
    renderRow: Function,
    renderOperation: Function
  },
  data() {
    return {
      canAdd: true,
      canEdit: true,
      canDelete: true,
      isExplanded: true,
      filterText: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.nodeTree.filter(val)
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="row">
          <span class="data">
            {typeof this.renderRow === 'function' ? this.renderRow(data) : data.name}
          </span>
          <span class='tree-operation'>
            {typeof this.renderOperation === 'function' ? this.renderOperation(store, data)
              : <div>
                {this.canAdd && !data.disableAdd
                  ? <el-button
                    size="small"
                    type="success"
                    icon="plus"
                    on-click={ (evt) => this.addRow(data, evt) }
                    >添加</el-button>
                  : ''
                }
                {this.canEdit && !data.disableEdit
                  ? <el-button
                    size="small"
                    type="primary"
                    icon="edit"
                    on-click={ (evt) => this.editRow(data, evt) }
                    >编辑</el-button>
                  : ''
                }
                {this.canDelete && !data.disableDelete
                  ? <el-button
                    size="small"
                    type="danger"
                    icon="delete"
                    on-click={ (evt) => this.deleteRow(data, evt) }
                    >删除</el-button>
                  : ''
                }
              </div>
            }
          </span>
        </span>
      )
    },
    toggleAllNode() {
      this.isExplanded = !this.isExplanded
      this.updateNodeRecursive(this.$refs.deptTree.root, this.isExplanded)
    },
    updateNodeRecursive(node, flag) {
      node.expanded = flag
      if (Array.isArray(node.childNodes)) {
        node.childNodes.forEach(item => {
          this.updateNodeRecursive(item, flag)
        })
      }
    },
    addRow(store, data, evt) {
      evt.stopPropagation()
      typeof this.add === "function" && this.add(data, evt)
    },
    editRow(store, data, evt) {
      evt.stopPropagation()
      typeof this.edit === "function" && this.edit(data, evt)
    },
    deleteRow(store, data, evt) {
      evt.stopPropagation()
      typeof this.delete === "function" && this.delete(data, evt)
    }
  } // methods
}
</script>


