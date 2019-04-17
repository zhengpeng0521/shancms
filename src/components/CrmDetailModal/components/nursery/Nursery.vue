<template>
  <div class="tab-pane-content">
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
import { getNursery } from '@/api/crmDetail/crmDetail'

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
    const height = this.headerHeight + 40 + 28 + 40 + 32
    return {
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '合同编号',
          prop: 'orderNum',
          width: '160px'
        }, {
          label: '托班类型',
          prop: 'nursryTypeName'
        }, {
          label: '开始日期',
          prop: 'startTime'
        }, {
          label: '结束日期',
          prop: 'endTime'
        }, {
          label: '剩余天数',
          prop: 'leftDays'
        }
      ],
      options: {
        apiService: getNursery, // 表格的数据请求接口
        params: { stuId: this.$props.params.stuId }
      },
      tableHeight: `calc(100vh - ${height}px)`
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-pane-content {
  padding-left: 20px;
}
</style>
