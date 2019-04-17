import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import { FormatDate } from '../../../../utils/dateFormat'
import {
  queryOrderCourseList,
  courseSummaryQuery
} from '@/api/teachManage/orderCourse'
import { exportFile } from '@/utils/exportFile'
import updateSignType from './dialog/updateSignType'
import CancelOrderCourse from './dialog/cancelOrderCourse'
import UpdateFix from './dialog/updateFix'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
export default {
  components: {
    CommonSearch,
    CommonTable,
    AdvancedSearch,
    updateSignType,
    CancelOrderCourse,
    UpdateFix
  },
  data() {
    return {
      formInline: {
        searchMethod: searchValue => {
          this.searchHandle(searchValue)
        },
        modifyTime: [
          this.$moment().format('YYYY-MM-DD'),
          this.$moment().format('YYYY-MM-DD')
        ],
        forms: [
          {
            itemType: 'input',
            placeholder: '学员名称',
            modelValue: 'stuName',
            isClearable: true,
            itemStyle: 'width:140px'
          },
          {
            itemType: 'select',
            placeholder: '课程名称',
            modelValue: 'courseId',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            labelKey: 'title',
            valueKey: 'id',
            apiService: courseSummaryQuery // 是否从接口中获取
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
          label: '学员名称',
          prop: 'stuName',
          isShowTooltip: true,
          width: '120'
        },
        {
          label: '标题',
          prop: 'cpTitle',
          isShowTooltip: true,
          width: '120'
        },
        {
          label: '课程',
          prop: 'courseName',
          isShowTooltip: true,
          width: '120'
        },
        {
          label: '班级名称',
          prop: 'clsName',
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
          label: '固定位',
          prop: 'fix',
          width: '120',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.fix === '0') {
              return `<div>否</div>`
            } else {
              return `<div>是</div>`
            }
          }
        },
        {
          label: '状态',
          prop: 'signType',
          width: '120',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.signType === '1') {
              return `<div>预约</div>`
            } else if (row.signType === '2') {
              return `<div>排队</div>`
            } else if (row.signType === '3') {
              return `<div>出勤</div>`
            } else if (row.signType === '4') {
              return `<div>请假</div>`
            } else if (row.signType === '5') {
              return `<div>旷课</div>`
            } else if (row.signType === '6') {
              return `<div>取消</div>`
            } else if (row.signType === '6' && row.reason === '1') {
              return `<div>取消</div>操作有误`
            } else if (row.signType === '6' && row.reason === '2') {
              return `<div>取消</div>节假日放假`
            } else if (row.signType === '6' && row.reason === '3') {
              return `<div>取消</div>老师请假`
            } else if (row.signType === '6' && row.reason === '4') {
              return `<div>取消</div>学员调班`
            } else if (row.signType === '6' && row.reason === '5') {
              return `<div>取消</div>从班级移除`
            } else if (row.signType === '6' && row.reason === '6') {
              return `<div>取消</div>老师离职`
            } else if (row.signType === '6' && row.reason === '7') {
              return `<div>取消</div>删除排课`
            } else if (row.signType === '6' && row.reason === '8') {
              return `<div>取消</div>家长取消`
            }
          }
        }
      ],
      tableHeight: 'calc(100vh - 294px)',
      listQuery: {
        show: true,
        sizes: true,
        sizeChange: this.sizeChange,
        indexChange: this.indexChange
      },
      options: {
        isSettingShow: true,
        mutiSelect: true,
        apiService: queryOrderCourseList,
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
            label: '修改考勤',
            method: row => {
              this.updateSignType(row)
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
            label: '标题'
          },
          {
            type: 'select',
            key: 'mtid',
            label: '主教名称',
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          },
          {
            type: 'select',
            key: 'atid',
            label: '助教名称',
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          },
          {
            type: 'timePicker',
            key: 'startTime',
            label: '开始时间',
            format: 'HH:mm',
            valueFormat: 'HH:mm'
          },
          {
            type: 'timePicker',
            key: 'endTime',
            label: '结束时间',
            format: 'HH:mm',
            valueFormat: 'HH:mm'
          },
          {
            type: 'select',
            key: 'signType',
            label: '状态',
            options: [
              { label: '出勤', value: '3' },
              { label: '请假', value: '4' },
              { label: '旷课', value: '5' },
              { label: '取消', value: '6' },
              { label: '预约', value: '1' },
              { label: '排队', value: '2' }
            ]
          },
          {
            key: 'roomId',
            type: 'select',
            label: '教室名称',
            placeholder: '教室名称',
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SS_CRM}/sysBase/cerp/classroom/summaryQuery`
          }
        ]
      },
      checkNum: '', // 选中的个数
      checkList: [], // 选中项
      tabKey: '1', // 选择的tab
      start: this.$moment().format('YYYY-MM-DD'),
      end: this.$moment().format('YYYY-MM-DD'),
      isBackDay: false, // 是否返回今天
      isBackWeek: false, // 是否返回本周
      isBackMonth: false, // 是否返回本月
      isShow: true, // 是否显示
      isShowNewArrange: true,
      superValue: {}, // 高级搜索数据
      formValue: {
        modifyTime: [
          this.$moment().format('YYYY-MM-DD'),
          this.$moment().format('YYYY-MM-DD')
        ]
      }, // 搜索的数据
      flag: true
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
      var monthStart = this.$moment()
        .month(this.$moment().month())
        .startOf('month')
        .format('YYYY-MM-DD') // 月头
      var monthEnd = this.$moment()
        .month(this.$moment().month())
        .endOf('month')
        .format('YYYY-MM-DD') // 月底
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
      if (this.start === monthStart && this.end === monthEnd) {
        this.isBackMonth = false
      } else {
        this.isBackMonth = true
      }
    },
    /** 页数改变 */
    indexChange(pageIndex) {
      let startDate = ''
      let endDate = ''
      if (this.flag) {
        startDate = this.formValue.modifyTime[0]
        endDate = this.formValue.modifyTime[1]
      } else {
        startDate = this.$refs.search.formValue.modifyTime[0]
        endDate = this.$refs.search.formValue.modifyTime[1]
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
      const payload = {
        startDate: this.formValue.modifyTime[0],
        endDate: this.formValue.modifyTime[1],
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
      this.flag = true
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
    /* 高级搜索 */
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
    /* 清空 */
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
    /* 取消约课 */
    cancelOrderCourse() {
      if (this.checkNum > 0) {
        this.checkList.map(item => {
          if (item.signType === '6') {
            this.$message.warning(item.stuName + '已取消的约课无法再次取消')
          } else {
            this.$refs.cancel.show(this.checkList)
          }
        })
      } else {
        this.$message.warning('请至少选中一项取消')
      }
    },
    /* 修改固定位 */
    updateFix() {
      if (this.checkNum > 0) {
        this.$refs.updateFix.show(this.checkList)
      } else {
        this.$message.warning('请至少选中一项修改')
      }
    },
    /* 导出 */
    exportContent() {
      const params = {
        ...this.superValue,
        stuName: this.formInline.stuName,
        courseId: this.formInline.courseId
      }
      if (this.formInline.modifyTime) {
        params.startDate = this.formInline.modifyTime[0]
        params.endDate = this.formInline.modifyTime[1]
      }
      for (const key in params) {
        if (!params[key]) {
          delete params[key]
        }
      }
      if (this.$refs.tableCommon.totalCount > 0) {
        exportFile(`${window.SS_CRM}/cerp/cpbook/exportQuery`, params)
      } else {
        this.$message.error('暂无数据导出')
      }
    },
    /* 上一天 / 下一天 / 上一周 /下一周 */
    OperationQuery(type) {
      let start
      let end
      this.flag = false
      var weekOfday = this.$moment().format('d')
      var monday = this.$moment()
        .subtract(weekOfday - 1, 'days')
        .format('YYYY-MM-DD') // 周一日期
      var sunday = this.$moment()
        .add(7 - weekOfday, 'days')
        .format('YYYY-MM-DD') // 周日日期
      var monthStart = this.$moment()
        .month(this.$moment().month())
        .startOf('month')
        .format('YYYY-MM-DD')
      var monthEnd = this.$moment()
        .month(this.$moment().month())
        .endOf('month')
        .format('YYYY-MM-DD')
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
      } else if (type === 'lastMonth') {
        // 上一月
        this.start = this.$moment(this.$refs.search.formValue.modifyTime[0])
          .subtract(1, 'month')
          .startOf('month')
          .format('YYYY-MM-DD')
        this.end = this.$moment(this.$refs.search.formValue.modifyTime[1])
          .subtract(1, 'month')
          .endOf('month')
          .format('YYYY-MM-DD')
        if (this.start === monthStart && this.end === monthEnd) {
          this.isBackMonth = false
        } else {
          this.isBackMonth = true
        }
      } else if (type === 'nextMonth') {
        // 下一月
        this.start = this.$moment(this.$refs.search.formValue.modifyTime[0])
          .add(1, 'month')
          .startOf('month')
          .format('YYYY-MM-DD')
        this.end = this.$moment(this.$refs.search.formValue.modifyTime[1])
          .add(1, 'month')
          .endOf('month')
          .format('YYYY-MM-DD')
        if (this.start === monthStart && this.end === monthEnd) {
          this.isBackMonth = false
        } else {
          this.isBackMonth = true
        }
      } else if (type === 'backToMonth') {
        // 返回本月
        this.start = this.$moment()
          .month(this.$moment().month())
          .startOf('month')
          .format('YYYY-MM-DD')
        this.end = this.$moment()
          .month(this.$moment().month())
          .endOf('month')
          .format('YYYY-MM-DD')
        this.isBackMonth = false
      }
      this.$refs.search.formValue.modifyTime = [this.start, this.end]
      const params = {
        startDate: this.start,
        endDate: this.end,
        ...this.superValue,
        ...this.formValue
      }
      delete params.modifyTime
      this.$refs.tableCommon.getList(params)
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
        const params = {
          startDate: monday,
          endDate: sunday
        }
        this.start = monday
        this.end = sunday
        this.$refs.tableCommon.getList(params)
      } else if (val === '3') {
        const startDate = this.$moment()
          .startOf('month')
          .format('YYYY-MM-DD')
        const endDate = this.$moment()
          .endOf('month')
          .format('YYYY-MM-DD')
        this.$refs.search.formValue.modifyTime = [startDate, endDate]
        const params = {
          startDate: startDate,
          endDate: endDate
        }
        this.start = startDate
        this.end = endDate
        this.$refs.tableCommon.getList(params)
      }
      this.isBackWeek = false
      this.isBackDay = false
      this.isBackMonth = false
    },
    /* 修改考勤 */
    updateSignType(row) {
      // eslint-disable-next-line
      if (row.signType == '6') {
        this.$message.error('已取消的不能修改')
      } else {
        this.$refs.updateSignType.show(row)
      }
    },
    /* 修改考勤成功更新 */
    getUpdateSignType() {
      let startDate = ''
      let endDate = ''
      if (this.flag) {
        startDate = this.formValue.modifyTime[0]
        endDate = this.formValue.modifyTime[1]
      } else {
        startDate = this.$refs.search.formValue.modifyTime[0]
        endDate = this.$refs.search.formValue.modifyTime[1]
      }
      const params = {
        startDate: startDate,
        endDate: endDate
      }
      this.$refs.tableCommon.getList(params)
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
