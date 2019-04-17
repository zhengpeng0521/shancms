import {
  getClassNameList,
  getScheduleList
} from '@/api/nurseryClass/classArrange'
import ClassArrange from './dialog/classArrangeDialog'
import ClassArrangeCopy from './dialog/classArrangeCopyDialog'
import EditClassArrange from './dialog/editClassArrangeDialog'

export default {
  components: {
    ClassArrange,
    ClassArrangeCopy,
    EditClassArrange
  },
  data() {
    const firstOfMonth =
      this.$moment() &&
      this.$moment()
        .clone()
        .startOf('month')
    const date = firstOfMonth.startOf('week')
    return {
      ruleForm: {
        clsId: '', // 班级名称
        month: this.$moment()
          .startOf('month')
          .format('YYYY-MM') // 月份
      },
      classNameList: [], // 班级名称列表
      month: this.$moment(),
      days: ['1', '2', '3', '4', '5', '6', '7'],
      first: true,
      weeks: [], // 周
      date,
      scheduleList: [],
      amList: [],
      pmList: [],
      syf: ''
    }
  },
  mounted() {
    if (this.$route.params.row) {
      getClassNameList().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.classNameList = data.data
          if (this.classNameList && this.classNameList.length > 0) {
            this.ruleForm.clsId = this.$route.params.row.id
            this.getList()
          }
        } else {
          this.$message.error(data.errorMessage || '获取班级列表失败')
        }
      })
    } else {
      getClassNameList().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.classNameList = data.data
          if (this.classNameList && this.classNameList.length > 0) {
            this.ruleForm.clsId = this.classNameList[0].id
            this.getList()
          }
        } else {
          this.$message.error(data.errorMessage || '获取班级列表失败')
        }
      })
    }
    // 周数
    let count = 0
    if (
      this.month
        .clone()
        .endOf('month')
        .week() == 1 //eslint-disable-line
    ) {
      count =
        this.month.isoWeeksInYear() -
        this.month
          .clone()
          .startOf('month')
          .isoWeek() +
        2
    } else {
      count =
        this.month
          .clone()
          .endOf('month')
          .isoWeek() -
        this.month
          .clone()
          .startOf('month')
          .isoWeek() +
        1
    }
    for (let i = 0; i < count; i++) {
      this.weeks.push(i + '')
    }
  },
  methods: {
    getList() {
      this.amList = []
      this.pmList = []
      const params = {
        clsId: this.ruleForm.clsId,
        month: this.ruleForm.month
      }
      getScheduleList(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.scheduleList = data.list
          this.scheduleList.map((item, index) => {
            const startTime = item.startTime
              ? item.startTime.split(':')
              : undefined
            if (startTime[0] <= 12) {
              this.amList.push(item)
              this.sortTime(this.amList)
            } else {
              this.pmList.push(item)
              this.sortTime(this.pmList)
            }
          })
        }
      })
    },
    getMonthWeek(day, length) {
      if (day === 0) {
        day = 7
      }
      if (day + (length % 7) > 8) {
        return parseInt(length / 7) + 2
      } else {
        return parseInt(length / 7) + 1
      }
    },
    /* 判断是否是同一天 */
    test(index, key, item) {
      return this.dateFunc(index, key) === item.studyDate
    },
    /* 样式 */
    myClass(index, key) {
      if (this.dateFunc(index, key) === this.$moment().format('YYYY-MM-DD')) {
        return 'now'
      } else if (
        this.dateFunc(index, key).slice(5, 7) ===
        this.month.format('YYYY-MM-DD').slice(5, 7)
      ) {
        return 'day_item'
      } else {
        return 'day_disabled'
      }
    },
    dateFunc(index, key) {
      const whj = index * 7 + key
      const firstOfMonth = this.month && this.month.clone().startOf('month')
      if (firstOfMonth.startOf('day').day() === 0) {
        firstOfMonth.add(-6, 'days')
      }
      const a = firstOfMonth
        .startOf('week')
        .add(whj, 'days')
        .format('YYYY-MM-DD')
      return a
    },
    /* 排课 */
    classArrange() {
      this.$refs.classArrange.show()
    },
    /* 复制课表 */
    copySchedule() {
      this.$refs.classCopy.show()
    },
    /* 重置 */
    resetForm() {
      this.ruleForm.month = this.$moment()
        .startOf('month')
        .format('YYYY-MM')
      if (this.classNameList && this.classNameList.length > 0) {
        this.ruleForm.clsId = this.classNameList[0].id
      }
      this.getList()
    },
    /* 搜索 */
    submit() {
      this.weeks = []
      var m = this.$moment(this.ruleForm.month, 'YYYY-MM')
      this.month = m
      let count = 0
      if (
        this.month
          .clone()
          .endOf('month')
          .week() == 1 //eslint-disable-line
      ) {
        count =
          this.month.isoWeeksInYear() -
          this.month
            .clone()
            .startOf('month')
            .isoWeek() +
          2
      } else {
        count =
          this.month
            .clone()
            .endOf('month')
            .isoWeek() -
          this.month
            .clone()
            .startOf('month')
            .isoWeek() +
          1
      }
      for (let i = 0; i < count; i++) {
        this.weeks.push(i + '')
      }
      this.getList()
    },
    /** 按时间排序 */
    sortTime(arr) {
      let temp = []
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
          const current = arr[j].startTime
            ? arr[j].startTime.split(':')
            : undefined
          const next = arr[j + 1].startTime
            ? arr[j + 1].startTime.split(':')
            : undefined
          if (current > next) {
            temp = arr[j + 1]
            arr[j + 1] = arr[j]
            arr[j] = temp
          }
        }
      }
      return arr
    },
    setSchedules(item) {
      this.$refs.edit.show(item)
    },
    /* 刷新列表数据 */
    getUpdateTable() {
      this.getList()
    }
  }
}
