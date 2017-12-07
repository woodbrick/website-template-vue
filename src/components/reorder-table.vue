<template>
  <div class="paged-table">
    <div class="table-info">
      <el-table :data="paginate(rows)"
                :default-sort="resourceConfig.defaultSort"
                @sort-change="changeOrder">
        <el-table-column v-for="field in fields.filter(item => item.displayType)"
                         :label="field.label" :prop="field.prop" :key="field.prop" :sortable="field.sortable">
          <template slot-scope="scope">
            <component :is="field.displayType" :field="field" :row="scope.row" @submitProp="submitProp"></component>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="480" align="center">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.$index, scope.row)" size="small" type="primary" icon="edit">编辑</el-button>
            <el-button size="small" type="primary" icon="arrow-up"
                       :disabled="scope.row.id === rows[0].id"
                       @click="updateOrder(scope.row.id, -1)" >上移</el-button>
            <el-button size="small" type="primary" icon="arrow-down"
                       :disabled="scope.row.id === rows[rows.length - 1].id"
                       @click="updateOrder(scope.row.id, 1)">下移</el-button>
            <el-button @click="handleDelete(scope.$index, scope.row)" size="small" type="danger" icon="delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-button class="button-create" @click="handleEdit(-1, {})" type="success" icon="plus" size="small">新增</el-button>
      </el-row>
    </div>
    <el-pagination
      v-show="rows.length > pageSize"
      layout="prev, pager, next"
      :page-size="pageSize"
      :total="rows.length"
      @current-change="changePage">
    </el-pagination>
    <ModelEditor 
      :resourceConfig="resourceConfig"
      :fields="fields"
      :model.sync="row"
      :display.sync="displayEditor"
      @submit="loadData"
      @close="displayEditor=false"
    ></ModelEditor>
  </div>
</template>
<script>
  import PagedTable from './paged-table.vue'
  import swal from 'sweetalert2'
  export default {
    name: 'reorder-table',
    extends: PagedTable,
    methods: {
      updateOrder(id, direction) {
        let param = Object.assign({id: id, direction: direction}, this.resourceConfig.submitParams)
        this.$http.put(this.resourceConfig.reorderUrl, param)
          .then(resObj => {
            this.loadData()
          })
          .catch(res => {
            swal('操作失败', res.msgs, 'error')
          })
      }
    }
  }
</script>
