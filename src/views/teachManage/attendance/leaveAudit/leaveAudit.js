import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import { queryVacationList } from '@/api/teachManage/attendance'
import ReviewContract from './dialog/reviewContract'
export default {
  components: {
    CommonSearch,
    CommonTable,
    AdvancedSearch,
    ReviewContract
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
            placeholder: '请输入学员姓名',
            modelValue: 'stuName',
            isClearable: true,
            itemStyle: 'width:140px'
          },
          {
            itemType: 'input',
            placeholder: '请输入手机号',
            modelValue: 'mobile',
            isClearable: true,
            itemStyle: 'width:140px'
          },
          {
            itemType: 'select',
            placeholder: '审核状态',
            modelValue: 'auditStatus',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              { value: '1', label: '待审核' },
              { value: '2', label: '已驳回' },
              { value: '3', label: '已通过' },
              { value: '4', label: '已失效' }
            ]
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
            key: 'parentName',
            label: '申请家长'
          },
          {
            type: 'input',
            key: 'courseName',
            label: '课程名称'
          },
          {
            type: 'datePicker',
            key: 'createTime',
            dateType: 'daterange',
            label: '提交时间'
          }
        ]
      },
      advancedSearchShow: false,
      columns: [
        {
          label: '学员姓名',
          prop: 'stuName',
          isShowSet: false,
          isShowTooltip: true
        },
        {
          label: '申请家长',
          prop: 'parentName',
          isShowSet: true,
          isShowTooltip: true
        },
        {
          label: '手机号',
          prop: 'mobile',
          isShowSet: true,
          isShowTooltip: true
        },
        {
          label: '请假课程',
          prop: 'courseName',
          isShowSet: true,
          isShowTooltip: true
        },
        {
          label: '上课时间',
          prop: 'time',
          isShowSet: true,
          isShowTooltip: true,
          width: '100'
        },
        {
          label: '请假原因',
          prop: 'reason',
          isShowSet: true,
          isShowTooltip: true,
          width: '100'
        },
        {
          label: '状态',
          prop: 'auditStatus',
          isShowSet: true,
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.auditStatus === '1') {
              return `<div>待审核</div>`
            } else if (row.auditStatus === '2') {
              return `<div>已驳回</div>`
            } else if (row.auditStatus === '3') {
              return `<div>已通过</div>`
            } else if (row.auditStatus === '4') {
              return `<div>已失效</div>`
            } else {
              return `<div>无</div>`
            }
          }
        },
        {
          label: '处理结果',
          prop: 'remark',
          isShowSet: true,
          isShowTooltip: true
        },
        {
          label: '提交时间',
          prop: 'createTime',
          isShowSet: true,
          isShowTooltip: true,
          width: '160'
        }
      ],
      listQuery: {
        show: true, // 是否显示
        sizes: true
      },
      options: {
        noMount: true, // 禁止组件加载获取数据
        mutiSelect: true, // 是否多选
        apiService: queryVacationList, // 表格的数据请求接口
        selectableFunc: this.getSelectAbleFunc,
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 279px)',
      checkNum: '0',
      checkList: [],
      formValue: {}, // 搜索栏的数据
      superValue: {} // 高级搜索的数据
    }
  },

  mounted() {
    const route = this.$router.history.current.params
    let params = {}
    if (route && route.action && route.action === 'waitLeave') {
      params = { auditStatus: '1' }
      this.$refs.commonSearch.params.auditStatus = '1'
      this.options.params = params
    }
    this.$refs.tableCommon.getList(params)
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
      if (this.superValue.createTime) {
        params.startDate = this.superValue.createTime[0]
        params.endDate = this.superValue.createTime[1]
      }
      delete params.createTime
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle() {
      // 重置的入参
      const params = {
        pageIndex: 0,
        ...this.superValue
      }
      if (this.superValue.createTime) {
        params.startDate = this.superValue.createTime[0]
        params.endDate = this.superValue.createTime[1]
      }
      this.formValue = {}
      delete params.createTime
      this.$refs.tableCommon.getList(params)
    },
    /** 高级搜索 */
    onSearch(superValue) {
      this.superValue = superValue
      const params = {
        ...this.formValue,
        ...superValue
      }
      if (this.superValue.createTime) {
        params.startDate = this.superValue.createTime[0]
        params.endDate = this.superValue.createTime[1]
      }
      delete params.createTime
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
    /* 更新表格数据 */
    getUpdateTable() {
      const params = {
        pageIndex: 0
      }
      this.$refs.tableCommon.getList(params)
    },
    selectionChange(val) {
      this.checkNum = val.length
      this.checkList = val
    },
    getCheckCol(val) {
      console.info('val--->', val)
    },
    /* 多选是否可用 */
    getSelectAbleFunc(row) {
      if (row.auditStatus === '1') {
        return true
      } else {
        return false
      }
    },
    /* 审核 */
    reviewContract() {
      if (this.checkNum > 0) {
        this.$refs.review.show(this.checkNum, this.checkList)
      } else {
        this.$message.error('请至少选中一项审核')
      }
    }
  }
}
