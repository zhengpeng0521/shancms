import { FormatDate } from '../../../../utils/dateFormat'
import EditAndAttendance from './dialog/editAndAttendance'
import ReapplyAttendanceTicket from './dialog/reapplyAttendanceTicket'
import {
  checkQuery,
  tenantUserSummaryQuery
} from '@/api/teachManage/attendance'
export default {
  components: {
    EditAndAttendance,
    ReapplyAttendanceTicket
  },
  data() {
    return {
      studyDate: this.$moment().format('YYYY-MM-DD'),
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6
        }
      },
      isCurrentDay: true, // 是否是当天
      totalCount: 0, // 一页条数
      attendanceList: [],
      pageIndex: 1,
      pageSize: 10,
      teacherList: [] // 教师列表
    }
  },
  watch: {
    studyDate(newVal) {
      if (
        newVal == this.$moment().format('YYYY-MM-DD') //eslint-disable-line
      ) {
        this.isCurrentDay = true
      } else {
        this.isCurrentDay = false
      }
      this.pageIndex = 1
      this.getAttentdanceList()
    }
  },
  mounted() {
    this.getAttentdanceList()
    this.getUserlist()
  },
  methods: {
    /* 获取考勤列表 */
    getAttentdanceList() {
      const params = {
        studyDate: this.studyDate,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex - 1
      }
      checkQuery(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.attendanceList = data.results
          this.totalCount = data.data && data.data.resultCount
        } else {
          this.$message.error(data.errorMessage || '获取考勤列表失败')
        }
      })
    },
    /* 获取员工列表 */
    getUserlist() {
      tenantUserSummaryQuery().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.teacherList = data.results
        } else {
          this.$message.error(data.errorMessage || '获取员工列表失败')
        }
      })
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.getAttentdanceList()
    },
    handleCurrentChange(index) {
      this.pageIndex = index
      this.getAttentdanceList()
    },
    OperationQuery(type) {
      let start
      // eslint-disable-next-line
      if (type == 'beforeDay') {
        // 上一天
        start = new Date(this.studyDate).getTime() - 24 * 60 * 60 * 1000
        this.studyDate = FormatDate(start).substr(0, 10)
        if (
          this.studyDate == this.$moment().format('YYYY-MM-DD') //eslint-disable-line
        ) {
          this.isCurrentDay = true
        } else {
          this.isCurrentDay = false
        }
        // eslint-disable-next-line
      } else if (type == 'nextDay') {
        // 下一天
        start = new Date(this.studyDate).getTime() + 24 * 60 * 60 * 1000
        this.studyDate = FormatDate(start).substr(0, 10)
        if (
          this.studyDate == this.$moment().format('YYYY-MM-DD') //eslint-disable-line
        ) {
          this.isCurrentDay = true
        } else {
          this.isCurrentDay = false
        }
      }
    },
    /* 考勤 */
    stuAttendanceChange(item) {
      this.$refs.editAttendance.show(this.isCurrentDay, '1', item)
    },
    /* 明细 */
    stuAttendanceDetail(item) {
      this.$refs.editAttendance.show(this.isCurrentDay, '2', item)
    },
    /* 补打小票 */
    reapplyTicket(item) {
      this.$refs.reapplySmallTicket.show(item)
    },
    /* 更新数据 */
    getUpdateTable() {
      this.getAttentdanceList()
    }
  }
}
