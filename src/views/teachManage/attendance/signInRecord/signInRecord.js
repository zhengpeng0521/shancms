import CommonSearch from '@/components/CommonSearch/CommonSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import { querySignList, updateStatus } from '@/api/teachManage/attendance'
export default {
  components: {
    CommonSearch,
    CommonTable
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
            placeholder: '请输入宝宝姓名',
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
          }
        ]
      },
      columns: [
        {
          label: '操作',
          prop: 'id',
          width: '90',
          fixed: 'right',
          render: (h, params) => {
            const currentDate = this.$moment(
              params.row.signTimeStr,
              'YYYY-MM-DD'
            ).format('YYYY-MM-DD')
            if (params.row.status === '0') {
              return h('a', { style: 'color:#999' }, '已撤销')
            } else {
              if (currentDate === this.$moment().format('YYYY-MM-DD')) {
                return h(
                  'a',
                  {
                    on: {
                      click: () => {
                        this.withdrawFunc(params.row)
                      }
                    }
                  },
                  '撤销'
                )
              } else {
                return h('a', { style: 'color:#999' }, '撤销')
              }
            }
          }
        },
        {
          label: '宝宝姓名',
          prop: 'stuName',
          isShowTooltip: true
        },
        {
          label: '手机号',
          prop: 'mobile',
          isShowTooltip: true
        },
        {
          label: '签到家长',
          prop: 'parentName',
          isShowTooltip: true
        },
        {
          label: '签到时间',
          prop: 'signTimeStr',
          isShowTooltip: true,
          width: '100'
        }
      ],
      listQuery: {
        show: true, // 是否显示
        sizes: true
      },
      options: {
        apiService: querySignList // 表格的数据请求接口
      },
      tableHeight: 'calc(100vh - 241px)'
    }
  },
  methods: {
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      const params = {
        ...formValue
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle() {
      const params = {
        pageIndex: 0
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 撤销 */
    withdrawFunc(row, index) {
      const params = {
        id: row.id,
        status: '0'
      }
      updateStatus(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$refs.tableCommon.getList()
          this.$message.success(data.errorMessage)
        } else {
          this.$message.error(data.errorMessage || '撤销失败')
        }
      })
    }
  }
}
