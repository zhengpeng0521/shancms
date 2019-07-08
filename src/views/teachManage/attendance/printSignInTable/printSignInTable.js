import { queryArrageCourseList } from '@/api/teachManage/attendance'
import { exportFile } from '@/utils/exportFile'
import { do_print } from '@/utils/printUtils'
import html2canvas from 'html2canvas'
import { showTableColumn, saveTableColumn } from '@/api/orgSet/tableColumnSet'
export default {
  data() {
    return {
      studyDate: '', // 上课日期
      course: [], // 课程
      tableData: [], // 表格数据
      checkList: [], // 勾选表头的列表
      formTheadOptions: [], // 表格的列
      checkboxVal: [], // 默认选中的表头
      totalCount: 0, // 总条数
      columns: [
        {
          prop: 'name',
          label: '姓名',
          isDisabled: true,
          defaultChecked: true
        },
        {
          prop: 'nickname',
          label: '昵称',
          defaultChecked: true
        },
        {
          prop: 'mobile',
          label: '家长电话',
          defaultChecked: true
        },
        {
          prop: 'sex',
          label: '性别',
          defaultChecked: true
        },
        {
          prop: 'seller',
          label: '负责销售',
          defaultChecked: true
        },
        {
          prop: 'type',
          label: '类型',
          formatter: this.formatType,
          defaultChecked: true
        },
        {
          prop: 'month',
          label: '月龄'
        },
        {
          prop: 'age',
          label: '年龄'
        },
        {
          prop: 'channel',
          label: '一级来源'
        },
        {
          prop: 'secondChannel',
          label: '二级来源'
        },
        {
          prop: 'parent',
          label: '家长签到',
          isDisabled: true,
          defaultChecked: true
        },
        {
          prop: 'remark',
          label: '备注',
          isDisabled: true,
          defaultChecked: true
        }
      ],
      formThead: this.columns, // 表格默认头部
      choosedArr: [], // 选中的课程
      options: [], // 打印签到表的数据
      tableKey: 'teachManage_attendance_printSignInTable_printSignInTable'
    }
  },
  created() {
    this.formTheadOptions = Object.assign([], this.columns)
    this.checkList = Object.assign([], this.columns)
    const checkArr = Object.assign([], this.columns)
    checkArr.map((item, index) => {
      if (item.defaultChecked === true) {
        this.checkboxVal.push(item.prop)
      }
    })
  },
  mounted() {
    this.showTableColumnFun()
  },
  watch: {
    checkboxVal(valArr) {
      this.formThead = this.formTheadOptions.filter(
        i => valArr.indexOf(i.prop) >= 0
      )
      this.key = this.key + 1 // 为了保证table 每次都会重渲
    },
    columns(newProp) {
      this.formThead = newProp
    },
    studyDate(val) {
      if (val) {
        this.getList()
      } else {
        this.choosedArr = []
        this.course = []
      }
    }
  },
  methods: {
    getList() {
      const params = {
        startDate: this.studyDate,
        endDate: this.studyDate,
        pageSize: 99999,
        pageIndex: 0,
        menu: 'sign'
      }
      queryArrageCourseList(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.options = data.results
          this.totalCount = data.data && data.data.resultCount
          let table = []
          this.options.map(item => {
            table = item.stuArr
            table = table.concat(item.mulStuArr)
            table = table.concat(item.tryStuArr)
            item.tableData = table
          })
        } else {
          this.$message.error(data.errorMessage || '获取列表失败')
        }
      })
    },
    // 显示该表格选中的列
    showTableColumnFun() {
      const params = {
        tableKey: this.tableKey
      }
      showTableColumn(params).then(res => {
        if (res.data.errorCode === 0) {
          const columnSet = res.data.columnSet
          if (columnSet.length <= 0 && res.data.diy !== 'all') {
            this.checkboxVal = []
          } else {
            if (res.data.columnSet) {
              this.checkboxVal = JSON.parse(res.data.columnSet)
            }
          }
        }
      })
    },
    // 保存选中的列
    saveTableColumnFun() {
      const params = {
        tableKey: this.tableKey,
        columnSet: JSON.stringify(this.checkboxVal)
      }
      saveTableColumn(params).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success(res.data.errorMessage)
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 类型格式化 */
    formatType(row, column) {
      if (row.stu_type === '1') {
        return `上课`
      } else if (row.stu_type === '2') {
        return `补课`
      } else {
        return `试听`
      }
    },
    /* 内容项选择 */
    saveCheckVal() {},
    /* 课程选择 */
    courseChange(cpdIdArr) {
      this.choosedArr = []
      if (cpdIdArr && cpdIdArr.length > 0) {
        cpdIdArr.map((item, index) => {
          for (const i in this.options) {
            if (item === this.options[i].cpdId) {
              this.choosedArr.push(this.options[i])
              break
            }
          }
        })
      } else {
        this.choosedArr = []
      }
    },
    /* 移除多选的tag */
    removeTagFunc(val) {
      this.choosedArr.map((item, index) => {
        if (item.cpdId === val) {
          this.choosedArr.splice(item, 1)
        }
      })
    },
    /* 导出 */
    exportContent() {
      let cpdIds = ''
      const cpdIdArr = []
      if (this.studyDate) {
        if (this.choosedArr && this.choosedArr.length > 0) {
          const params = {
            ...this.superValue
          }
          this.choosedArr.map(item => {
            cpdIdArr.push(item.cpdId)
            cpdIds = cpdIdArr && cpdIdArr.join(',')
          })
          params.startDate = this.studyDate
          params.endDate = this.studyDate
          params.cpdIds = cpdIds
          params.menu = 'sign'
          for (const key in params) {
            if (!params[key]) {
              delete params[key]
            }
          }
          if (this.totalCount > 0) {
            exportFile(`${window.SS_CRM}/cerp/cp/exportSignTable`, params)
          } else {
            this.$message.error('暂无数据导出')
          }
        } else {
          this.$message.error('请选择课程')
        }
      } else {
        this.$message.error('请选择日期')
      }
    },
    /* 打印签到表 */
    printSign() {
      const course_print = document.getElementById(
        'new_cerp_follow_course_print'
      )
      setTimeout(function() {
        var w = 1180
        var h = 1650

        // 要将 canvas 的宽高设置成容器宽高的 2 倍
        var canvas = document.createElement('canvas')
        canvas.width = w * 3
        canvas.height = h * 3
        canvas.style.width = w * 3 + 'px'
        canvas.style.height = h * 3 + 'px'
        var context = canvas.getContext('2d')
        // 然后将画布缩放，将图像放大两倍画到画布上
        context.scale(3, 3)

        html2canvas(course_print, { canvas: canvas }).then(function(canvas) {
          const image_data = canvas.toDataURL('image/png')
          document.getElementById('print_area_stu').innerHTML =
            '<img style="width:1000px;height:auto" src="' + image_data + '"/>'
        })
      }, 1000)

      setTimeout(function() {
        do_print('print_area_stu')
      }, 3000)
    }
  }
}
