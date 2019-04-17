<template>
  <div>
    <el-alert
      :closable="false"
      type="info"
      title="此表可以查看机构学员的消课情况，可据此调整排课等机构运营策略"
      show-icon
    />
    <FormSearch
      ref="formSearch"
      v-bind="formSearchProps"
      :loading="loading"
    />
    <div class="use-class-chart">
      <!-- 消课统计 -->
      <ChartCard
        v-bind="allProps"
        :loading="loading"
        :data-source="allSource"
        :all-cols="allCols"
        :show-cols="showCols"
      />
      <!-- 按课程 -->
      <ChartCard
        v-bind="courseProps"
        :loading="loading"
        :data-source="courseSource"
        :all-cols="courseCols"
        :show-cols="courseShowCols"
        :stack="courseStack"
        class="chart-top"
      />
      <!-- 按机构 -->
      <ChartCard
        v-bind="orgProps"
        :loading="loading"
        :data-source="orgSource"
        class="chart-top"
      />
      <!-- 按授课老师 -->
      <ChartCard
        v-bind="teacherProps"
        :loading="loading"
        :data-source="teacherSource"
        :all-cols="teacherCols"
        :show-cols="teacherShowCols"
        :stack="teacherStack"
        class="chart-top"
      />
      <!-- 按负责销售 -->
      <ChartCard
        v-bind="saleProps"
        :loading="loading"
        :data-source="saleSource"
        class="chart-top"
      />
      <!-- 按负责老师 -->
      <ChartCard
        v-bind="chargeProps"
        :loading="loading"
        :data-source="chargeSource"
        class="chart-top"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { fmtDateFormat } from '@/utils/dateFormat'
import FormSearch from '@/components/ReportForm/FormSearch'
import ChartCard from '@/components/ReportForm/ChartCard'
import { exportFile } from '@/utils/exportFile'

