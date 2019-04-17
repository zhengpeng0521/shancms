import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import {
  courseSummaryQuery,
  tenantUserSummaryQuery,
  getElvationList
} from '@/api/teachManage/homeSchoolConnect'
import CourseNameDetail from './side/courseNameDetail'
import TeachComment from './side/dialog/teachComment'
import EditClassContent from './side/dialog/editClassContent'
import comment from './side/dialog/comment'
import { exportFile } from '@/utils/exportFile' //eslint-disable-line
export default {
  components: {
    CommonSearch,
    CommonTable,
    CourseNameDetail,
    TeachComment,
    EditClassContent,
    comment
  },
  data() {
    return {
      formInline: {
        searchMethod: formValue => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'select',
            placeholder: '课程名称',
            modelValue: 'courseId',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            valueKey: 'id',
            labelKey: 'title',
            apiService: courseSummaryQuery // 是否从接口中获取
          },
          {
            itemType: 'select',
            placeholder: '主教',
            modelValue: 'mtid',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            valueKey: 'id',
            labelKey: 'name',
            apiService: tenantUserSummaryQuery // 是否从接口中获取
          },
          {
            itemType: 'datePicker',
            datePickerType: 'daterange',
            rangeSeparator: '~',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd',
            modelValue: 'studyDate'
          }
        ]
      },
      columns: [
        {
          label: '课程名称',
          prop: 'courseName',
          isShowTooltip: true,
          width: '100',
          isShowSet: false,
          render: (h, params) => {
            return h(
              'span',
              {
                class: 'courseName',
                on: {
                  click: () => {
                    this.toCourseDetail(params.row)
                  }
                }
              },
              params.row.courseName
            )
          }
        },
        {
          label: '排课标题',
          prop: 'title',
          isShowTooltip: true,
          width: '100'
        },
        {
          label: '上课时间',
          prop: 'process',
          isShowTooltip: true,
          width: '140',
          formatter: row => {
            return `${row.studyDate} ${row.startTime}~${row.endTime}`
          }
        },
        {
          label: '主教',
          prop: 'mtNames',
          isShowTooltip: true,
          width: '100'
        },
        {
          label: '学员总数',
          prop: 'stuNum',
          isShowTooltip: true
        },
        {
          label: '老师已点评(率)',
          prop: 'tcrCommNum',
          isShowTooltip: true,
          width: '150',
          formatter: row => {
            return `${row.tcrCommNum} (${row.tcrCommNumRate})`
          }
        },
        {
          label: '带图点评(率)',
          prop: 'commNumWithPic',
          isShowTooltip: true,
          width: '150',
          formatter: row => {
            return `${row.commNumWithPic} (${row.commNumWithPicRate})`
          }
        },
        {
          label: '家长已评价',
          prop: 'homeCommNum',
          isShowTooltip: true,
          width: '100'
        }
      ],
      listQuery: {
        show: true, // 是否显示
        sizes: true
      },
      options: {
        apiService: getElvationList, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 241px)',
      operates: {
        width: '150',
        fixed: 'right',
        list: [
          {
            label: '评价',
            method: row => {
              this.toEvaluation(row)
            }
          }
        ]
      },
      formValue: {} // 搜索的数据
    }
  },
  methods: {
    getCheckCol(val) {
      console.info('val--->', val)
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      let startDate
      let endDate
      if (formValue.studyDate) {
        startDate = formValue.studyDate[0]
        endDate = formValue.studyDate[1]
      } else {
        startDate = ''
        endDate = ''
      }
      const params = {
        courseId: formValue.courseId,
        mtid: formValue.mtid,
        startDate: startDate,
        endDate: endDate
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 0
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 评价 */
    toEvaluation(row) {
      this.$refs.commentEdit.show(row)
    },
    /* 课程点击侧边栏 */
    toCourseDetail(row) {
      this.$refs.courseNameDetail.show(row)
    },
    /* 老师评价编辑 */
    getTeachCommentEdit(row) {
      this.$refs.teachComment.show(row)
    },
    /* 上课内容编辑 */
    getEditClassContent(val) {
      this.$refs.editClassContent.show(val)
    },
    /* 点评 */
    commentFunc(val) {
      this.$refs.commentEdit.show(val)
    },
    /* 更新表格数据 */
    getUpdateTable(row) {
      this.$refs.tableCommon.getList()
      this.$refs.courseNameDetail.show(row)
      this.$refs.search.formValue = {}
    },
    /* 只更新表格 */
    getUpdateCommentTable() {
      this.$refs.search.formValue = {}
      this.$refs.tableCommon.getList()
    },
    /* 导出 */
    exportContent() {
      const params = {
        ...this.formValue
      }
      if (this.formValue.studyDate) {
        params.startDate = this.formValue.studyDate[0]
        params.endDate = this.formValue.studyDate[1]
      }
      delete params.studyDate
      for (const key in params) {
        if (!params[key]) {
          delete params[key]
        }
      }
      if (this.$refs.tableCommon.totalCount > 0) {
        exportFile(`${window.SS_CRM}/cerp/homeschool/exportByPlan`, params)
      } else {
        this.$message.error('暂无数据导出')
      }
    }
  }
}
