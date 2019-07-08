import {
  tenantUserSummaryQuery,
  queryClassroomList,
  queryArrageCourseList
} from '@/api/teachManage/orderCourse'
import { do_print } from '@/utils/printUtils'
export default {
  data() {
    return {
      type: '1', // 教室/老师
      list: [], // 下拉为教室/老师
      placeholder: '请选择老师',
      teachList: [], // 老师列表
      roomList: [], // 教室列表
      modifyTime: this.$moment().format('YYYY-MM-DD'), // 选择时间
      teacherInfo: [], // 老师信息
      courseInfo: [], // 课程信息
      roomInfo: [], // 教室信息
      printList: [], // 打印的信息
      realPrint: 0,
      realPrintArr: [], // 5个一组，长度即为页数
      realPrintItem: [], // 一页五组
      realRemainder: 0,
      realRemainderArr: []
    }
  },

  computed: {
    selectList() {
      const selects = this.type === '2' ? this.roomList : this.teachList
      return selects
    }
  },

  watch: {
    type(val) {
      // eslint-disable-next-line
      if (val == "1") {
        this.placeholder = '请选择老师'
        // eslint-disable-next-line
      } else if (val == "2") {
        this.placeholder = '请选择教室'
      }
      this.list = []
      this.printList = []
    }
  },
  mounted() {
    this.getClassroomList()
    this.getUserlist()
    this.getList()
  },
  methods: {
    /* 获取教室列表 */
    getClassroomList() {
      const params = {
        status: '1'
      }
      queryClassroomList(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.roomList = data.results
        } else {
          this.$message.error(data.errorMessage || '获取教室列表失败')
        }
      })
    },
    /* 获取员工列表 */
    getUserlist() {
      tenantUserSummaryQuery().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.teachList = data.results
        } else {
          this.$message.error(data.errorMessage || '获取员工列表失败')
        }
      })
    },
    getList() {
      /* 获取打印列表展示 */
      const params = {
        startDate: this.modifyTime,
        endDate: this.modifyTime,
        pageSize: 99999,
        pageIndex: 0
      }
      queryArrageCourseList(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.courseInfo = data.results
          this.courseInfo.map(item => {
            const stuArr = this.formatStu(item.stuArr, '_stuArr_')
            const mulStuArr = this.formatStu(item.mulStuArr, '_mulStuArr_')
            const tryStuArr = this.formatStu(item.tryStuArr, '_tryStuArr_')
            let stuArrSum = []
            for (const i in stuArr) {
              stuArrSum.push(stuArr[i])
            }
            for (const i in mulStuArr) {
              stuArrSum.push(mulStuArr[i])
            }
            for (const i in tryStuArr) {
              stuArrSum.push(tryStuArr[i])
            }
            stuArrSum = stuArrSum.slice(0, 20).join('，')
            item.stuArrSum = stuArrSum
          })
        } else {
          this.$message.error(data.errorMessage || '列表获取失败')
        }
      })
    },

    /* 选择老师或教室 */
    selectChange(arr) {
      const info = []
      // eslint-disable-next-line
      if (this.type == "1") {
        for (const i in arr) {
          const index = arr[i].indexOf('-')
          const obj = {
            id: arr[i].substr(0, index),
            name: arr[i].substr(index + 1),
            course: []
          }
          for (const j in this.courseInfo) {
            const mtids = this.courseInfo[j].mtids
              ? this.courseInfo[j].mtids + ''
              : ''
            const atids = this.courseInfo[j].atids
              ? this.courseInfo[j].atids + ''
              : ''

            if (mtids.indexOf(arr[i].substr(0, index)) > -1) {
              obj.course.push(this.courseInfo[j])
            } else if (atids.indexOf(arr[i].substr(0, index)) > -1) {
              obj.course.push(this.courseInfo[j])
            }
          }
          info.push(obj)
        }
        this.printList = info
        // eslint-disable-next-line
      } else if (this.type == "2") {
        for (const i in arr) {
          const index = arr[i].indexOf('-')
          const obj = {
            id: arr[i].substr(0, index),
            name: arr[i].substr(index + 1),
            course: []
          }
          for (const j in this.courseInfo) {
            const roomId = this.courseInfo[j].roomId
              ? this.courseInfo[j].roomId + ''
              : ''
            // eslint-disable-next-line
            if (roomId == arr[i].substr(0, index)) {
              obj.course.push(this.courseInfo[j])
            }
          }
          info.push(obj)
        }
        this.printList = info
      }
      this.realPrintArr = []
      this.realPrintItem = []
      this.realRemainderArr = []
      this.realPrint = Math.ceil(this.printList.length / 5) // 需要渲染的组数个数即页数(5个为1组)
      this.realRemainder = this.printList.length - (this.realPrint - 1) * 5 // 余数，用来进行大于5个的最后一组或者小于5个的第一组渲染
      for (let i = 0; i < this.realPrint; i++) {
        this.realPrintArr.push(i)
        // eslint-disable-next-line
        if (i != this.realPrint - 1 && this.realPrint > 1) {
          for (let j = i * 5; j < i * 5 + 5; j++) {
            this.realPrintItem.push(j)
          }
        } else {
          for (let k = i * 5; k < i * 5 + this.realRemainder; k++) {
            this.realRemainderArr.push(k)
          }
        }
      }
    },
    datePickerOnChange(time) {
      this.getList()
    },
    // 上课/补课/试听学员姓名格式化方法
    formatStu(array, type) {
      let formatArray = [] //eslint-disable-line
      if (array && array.length > 0) {
        return (formatArray = array.map((item, index) => {
          return item.name
        }))
      } else {
        return []
      }
    },
    /* 打印签到表 */
    print() {
      do_print('schedule_print_by_day')
    }
  }
}
