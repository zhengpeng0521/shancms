import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import WeekDatePicker from '@/components/WeekDatePicker/weekDatePicker'
import { batchCopyQuery } from '@/api/teachManage/arrangeCourse'
import BatchCopyCourse from './dialog/batchCopyCourse'
export default {
  components: {
    CommonSearch,
    CommonTable,
    BatchCopyCourse,
    WeekDatePicker
  },
  data() {
    return {
      checkNum: '0', // 已选中的数据
      checkList: [], // 选中的项
      formInline: {
        modifyTime: new Date(this.$moment().format('YYYY-MM-DD'))
      },
      pickerOptions: {
        // disabledDate(time) {
        //   return time.getTime() > Date.now() - 8.64e7
        // },
        firstDayOfWeek: 1
      },
      columns: [
        {
          label: '排课标题',
          prop: 'title',
          isShowTooltip: true,
          width: '120',
          isShowSet: false
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
            return `<div>${row.studyDate} (${row.weekDay})</div>`
          }
        },
        {
          label: '时间段',
          prop: 'time',
          width: '120',
          isShowTooltip: true,
          formatter: row => {
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
      tableHeight: 'calc(100vh - 252px)',
      listQuery: {
        show: false
      },
      options: {
        mutiSelect: true, // 是否多选
        isSettingShow: true // 是否出现设置
      },
      tableData: [],
      tableLoading: false,
      startWeek: '',
      endWeek: ''
    }
  },
  mounted() {
    this.getList()
  },
  watch: {
    'formInline.modifyTime'(newVal) {
      var weekOfday = this.$moment().format('d')
      var monday = this.$moment()
        .subtract(weekOfday - 1, 'days')
        .format('YYYY-MM-DD') // 周一日期
      var sunday = this.$moment()
        .add(7 - weekOfday, 'days')
        .format('YYYY-MM-DD') // 周日日期
      this.startWeek = monday
      this.endWeek = sunday
    }
  },
  methods: {
    getList(val) {
      let params = {}
      if (val) {
        params = val
      } else {
        params = {
          startDate: this.$moment()
            .subtract(this.$moment().format('d') - 1, 'days')
            .format('YYYY-MM-DD'),
          endDate: this.$moment()
            .add(7 - this.$moment().format('d'), 'days')
            .format('YYYY-MM-DD')
        }
      }
      console.info('params---->', params)
      this.tableLoading = true
      batchCopyQuery(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.tableData = data.list
        } else {
          this.$message.error(data.errorMessage)
        }
        this.tableLoading = false
      })
    },
    /* 搜索 */
    searchHandle() {
      // 搜索的入参
      let params = {}
      // eslint-disable-next-line
      if (this.startWeek != '' && this.endWeek != '') {
        params = {
          startDate: this.startWeek,
          endDate: this.endWeek
        }
        this.getList(params)
      } else {
        this.getList()
      }
    },
    /* 搜索重置 */
    resetFieldHanle() {
      // 重置的入参
      const params = {
        startDate: this.$moment()
          .subtract(this.$moment().format('d') - 1, 'days')
          .format('YYYY-MM-DD'),
        endDate: this.$moment()
          .add(7 - this.$moment().format('d'), 'days')
          .format('YYYY-MM-DD')
      }
      this.formInline.modifyTime = new Date(this.$moment().format('YYYY-MM-DD'))
      this.getList(params)
    },
    /* 批量复制 */
    batchCopy() {
      if (this.checkList.length > 0) {
        this.$refs.batchCopy.show(this.checkList)
      } else {
        this.$message.warning('至少选中一项复制')
      }
    },
    /* 获取选中的条数 */
    selectionChange(val) {
      this.checkList = val
      this.checkNum = val.length
    },
    /* 获取列的勾选 */
    getCheckCol() {},
    /* 清除选中项 */
    clearSelection() {
      this.$refs.tableCommon.clearSelection()
    },
    /* 时间戳转日期 */
    fmtDate(obj) {
      var date = new Date(obj)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return (
        y +
        '-' +
        m.substring(m.length - 2, m.length) +
        '-' +
        d.substring(d.length - 2, d.length)
      )
    },
    dateChange(val) {
      const start = new Date(val)
      this.startWeek = this.fmtDate(start)
      const end = new Date(this.startWeek).getTime() + 6 * 24 * 60 * 60 * 1000
      this.endWeek = this.fmtDate(end)
    }
  }
}
