<style lang="less" type="text/less" rel="stylesheet/less">
  .tree-editor {
    padding: 20px;

    .table-data {
      display: flex;
      justify-content: flex-end;
      &>*:first-child {
        width: 300px;
      }
      &>*:not(:first-child) {
        flex: 1;
      }
      input {
        height: 32px;
        width: 90%;
        padding: 0 6px;
        margin-left: -6px;
        font-size: 16px;
      }
    }
    .status-bar {
      display: flex;
      justify-content: space-between;
      &>div {
        flex: 1;
      }
    }
    .right {
      text-align: right;
    }
  }
</style>
<template>
  <div class="tree-editor">
    <div class="status-bar">
      <div class="left">
        <div class="row">
          <label>表单名称：</label><span>{{parentFormData.name}}</span>
        </div>
        <div class="row">
          <label>分配部门：</label><span>{{parentFormData.deptName}}</span>
        </div>
        <div class="row">
          <label>表单描述：</label><span>{{parentFormData.description}}</span>
        </div>
      </div>
      <div class="right">
        <div class="inline">
          <label for="">开始录入时间：</label><span>{{parentFormData.startInputTime}}</span>
        </div>
        <div class="inline">
          <label for="">结束录入时间：</label><span>{{parentFormData.endInputTime}}</span>
        </div>
      </div>
    </div>
    <node-tree
      id="test"
      ref="nodeTree"
      nodeKey="deptCode"
      :searchable="false"
      :treeData="treeData"
      :renderRow="renderRow"
      :renderOperation="renderOperation"
    ></node-tree>
  </div>
