import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import { getAttendanceList } from '@/api/nurseryClass/attendanceRecord'
export default {
  components: {
    CommonSearch,
    CommonTable,
    AdvancedSearch
  },
  data() {
    return {
      formInline: {
        searchMethod: formValue => {
          this.searchHandle(formValue)
        },
        date: [
          this.$moment().format('YYYY-MM-DD'),
          this.$moment().format('YYYY-MM-DD')
        ],
        forms: [
          {
            itemType: 'input',
            placeholder: '学员姓名',
            modelValue: 'stuName',
            isClearable: true,
            itemStyle: 'width:140px'
          },
          {
            itemType: 'datePicker',
            datePickerType: 'daterange',
            rangeSeparator: '~',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd',
            modelValue: 'date',
            itemStyle: 'width:220px',
            isClearable: false,
            default: true
          },
          {
            itemType: 'select',
            placeholder: '操作',
            modelValue: 'signType',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              { value: '1', label: '签到' },
              { value: '2', label: '签退' },
              { value: '3', label: '请假' },
              { value: '4', label: '撤销签到' },
              { value: '5', label: '撤销签退' },
              { value: '6', label: '撤销请假' }
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
            type: 'select',
            key: 'userId',
            label: '操作人',
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/tenantUser/summaryQuery`
          },
          {
            type: 'select',
            key: 'clsId',
            label: '所属班级',
            optionValue: 'id',
            optionLabel: 'name',
            listValue: 'data',
            isAsync: true,
            url: `${window.SS_CRM}/crm/nur/cerpClass/summeryQuery`
          }
        ]
      },
      advancedSearchShow: false,
      columns: [
        {
          label: '操作',
          prop: 'signType',
          isShowTooltip: true,
          isShowSet: false,
          formatter: row => {
            // eslint-disable-next-line
            if (row.signType == '1') {
              return `签到`
              // eslint-disable-next-line
            } else if (row.signType == '2') {
              return `签退`
              // eslint-disable-next-line
            } else if (row.signType == '3') {
              return `请假`
              // eslint-disable-next-line
            } else if (row.signType == '4') {
              return `撤销签到`
              // eslint-disable-next-line
            } else if (row.signType == '5') {
              return `撤销签退`
              // eslint-disable-next-line
            } else if (row.signType == '6') {
              return `撤销请假`
            } else {
              return ``
            }
          }
        },
        {
          label: '学员姓名',
          prop: 'stuName',
          isShowSet: true,
          isShowTooltip: true
        },
        {
          label: '所属班级',
          prop: 'clsName',
          isShowSet: true,
          isShowTooltip: true
        },
        {
          label: '考勤时间',
          prop: 'createTime',
          isShowSet: true,
          isShowTooltip: true
        },
        {
          label: '操作人',
          prop: 'operator',
          isShowSet: true,
          isShowTooltip: true
        }
      ],
      listQuery: {
        show: true // 是否显示
      },
      options: {
        apiService: getAttendanceList, // 表格的数据请求接口
        params: {
          startDate: this.$moment().format('YYYY-MM-DD'),
          endDate: this.$moment().format('YYYY-MM-DD')
        },
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 235px)',
      superValue: {}, // 高级搜索的数据
      formValue: {
        date: [
          this.$moment().format('YYYY-MM-DD'),
          this.$moment().format('YYYY-MM-DD')
        ]
      } // 搜索栏数据
    }
  },
  methods: {
    /* 搜索 */
    searchHandle(formValue) {
      this.formValue = formValue
      // 搜索的入参
      let start
      let end
      if (formValue.date) {
        start = formValue.date[0]
        end = formValue.date[1]
      } else {
        start = ''
        end = ''
      }
      const params = {
        stuName: this.formValue.stuName,
        signType: this.formValue.signType,
        startDate: start,
        endDate: end,
        userId: this.superValue.userId,
        clsId: this.superValue.clsId
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 0,
        startDate: this.$moment().format('YYYY-MM-DD'),
        endDate: this.$moment().format('YYYY-MM-DD'),
        ...this.superValue
      }
      this.formValue = {}
      this.$refs.tableCommon.getList(params)
    },
    /** 高级搜索 */
    onSearch(superValue) {
      this.superValue = superValue
      let start
      let end
      if (this.formValue.date) {
        start = this.formValue.date[0]
        end = this.formValue.date[1]
      } else {
        start = ''
        end = ''
      }
      const params = {
        stuName: this.formValue.stuName,
        signType: this.formValue.signType,
        startDate: start,
        endDate: end,
        userId: this.superValue.userId,
        clsId: this.superValue.clsId
      }
      this.$refs.tableCommon.getList(params)
    },
    /** 高级清除 */
    onClear() {
      const params = {
        pageIndex: 0,
        ...this.formValue
      }
      if (this.formValue.date) {
        params.startDate = this.formValue.date[0]
        params.endDate = this.formValue.date[1]
      }
      delete params.date
      this.superValue = {}
      this.$refs.tableCommon.getList(params)
    }
  }
}
