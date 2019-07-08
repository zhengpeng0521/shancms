<template>
  <div>

    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="optionsTab"
    />

  </div>
</template>

<script>
import { queryPayHistoryAccountList } from '@/api/orgSet/payAccount'//eslint-disable-line

import CommonTable from '@/components/CommonTable/CommonTable'

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
          label: '编号',
          prop: 'id',
          isShowTooltip: true
        },
        {
          label: '交易单号',
          prop: 'tradeNo',
          isShowTooltip: true
        },
        {
          label: '描述',
          prop: 'subject',
          isShowTooltip: true
        },
        {
          label: '发生金额',
          prop: 'amount',
          render: (h, params) => {
            return h('span', {}, [
              h('el-popover', {
                props: { placement: 'top', trigger: 'hover', content: params.row.amount }
              }, [
                h('a', { slot: 'reference' }, params.row.amount)
              ])
            ])
          }
        },
        {
          label: '账号金额',
          prop: 'balance',
          isShowTooltip: true
        },
        {
          label: '类型',
          prop: 'trxType',
          isShowTooltip: true
        }, {
          label: '提交时间',
          prop: 'createTime',
          width: '140px',
          isShowTooltip: true
        }

      ],
      optionsTab: {
        apiService: queryPayHistoryAccountList, // 表格的数据请求接口
        isSettingShow: false // 是否出现设置
      },

      tableHeight: 'calc(100vh - 259px)'

    }
  },

  methods: {

  }
}
</script>
