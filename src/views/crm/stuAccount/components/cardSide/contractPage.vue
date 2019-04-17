<template>
  <div class="contract_container">
    <!-- 表格 -->
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
    />
    <!-- 侧边滑块合同中扣课顺序弹框 -->
    <DeductOrderDialog ref="deductOrderDialog" @afterSumit="afterSumitDialog"/>
  </div>
</template>

<script>
import CommonTable from '../../../../../components/CommonTable/CommonTable'
import DeductOrderDialog from './../deductOrderDialog.vue'
export default {
  components: {
    CommonTable,
    DeductOrderDialog
  },
  data() {
    return {
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '扣课顺序',
          prop: 'sort',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.sort === null) {
              return `<div style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${'0'}</div>`
            } else {
              return `<div style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${row.sort}</div>`
            }
          },
          methods: (row) => {
            this.openDeductDialog(row)
          }
        },
        {
          label: '合同编号',
          prop: 'orderNum',
          isShowTooltip: true
        },
        {
          label: '学员姓名',
          prop: 'id',
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span',
                params.row.stuNameList.map((item, index) => {
                  return h('span', item.stuName)
                })
              )
            ])
          }
        },
        {
          label: '学员类型',
          prop: 'stuOldNew',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.stuOldNew === '0') {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        新学员
                      </div>`
            }
            if (row.stuOldNew === '1') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        ${'老学员'}
                      </div>`
            }
          }
        },
        {
          label: '签约类型',
          prop: 'signType',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.signType === '0') {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        ${'新签约'}
                      </div>`
            }
            if (row.signType === '1') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        ${'续约'}
                      </div>`
            }
          }
        },
        {
          label: '购买类型',
          prop: 'type',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.type === '2') {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        ${'课时套餐'}
                      </div>`
            }
            if (row.type === '3') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        ${'托班套餐'}
                      </div>`
            }
          }
        },
        {
          label: '会员卡号',
          prop: 'stuCardId',
          isShowTooltip: true
        },
        {
          label: '签约家长',
          prop: 'parentName',
          isShowTooltip: true
        },
        {
          label: '合同期限',
          prop: 'startTime',
          isShowTooltip: true,
          width: '160px',
          render: (h, params) => {
            if (params.row.startTime && params.row.endTime) {
              return h('span', {}, [
                h(
                  'span',
                  params.row.startTime + '~' + params.row.endTime
                )
              ])
            } else {
              ''
            }
          }
        },
        {
          label: '合同金额',
          prop: 'oriMoney',
          isShowTooltip: true
        },
        {
          label: '审核状态',
          prop: 'status',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.status === '0') {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: #D0021B;border-radius: 50px;margin-right: 5px;"></span>
                        ${'无效'}
                      </div>`
            }
            if (row.status === '1') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: #87D068;border-radius: 50px;margin-right: 5px;"></span>
                        ${'待审核'}
                      </div>`
            }
            if (row.status === '3') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: #87D068;border-radius: 50px;margin-right: 5px;"></span>
                        ${'已驳回'}
                      </div>`
            }
            if (row.status === '4') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: #87D068;border-radius: 50px;margin-right: 5px;"></span>
                        ${'审核通过'}
                      </div>`
            }
          }
        },
        {
          label: '收款状态',
          prop: 'receiptStatus',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.receiptStatus === '0') {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: #D0021B;border-radius: 50px;margin-right: 5px;"></span>
                        ${'未收款'}
                      </div>`
            }
            if (row.receiptStatus === '1') {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: #87D068;border-radius: 50px;margin-right: 5px;"></span>
                        ${'已收款'}
                      </div>`
            }
          }
        }
      ],
      options: {
        isSettingShow: false // 是否出现设置
      },
      tableHeight: 'calc(100vh - 218px)'
    }
  },
  methods: {
    /*  */
    getOpenList(rowList) {
      this.$refs.tableCommon.getList({ id: rowList.id })
    },
    /* 打开扣课顺序弹框 */
    openDeductDialog(row) {
      this.$refs.deductOrderDialog.showDialog(row)
    },
    afterSumitDialog() {
      this.$refs.tableCommon.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

