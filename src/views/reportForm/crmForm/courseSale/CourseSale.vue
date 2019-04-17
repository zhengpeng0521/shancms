<template>
  <div>
    <el-alert
      :closable="false"
      type="info"
      title="此课程售卖表从不同维度反映了机构的课程售卖情况，可据此判断客户选择以及中心推介课程重心"
      show-icon
    />
    <FormSearch
      ref="formSearch"
      v-bind="formSearchProps"
      :loading="loading"
    />
    <div class="course-sale-chart">
      <BlockTitle class="course-sale-title">各课程售卖数据表</BlockTitle>
      <ChartCard
        v-bind="byCourseProps"
        :loading="loading"
        :data-source="courseList"
      />
      <BlockTitle class="course-sale-title-line">课程售卖趋势图</BlockTitle>
      <ChartCard
        v-bind="byDateProps"
        :loading="loading"
        :data-source="dateList"
        :all-cols="allCols"
        :show-cols="showCols"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { fmtDateFormat } from '@/utils/dateFormat'
import FormSearch from '@/components/ReportForm/FormSearch'
import BlockTitle from '@/components/MiniCommon/BlockTitle'
import ChartCard from '@/components/ReportForm/ChartCard'
import { exportFile } from '@/utils/exportFile'

export default {
  components: {
    FormSearch,
    BlockTitle,
    ChartCard
  },

  data() {
    return {
      formSearchProps: {
        searchHandle: this.makeForm,
        extraForm: [
          {
            type: 'select',
            key: 'chartWay',
            clearable: false,
            initFirst: true,
            options: [
              { value: '1', label: '按学员人数' },
              { value: '2', label: '按课时数' }
            ]
          }
        ]
      },
      // 按课程
      byCourseProps: {
        title: '按学员人数',
        extraTitle: '默认显示前10',
        type: 'histogram',
        legend: false,
        custLegend: true,
        exportFile: this.exportFile.bind(this, 'byCourse'),
        allCols: [{ key: 'num', value: '学员人数' }],
        showCols: ['courseName', 'num']
      },
      // 按日期
      byDateProps: {
        title: '按学员人数',
        extraTitle: '默认显示前5',
        type: 'line',
        legend: false,
        custLegend: true,
        exportFile: this.exportFile.bind(this, 'byDate')
      },
      exportType: '2'
    }
  },

  computed: {
    ...mapState('courseSale', [
      'loading',
      'searchValue',
      'courseList',
      'courseCols',
      'dateList',
      'allCols',
      'showCols'
    ])
  },

  mounted() {
    const payload = {
      startDate: fmtDateFormat(this.$refs.formSearch.formSearch.date[0], 'yyyy-MM-dd'),
      endDate: fmtDateFormat(this.$refs.formSearch.formSearch.date[1], 'yyyy-MM-dd')
    }
    this.getStu(payload)
  },

  methods: {
    ...mapActions('courseSale', [
      'getStu',
      'getTimes'
    ]),

    /** 生成报表 */
    makeForm(values, extra) {
      const payload = {
        startDate: values.date[0],
        endDate: values.date[1]
      }
      this.exportType = extra.chartWay === '1' ? '2' : '1'
      if (extra.chartWay === '2') {
        this.byCourseProps.title = '按课时数'
        this.byDateProps.title = '按课时数'
        this.byCourseProps.allCols = [{ key: 'num', value: '课时数' }]
        this.getTimes(payload)
      } else {
        this.byCourseProps.title = '按学员人数'
        this.byDateProps.title = '按学员人数'
        this.byCourseProps.allCols = [{ key: 'num', value: '学员人数' }]
        this.getStu(payload)
      }
    },

    /** 导出 */
    exportFile(type) {
      const params = {
        ...this.searchValue,
        exportType: this.exportType
      }
      if (type === 'byCourse') {
        if (this.courseList.length > 0) {
          exportFile(`${window.REPORT_URL}/cerp/stats/exportCourseSellStaticsForCourse`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      } else {
        if (this.dateList.length > 0) {
          exportFile(`${window.REPORT_URL}/cerp/stats/exportCourseSellStaticsForDate`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.course-sale-chart {
  max-height: calc(100vh - 200px);
  overflow: auto;
  padding-right: 10px;
  margin-right: -10px;
}
.course-sale-title {
  margin-bottom: 10px;
}
.course-sale-title-line {
  margin: 20px 0 10px;
}
</style>
