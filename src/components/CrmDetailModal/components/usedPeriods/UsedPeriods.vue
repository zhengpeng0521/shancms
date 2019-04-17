<template>
  <div class="tab-pane-content">
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :options="options"
      :pagination="listQuery"
      class="parent-list"
    />
  </div>
</template>

<script>
import CommonTable from '@/components/CommonTable/CommonTable'
import { getUsedPeriods } from '@/api/crmDetail/crmDetail'

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
      columns: [
        {
          label: '课程',
          prop: 'courseName',
          width: '120px',
          isShowTooltip: true
        }, {
          label: '上课时间',
          prop: 'itemTime',
          width: '160px',
          isShowTooltip: true
        }, {
          label: '课时',
          prop: 'periodChange',
          isShowTooltip: true
        }, {
          label: '教室',
          prop: 'classRoom',
          isShowTooltip: true
        }, {
          label: '状态',
          prop: 'tradeType',
          isShowTooltip: true
        }
      ],
      options: {
        apiService: getUsedPeriods, // 表格的数据请求接口
        params: { stuId: this.$props.params.stuId }
      },
      listQuery: {
        show: true, // 是否显示
        sizes: false
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
