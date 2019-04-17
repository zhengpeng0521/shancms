<template>
  <div class="parent-info">
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :pagination="listQuery"
      :table-height="tableHeight"
      :options="options"
      class="parent-list"
    />
  </div>
</template>

<script>
import CommonTable from '@/components/CommonTable/CommonTable'
import { queryOrder } from '@/api/crmDetail/crmDetail'

export default {
  components: {
    CommonTable
  },

  props: {
    headerHeight: {
      type: Number,
      required: true
    },
    params: {
      type: Object,
      required: true
    }
  },

  data() {
    const height = this.headerHeight + 40 + 30 + 40 + 74
    return {
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '合同编号',
          prop: 'orderNum',
          width: '120px',
          isShowTooltip: true
        }, {
          label: '学员类型',
          prop: 'orderNewOldstuName',
          isShowTooltip: true
        }, {
          label: '签约类型',
          prop: 'signTypeName',
          isShowTooltip: true
        }, {
          label: '购买类型',
          prop: 'orderType',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if(row.orderType == '2') { //eslint-disable-line
              return `<div>${'课时套餐'}</div>`
            }
            if(row.orderType == '3') { //eslint-disable-line
              return `<div>${'托班套餐'}</div>`
            }
          }
        }, {
          label: '会员卡号',
          prop: 'stuCardId',
          width: '120px',
          isShowTooltip: true
        }, {
          label: '签约家长',
          prop: 'parentName',
          isShowTooltip: true
        }, {
          label: '合同期限',
          prop: 'startEndTime',
          width: '200px',
          isShowTooltip: true
        }, {
          label: '合同金额',
          prop: 'orderMoney',
          align: 'right'
        }, {
          label: '审核状态',
          prop: 'orderStateName',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if(row.orderState == '0') { //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: #D0021B;border-radius: 50px;margin-right: 5px;"></span>
                        ${'无效'}
                      </div>`
            } else if(row.orderState == '1'){ //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(93, 156, 236);border-radius: 50px;margin-right: 5px;"></span>
                        ${'待审核'}
                      </div>`
            } else if(row.orderState == '3'){ //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(204, 67, 66);border-radius: 50px;margin-right: 5px;"></span>
                        ${'已驳回'}
                      </div>`
            } else if(row.orderState == '4'){ //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(136, 199, 10);border-radius: 50px;margin-right: 5px;"></span>
                        ${'已通过'}
                      </div>`
            } else {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(252, 192, 71);border-radius: 50px;margin-right: 5px;"></span>
                        ${'已作废'}
                      </div>`
            }
          }
        }, {
          label: '收款状态',
          prop: 'receiptStatus',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if(row.receiptStatus == '0') { //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(255, 127, 117);border-radius: 50px;margin-right: 5px;"></span>
                        ${'待收款'}
                      </div>`
            } else if(row.receiptStatus == '1'){ //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(136, 199, 10);border-radius: 50px;margin-right: 5px;"></span>
                        ${'收款完成'}
                      </div>`
            } else {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(255, 127, 117);border-radius: 50px;margin-right: 5px;"></span>
                        ${'部分收款'}
                      </div>`
            }
          }
        }, {
          label: '签订日期',
          prop: 'signTime',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '创建人',
          prop: 'orderCreatePerson',
          isShowTooltip: true
        }
      ],
      options: {
        // apiService: queryOrder // 表格的数据请求接口
      },
      resultCount: '',
      tableHeight: `calc(100vh - ${height}px)`
    }
  },
  created() {
    this.queryOrderFun()
  },

  methods: {
    /* 获取合同数据 */
    queryOrderFun() {
      const params = {
        stuId: this.$props.params.stuId,
        condition: 'all'
      }
      this.$nextTick(() => {
        this.options.apiService = queryOrder
        this.$refs.tableCommon.getList(params)
      })
    },

    /** 删除 */
    deleteHandle(row) {
      console.log(row)
    },

    /** 保存新增 */
    saveAdd(values) {
      console.log(values)
    }
  }
}
</script>

<style lang="scss" scoped>
.parent-info {
  padding-left: 20px;
}
.parent-list {
  margin-top: 20px;
}
</style>

<style lang="scss">
.detail-parent-pop {
  text-align: center;
}
</style>