</template>
<script>
  import Resource, {doGet} from '../../utils/resource'
  import nodeTree from '../../components/node-tree'
  
  const InlineForm = {
    name: 'inline-form',
    template: `
      <el-form class="table-data" :model="form" @click.native="stopProp">
        <el-input v-model="form.name"/>
        <el-input v-model="form.description"/>
        <el-input v-model="form.unit"/>
        <el-input v-model="form.modifyDate"/>
      </el-form>
    `,
    props: ['data'],
    data() {
      return {
        form: {}
      }
    },
    mounted() {
      this.form = JSON.parse(JSON.stringify(this.data))
    },
    methods: {
      getFormData() {
        return this.form
      },
      stopProp(e) {
        e.stopPropagation()
      }
    }
  }
  export default {
    components: {
      nodeTree,
      InlineForm
    },
    data() {
      this.getAuthority()
      let params = this.$route.params
      let id = params.formId
      return {
        resource: new Resource(this.$resource(`/thor/statistic/item?formId=${id}`)),
        display: false,
        rowData: [],
        treeData: [],
        parentFormData: {}
      }
    }, // data
    mounted() {
      Promise.all([this.resource.get(), doGet('/thor/statistic/form/1')])
        .then(results => {
          let [treeRes, dataRes] = results
          this.rowData = JSON.parse(JSON.stringify(treeRes.data))
          this.parentFormData = JSON.parse(JSON.stringify(dataRes.data))
          this.updateTreeData(treeRes.data, dataRes.data)
          setTimeout(this.updateIndent)
        })
    },
    watch: {
      display() {
        if (this.display === false) {
          this.$refs.editForm.resetFields()
        }
      }
    },
    methods: {
      renameProp(dataArr, from, to) {
        dataArr.forEach(item => {
          if (item[from]) {
            this.renameProp(item[from], from, to)
            item[to] = item[from]
            delete item[from]
          }
        })
      },
      updateIndent() {
        let nodeList = this.$refs.nodeTree.$el.querySelectorAll('.el-tree-node__content')
        let firstNode = nodeList[0]
        let width = firstNode.querySelector('.table-data div:first-child').clientWidth
        Array.prototype.forEach.call(nodeList, node => {
          let left = node.style['padding-left'].match(/\d+/)
          left = left ? parseInt(left[0]) : 0
          let firstTab = node.querySelector('.table-data div:first-child')
          firstTab.style.width = `${width - left}px`
        })
      },
      getAuthority() {
        doGet('/thor/userinfo')
          .then(res => {
            let menus = res.data.menus || []
            this.canAdd = menus.indexOf('page_inset') > -1
            this.canEdit = menus.indexOf('page_update') > -1
            this.canDelete = menus.indexOf('page_delete') > -1
          })
      },
      updateTreeData(data, root) {
        data.forEach(item => {
          item.editing = false
          item.deleted = false
        })
        this.renameProp(data, 'childItems', 'children')
        root.disableEdit = true
        root.disableDelete = true
        root.children = data
        root.id = -1
        console.log(root)
        this.treeData = [root]
      },
      addRow(data, evt) {
        evt.stopPropagation()
        let newRow = {
          parentId: data.id,
          formId: this.parentFormData.id,
          disableEdit: false,
          editing: true,
          name: '',
          creator: '',
          modifyDate: ''
        }
        this.searchTree(
          this.treeData,
          item => item.id === data.id,
          (index, arr) => {
            let item = arr[index]
            item.children = item.children || []
            item.children.push(newRow)
          }
        )
        this.refreshOverlay()
      },
      editRow(data, evt) {
        evt.stopPropagation()
        this.searchTree(
          this.treeData,
          item => {
            item.editing = item.id === data.id
          }
        )
        this.refreshOverlay()
      },
      saveRow(_, evt) {
        evt.stopPropagation()
        let data = this.$refs.editingForm.getFormData()
        let updateItem = (index, arr) => {
          let formData = this.fetchSubmitForm(data)
          let promise = formData.id
            ? this.resource.update(formData)
            : this.resource.save(formData)
          promise.then(res => {
            if (res.success) {
              data.editing = false
            }
            arr.splice(index, 1, data)
            this.refreshOverlay()
          })
        }
        this.searchTree(
          this.treeData,
          item => item.id === data.id,
          updateItem
        )
      },
      cancelRow(data, evt) {
        evt.stopPropagation()
        this.searchTree(
          this.treeData,
          item => {
            item.editing = false
            return !item.id
          },
          (index, arr) => {
            arr.splice(index, 1)
          }
        )
        this.refreshOverlay()
      },
      deleteRow(data, evt) {
        evt.stopPropagation()
        let submitDelete = (index, arr) => {
          let item = arr[index]
          this.resource.delete(item.id).then(res => {
            if (res.success) {
              arr.splice(index, 1)
              this.refreshOverlay()
            }
          })
        }
        this.searchTree(
          this.treeData,
          item => item.id === data.id,
          submitDelete
        )
      },
      refreshOverlay() {
        this.treeData = JSON.parse(JSON.stringify(this.treeData))
        setTimeout(this.updateIndent)
      },
      fetchSubmitForm(data) {
        return {
          id: data.id,
          parentId: data.parentId,
          name: data.name,
          formId: data.formId,
          unit: data.unit,
          description: data.description
        }
      },
      searchTree(treeData, isMatch, callback) {
        let isFound = false
        treeData.every((item, index) => {
          if (isMatch(item)) {
            typeof callback === 'function' && callback(index, treeData)
            isFound = true
          } else if (item.children && Array.isArray(item.children)) {
            isFound = this.searchTree(item.children, isMatch, callback)
          }
          return !isFound
        })
        return isFound
      },
      stopProp(evt) {
        evt.stopPropagation()
      },
      renderRow(data) {
        return data.editing
          ? (
            <inline-form data={data} ref="editingForm"></inline-form>
          )
          : (
            <div class="table-data">
              <div>{data.name}</div>
              <div>{data.description}</div>
              <div>{data.unit}</div>
              <div>{data.modifyDate}</div>
            </div>
          )
      },
      renderOperation(store, data) {
        return (
          <div>
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
                on-click={ (evt) => data.editing ? this.saveRow(data, evt) : this.editRow(data, evt) }
                >{data.editing ? '保存' : '编辑'}</el-button>
              : ''
            }
            {this.canEdit && !data.disableEdit && data.editing
              ? <el-button
                size="small"
                icon="close"
                on-click={ (evt) => this.cancelRow(data, evt) }
                >取消</el-button>
              : ''
            }
            {this.canDelete && !data.disableDelete && !data.editing
              ? <el-button
                size="small"
                type="danger"
                icon="delete"
                on-click={ (evt) => this.deleteRow(data, evt) }
                >删除</el-button>
              : ''
            }
          </div>
        )
      }
    } // methods
  }
</script>
