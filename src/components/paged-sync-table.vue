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
      <el-table :data="rows"
                :default-sort="resourceConfig.defaultSort"
                @sort-change="changeOrder">
        <el-table-column v-for="field in fields.filter(item => item.displayType)"
                         :label="field.label"
                         :prop="field.prop"
                         :key="field.prop"
                         :sortable="field.sortable">
          <template slot-scope="scope">
            <component :is="field.displayType" :field="field" :row="scope.row"
                       :index="scope.$index" @submitProp="submitProp"></component>
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
      v-show="total > pageSize"
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="total"
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
  import Resource from '../utils/resource'
  import PagedTable from './paged-table.vue'

  export default {
    name: 'paged-sync-table',
    extends: PagedTable,
    components: {
      ModelEditor
    },
    props: ['resourceConfig', 'fields', 'tableName', 'filterForm'],
    data() {
      return {
        resource: new Resource(this.resourceConfig.url + '{/id}'),
        rows: [],
        rowsBack: [],
        row: {},
        pageSize: this.resourceConfig.pageSize || 5,
        currentPage: 1,
        displayEditor: false,
        total: 0,
        orderData: {
          sort: '',
          order: ''
        }
      }
    },
    watch: {
      filterForm(form) {
        this.reloadAllData()
      }
    },
    mounted() {
      this.reloadAllData()
    },
    methods: {
      reloadAllData(params = {}) {
        this.displayEditor = false
        params = Object.assign({}, params, this.resourceConfig.params, this.filterForm)
        Object.keys(params).forEach(key => {
          let value = params[key]
          if (!value) {
            delete params[key]
          }
        })
        params.page = this.currentPage
        params.limit = this.pageSize
        this.resource.get(params)
          .then(res => {
            this.rows = this.resourceConfig.getRows ? this.resourceConfig.getRows(res)
              : (this.resourceConfig.resKey === '' ? res.data.rows : this.getRows(res))
            this.total = res.data.total
          })
      },
      changePage(page) {
        this.currentPage = page
        this.reloadAllData({sort: this.orderData.sort, order: this.orderData.order})
      },
      changeOrder({column, prop, order}) {
        this.orderData.sort = prop
        this.orderData.order = order === 'ascending' ? 'ASC' : 'DESC'
        this.reloadAllData({sort: prop, order: order === 'ascending' ? 'ASC' : 'DESC'})
      }
    }
  }
</script>
