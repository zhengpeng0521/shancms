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
          isShowTooltip: true
        },
        {
          label: '提现金额',
          prop: 'settAmount',
          isShowTooltip: true
        },
        {
          label: '实际到账',
          prop: 'remitAmount',
          isShowTooltip: true
        },
        {
          label: '手续费',
          prop: 'settFee',
          isShowTooltip: true
        },
        {
          label: '户名',
          prop: 'mchName',
          isShowTooltip: true
        },
        {
          label: '账号',
          prop: 'payeeAccount',
          isShowTooltip: true
        }, {
          label: '开户行',
          prop: 'remitWay',
          isShowTooltip: true
        },
        {
          label: '操作人',
          prop: 'operator',
          isShowTooltip: true
        },
        {
          label: '提交时间',
          prop: 'createTime',
          width: '140px',
          isShowTooltip: true
        },
        {
          label: '状态',
          prop: 'settStatus',
          isShowTooltip: true
        }

      ],
      optionsTab: {
        apiService: queryPaySetRecordList, // 表格的数据请求接口
        isSettingShow: false // 是否出现设置
      },

      tableHeight: 'calc(100vh - 259px)'

    }
  },

  methods: {
    getTableList() {
      this.$refs.tableCommon.getList()
    }

  }
}
</script>
