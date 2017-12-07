<template>
  <div class="base-page">
    <paged-table :resourceConfig="quotaConfig" :fields="fields"></paged-table>
  </div>
</template>
<script>
  import PagedTable from '../../components/paged-table.vue'
  import {FormInput, FormSwitch} from '../../components/form/fields'
  import {TableSwitch, TableSpan} from '../../components/table/fields'
  import {RuleRequire, RuleRange, Range} from '../../components/form/rules'

  export default {
    name: 'blank',
    components: {
      'paged-table': PagedTable
    },
    data() {
      return {
        quotaConfig: {
          url: '/nova/manage/quota',
          resKey: 'rows',
          params: {legendId: 108, limit: 1000},
          submitParams: {legendId: 108}
        },
        fields: [
          {
            prop: 'id',
            label: 'ID',
            displayType: TableSpan
          },
          {
            prop: 'dimension',
            label: '维度',
            displayType: TableSpan,
            editorType: FormInput,
            rules: [new RuleRequire(true), new RuleRange(Range.short)]
          },
          {
            prop: 'value',
            label: '数值',
            displayType: TableSpan,
            editorType: FormInput,
            rules: [new RuleRequire(true), new RuleRange(Range.short)]
          },
          {
            prop: 'reorder',
            label: '权重',
            displayType: TableSpan,
            editorType: FormInput,
            defaultValue: '0',
            rules: [new RuleRequire(true), new RuleRange(Range.short)]
          },
          {
            prop: 'isUsed',
            label: '是否显示',
            displayType: TableSwitch,
            editorType: FormSwitch,
            defaultValue: '1',
            rules: [new RuleRequire(true), new RuleRange(Range.shortest)]
          }
        ]
      }
    }
  }
</script>
