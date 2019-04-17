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
import { getOrderClass } from '@/api/crmDetail/crmDetail'

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
    const height = this.headerHeight + 40 + 40 + 56
    return {
      columns: [
        {
          label: '会员卡号',
          prop: 'cardId',
          width: '120px',
          isShowTooltip: true
        }, {
          label: '课程',
          prop: 'courseName',
          width: '160px',
          isShowTooltip: true
        }, {
          label: '日期',
          prop: 'studyDate',
          width: '120px',
          isShowTooltip: true
        }, {
          label: '时间段',
          prop: 'startTime',
          width: '120px',
          isShowTooltip: true,
          render: (h, params) => {
            const text = params.row.startTime + '~' + params.row.endTime
            return h('span', {}, text)
          }
        }, {
          label: '班级',
          prop: 'clsName',
          isShowTooltip: true
        }, {
          label: '主教',
          prop: 'mtNames',
          isShowTooltip: true
        }, {
          label: '教室',
          prop: 'roomName',
          isShowTooltip: true
        }, {
          label: '消耗课时',
          prop: 'cost',
          isShowTooltip: true
        }, {
          label: '固定位',
          prop: 'fix',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            const text = row.fix === '1' ? '是' : '否'
            return text
          }
        }, {
          label: '状态',
          prop: 'status',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            const text = row.status === '1' ? '已试听' : '已预约'
            return text
          }
        }
      ],
      options: {
        apiService: getOrderClass, // 表格的数据请求接口
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
