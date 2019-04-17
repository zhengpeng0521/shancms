<template>
  <div class="returnMoney_container">
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
    />
  </div>
</template>

<script>
import CommonTable from '../../../../../components/CommonTable/CommonTable'
export default {
  components: {
    CommonTable
  },
  data() {
    return {
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '退款单号',
          prop: 'id',
          isShowTooltip: true
        },
        {
          label: '合同号',
          prop: 'purchaseId',
          isShowTooltip: true
        },
        {
          label: '退款类型',
          prop: 'refundType',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.refundType === '1') {
              return `<div>${'退课时'} + ':' +${row.periodNum}</div>`
            }
            if (row.refundType === '2') {
              return `<div>${'退款'}</div>`
            }
          }
        },
        {
          label: '退款说明',
          prop: 'refundWay',
          isShowTooltip: true
        },
        {
          label: '退款状态',
          prop: 'status',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.status === '1') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: #D0021B;border-radius: 50px;margin-right: 5px;"></span>
                        ${'待退款'}
                      </div>`
            }
            if (row.status === '2') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: #87D068;border-radius: 50px;margin-right: 5px;"></span>
                        ${'已退款'}
                      </div>`
            }
            if (row.status === '3') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: #87D068;border-radius: 50px;margin-right: 5px;"></span>
                        ${'已驳回'}
                      </div>`
            }
          }
        },
        {
          label: '退款日期',
          prop: 'createTime',
          isShowTooltip: true
        },
        {
          label: '创建人',
          prop: 'creatorName',
          isShowTooltip: true
        }
        // {
        //   label: '所属校区',
        //   prop: 'orgName',
        //   isShowTooltip: true
        // }
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
    }
  }
}
</script>

<style lang="scss" scoped>
.returnMoney_container /deep/ {
  .el-table__body,
  .el-table__footer,
  .el-table__header {
    width: 100% !important;
  }
}
</style>

