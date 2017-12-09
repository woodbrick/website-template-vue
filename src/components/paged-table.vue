<style lang='less' type='text/less' rel='stylesheet/less'>
  .paged-table {
    .button-create {
      float: right;
      margin: .6rem 8rem;
    }
    .el-pagination {
      text-align: center;
      margin-top: 2rem;
      width: 100%;
    }
    .table-info {
      min-height: 30rem;
      width: 100%;
      display: table;
    }
  }
</style>
<template>
  <div class="paged-table">
    <div class="table-info">
      <el-table :data="paginate(rows)"
                :default-sort="resourceConfig.defaultSort"
                @sort-change="changeOrder">
        <el-table-column v-for="field in fields.filter(item => item.displayType)"
                         :label="field.label"
                         :prop="field.prop"
                         :key="field.prop"
                         :sortable="field.sortable">
          <template slot-scope="scope">
            <component :is="field.displayType" :field="field" :row="scope.row" :index="scope.$index" @submitProp="submitProp"></component>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" align="center" v-if="!resourceConfig.notEdit">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.$index, scope.row)"
                       size="small"
                       type="primary"
                       v-show="resourceConfig.canEdit"
                       icon="edit">编辑</el-button>
            <el-button @click="handleDelete(scope.$index, scope.row)"
                       size="small"
                       type="danger"
                       v-show="resourceConfig.canDelete"
                       icon="delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-button
          v-show="!resourceConfig.notEdit && resourceConfig.canAdd"
          class="button-create"
          @click="handleEdit(-1, {})"
          type="success"
          icon="plus"
          size="small">新增</el-button>
      </el-row>
    </div>
    <el-pagination
      v-show="rows.length > pageSize"
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="rows.length"
      @current-change="changePage">
    </el-pagination>
    <template v-if="Editor">
      <comment :is="Editor"
               :resourceConfig="resourceConfig"
               :fields="fields"
               :model.sync="row"
               :display.sync="displayEditor"
               @submit="reloadNewData"
               @close="displayEditor=false"></comment>
    </template>
    <template v-else>
      <ModelEditor
        :resourceConfig="resourceConfig"
        :fields="fields"
        :model.sync="row"
        :display.sync="displayEditor"
        @submit="reloadNewData"
        @close="displayEditor=false"
      ></ModelEditor>
    </template>
  </div>
</template>
<script>
  import ModelEditor from '../components/model-editor.vue'
  import {fetchData} from '../utils/common'
  export default {
    name: 'paged-table',
    components: {
      ModelEditor
    },
    props: ['resourceConfig', 'fields', 'tableName', 'filterForm', 'Editor'],
    data() {
      return {
        resource: new Resource(this.resourceConfig.url),
        rows: [],
        rowsBack: [],
        row: {},
        pageSize: this.resourceConfig.pageSize || 5,
        currentPage: 1,
        displayEditor: false
      }
    },
    watch: {
      filterForm(form) {
        this.rows = this.rowsBack.filter(item =>
          Object.keys(form).every(key => item[key] ? item[key].indexOf(form[key]) > -1 : true))
        this.changePage(1)
      }
    },
    mounted() {
      this.reloadAllData()
    },
    methods: {
      reloadAllData() {
        this.resource.get(this.resourceConfig.params)
          .then(res => {
            if (typeof this.resourceConfig.getRows === 'function') {
              this.rows = this.resourceConfig.getRows(res)
            } else if (this.resourceConfig.resKey | 0) {
              this.rows = this.getRows(res)
            } else {
              this.rows = res.rows
            }
            this.rowsBack = this.rows
          })
      },
      reloadNewData(formData) {
        if (formData && formData.id > 0 && !this.resourceConfig.reloadAll) {
          this.loadSingleData(formData.id)
          this.displayEditor = false
        } else {
          this.reloadAllData()
          this.displayEditor = false
        }
      },
      paginate(rows) {
        return rows ? rows.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage) : []
      },
      changePage(page) {
        this.currentPage = page
      },
      changeOrder({column, prop, order}) {
        if (!prop || !order) return
        this.rows.sort((a, b) => {
          a[prop] = a[prop] === null ? '' : a[prop]
          b[prop] = b[prop] === null ? '' : b[prop]
          if (order === 'ascending') {
            return a[prop].localeCompare(b[prop])
          } else {
            return b[prop].localeCompare(a[prop])
          }
        })
      },
      handleEdit(index, data) {
        this.row = data.id ? data : {}
        this.displayEditor = true
      },
      handleDelete(index, data) {
        if (!data.id) return
        this.resource.delete(data.id)
          .then(res => {
            this.rows.forEach((row, index) => {
              if (row.id === data.id) {
                this.rows.splice(index, 1)
              }
            })
          })
          .catch(dismiss => {
            console.warn(dismiss)
          })
      },
      submitProp(index, row, key, value) {
        row[key] = value
        let formData = Object.assign(
          fetchData(this.fields.filter(field => !field.readonly), row),
          this.resourceConfig.submitParams)
        this.resource.update(formData)
          .then(res => {
            if (!this.resourceConfig.reloadAll) {
              this.loadSingleData(row.id)
            } else {
              this.reloadAllData()
            }
          })
          .catch(dismiss => {
            console.warn(dismiss)
            this.loadSingleData(row.id)
          })
      },
      loadSingleData(id) {
        this.resource.get({id: id}).then(res => {
          let rowData = res.data
          if (!rowData || !rowData.id) return
          this.rows.every((item, index) => {
            if (item.id === rowData.id) {
              this.rows.splice(index, 1, rowData)
              return false
            } else {
              return true
            }
          })
        })
      },
      getRows(res) {
        return res.data[this.resourceConfig.resKey]
      }
    }
  }
</script>
