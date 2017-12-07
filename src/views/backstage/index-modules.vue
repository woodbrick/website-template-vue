<template>
  <div class="systems">
    <routed-crumb topic="module"></routed-crumb>
    <el-form :inline="true" :model="filterForm" class="filter-form">
      <el-form-item label="指标名称">
        <el-input v-model="filterForm.cname" placeholder="指标名称" @keyup.native.enter="search"></el-input>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-select v-model="filterForm.isUsed" placeholder="未选择">
          <el-option label="全部" value=""></el-option>
          <el-option label="启用" value="1"></el-option>
          <el-option label="未启用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <paged-table :resourceConfig="quotaConfig" :fields="fields" :filterForm.sync="filterForm"></paged-table>
  </div>
</template>
<script>
  import PagedTable from '../../components/paged-table.vue'
  import {FormInput, FormSwitch} from '../../components/form/fields'
  import {TableSwitch, TableSpan, TableRoute} from '../../components/table/fields'
  import {RuleRequire, RuleRange, Range} from '../../components/form/rules'
  import RoutedCrumb from '../../components/routed-breadcrumb.vue'

  export default {
    name: 'blank',
    components: {
      'paged-table': PagedTable,
      RoutedCrumb
    },
    data() {
      return {
        quotaConfig: {
          url: '/nova/manage/module',
          resKey: 'rows',
          pageSize: 10,
          params: {limit: 1000},
          submitParams: {}
        },
        fields: [
          {
            prop: 'id',
            label: 'ID'
          },
          {
            prop: 'ename',
            label: '组件名',
            displayType: TableSpan,
            editorType: FormInput
          },
          {
            prop: 'cname',
            label: '指标名称',
            displayType: TableRoute,
            route: '/index/module/:id/chart',
            editorType: FormInput,
            rules: [new RuleRequire(true), new RuleRange(Range.short)]
          },
          {
            prop: 'isUsed',
            label: '是否启用',
            displayType: TableSwitch,
            editorType: FormSwitch,
            defaultValue: '1',
            rules: [new RuleRequire(true), new RuleRange(Range.shortest)]
          },
          {
            prop: 'createDate',
            label: '更新时间',
            displayType: TableSpan,
            editorType: FormInput,
            readonly: true
          }
        ],
        filterForm: {
          cname: '',
          isUsed: ''
        }
      }
    },
    methods: {
      search() {
        let temp = JSON.stringify(this.filterForm)
        this.filterForm = {}
        this.filterForm = JSON.parse(temp)
      }
    }
  }
</script>
