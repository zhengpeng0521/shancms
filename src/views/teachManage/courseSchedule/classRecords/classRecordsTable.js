import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import { FormatDate } from '../../../../utils/dateFormat'
import {
  queryArrangeList,
  courseSummaryQuery,
  tenantUserSummaryQuery
} from '@/api/teachManage/arrangeCourse'
import DelArrange from './dialog/delCourseArrange'
import EditArrange from './dialog/editCourseArrange'
import CopyArrange from './copyCourseArrange'
import NewArrangeCourse from './newArrangeCourse'
export default {
  components: {
    CommonSearch,
    CommonTable,
    DelArrange,
    EditArrange,
    CopyArrange,
    NewArrangeCourse,
    AdvancedSearch
  },
  data() {
    return {
      isEditShow: false,
      formInline: {
        searchMethod: formValue => {
          this.searchHandle(formValue)
        },
        modifyTime: [
          this.$moment().format('YYYY-MM-DD'),
          this.$moment().format('YYYY-MM-DD')
        ],
        forms: [
          {
            itemType: 'select',
            placeholder: '课程名称',
            modelValue: 'courseId',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            labelKey: 'title',
            valueKey: 'id',
            apiService: courseSummaryQuery
          },
          {
            itemType: 'select',
            placeholder: '主教',
            modelValue: 'mtid',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            labelKey: 'name',
            valueKey: 'id',
            apiService: tenantUserSummaryQuery
          },
          {
            itemType: 'datePickerChange',
            datePickerType: 'daterange',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd',
            modelValue: 'modifyTime',
            itemStyle: 'width:231px',
            isClearable: false,
            default: true,
            toChange: this.timeChange
          }
        ]
      },
      columns: [
        {
          label: '排课标题',
          prop: 'title',
          isShowTooltip: true,
          width: '120'
        },
        {
          label: '课程名称',
          prop: 'courseName',
          isShowTooltip: true,
          width: '120'
        },
        {
          label: '状态',
          prop: 'status',
          width: '120',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.status !== '1') {
              return `<div style="text-overflow:ellipsis;overflow:hidden"><div style="display:inline-block;width:8px;height:8px;background-color: #D0021B;border-radius: 50px;margin-right: 5px;"></div>无效</div>`
            } else {
              return `<div style="text-overflow:ellipsis;overflow:hidden"><div style="display:inline-block;width:8px;height:8px;background-color: #87D068;border-radius: 50px;margin-right: 5px;"></div>有效</div>`
            }
          }
        },
        {
          label: '进度',
          prop: 'process',
          isShowTooltip: true,
          width: '120'
        },
        {
          label: '上课主题',
          prop: 'courseTheme',
          isShowTooltip: true,
          width: '120'
        },
        {
          label: '日期',
          prop: 'studyDate',
          isShowTooltip: true,
          width: '150',
          formatter: (row, column, cellValue) => {
            return `<div>${row.studyDate}(${row.weekDay})</div>`
          }
        },
        {
          label: '时间段',
          prop: 'rangeTime',
          width: '150',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            return `<div>${row.startTime} ~ ${row.endTime}</div>`
          }
        },
        {
          label: '自主约课',
          prop: 'bookCls',
          width: '120',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.bookCls === '1') {
              return `<div>开启</div>`
            } else if (row.bookCls === '2') {
              return `<div>关闭</div>`
            }
          }
        },
        {
          label: '主教',
          prop: 'mtNames',
          width: '120',
          isShowTooltip: true
        },
        {
          label: '助教',
          prop: 'atNames',
          width: '120',
          isShowTooltip: true
        },
        {
          label: '教室',
          prop: 'roomName',
          isShowTooltip: true
        },
        {
          label: '消耗课时',
          prop: 'cost',
          width: '120',
          isShowTooltip: true
        },
        {
          label: '最大人数',
          prop: 'maxNum',
          width: '120',
          isShowTooltip: true
        },
        {
          label: '上课人数',
          prop: 'num',
          width: '120',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.maxAttNum === -1) {
              return `<div>${row.num}</div>`
            } else {
              return `<div>${row.num}/${row.maxAttNum}</div>`
            }
          }
        },
        {
          label: '补课人数',
          prop: 'mulNum',
          width: '120',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.maxMulNum === -1) {
              return `<div>${row.mulNum}</div>`
            } else {
              return `<div>${row.mulNum}/${row.maxMulNum}</div>`
            }
          }
        },
        {
          label: '试听人数',
          prop: 'tryNum',
          width: '120',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.maxTryNum === -1) {
              return `<div>${row.tryNum}</div>`
            } else {
              return `<div>${row.tryNum}/${row.maxTryNum}</div>`
            }
          }
        },
        {
          label: '排队人数',
          prop: 'lineNum',
          width: '120',
          isShowTooltip: true
        }
      ],
      tableHeight: 'calc(100vh - 289px)',
      listQuery: {
        show: true,
        sizes: true,
        sizeChange: this.sizeChange,
        indexChange: this.indexChange
      },
      options: {
        isSettingShow: true,
        mutiSelect: true,
        apiService: queryArrangeList,
        params: {
          startDate: this.$moment().format('YYYY-MM-DD'),
          endDate: this.$moment().format('YYYY-MM-DD')
        }
      },
      operates: {
        width: '150',
        fixed: 'right',
        list: [
          {
            label: '编辑',
            method: row => {
              this.toScheduleCourseDetail(row)
            }
          },
          {
            label: '复制',
            method: row => {
              this.copyCourse(row)
            }
          }
        ]
      },
      superSearch: {
        onClear: () => {
          this.onClear()
        },
        onSearch: superValue => {
          this.onSearch(superValue)
        },
        fields: [
          {
            type: 'input',
            key: 'title',
            label: '排课标题'
          },
          {
            type: 'select',
            key: 'bookCls',
            label: '自主约课',
            options: [
              { value: '1', label: '开启' },
              { value: '2', label: '关闭' }
            ]
          },
          {
            type: 'select',
            key: 'roomId',
            label: '教室',
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SS_CRM}/sysBase/cerp/classroom/summaryQuery`
          },
          {
            type: 'select',
            key: 'atid',
            label: '助教',
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          }
        ]
      },
      checkNum: '', // 选中的个数
      tabKey: '1', // 选择的tab
      start: this.$moment().format('YYYY-MM-DD'),
      end: this.$moment().format('YYYY-MM-DD'),
      isBackDay: false, // 是否返回今天
      isBackWeek: false, // 是否返回本周
      checkList: [], // 勾选的列表
      rowInfo: {},
      superValue: {}, // 高级搜索数据
      formValue: {
        modifyTime: [
          this.$moment().format('YYYY-MM-DD'),
          this.$moment().format('YYYY-MM-DD')
        ]
      }, // 搜索栏数据
      flag: true,
      isParams: false // 是否有传参
    }
  },
  mounted() {
    if (JSON.stringify(this.$route.params) !== '{}') {
      this.isParams = true
      this.getUpdateTableTime(this.$route.params.start, this.$route.params.end)
    }
  },
  methods: {
    timeChange(val) {
      this.start = val[0]
      this.end = val[1]
      var weekOfday = this.$moment().format('d')
      var monday = this.$moment()
        .subtract(weekOfday - 1, 'days')
        .format('YYYY-MM-DD') // 周一日期
      var sunday = this.$moment()
        .add(7 - weekOfday, 'days')
        .format('YYYY-MM-DD') // 周日日期
      if (
        this.start == monday && //eslint-disable-line
        this.end == sunday //eslint-disable-line
      ) {
        this.isBackWeek = false
      } else {
        this.isBackWeek = true
      }
      if (
        this.start == this.$moment().format('YYYY-MM-DD') && //eslint-disable-line
        this.start == this.end //eslint-disable-line
      ) {
        this.isBackDay = false
      } else {
        this.isBackDay = true
      }
    },
    /** 页数改变 */
    indexChange(pageIndex) {
      let startDate = ''
      let endDate = ''
      if (JSON.stringify(this.$route.params) !== '{}' && this.isParams) {
        startDate = this.$route.params.start
        endDate = this.$route.params.end
      } else {
        if (this.flag) {
          startDate = this.formValue.modifyTime[0]
          endDate = this.formValue.modifyTime[1]
        } else {
          startDate = this.$refs.search.formValue.modifyTime[0]
          endDate = this.$refs.search.formValue.modifyTime[1]
        }
      }
      const payload = {
        startDate: startDate,
        endDate: endDate,
        pageIndex: pageIndex - 1,
        ...this.formValue,
        ...this.superValue
      }
      delete payload.modifyTime
      this.$refs.tableCommon.getList(payload)
    },
    /** 每页条数改变 */
    sizeChange(pageSize) {
      let startDate = ''
      let endDate = ''
      if (JSON.stringify(this.$route.params) !== '{}' && this.isParams) {
        startDate = this.$route.params.start
        endDate = this.$route.params.end
      } else {
        if (this.flag) {
          startDate = this.formValue.modifyTime[0]
          endDate = this.formValue.modifyTime[1]
        } else {
          startDate = this.$refs.search.formValue.modifyTime[0]
          endDate = this.$refs.search.formValue.modifyTime[1]
        }
      }
      const payload = {
        startDate: startDate,
        endDate: endDate,
        pageSize,
        ...this.formValue,
        ...this.superValue
      }
      delete payload.modifyTime
      this.$refs.tableCommon.getList(payload)
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      const params = {
        ...this.formValue,
        ...this.superValue,
        pageIndex: 0
      }
      this.flag = true
      this.isParams = false
      params.startDate = formValue.modifyTime[0]
      params.endDate = formValue.modifyTime[1]
      delete params.modifyTime
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle() {
      // 重置的入参
      const params = {
        pageIndex: 0,
        startDate: this.$moment().format('YYYY-MM-DD'),
        endDate: this.$moment().format('YYYY-MM-DD'),
        ...this.superValue
      }
      this.tabKey = '1'
      delete params.modifyTime
      this.formValue = {}
      this.start = this.$moment().format('YYYY-MM-DD')
      this.end = this.$moment().format('YYYY-MM-DD')
      this.isBackDay = false
      this.formValue.modifyTime = [
        this.$moment().format('YYYY-MM-DD'),
        this.$moment().format('YYYY-MM-DD')
      ]
      this.$refs.tableCommon.getList(params)
    },
    /** 高级搜索 */
    onSearch(superValue) {
      this.superValue = superValue
      const params = {
        ...this.superValue,
        ...this.formValue
      }
      if (this.formValue.modifyTime) {
        params.startDate = this.formValue.modifyTime[0]
        params.endDate = this.formValue.modifyTime[1]
      }
      delete params.modifyTime
      this.$refs.tableCommon.getList(params)
    },
    /** 高级清除 */
    onClear() {
      const params = {
        pageIndex: 0,
        ...this.formValue
      }
      if (this.formValue.modifyTime) {
        params.startDate = this.formValue.modifyTime[0]
        params.endDate = this.formValue.modifyTime[1]
      }
      delete params.modifyTime
      this.formValue.modifyTime = [
        this.formValue.modifyTime[0],
        this.formValue.modifyTime[1]
      ]
      this.tabKey = '1'
      this.superValue = {}
      this.$refs.tableCommon.getList(params)
    },
    /* 排课 */
    arrangeCourse() {
      this.$router.push({ name: 'newArrangeCourse' })
    },
    /* 排课成功时间传递 */
    getUpdateTableTime(start, end) {
      this.$nextTick(() => {
        this.$refs.search.formValue.modifyTime = [start, end]
      })
      this.start = start
      this.end = end
      if (
        this.start == this.$moment().format('YYYY-MM-DD') && //eslint-disable-line
        this.start == this.end //eslint-disable-line
      ) {
        this.isBackDay = false
      } else {
        this.isBackDay = true
      }
      const params = {
        startDate: start,
        endDate: end
      }
      this.$nextTick(() => {
        this.$refs.tableCommon.getList(params)
      })
    },
    /* 上一天 / 下一天 / 上一周 /下一周 */
    OperationQuery(type) {
      let start
      let end
      this.flag = false
      this.isParams = false
      var weekOfday = this.$moment().format('d')
      var monday = this.$moment()
        .subtract(weekOfday - 1, 'days')
        .format('YYYY-MM-DD') // 周一日期
      var sunday = this.$moment()
        .add(7 - weekOfday, 'days')
        .format('YYYY-MM-DD') // 周日日期
      if (type === 'yesterday') {
        // 上一天
        start =
          new Date(this.$refs.search.formValue.modifyTime[0]).getTime() -
          24 * 60 * 60 * 1000
        this.start = FormatDate(start).substr(0, 10)
        end =
          new Date(this.$refs.search.formValue.modifyTime[1]).getTime() -
          24 * 60 * 60 * 1000
        this.end = FormatDate(end).substr(0, 10)
        if (
          this.start == this.$moment().format('YYYY-MM-DD') && //eslint-disable-line
          this.start == this.end //eslint-disable-line
        ) {
          this.isBackDay = false
        } else {
          this.isBackDay = true
        }
      } else if (type === 'tomorrow') {
        // 下一天
        start =
          new Date(this.$refs.search.formValue.modifyTime[0]).getTime() +
          24 * 60 * 60 * 1000
        this.start = FormatDate(start).substr(0, 10)
        end =
          new Date(this.$refs.search.formValue.modifyTime[1]).getTime() +
          24 * 60 * 60 * 1000
        this.end = FormatDate(end).substr(0, 10)
        if (
          this.start == this.$moment().format('YYYY-MM-DD') && //eslint-disable-line
          this.start == this.end //eslint-disable-line
        ) {
          this.isBackDay = false
        } else {
          this.isBackDay = true
        }
      } else if (type === 'today') {
        // 回到今天
        this.start = this.$moment().format('YYYY-MM-DD')
        this.end = this.$moment().format('YYYY-MM-DD')
        this.isBackDay = false
      } else if (type === 'lastWeek') {
        // 上一周
        start =
          new Date(this.$refs.search.formValue.modifyTime[0]).getTime() -
          7 * 24 * 60 * 60 * 1000
        this.start = FormatDate(start).substr(0, 10)
        end =
          new Date(this.$refs.search.formValue.modifyTime[0]).getTime() -
          1 * 24 * 60 * 60 * 1000
        this.end = FormatDate(end).substr(0, 10)
        if (
          this.start == monday && //eslint-disable-line
          this.end == sunday //eslint-disable-line
        ) {
          this.isBackWeek = false
        } else {
          this.isBackWeek = true
        }
      } else if (type === 'nextWeek') {
        // 下一周
        start =
          new Date(this.$refs.search.formValue.modifyTime[1]).getTime() +
          1 * 24 * 60 * 60 * 1000
        this.start = FormatDate(start).substr(0, 10)
        end =
          new Date(this.$refs.search.formValue.modifyTime[1]).getTime() +
          7 * 24 * 60 * 60 * 1000
        this.end = FormatDate(end).substr(0, 10)
        if (
          this.start == monday && //eslint-disable-line
          this.end == sunday //eslint-disable-line
        ) {
          this.isBackWeek = false
        } else {
          this.isBackWeek = true
        }
      } else if (type === 'backToWeek') {
        // 返回本周
        this.start = monday
        this.end = sunday
        this.isBackWeek = false
      }
      const params = {
        startDate: this.start,
        endDate: this.end,
        ...this.superValue,
        ...this.formValue,
        pageIndex: 0
      }
      delete params.modifyTime
      this.$refs.tableCommon.getList(params)
      this.$refs.search.formValue.modifyTime = [this.start, this.end]
    },
    /* 天数radio切换*/
    tabChange(val) {
      var weekOfday = this.$moment().format('d') // 计算今天是这周第几天
      var monday = this.$moment()
        .subtract(weekOfday - 1, 'days')
        .format('YYYY-MM-DD')
      var sunday = this.$moment()
        .add(7 - weekOfday, 'days')
        .format('YYYY-MM-DD') // 周日日期
      if (val === '1') {
        this.$refs.search.formValue.modifyTime = [
          this.$moment().format('YYYY-MM-DD'),
          this.$moment().format('YYYY-MM-DD')
        ]
        this.start = this.$moment().format('YYYY-MM-DD')
        this.end = this.$moment().format('YYYY-MM-DD')
        const params = {
          startDate: this.$refs.search.formValue.modifyTime[0],
          endDate: this.$refs.search.formValue.modifyTime[1]
        }
        this.$refs.tableCommon.getList(params)
      } else if (val === '2') {
        this.$refs.search.formValue.modifyTime = [monday, sunday]
        this.start = monday
        this.end = sunday
        const params = {
          startDate: monday,
          endDate: sunday,
          pageIndex: 0
        }
        this.$refs.tableCommon.getList(params)
      }
      this.isBackWeek = false
      this.isBackDay = false
    },
    /* 删除 */
    delCheckData() {
      if (this.checkNum > 0) {
        this.$refs.arrageCourse.show(this.checkNum, this.checkList)
      } else {
        this.$message.warning('请至少选中一项删除')
      }
    },
    /* 删除更新列表 */
    getUpdateTableData() {
      if (
        this.$refs.search.formValue.modifyTime &&
        this.$refs.search.formValue.modifyTime.length > 0
      ) {
        const params = {
          startDate: this.$refs.search.formValue.modifyTime[0],
          endDate: this.$refs.search.formValue.modifyTime[1]
        }
        this.$refs.search.formValue.courseid = ''
        this.$refs.search.formValue.mtid = ''
        this.$refs.search.formValue.modifyTime = [
          this.$refs.search.formValue.modifyTime[0],
          this.$refs.search.formValue.modifyTime[1]
        ]
        this.$refs.tableCommon.getList(params)
      }
    },
    /* 编辑 */
    toScheduleCourseDetail(row) {
      this.isEditShow = true
      this.$nextTick(() => {
        this.$refs.editCourse.show(row)
      })
    },
    /* 关闭编辑弹窗 */
    getCloseEditArrange() {
      this.isEditShow = false
    },
    /* 复制 */
    copyCourse(row) {
      this.rowInfo = row
      this.$router.push({ name: 'copyCourseArrange', params: { rowInfo: row }})
    },
    /* 获取表格列 */
    getCheckCol() {},
    selectionChange(val) {
      if (val) {
        this.checkList = val
        this.checkNum = val.length
      }
    }
  }
}
