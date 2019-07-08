<template>
  <div>
    <FormSearch
      ref="formSearch"
      v-bind="formSearchProps"
      :loading="loading"
    />
    <Media :query="{minWidth: 1275}">
      <CommonTable
        ref="stuAttence"
        :columns="columns"
        :table-height="'calc(100vh - 182px)'"
        :pagination="listQuery"
        :options="options"
        table-key="report_teach_attence"
      />
    </Media>
    <Media :query="{maxWidth: 1275}">
      <CommonTable
        ref="stuAttence"
        :columns="columns"
        :table-height="'calc(100vh - 230px)'"
        :pagination="listQuery"
        :options="options"
        table-key="report_teach_attence"
        class="form-table"
      />
    </Media>
  </div>
</template>

<script>
import Media from 'vue-media'
import moment from 'moment'
import { mapState } from 'vuex'
import FormSearch from '@/components/ReportForm/FormSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import {
  getAttenceByCourse,
  getAttenceByMteacher,
  getAttenceByAteacher,
  getAttenceByStu,
  getAttenceByPlan
} from '@/api/reportForm/stuAttence'
import { exportFile } from '@/utils/exportFile'

export default {
  components: {
    FormSearch,
    CommonTable,
    Media
  },

  data() {
    const now = moment()
    const params = {
      startDate: now.format('YYYY-MM-DD'),
      endDate: now.format('YYYY-MM-DD')
    }

    return {
      formSearchProps: {
        mediaWidth: 1275,
        searchHandle: this.makeForm,
        exportFile: this.exportFile,
        extraForm: [
          {
            type: 'select',
            key: 'type',
            clearable: false,
            options: [
              { value: '1', label: '按课程统计' },
              { value: '2', label: '按主教统计' },
              { value: '3', label: '按助教统计' },
              { value: '4', label: '按学员统计' },
              { value: '5', label: '按上课明细' }
            ],
            initFirst: true,
            control: { key: 'stuName', value: '4' }
          },
          {
            type: 'input',
            key: 'stuName',
            label: '学员姓名'
          }
        ]
      },
      listQuery: {
        show: true // 是否显示
      },
      options: {
        isSettingShow: true,
        apiService: getAttenceByCourse, // 表格的数据请求接口
        params
      },
      columns: this.renderCols('1'),
      currentType: '1',
      searchValue: params
    }
  },

  computed: {
    ...mapState('commonTable', [
      'loading'
    ])
  },

  methods: {

    /** 生成报表 */
    makeForm(values, extra) {
      const payload = {
        startDate: values.date[0],
        endDate: values.date[1],
        stuName: extra.stuName
      }
      if (extra.type !== '4') {
        delete payload.stuName
      } else {
        payload.stuName = extra.stuName
      }
      this.options.params = payload
      this.searchValue = payload
      this.currentType = extra.type

      if (extra.type === '1') {
        this.columns = this.renderCols('1')
        this.options.apiService = getAttenceByCourse
        this.$refs.stuAttence.getList(payload)
      } else if (extra.type === '2') {
        this.columns = this.renderCols('2')
        this.options.apiService = getAttenceByMteacher
        this.$refs.stuAttence.getList(payload)
      } else if (extra.type === '3') {
        this.columns = this.renderCols('3')
        this.options.apiService = getAttenceByAteacher
        this.$refs.stuAttence.getList(payload)
      } else if (extra.type === '4') {
        this.columns = this.renderCols('4')
        this.options.apiService = getAttenceByStu
        this.$refs.stuAttence.getList(payload)
      } else if (extra.type === '5') {
        this.columns = this.renderCols('5')
        this.options.apiService = getAttenceByPlan
        this.$refs.stuAttence.getList(payload)
      }
    },

    /** 导出 */
    exportFile() {
      const params = { ...this.searchValue }
      if (this.currentType === '1') {
        if (this.$refs.stuAttence.totalCount > 0) {
          exportFile(`${window.REPORT_URL}/crm/erp/statistics/exportByCourse`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      } else if (this.currentType === '2') {
        if (this.$refs.stuAttence.totalCount > 0) {
          exportFile(`${window.REPORT_URL}/crm/erp/statistics/exportByMteacher`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      } else if (this.currentType === '3') {
        if (this.$refs.stuAttence.totalCount > 0) {
          exportFile(`${window.REPORT_URL}/crm/erp/statistics/exportByAteacher`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      } else if (this.currentType === '4') {
        if (this.$refs.stuAttence.totalCount > 0) {
          exportFile(`${window.REPORT_URL}/crm/erp/statistics/exportByStu`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      } else {
        if (this.$refs.stuAttence.totalCount > 0) {
          exportFile(`${window.REPORT_URL}/crm/erp/statistics/exportByPlan`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      }
    },

    /** 表格columns */
    renderCols(type) {
      const columns = type === '5' ? [
        {
          label: '课程名称',
          prop: 'courseName',
          width: '96px',
          isShowTooltip: true
        }, {
          label: '课程标题',
          prop: 'title',
          width: '96px',
          isShowTooltip: true
        }, {
          label: '上课主题',
          prop: 'courseTheme',
          width: '96px',
          isShowTooltip: true
        }, {
          label: '日期',
          prop: 'studyDate',
          width: '120px',
          isShowTooltip: true
        }, {
          label: '时间段',
          prop: 'studyTime',
          width: '120px',
          isShowTooltip: true
        }, {
          label: '教室',
          prop: 'room',
          width: '120px',
          isShowTooltip: true
        }, {
          label: '班级',
          prop: 'classes',
          width: '96px',
          isShowTooltip: true
        }, {
          label: '主教',
          prop: 'mtName',
          width: '96px',
          isShowTooltip: true
        }, {
          label: '助教',
          prop: 'atName',
          width: '96px',
          isShowTooltip: true
        }, {
          label: '消耗课时',
          prop: 'cost',
          width: '96px',
          isShowTooltip: true
        }, {
          label: '预约上课会员',
          prop: 'attend',
          width: '120px',
          isShowTooltip: true
        }, {
          label: '实际上课会员',
          prop: 'realAttend',
          width: '120px',
          isShowTooltip: true
        }, {
          label: '预约补课会员',
          prop: 'makeUp',
          width: '120px',
          isShowTooltip: true
        }, {
          label: '实际补课会员',
          prop: 'realMakeUp',
          width: '120px',
          isShowTooltip: true
        }, {
          label: '预约试听',
          prop: 'audition',
          width: '96px',
          isShowTooltip: true
        }, {
          label: '实际试听',
          prop: 'realAudition',
          width: '96px',
          isShowTooltip: true
        }, {
          label: '请假',
          prop: 'vacate',
          width: '96px',
          isShowTooltip: true
        }, {
          label: '旷课',
          prop: 'truant',
          width: '96px',
          isShowTooltip: true
        }
      ] : type === '1' ? [
        {
          label: '课程名称',
          prop: 'courseName',
          width: '100px',
          isShowTooltip: true
        }, {
          label: '预约报读(补课)',
          prop: 'studyMaa',
          width: '100px',
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span', { slot: 'reference' }, params.row.studyMaa + ' (' + (params.row.studyMaaR || 0) + ')'
              )
            ])
          }
        }, {
          label: '出勤(补课)',
          prop: 'studyAttend',
          width: '100px',
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span', { slot: 'reference' }, params.row.studyAttend + ' (' + (params.row.studyAttendR || 0) + ')'
              )
            ])
          }
        }, {
          label: '请假(补课)',
          prop: 'studyLeave',
          width: '100px',
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span', { slot: 'reference' }, params.row.studyLeave + ' (' + (params.row.studyLeaveR || 0) + ')'
              )
            ])
          }
        }, {
          label: '旷课(补课)',
          prop: 'studyAbsent',
          width: '100px',
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span', { slot: 'reference' }, params.row.studyAbsent + ' (' + (params.row.studyAbsentR || 0) + ')'
              )
            ])
          }
        }, {
          label: '出勤率',
          prop: 'rate',
          width: '100px',
          isShowTooltip: true,
          renderHeader: (h, { column, $index }) => {
            return h('div', { 'class': 'stu_attence', style: { lineHeight: '23px' }}, [
              h('span', '出勤率'),
              h('el-tooltip', { props: { effect: 'dark', content: '已统计补课学员', placement: 'top' }}, [
                h('i', { 'class': 'iconfont icon_ym_ts', style: { marginLeft: '5px', cursor: 'pointer', color: '#666', fontSize: '16px', verticalAlign: 'middle' }})
              ])
            ])
          }
        }, {
          label: '正常出勤率',
          prop: 'rateR',
          width: '100px',
          isShowTooltip: true,
          renderHeader: (h, { column, $index }) => {
            return h('div', { 'class': 'stu_attence', style: { lineHeight: '23px' }}, [
              h('span', '正常出勤率'),
              h('el-tooltip', { props: { effect: 'dark', content: '不统计补课学员', placement: 'top' }}, [
                h('i', { 'class': 'iconfont icon_ym_ts', style: { marginLeft: '5px', cursor: 'pointer', color: '#666', fontSize: '16px', verticalAlign: 'middle' }})
              ])
            ])
          }
        }
      ] : [
        {
          label: type === '2' ? '主教名称' : type === '3' ? '助教名称'
            : type === '4' ? '学员' : '未知',
          prop: type === '4' ? 'stuName' : 'userName',
          width: '100px',
          isShowTooltip: true
        }, {
          label: '预约报读',
          prop: type === '2' ? 'mstudyMaa' : type === '3' ? 'astudyMaa'
            : type === '4' ? 'studyMaa' : 'maa',
          width: '100px',
          isShowTooltip: true
        }, {
          label: '出勤',
          prop: type === '2' ? 'mstudyAttend' : type === '3' ? 'astudyAttend'
            : type === '4' ? 'studyAttend' : 'attend',
          width: '100px',
          isShowTooltip: true
        }, {
          label: '请假',
          prop: type === '2' ? 'mstudyLeave' : type === '3' ? 'astudyLeave'
            : type === '4' ? 'studyLeave' : 'leave',
          width: '100px',
          isShowTooltip: true
        }, {
          label: '旷课',
          prop: type === '2' ? 'mstudyAbsent' : type === '3' ? 'astudyAbsent'
            : type === '4' ? 'studyAbsent' : 'absent',
          width: '100px',
          isShowTooltip: true
        }, {
          label: '出勤率',
          prop: 'rate',
          width: '100px',
          isShowTooltip: true
        }
      ]

      return columns
    }
  }
}
</script>

<style lang="scss" scoped>
.form-table {
  margin-top: 20px;
}
</style>

<style lang="scss">
.stu_attence {
  padding: 0 !important;
}
</style>