export default {
  components: {
    FormSearch,
    ChartCard
  },

  data() {
    // 默认近7日
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)

    return {
      formSearchProps: {
        searchHandle: this.makeForm,
        defaultDate: [start, end]
      },
      // 消课统计
      allProps: {
        title: '消课统计表',
        extraTitle: '默认显示前5，若查看其它请在右侧勾选',
        type: 'line',
        legend: false,
        custLegend: true,
        exportFile: this.exportFile.bind(this, 'all')
      },
      // 按课程
      courseProps: {
        title: '按课程统计',
        extraTitle: '默认显示前10，查看全部请导出报表',
        type: 'histogram',
        legend: false,
        custLegend: true,
        exportFile: this.exportFile.bind(this, 'course'),
        formatter: this.formatter.bind(this, 'course')
      },
      // 按机构
      orgProps: {
        title: '按机构统计',
        extraTitle: '最多显示前10，查看全部请导出报表',
        type: 'histogram',
        legend: false,
        exportFile: this.exportFile.bind(this, 'org'),
        formatter: this.orgToolTip.bind(this, 'org'),
        allCols: [
          { key: 'cost', value: '消耗课时' }
        ],
        showCols: ['orgName', 'cost']
      },
      // 按授课老师
      teacherProps: {
        title: '按授课老师统计',
        extraTitle: '默认显示前10，查看全部请导出报表',
        type: 'histogram',
        legend: false,
        custLegend: true,
        exportFile: this.exportFile.bind(this, 'teacher'),
        formatter: this.formatter.bind(this, 'teacher')
      },
      // 按负责销售
      saleProps: {
        title: '按负责销售统计',
        extraTitle: '最多显示前10，查看全部请导出报表',
        type: 'histogram',
        legend: false,
        exportFile: this.exportFile.bind(this, 'sale'),
        formatter: this.orgToolTip.bind(this, 'sale'),
        allCols: [
          { key: 'cost', value: '消耗课时' }
        ],
        showCols: ['userName', 'cost']
      },
      // 按负责老师
      chargeProps: {
        title: '按负责老师统计',
        extraTitle: '最多显示前10，查看全部请导出报表',
        type: 'histogram',
        legend: false,
        exportFile: this.exportFile.bind(this, 'charge'),
        formatter: this.orgToolTip.bind(this, 'charge'),
        allCols: [
          { key: 'cost', value: '消耗课时' }
        ],
        showCols: ['userName', 'cost']
      }
    }
  },

  computed: {
    ...mapState('useClass', [
      'loading',
      'searchValue',
      'allSource',
      'allCols',
      'showCols',
      'courseSource',
      'courseCols',
      'courseShowCols',
      'courseStack',
      'orgSource',
      'teacherSource',
      'teacherCols',
      'teacherShowCols',
      'teacherStack',
      'saleSource',
      'chargeSource'
    ])
  },

  mounted() {
    const payload = {
      startDate: fmtDateFormat(this.$refs.formSearch.formSearch.date[0], 'yyyy-MM-dd'),
      endDate: fmtDateFormat(this.$refs.formSearch.formSearch.date[1], 'yyyy-MM-dd')
    }
    this.getUseClass(payload)
  },

  methods: {
    ...mapActions('useClass', [
      'getUseClass'
    ]),

    /** 生成报表 */
    makeForm(values, extra) {
      const payload = {
        startDate: values.date[0],
        endDate: values.date[1]
      }
      this.getUseClass(payload)
    },

    /** 导出 */
    exportFile(type) {
      const params = { ...this.searchValue }
      if (type === 'all') {
        if (this.allSource && this.allSource.length > 0) {
          exportFile(`${window.REPORT_URL}/cerp/stats/costSQ/exportByAllCourse`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      } else if (type === 'course') {
        if (this.courseSource && this.courseSource.length > 0) {
          exportFile(`${window.REPORT_URL}/cerp/stats/costSQ/exportByCourse`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      } else if (type === 'org') {
        if (this.orgSource && this.orgSource.length > 0) {
          exportFile(`${window.REPORT_URL}/cerp/stats/costSQ/exportByOrg`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      } else if (type === 'teacher') {
        if (this.teacherSource && this.teacherSource.length > 0) {
          exportFile(`${window.REPORT_URL}/cerp/stats/costSQ/exportByTeacher`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      } else if (type === 'sale') {
        if (this.saleSource && this.saleSource.length > 0) {
          exportFile(`${window.REPORT_URL}/cerp/stats/costSQ/exportBySeller`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      } else {
        if (this.chargeSource && this.chargeSource.length > 0) {
          exportFile(`${window.REPORT_URL}/cerp/stats/costSQ/exportByCounselor`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      }
    },

    /** 堆叠柱形浮层 */
    formatter(type, params) {
      let html = ''
      params.forEach((item) => {
        let money = 0
        if (type === 'course') {
          for (let i = 0; i < this.courseSource.length; i++) {
            if (item.name === this.courseSource[i].courseName) {
              money = this.courseSource[i][item.seriesName]
            }
          }
        } else if (type === 'teacher') {
          for (let i = 0; i < this.teacherSource.length; i++) {
            if (item.name === this.teacherSource[i].userName) {
              money = this.teacherSource[i][item.seriesName]
            }
          }
        }

        html += `<p>
            <i style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${item.color}"></i>
            ${item.seriesName}: ${item.value}(￥${money})
        </p>`
      })

      return `<div><p style="margin-bottom:5px;">${params[0].name}</p>${html}</div>`
    },

    /** 柱形浮层 */
    orgToolTip(type, params) {
      let money = 0
      if (type === 'org') {
        for (let i = 0; i < this.orgSource.length; i++) {
          if (this.orgSource[i].orgName === params[0].name) {
            money = this.orgSource[i].money
          }
        }
      } else if (type === 'sale') {
        for (let i = 0; i < this.saleSource.length; i++) {
          if (this.saleSource[i].userName === params[0].name) {
            money = this.saleSource[i].money
          }
        }
      } else if (type === 'charge') {
        for (let i = 0; i < this.chargeSource.length; i++) {
          if (this.chargeSource[i].userName === params[0].name) {
            money = this.chargeSource[i].money
          }
        }
      }

      return `<div>
        <p style="margin-bottom:5px;">${params[0].name}</p>
        <p><i style="display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px;background:${params[0].color}"></i>消耗课时: ${params[0].value}</p>
        <p><i style="display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px;background:${params[0].color}"></i>金额: ${money}</p>
      </div>`
    }
  }
}
</script>

<style lang="scss" scoped>
.use-class-chart {
  max-height: calc(100vh - 200px);
  overflow: auto;
  padding-right: 10px;
  margin-right: -10px;
}
.chart-top {
  margin-top: 20px;
}
.chart-tooltip-circle {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
</style>
