<template>
  <div class="base-page">
    <paged-table :resourceConfig="resourceConfig" :fields="fields"></paged-table>
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
        resourceConfig: {
          url: '/data/issue',
          params: {limit: 1000},
          submitParams: {}
        },
        fields: [
          {
            prop: 'index',
            label: 'Index',
            displayType: TableSpan
          },
          {
            prop: 'title',
            label: 'Title',
            displayType: TableSpan,
            editorType: FormInput,
            rules: [new RuleRequire(true), new RuleRange(Range.short)]
          },
          {
            prop: 'author',
            label: 'Author',
            displayType: TableSpan,
            editorType: FormInput,
            rules: [new RuleRequire(true), new RuleRange(Range.short)]
          },
          {
            prop: 'active',
            label: 'Active',
            displayType: TableSwitch,
            editorType: FormSwitch,
            defaultValue: '1',
            rules: [new RuleRequire(true), new RuleRange(Range.shortest)]
          },
          {
            prop: 'datetime',
            label: 'Update date',
            displayType: TableSpan,
            editorType: FormInput
          }
        ]
      }
    }, // data
    methods: {
      search() {
        let temp = JSON.stringify(this.filterForm)
        this.filterForm = {}
        this.filterForm = JSON.parse(temp)
      }
    }
  }
</script>
