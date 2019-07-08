<template>
  <div class="inventoryDetail_container">
    <div class="search">
      <div>
        <CommonSearch
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
        <Advanced-search
          v-bind="superSearch"
          style="margin-bottom: 14px"
        />
      </div>
      <div>
        <el-button
          v-log="{compName:'进销存管理',eventName:'web-【学员CRM】-进销存管理-库存明细-导出库存明细'}"
          class="green_btn"
          @click="exportStock"
        >导出</el-button>
      </div>
    </div>
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      table-key="crm_inventory_detail"
    />
  </div>
</template>

<script>
import {
  getGoods
} from '@/api/crm/market/stock'
import { getStockDetail } from '@/api/crm/market/stockDetail'
import CommonTable from '../../../components/CommonTable/CommonTable'
import CommonSearch from '../../../components/CommonSearch/CommonSearch'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import { exportFile } from '@/utils/exportFile'

export default {
  components: {
    CommonTable,
    CommonSearch,
    AdvancedSearch
  },
  data() {
    return {
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '日期',
          prop: 'date',
          isShowTooltip: true,
          isShowSet: false,
          width: '170px',
          formatter: (row, column, cellValue) => {
            return `<div style="text-overflow:ellipsis;overflow:hidden">${row.date}</div>`
          },
          render: (h, params) => {
            return h('span', {}, [
              h('el-popover', {
                props: { placement: 'top', width: '200', trigger: 'hover', content: params.row.date }
              }, [
                h('span', { slot: 'reference' }, params.row.date)
              ])
            ])
          }
        },
        {
          label: '操作',
          prop: 'typeName',
          isShowTooltip: true,
          isShowSet: true
        },
        {
          label: '数量',
          prop: 'num',
          isShowTooltip: true,
          isShowSet: true,
          render: (h, params) => {
            return h('span', {}, [
              h('el-popover', {
                props: { placement: 'top', width: '200', trigger: 'hover', content: params.row.num }
              }, [
                h('span', { slot: 'reference' }, params.row.num)
              ])
            ])
          }
        },
        {
          label: '物资名称',
          prop: 'proName',
          isShowTooltip: true,
          isShowSet: true,
          render: (h, params) => {
            return h('span', {}, [
              h('el-popover', {
                props: { placement: 'top', trigger: 'hover', content: params.row.proName }
              }, [
                h('span', { slot: 'reference' }, params.row.proName)
              ])
            ])
          }
        },
        {
          label: '创建人',
          prop: 'createName',
          isShowTooltip: true,
          isShowSet: true,
          formatter: (row, column, cellValue) => {
            return `<div style="text-overflow:ellipsis;overflow:hidden">${row.createName}</div>`
          },
          render: (h, params) => {
            return h('span', {}, [
              h('el-popover', {
                props: { placement: 'top', width: '200', trigger: 'hover', content: params.row.createName }
              }, [
                h('span', { slot: 'reference' }, params.row.createName)
              ])
            ])
          }
        }
      ],
      options: {
        isSettingShow: true, // 是否出现设置
        apiService: getStockDetail // 表格的数据请求接口
      },
      tableHeight: 'calc(100vh - 228px)',
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'select',
            placeholder: '物资名称',
            modelValue: 'proId',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            listKey: 'list',
            labelKey: 'name',
            valueKey: 'id',
            apiService: getGoods
          }, {
            itemType: 'select',
            placeholder: '操作类型',
            modelValue: 'type',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '进货',
                value: '1'
              }, {
                label: '退货',
                value: '2'
              }, {
                label: '领用',
                value: '3'
              }, {
                label: '退领',
                value: '4'
              }, {
                label: '报损',
                value: '5'
              }, {
                label: '销售',
                value: '6'
              }, {
                label: '库存调整',
                value: '8'
              }
            ]
          }, {
            itemType: 'datePicker',
            datePickerType: 'daterange',
            rangeSeparator: '~',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd',
            modelValue: 'date',
            itemStyle: 'width:250px'
          }
        ]
      },
      superSearch: {
        onClear: this.onClear,
        onSearch: this.onSearch,
        fields: [
          {
            type: 'input',
            key: 'createName',
            label: '创建人'
          }
        ]
      },
      superValue: {}
    }
  },

  methods: {

    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      const params = {
        ...this.superValue,
        ...this.formValue
        // proId: this.formInline.proId,
        // type: this.formInline.type
      }
      if (params && params.date && params.date.length > 0) {
        params.beginTime = params.date && params.date[0]
        params.endTime = params.date && params.date[1]
      }
      delete params.date
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        ...this.superValue,
        pageIndex: 0
      }
      this.formValue = {}
      this.$refs.tableCommon.getList(params)
    },

    /** 高级搜索 */
    onSearch(superValue) {
      this.superValue = superValue
      const params = {
        ...this.superValue,
        ...this.formValue
        // proId: this.formInline.proId,
        // type: this.formInline.type
      }
      if (params && params.date && params.date.length > 0) {
        params.beginTime = params.date && params.date[0]
        params.endTime = params.date && params.date[1]
      }
      delete params.date
      this.$refs.tableCommon.getList(params)
    },

    /** 高级重置 */
    onClear() {
      const params = {
        ...this.formValue,
        pageIndex: 0
      }
      if (params && params.date && params.date.length > 0) {
        params.beginTime = params.date && params.date[0]
        params.endTime = params.date && params.date[1]
      }
      delete params.date
      this.superValue = {}
      this.$refs.tableCommon.getList(params)
    },

    /** 导出 */
    exportStock() {
      const params = {
        ...this.superValue,
        proId: this.formInline.proId,
        type: this.formInline.type
      }
      if (this.formInline.date) {
        params.beginTime = this.formInline.date[0]
        params.endTime = this.formInline.date[1]
      }
      for (const key in params) {
        if (!params[key]) {
          delete params[key]
        }
      }
      if (this.$refs.tableCommon.totalCount > 0) {
        exportFile(`${window.SS_CRM}/crm/product/exportRepertoryDetail`, params)
      } else {
        this.$message.error('暂无数据导出')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  justify-content: space-between;
  height: 48px;
}
</style>

