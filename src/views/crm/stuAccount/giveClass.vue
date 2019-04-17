<template>
  <div class="giveClass_container">
    <!-- 搜索栏 -->
    <div class="search">
      <CommonSearch
        :is-inline="true"
        :params="formInline"
        :forms="formInline"
        @toParent="resetFieldHanle"
      />
      <advanced-search v-bind="superSearch" />
    </div>
    <!-- 已选数据操作 -->
    <div class="table_checked_box">
      <span class="table_checked_text">已选
        <span class="checked_nums">{{ checkedData || '0' }}</span>条数据
      </span>
      <span>
        <el-button
          slot="reference"
          class="cancel_btn edit_btn"
          size="mini"
          @click="auditDialog"
        >审核</el-button>
      </span>
    </div>
    <!-- 表格 -->
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      table-key="crm_account_giveClass"
      @handleSelectionChange="selectionChange"
    />
    <!-- 审核弹框 -->
    <el-dialog
      :visible.sync="auditDialogShow"
      title="审核赠课"
    >
      <div style="text-align: center; margin-bottom: 20px;">
        请审核已选中的{{ checkedData || '0' }}条信息
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitFormAudit('1')"
        >通 过</el-button>
        <el-button
          class="cancel_btn"
          @click="submitFormAudit('2')"
        >不通过</el-button>
      </span>
    </el-dialog>
    <!-- 学员详情侧边弹框 -->
    <StudentDetailSide ref="studentDetailSide" />
  </div>
</template>

<script>
import { givePeriodList, checkGivePeriod } from '@/api/crm/stuAccount/stuAccount.js'
import CommonTable from '../../../components/CommonTable/CommonTable'
import CommonSearch from '../../../components/CommonSearch/CommonSearch'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import StudentDetailSide from './components/studentDetailSide.vue'
export default {
  components: {
    CommonTable,
    CommonSearch,
    AdvancedSearch,
    StudentDetailSide
  },
  data() {
    return {
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '合同编号',
          prop: 'orderNum',
          isShowSet: false,
          isShowTooltip: true
        },
        {
          label: '学员账户号',
          prop: 'cardId',
          isShowTooltip: true,
          width: '100'
        },
        {
          label: '适用学员',
          prop: 'applicableStu',
          isShowTooltip: true,
          width: '120',
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span',

                params.row.applicableStu.map((item, index) => {
                  return h('a', {
                    on: {
                      click: () => {
                        this.openSideDialog(item)
                      }
                    }
                  }, item.stuName)
                })
              )
            ])
          }
        },
        {
          label: '课时数量',
          prop: 'periodNum',
          isShowTooltip: true
        },
        {
          label: '赠课类型',
          prop: 'extType',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.extType === '1') {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        ${'通用课时'}
                      </div>`
            }
            if (row.extType === '2') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        ${'专用课时'}
                      </div>`
            }
          }
        },
        {
          label: '课程名称',
          prop: 'courseName',
          isShowTooltip: true
        },
        {
          label: '赠课成本',
          prop: 'extPeriodMoney',
          isShowTooltip: true
        },
        {
          label: '赠课原因',
          prop: 'extPeriodReason',
          isShowTooltip: true
        },
        {
          label: '状态',
          prop: 'status',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.status === '0') {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(255, 127, 117);border-radius: 50px;margin-right: 5px;"></span>
                        ${'待审核'}
                      </div>`
            }
            if (row.status === '1') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: #87D068;border-radius: 50px;margin-right: 5px;"></span>
                        ${'已通过'}
                      </div>`
            }
            if (row.status === '2') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(204, 67, 66);border-radius: 50px;margin-right: 5px;"></span>
                        ${'已驳回'}
                      </div>`
            }
          }
        },
        {
          label: '创建人',
          prop: 'creatorName',
          isShowTooltip: true
        },
        {
          label: '创建时间',
          prop: 'createTime',
          isShowTooltip: true,
          width: '160px'
        }
      ],
      options: {
        mutiSelect: true, // 是否多选
        apiService: givePeriodList, // 表格的数据请求接口
        isSettingShow: true, // 是否出现设置
        selectableFunc: this.checkedSelectRow // 审核判断条件
      },
      tableHeight: 'calc(100vh - 280px)',
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '学员姓名/家长电话',
            modelValue: 'nameOrMobile',
            isClearable: true
          },
          {
            itemType: 'input',
            placeholder: '合同编号',
            modelValue: 'orderNum',
            isClearable: true
          }, {
            itemType: 'select',
            placeholder: '请选择状态',
            modelValue: 'status',
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '待审核',
                value: '0'
              }, {
                label: '已通过',
                value: '1'
              }, {
                label: '已驳回',
                value: '2'
              }
            ]
          }
        ]
      },
      superSearch: {
        onClear: () => { this.onClear() },
        onSearch: (superValue) => { this.onSearch(superValue) },
        fields: [
          {
            type: 'input',
            key: 'cardId',
            label: '学员账户号'
          }, {
            type: 'input',
            key: 'creatorName',
            label: '创建人'
          }
        ]
      },
      checkedData: '',
      auditDialogShow: false,
      superValue: {},
      formValue: {},
      checkedSelectList: [] // 选择数据列表数组
    }
  },
  methods: {
    /* 审核条件选中判断是否可选 */
    checkedSelectRow(row) {
      if (row.status === '0') {
        return true
      } else {
        return false
      }
    },
    /* 打开学员详情侧边弹框 */
    openSideDialog(row) {
      // debugger
      this.$refs.studentDetailSide.showSideDialog(row)
    },
    /* 选择数据条数操作 */
    selectionChange(val) {
      this.checkedData = val.length
      this.checkedSelectList = []
      val.map((item, index) => {
        this.checkedSelectList.push(item.id)
      })
    },
    /* 显示审核弹框 */
    auditDialog() {
      if (this.checkedData && this.checkedData > 0) {
        this.auditDialogShow = !this.auditDialogShow
      }
    },
    /* 确定审核弹框提交 */
    submitFormAudit(val) {
      const params = {
        id: this.checkedSelectList.join(','),
        status: val
      }
      checkGivePeriod(params).then(res => {
        if (res.data.errorCode === 0) {
          this.auditDialogShow = false
          this.$message.success(res.data.errorMessage)
          this.$refs.tableCommon.getList()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      const params = {
        ...this.formValue,
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
        ...this.superValue,
        ...this.formValue
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
    }
  }
}
</script>

<style lang="scss" scoped>
.giveClass_container /deep/ {
  .el-dialog {
    width: 400px;
  }
}
.table_checked_box {
  margin-bottom: 16px;
  .table_checked_text {
    margin-right: 10px;
  }
  .checked_nums {
    margin: 0 3px;
    color: #46b6ee;
  }
}
.search {
  height: 48px;
}
</style>
