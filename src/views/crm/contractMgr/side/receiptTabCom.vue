<template>
  <div class="tableStyle">
    <!-- 表格 -->
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
import CommonTable from './../../../../components/CommonTable/CommonTable'
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
          label: '收款单号',
          prop: 'id',
          isShowTooltip: true
        },
        {
          label: '签约家长',
          prop: 'parentName',
          isShowTooltip: true
        },
        {
          label: '收款方式',
          prop: 'paymentName',
          isShowTooltip: true
        },
        {
          label: '收款状态',
          prop: 'status',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if(row.status == '1') { //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        ${'已到账'}
                      </div>`
            }
            if(row.status == '2') { //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        ${'待确认'}
                      </div>`
            }
            if(row.status == '3') { //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        ${'已作废'}
                      </div>`
            }
          }
        },
        {
          label: '收款账号',
          prop: 'acctNo',
          isShowTooltip: true
        },
        {
          label: '流水号',
          prop: 'realSerialNumber',
          isShowTooltip: true
        },
        {
          label: '收款金额',
          prop: 'money',
          isShowTooltip: true
        },
        {
          label: '实际到账',
          prop: 'realMoney',
          isShowTooltip: true
        },
        {
          label: '收款日期',
          prop: 'createTime',
          isShowTooltip: true
        },
        {
          label: '收款人',
          prop: 'receiverName',
          isShowTooltip: true
        }
      ],
      options: {
        isSettingShow: false // 是否出现设置
      },
      tableHeight: 'calc(100vh - 263px)'
    }
  },
  methods: {
    /* 获取列表 */
    getOpenList(purchaseId) {
      const params = {
        purchaseId: purchaseId,
        pageIndex: 0
      }
      this.$refs.tableCommon.getList(params)
    }
  }
}
</script>

<style lang="scss" scoped>
.tableStyle {
  padding: 5px 0 0 20px;
}
</style>

