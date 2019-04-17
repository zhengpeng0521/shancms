<template>
  <div class="wageSet">

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

import { queryPaySetRecordList } from '@/api/orgSet/payAccount'
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
          prop: 'mchId',
          width: '120px',
          render: (h, params) => {
            return h('span', {}, [
              h('el-popover', {
                props: { placement: 'top', trigger: 'hover', content: params.row.mchId }
              }, [
                h('a', { slot: 'reference' }, params.row.mchId)
              ])
            ])
          }
          // formatter: (row, column, cellValue) => {
          //   return `<div style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${row.mchId}</div>`
          // }
        },
        {
          label: '提现金额',
          prop: 'settAmount'
        },
        {
          label: '实际到账',
          prop: 'remitAmount'
        },
        {
          label: '手续费',
          prop: 'settFee'

        },
        {
          label: '户名',
          prop: 'mchName'
        },
        {
          label: '账号',
          prop: 'payeeAccount'
        }, {
          label: '开户行',
          prop: 'remitWay'
        },
        {
          label: '操作人',
          prop: 'operator'
        },
        {
          label: '提交时间',
          prop: 'createTime'
        },
        {
          label: '状态',
          prop: 'settStatus'
        }

      ],
      optionsTab: {
        apiService: queryPaySetRecordList, // 表格的数据请求接口
        isSettingShow: false // 是否出现设置
      },

      tableHeight: 'calc(100vh - 270px)'

    }
  },

  methods: {
    getTableList() {
      this.$refs.tableCommon.getList()
    }

  }
}
</script>
