<template>
  <div class="app-container">
    <div class="search">
      <CommonSearch
        :is-inline="true"
        :params="formInline"
        :forms="formInline"
        @toParent="resetFieldHanle"
      />
      <advanced-search v-bind="superSearch" />
    </div>
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      :is-border="true"
      :operation="operates"
      @handleSelectionChange="selectionChange"
      @toChildData="getCheckCol"
    />
    <side-dialog :visible.sync="sideDialogShow">
      <div>ID是 {{ id }}</div>
    </side-dialog>
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import { fetchList1 } from '@/api/transaction'

import CommonTable from '../../components/CommonTable/CommonTable'
import CommonSearch from '../../components/CommonSearch/CommonSearch'
import SideDialog from '@/components/SideDialog'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
export default {
  components: {
    CommonTable,
    SideDialog,
    AdvancedSearch,
    CommonSearch
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      listQuery: {
        show: true // 是否显示
      },
      sortable: null,
      oldList: [],
      newList: [],
      columns: [
        {
          label: 'ID',
          prop: 'id',
          isShowSet: false,
          renderHeader: (h, { column, $index }) => {
            return h('div', { 'class': 'sale-work-header', style: { lineHeight: '23px', paddingTop: '7px' }}, [
              h('span', 'ID'),
              h('el-tooltip', { 'class': 'item', effect: 'dark', content: '手续费 - 交易金额 x 结算费率', placement: 'top' }, [
                h('i', { 'class': 'el-icon-question', style: { marginLeft: '5px' }})
              ])
            ])
          }
        },
        {
          label: 'Date',
          prop: 'timestamp',
          hasSort: 'true',
          isShowSet: true,
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            return `<div style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${row.timestamp} ~ ${row.author}</div>`
          },
          methods: (row) => {
            this.openSideDialog(row)
          }
        }, {
          label: 'Author',
          prop: 'author',
          isShowSet: true,
          render: (h, params) => {
            return h('span', {}, [
              h('el-popover', {
                props: { placement: 'top', width: '200', trigger: 'click', content: params.row.author }
              }, [
                h('a',
                  { slot: 'reference',
                    on: {
                      click: () => {
                        this.updateRole(params.index)
                      }
                    }
                  }, '查看')
              ])
            ])
          }
        }, {
          label: 'Importance',
          prop: 'importance',
          align: 'right',
          render: (h, params) => {
            return h('el-tag', {
              props: { type: params.row.importance === 2 ? 'success' : params.row.importance === 1 ? 'info' : 'danger' } // 组件的props
            }, params.row.importance === 2 ? '上架' : params.row.importance === 1 ? '下架' : '审核中')
          }
        },
        {
          label: 'Readings',
          prop: 'pageviews',
          isColShow: false
        }, {
          label: 'Status',
          prop: 'status',
          formatter: (row, column, cellValue) => {
            if (row.show != 'published') {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden"><div style="width:8px;height:8px;background-color: #D0021B;border-radius: 50px;margin-right: 5px;">1</div>${row.status}</div>`
            } else {
              return `<div style="text-overflow:ellipsis;overflow:hidden"><div style="width:8px;height:8px;background-color: #87D068;border-radius: 50px;margin-right: 5px;"></div>${row.status}</div>`
            }
          }
        }, {
          label: '支付类型',
          prop: 'payType'
        }, {
          label: 'Drag',
          prop: 'payUser'
        }
      ],
      options: {
        mutiSelect: true, // 是否多选
        index: true,
        apiService: fetchList, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 250px)',
      operates: {
        width: '250',
        fixed: 'right',
        list: [
          {
            label: '删除',
            type: 'normal',
            method: (row) => {
              this.deleteHandle(row)
            },
            popoverCon: [
              {
                contentText: '删除将导致该商户无法登陆，确定要删除？？'
              }
            ]
          },
          {
            label_1: '启用',
            label_2: '停用',
            type: 'unnormal',
            method: (row) => {
              this.openStopHandle(row)
            },
            prop: 'importance',
            popoverCon: [
              {
                contentText: '确定停用该商户？',
                status: '1'
              }, {
                contentText: '确定启用该商户？',
                status: '2'
              }
            ]
          }
          // {
          //   label: '详情',
          //   method: (row) => {
          //     this.toMerchantDetail(row)
          //   }
          // },
          // {
          //   label: '转移',
          //   method: (row) => {
          //     this.merchantTransfer(row)
          //   }
          // }
        ]
      },
      sideDialogShow: false,
      id: '',
      formInline: {
        searchMethod: () => {
          this.searchHandle('formInline')
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '商户号',
            modelValue: 'id',
            isClearable: true
          }, {
            itemType: 'select',
            placeholder: '请选择状态',
            modelValue: 'region',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '已开通',
                value: '1'
              }, {
                label: '已停用',
                value: '0'
              }
            ]
          }, {
            itemType: 'select',
            placeholder: '请选择类型',
            modelValue: 'test',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            apiService: fetchList1 // 是否从接口中获取
          }, {
            itemType: 'datePicker',
            datePickerType: 'date',
            placeholder: '请选择日期',
            valueFormat: 'yyyy-MM-dd',
            modelValue: 'date1'
          }, {
            itemType: 'datePicker',
            datePickerType: 'daterange',
            rangeSeparator: '~',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd',
            modelValue: 'date2'
          }, {
            itemType: 'datePicker',
            datePickerType: 'datetime',
            placeholder: '选择日期时间',
            valueFormat: 'yyyy-MM-dd-HH-mm-ss',
            modelValue: 'dateTime1'
          }, {
            itemType: 'datePicker',
            datePickerType: 'datetimerange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd-HH-mm-ss',
            modelValue: 'dateTime2'
          }, {
            itemType: 'timeSelect',
            placeholder: '请选择固定时间',
            valueFormat: 'HH-mm-ss',
            isArrowControl: true,
            modelValue: 'time1'
          }, {
            itemType: 'timeRangePicker',
            placeholder: '请选择时分的时间',
            valueFormat: 'HH:mm', // 设置返回值时间格式
            format: 'HH:mm', // 设置下拉框时间格式
            isArrowControl: true,
            modelValue: 'time5',
            pickerOption: {
              selectableRange: `00:00:00 - 23:59:00`
            }
          }, {
            itemType: 'timeRangePicker',
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间',
            isArrowControl: true,
            modelValue: 'time2',
            isRange: true
          }, {
            itemType: 'timeRangePicker',
            placeholder: '请选择时分秒的时间',
            modelValue: 'time4'
          }
        ]
      },
      advancedSearchShow: false,
      superSearch: {
        onClear: () => { this.onClear() },
        onSearch: (superValue) => { this.onSearch(superValue) },
        fields: [
          {
            type: 'input',
            key: 'name',
            label: '家长姓名'
          }, {
            type: 'select',
            key: 'sex',
            label: '性别',
            options: [
              { value: '1', label: '女' },
              { value: '2', label: '男' }
            ]
          }, {
            type: 'select',
            key: 'teacher',
            label: '老师',
            optionValue: 'id',
            optionLabel: 'name',
            options: [
              { id: '1111', name: '苍老师' },
              { id: '2222', name: '加老师' }
            ]
          }, {
            type: 'datePicker',
            key: 'createTime',
            label: '创建日期'
          }, {
            type: 'datePicker',
            key: 'rangeDate',
            dateType: 'daterange',
            label: '日期范围'
          }, {
            type: 'timePicker',
            key: 'time',
            label: '跟进时间'
          }, {
            type: 'dateTimePicker',
            key: 'dateTime',
            dateType: 'datetime',
            defaultTime: '12:00:00',
            label: '日期时间'
          }, {
            type: 'dateTimePicker',
            key: 'dateTimeRange',
            dateType: 'datetime',
            isRange: true,
            label: '日期时间范围'
          }
        ]
      }
    }
  },
  methods: {
    selectionChange(val) {
      console.info('val--->', val.length)
    },
    getCheckCol(val) {
      console.info('val--->', val)
    },
    openSideDialog(val) {
      console.info('row--->', val)
      this.sideDialogShow = true
      this.id = val.id
    },
    toMerchantDetail(row) {
      console.info('111', row.id)
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      const params = {
        id: this.formInline.id
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 1
      }
      this.$refs.tableCommon.getList(params)
    },
    /** 高级搜索 */
    onSearch(superValue) {
      console.log('onSearch', superValue)
    },
    /** 高级清除 */
    onClear() {
      console.log('onClear')
    },
    updateRole() {
      console.log('111')
    }
  }
}
</script>

<style>
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
</style>
<style lang="scss" scoped>
.demo-form-inline {
  display: inline-block;
}
</style>
<style scoped>
.icon-star {
  margin-right: 2px;
}
.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d {
  margin-top: 15px;
}
</style>
