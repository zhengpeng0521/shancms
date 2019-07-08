import CommonSearch from '@/components/CommonSearch/CommonSearch'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import Popover from '@/components/CommonTable/popover'
import {
  getStuAttendanceList,
  batchCreate,
  createSign
} from '@/api/nurseryClass/gradeManage'
import { showTableColumn, saveTableColumn } from '@/api/orgSet/tableColumnSet'
import MyRender from '@/components/CommonTable/MyRender'
import success from './dialog/success'
import remark from './dialog/remark'
import fail from './dialog/fail'
export default {
  components: {
    CommonSearch,
    AdvancedSearch,
    MyRender,
    success,
    remark,
    fail,
    Popover
  },
  props: {
    attendanceId: {
      type: String,
      default: () => {
        return undefined
      }
    }
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
            placeholder: '学员姓名',
            modelValue: 'stuName',
            isClearable: true,
            itemStyle: 'width:140px'
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
            key: 'nickName',
            type: 'input',
            label: '昵称',
            placeholder: '昵称'
          },
          {
            key: 'parentName',
            type: 'input',
            label: '家长姓名',
            placeholder: '家长姓名'
          },
          {
            key: 'phone',
            type: 'input',
            label: '家长手机号',
            placeholder: '家长手机号'
          },
          {
            type: 'select',
            key: 'gender',
            label: '性别',
            optionValue: 'key',
            optionLabel: 'label',
            options: [{ key: '1', label: '男' }, { key: '2', label: '女' }]
          }
        ]
      },
      columns: [
        {
          label: '学生姓名',
          prop: 'name',
          isShowTooltip: true,
          width: '90'
        },
        {
          label: '昵称',
          prop: 'nickName',
          isShowTooltip: true
        },
        {
          label: '家长姓名',
          prop: 'parentName',
          width: 150,
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span',
                params.row.parentInfo && params.row.parentInfo.length > 1
                  ? [
                    h(
                      'el-popover',
                      {
                        props: { placement: 'top', trigger: 'hover' }
                      },
                      [
                        h(
                          'div',
                          params.row.parentInfo &&
                              params.row.parentInfo.map(item => {
                                return h(
                                  'span',
                                  { style: 'margin-right:10px' },
                                  item.name
                                )
                              })
                        ),
                        h('span', { slot: 'reference' }, [
                          h('span', params.row.parentInfo[0].name + ' '),
                          h(
                            'a',
                            { style: 'margin: 0 0 0 5px' },
                            '共' + params.row.parentInfo.length + '人'
                          )
                        ])
                      ]
                    )
                  ]
                  : params.row.parentInfo &&
                      params.row.parentInfo.map((item, index) => {
                        return h('span', item.name)
                      })
              )
            ])
          }
        },
        {
          label: '家长手机号',
          prop: 'parentMobile',
          width: '120',
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'el-popover',
                {
                  props: { placement: 'top', width: '200', trigger: 'hover' }
                },
                [
                  h(
                    'div',
                    params.row.parentInfo.map(item => {
                      return h('div', item.name + '：' + item.mobile)
                    })
                  ),
                  h('a', { slot: 'reference' }, '查看')
                ]
              )
            ])
          }
        },
        {
          label: '性别',
          prop: 'sex',
          isShowTooltip: true
        },
        {
          label: '年龄(月龄)',
          prop: 'age',
          width: '100',
          isShowTooltip: true
        },
        {
          label: '备注',
          prop: 'remark',
          width: '150',
          render: (h, params) => {
            if (params.row.remark) {
              return h('div', [
                h(
                  'el-tooltip',
                  {
                    props: {
                      placement: 'top',
                      effect: 'dark',
                      trigger: 'hover'
                    }
                  },
                  [
                    h('span', { slot: 'content' }, params.row.remark),
                    h(
                      'span',
                      {
                        style:
                          'display:inline-block;max-width:80px;vertical-align:middle;overflow:hidden;white-space:nowrap'
                      },
                      params.row.remark
                    )
                  ]
                ),
                h(
                  'a',
                  {
                    style: {
                      marginRight: '0px',
                      marginLeft: '10px'
                    },
                    on: {
                      click: () => {
                        this.toUpdateRemarkFunc(params.row)
                      }
                    }
                  },
                  '修改'
                )
              ])
            } else {
              return h(
                'a',
                {
                  on: {
                    click: () => {
                      this.toRemarkFunc(params.row)
                    }
                  }
                },
                '备注'
              )
            }
          }
        }
      ],
      tableKey: 'classAffairs_gradeManage_childCom_stuAttendance',
      // signVisible: false,
      advancedSearchShow: false,
      tableData: [],
      pageSize: 10,
      pageIndex: 1,
      totalCount: 0, // 总条数
      isloading: false, // 是否loading加载
      formTheadOptions: [], // 表格的列
      checkboxVal: [], // 默认选中的表头
      formThead: this.columns, // 默认表头
      checkList: [], // 勾选表头的列表
      checkNum: 0, // 多选的个数
      selectList: [],
      superValue: {}, // 高级搜索的查询数据
      formValue: {}, // 搜索栏的数据
      visiArr: [],
      operateArr: [
        {
          label: '签到',
          prop: 'signIn',
          methodCancel: row => {
            this.changeSign(row, '4')
          },
          methodSure: row => {
            this.changeSign(row, '1')
          },
          content: '确定要撤销该项操作吗？'
        }
      ]
    }
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
    }
  },
  created() {
    this.formTheadOptions = Object.assign([], this.columns)
    this.checkList = Object.assign([], this.columns)
    const checkArr = Object.assign([], this.columns)
    checkArr.map((item, index) => {
      if (item.isColShow !== false) {
        this.checkboxVal.push(item.prop)
      }
    })
  },
  mounted() {
    this.getList()
    this.showTableColumnFun()
  },
  methods: {
    getList() {
      const params = {
        pageIndex: this.pageIndex - 1,
        pageSize: this.pageSize,
        id: this.attendanceId,
        stuName: this.formValue.stuName,
        nickName: this.superValue.nickName,
        parentName: this.superValue.parentName,
        phone: this.superValue.phone,
        gender: this.superValue.gender
      }
      getStuAttendanceList(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.tableData = data.results
          this.tableData.map(item => {
            Object.assign(item, { signVisible: false })
            Object.assign(item, { signOutVisible: false })
            Object.assign(item, { signLeaveVisible: false })
          })
          this.totalCount = data.data && data.data.resultCount
        } else {
          this.$message.error(data.errorMessage || '考勤列表获取失败')
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
    /* 返回班级列表 */
    goBack() {
      this.$emit('toParent', false)
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      this.getList()
    },
    /* 搜索重置 */
    resetFieldHanle() {
      // 重置的入参
      this.formValue = {}
      this.getList()
    },
    /** 高级搜索 */
    onSearch(superValue) {
      this.superValue = superValue
      this.getList()
    },
    /** 高级清除 */
    onClear() {
      this.superValue = {}
      this.getList()
    },
    /* 签到撤销取消 */
    signInCancel(stuId) {
      this.$refs[`signIn-` + stuId].doClose()
    },
    /* 签退撤销取消 */
    signOutCancel(stuId) {
      this.$refs[`signOut-` + stuId].doClose()
    },
    /* 请假撤销取消 */
    signLeaveCancel(stuId) {
      this.$refs[`signLeave-` + stuId].doClose()
    },
    /* 操作考勤 */
    createSign(name, status, params) {
      createSign(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.getList()
          this.$message.success(data.errorMessage)
          this.$refs.success.show(name, status)
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 状态更改 */
    changeSign(row, status) {
      // eslint-disable-next-line
      if (status == '1') {
        const params = {
          signType: '1',
          clsId: this.attendanceId,
          stuId: row.stuId
        }
        this.createSign(row.name, status, params)
        // eslint-disable-next-line
      } else if (status == '2') {
        const params = {
          signType: '2',
          clsId: this.attendanceId,
          stuId: row.stuId
        }
        this.createSign(row.name, status, params)
        // eslint-disable-next-line
      } else if (status == '3') {
        const params = {
          signType: '3',
          clsId: this.attendanceId,
          stuId: row.stuId
        }
        this.createSign(row.name, status, params)
        // eslint-disable-next-line
      } else if (status == '4') {
        const params = {
          signType: '4',
          clsId: this.attendanceId,
          stuId: row.stuId
        }
        this.createSign(row.name, status, params)
        this.$refs[`signIn-` + row.stuId].doClose()
        // eslint-disable-next-line
      } else if (status == '5') {
        const params = {
          signType: '5',
          clsId: this.attendanceId,
          stuId: row.stuId
        }
        this.createSign(row.name, status, params)
        this.$refs[`signOut-` + row.stuId].doClose()
        // eslint-disable-next-line
      } else if (status == '6') {
        const params = {
          signType: '6',
          clsId: this.attendanceId,
          stuId: row.stuId
        }
        this.createSign(row.name, status, params)
        this.$refs[`signLeave-` + row.stuId].doClose()
      }
    },
    /* 批量考勤 */
    batchCreate(params, status) {
      batchCreate(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.getList()
          this.$message.success(data.errorMessage)
        } else if (data.errorCode === 110613) {
          this.$refs.fail.show(data.list, status)
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 批量更改状态 */
    batchChangeStatus(status) {
      let stuIds = ''
      const stuArr = []
      if (this.selectList && this.selectList.length > 0) {
        // eslint-disable-next-line
        if (status == 'signIn') {
          this.selectList.map(item => {
            stuArr.push(item.stuId)
          })
          stuIds = stuArr && stuArr.join(',')
          const params = {
            signType: '1',
            stuIds: stuIds,
            clsId: this.attendanceId
          }
          this.batchCreate(params, status)
          // eslint-disable-next-line
        } else if (status == 'signOut') {
          this.selectList.map(item => {
            stuArr.push(item.stuId)
          })
          stuIds = stuArr && stuArr.join(',')
          const params = {
            signType: '2',
            stuIds: stuIds,
            clsId: this.attendanceId
          }
          this.batchCreate(params, status)
          // eslint-disable-next-line
        } else if (status == 'signLeave') {
          this.selectList.map(item => {
            stuArr.push(item.stuId)
          })
          stuIds = stuArr && stuArr.join(',')
          const params = {
            signType: '3',
            stuIds: stuIds,
            clsId: this.attendanceId
          }
          this.batchCreate(params, status)
        }
      } else {
        this.$message.error('至少选中一项进行操作')
      }
    },
    /* 表格多选 */
    handleSelectionChange(val) {
      if (val && val.length > 0) {
        this.checkNum = val.length
        this.selectList = val
      } else {
        this.checkNum = 0
      }
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.pageIndex = 1
      this.getList()
    },
    handleIndexChange(current) {
      this.pageIndex = current
      this.getList()
    },
    /* 备注 */
    toRemarkFunc(row) {
      this.$refs.remark.show(row, this.attendanceId, 'edit')
    },
    /* 修改备注 */
    toUpdateRemarkFunc(row) {
      this.$refs.remark.show(row, this.attendanceId, 'update')
    },
    /* 更新表格数据 */
    getUpdateTable() {
      this.getList()
    }
  }
}
