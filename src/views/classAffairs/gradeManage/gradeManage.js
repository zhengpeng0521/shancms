import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import {
  tenantUserSummaryQuery,
  getClassType,
  getGradeList,
  excistStu,
  deleteClass
} from '@/api/nurseryClass/gradeManage'
import GradeInfo from './dialog/gradeInfo'
import EditGradeInfo from './dialog/editGradeInfo'
import StuAttendance from './childCom/stuAttendance.vue'
import ClassDetail from './side/classDetail'
import AddStudent from './dialog/addStudent'
import DeleteSureAgain from './dialog/deleteSureAgain'

export default {
  components: {
    CommonSearch,
    CommonTable,
    AdvancedSearch,
    GradeInfo,
    EditGradeInfo,
    StuAttendance,
    ClassDetail,
    AddStudent,
    DeleteSureAgain
  },
  data() {
    return {
      formInline: {
        searchMethod: formValue => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '班级名称',
            modelValue: 'clsName',
            isClearable: true,
            itemStyle: 'width:140px'
          },
          {
            itemType: 'select',
            placeholder: '托班类型',
            modelValue: 'clsType',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            apiService: getClassType,
            params: {
              dictkey: 'nurseryType'
            },
            valueKey: 'key',
            labelKey: 'value'
          },
          {
            itemType: 'select',
            placeholder: '主教',
            modelValue: 'mTeacher',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            apiService: tenantUserSummaryQuery,
            valueKey: 'id',
            labelKey: 'name'
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
            type: 'select',
            key: 'classRoom',
            label: '教室',
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SS_CRM}/sysBase/cerp/classroom/summaryQuery`
          },
          {
            type: 'select',
            key: 'aTeacher',
            label: '助教',
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          },
          {
            type: 'select',
            key: 'nursery',
            label: '保育员',
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          }
        ]
      },
      advancedSearchShow: false,
      columns: [
        {
          label: '班级名称',
          prop: 'clsName',
          isShowSet: false,
          width: '180',
          isShowTooltip: true,
          render: (h, params) => {
            return h(
              'span',
              {
                class: 'gradeName',
                on: {
                  click: () => {
                    this.toCourseDetail(params.row)
                  }
                }
              },
              params.row.clsName
            )
          }
          // formatter: row => {
          //   return `<div style="color:#46B6EE">${row.clsName}</div>`
          // },
          // methods: row => {
          //   this.toCourseDetail(row)
          // }
        },
        {
          label: '托班类型',
          prop: 'nurseryType',
          isShowSet: true,
          isShowTooltip: true
        },
        {
          label: '班级人数',
          prop: 'clsNumber',
          isShowSet: true,
          isShowTooltip: true,
          formatter: row => {
            return `${row.clsNumber || '--'}`
          }
        },
        {
          label: '已签到',
          prop: 'signInNum',
          isShowSet: true,
          isShowTooltip: true
        },
        {
          label: '已签退',
          prop: 'signOutNum',
          isShowSet: true,
          isShowTooltip: true
        },
        {
          label: '已请假',
          prop: 'signLeaveNum',
          isShowSet: true,
          isShowTooltip: true
        },
        {
          label: '主教',
          prop: 'mteachers',
          isShowSet: true,
          isShowTooltip: true
        },
        {
          label: '助教',
          prop: 'ateachers',
          isShowSet: true,
          isShowTooltip: true
        },
        {
          label: '保育员',
          prop: 'nurserys',
          isShowSet: true,
          isShowTooltip: true
        },
        {
          label: '教室',
          prop: 'clsRoom',
          isShowSet: true,
          isShowTooltip: true
        }
      ],
      listQuery: {
        show: true // 是否显示
      },
      options: {
        apiService: getGradeList, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 234px)',
      operates: {
        width: '250',
        fixed: 'right',
        list: [
          {
            label: '考勤',
            method: row => {
              this.attendanceFunc(row)
            }
          },
          {
            label: '排课',
            method: row => {
              this.arrangeCourse(row)
            }
          },
          {
            label: '删除',
            type: 'normal',
            method: row => {
              this.deleteHandle(row)
            },
            popoverCon: [
              {
                contentText: '确定要删除？'
              }
            ]
          }
        ]
      },
      isStuAttenShow: false, // 考勤是否显示
      superValue: {}, // 高级搜索数据
      formValue: {}, // 搜索栏的数据
      attendanceId: '' // 考勤的id
    }
  },
  methods: {
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      const params = {
        ...formValue,
        ...this.superValue
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 0,
        ...this.superValue
      }
      this.formValue = {}
      this.$refs.tableCommon.getList(params)
    },
    /** 高级搜索 */
    onSearch(superValue) {
      this.superValue = superValue
      const params = {
        ...this.formValue,
        ...this.superValue
      }
      this.$refs.tableCommon.getList(params)
    },
    /** 高级清除 */
    onClear() {
      const params = {
        pageIndex: 0,
        ...this.formValue
      }
      this.superValue = {}
      this.$refs.tableCommon.getList(params)
    },
    getCheckCol(val) {
      console.info('val--->', val)
    },
    /* 新建班级 */
    addGrade() {
      this.$refs.gradeInfo.show()
    },
    /* 更新表格数据 */
    getUpdateTable() {
      const params = {
        pageIndex: 0
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 删除  */
    deleteHandle(row) {
      excistStu({ id: row.id }).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          if (data.excist) {
            this.$refs.delSureAgain.show(row)
          } else {
            deleteClass({ id: row.id }).then(res => {
              const ret = res.data
              if (ret.errorCode === 0) {
                this.$refs.tableCommon.getList({ pageIndex: 0 })
                this.$message.success(ret.errorMessage)
              } else {
                this.$message.error(ret.errorMessage || '删除班级失败')
              }
            })
          }
        }
      })
    },
    /* 考勤 */
    attendanceFunc(row) {
      this.attendanceId = row.id
      this.isStuAttenShow = true
    },
    /* 返回班级列表 */
    getShowStu(val) {
      this.isStuAttenShow = val
    },
    /* 排课 */
    arrangeCourse(row) {
      this.$router.push({ name: 'classArrangement', params: { row }})
    },
    /* 班级详情 */
    toCourseDetail(row) {
      this.$refs.classDetail.show(row)
    },
    /* 添加学员 */
    getAddStuData(list, row) {
      this.$refs.addStu.show(list, row)
    },
    /* 添加学员刷新数据 */
    getUpdateAddStuTable(row) {
      const params = {
        pageIndex: 0
      }
      this.$refs.tableCommon.getList(params)
      this.$refs.classDetail.show(row)
    },
    /* 编辑 */
    getEditStuInfoData(id) {
      this.$refs.editGradeInfo.show(id)
    },
    /* 编辑更新表格数据 */
    getEditUpdate() {
      const params = {
        pageIndex: 0
      }
      this.$refs.tableCommon.getList(params)
      this.$refs.classDetail.close()
    },
    /* 删除 */
    getDelClassData(row) {
      this.$refs.delSureAgain.show(row)
    }
  }
}
