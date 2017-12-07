<template>
  <div class="radio-tree">
    <el-tree ref="tree" :data="field.treeData" :props="props" accordion show-checkbox @check-change="checkChange" node-key="id"></el-tree>
  </div>
</template>

<script>
  import Axios from 'axios'
  export default {
    props: ['field', 'row'],
    data() {
      return {
        props: {
          label: 'text',
          children: 'children'
        },
        checkedNode: []
      }
    },
    watch: {
      row() {
        this.setCheckedNode()
      }
    },
    mounted() {
      this.setCheckedNode()
    },
    methods: {
      getAuthorities() {
        Axios.get('/thor/manager/role/listPerm/0').then(res => {
          this.authorities = res.data.data[0].children
        })
      },
      checkChange() {
        let nodes = this.$refs.tree.getCheckedNodes(true)
        let prop = []
        nodes.map(node => {
          prop.push(node.id)
        })
        this.$emit('updateProp', this.field.prop, prop)
      },
      getCheckedNode(nodes) {
        nodes.map(node => {
          if (this.row.ids.indexOf(node.id) > -1) {
            this.checkedNode.push(node)
          }
          if (node.children.length > 0) {
            this.getCheckedNode(node.children)
          }
        })
      },
      setCheckedNode() {
        if (this.row.ids !== undefined) {
          this.checkedNode = []
          this.getCheckedNode(this.field.treeData)
          this.$refs.tree.setCheckedKeys(this.row.ids)
        } else {
          this.$refs.tree.setCheckedKeys([])
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" type="text/less" rel="stylesheet/less" scoped>
  .radio-tree {
    ul {
      margin: 0;
      padding-left: 0;
      list-style: none;
    }
  }
</style>
