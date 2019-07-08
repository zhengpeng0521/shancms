<template>
  <div class="refundMgr_container">
    <!-- 搜索栏 -->
    <div class="search">
      <div>
        <CommonSearch
          ref="commonSearch"
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
        <advanced-search ref="superSearch" v-bind="superSearch" />
      </div>
      <div>
        <el-button
          v-log="{compName:'财务管理',eventName:'web-【学员CRM】-财务管理-退款管理-新建退款单'}"
          type="primary"
          size="mini"
          @click="addRefundDialog"
        >新建退款单</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      :operation="operates"
      table-key="crm_finance_refunded"
    />
    <!-- 新建退款单弹框 -->
    <AddRefundDialog
      ref="addRefundDialog"
      @refeshRefun="getRefeshList"
    />
    <!-- 打印退课时弹框 -->
    <RefundPrintDialog ref="refundPrintDialog" />
    <!-- 审核退款弹框 -->
    <CheckRefundDialog
      ref="checkRefundDialog"
      @toRefundList="getRefeshList"
    />
  </div>
</template>

<script>
import { refundOrderList } from '@/api/crm/financeMgr/financeMgr.js'
import CommonTable from './../../../components/CommonTable/CommonTable'
import CommonSearch from './../../../components/CommonSearch/CommonSearch'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import AddRefundDialog from './components/addRefundDialog.vue'
import RefundPrintDialog from './components/refundPrintDialog.vue'
import CheckRefundDialog from './components/checkRefundDialog.vue'
export default {
  components: {
    CommonTable,
    CommonSearch,
    AdvancedSearch,
    AddRefundDialog, // 新建退款单弹框
    RefundPrintDialog, // 打印退课时弹框
    CheckRefundDialog // 审核退款弹框
  },
  data() {
    return {
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '退款单编号',
          prop: 'id',
          isShowTooltip: true,
          width: '110px;'
        },
        {
          label: '合同编号',
          prop: 'orderNum',
          isShowTooltip: true
        },
        {
          label: '学员姓名',
          prop: 'stuName',
          isShowTooltip: true
        },
        {
          label: '退款类型',
          prop: 'refundType',
          isShowTooltip: true,
          width: '140px;',
          formatter: (row, column, cellValue) => {
            if (row.refundType == '3') {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        ${'退时长:'} ${row.months > 0 ? row.months + '个月' : ''}${row.days > 0 ? row.days + '天' : ''}
                      </div>`
            }
            if (row.refundType == '2') {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        ${'退课时:'} ${row.periodNum}
                      </div>`
            }
          }
        },
        {
          label: '审核说明',
          prop: 'refundWay',
          isShowTooltip: true
        },
        {
          label: '状态',
          prop: 'status',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.status == '1') {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(93, 156, 236);border-radius: 50px;margin-right: 5px;"></span>
                        ${'待退款'}
                      </div>`
            }
            if (row.status == '2') {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(136, 199, 10);border-radius: 50px;margin-right: 5px;"></span>
                        ${'已退款'}
                      </div>`
            }
            if (row.status == '3') {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(204, 67, 66);border-radius: 50px;margin-right: 5px;"></span>
                        ${'已驳回'}
                      </div>`
            }
          }
        },
        {
          label: '退款金额',
          prop: 'money',
          width: '90px',
          isShowTooltip: true
        },
        {
          label: '退款手续费',
          prop: 'fee',
          width: '100px',
          isShowTooltip: true
        },
        {
          label: '退款日期',
          prop: 'createTime',
          isShowTooltip: true
        },
        {
          label: '创建人',
          prop: 'createName',
          isShowTooltip: true
        },
        {
          label: '退款备注',
          prop: 'remark',
          isShowTooltip: true
        }
        // {
        //   label: '所属校区',
        //   prop: 'orgName',
        //   isShowTooltip: true
        // }
      ],
      options: {
        noMount: true,
        apiService: refundOrderList, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 227px)',
      operates: {
        width: '140',
        fixed: 'right',
        list: [
          {
            label: '打印',
            type: 'normal',
            method: (row) => {
              if (row.status === '1') {
                this.$message.error('待退款状态，需要先进行审核')
              } else if (row.status === '2') {
                this.refundPrintDialog(row)
              } else if (row.status === '3') {
                this.$message.error('退款已驳回')
              }
            }
          },
          {
            label: '审核',
            type: 'normal',
            btnId: '407000005',
            method: (row) => {
              if (row.status === '1') { // 待审核状态
                this.checkRefundDialog(row)
              } else if (row.status === '2') {
                this.$message.error('已审核通过，请直接打印')
              } else if (row.status === '3') {
                this.$message.error('退款已驳回')
              }
            }
          }
        ]
      },
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '退款单号',
            modelValue: 'id',
            isClearable: true,
            itemStyle: 'width: 140px'
          }, {
            itemType: 'input',
            placeholder: '创建人',
            modelValue: 'createName',
            isClearable: true,
            itemStyle: 'width:140px'
          }, {
            itemType: 'select',
            placeholder: '退款类型',
            modelValue: 'refundType',
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '退课时',
                value: '2'
              }, {
                label: '退时长',
                value: '3'
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
            key: 'stuName',
            label: '学员姓名'
          }, {
            type: 'input',
            key: 'id',
            label: '退款单编号'
          }, {
            type: 'input',
            key: 'cardId',
            label: '学员账户号'
          }, {
            type: 'input',
            key: 'orderNum',
            label: '合同号'
          }, {
            type: 'select',
            key: 'status',
            label: '状态',
            options: [
              {
                label: '已退款',
                value: '2'
              }, {
                label: '待退款',
                value: '1'
              }, {
                label: '已驳回',
                value: '3'
              }
            ]
          }
        ]
      },
      superValue: {},
      formValue: {}
    }
  },
  mounted() {
    const route = this.$router.history.current.params
    let params = {}
    if (route.activeTab === 'refundMgr') {
      if (route.action === 'waitCheck') {
        params = { status: '1' }
        this.$refs.superSearch.ruleForm.status = '1'
      }
    }
    this.onSearch(params)
    // this.$refs.tableCommon.getList(params)
  },
  methods: {
    /* 子组件调用父组件 刷新列表 */
    getRefeshList() {
      const params = {
        pageIndex: 0
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 新建退款单弹框 */
    addRefundDialog() {
      this.$refs.addRefundDialog.showDialog()
    },
    /* 退课时打印弹框 */
    refundPrintDialog(row) {
      this.$refs.refundPrintDialog.showDialog(row)
    },
    /* 审核退款弹框 */
    checkRefundDialog(row) {
      this.$refs.checkRefundDialog.showDialog(row)
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      const params = {
        ...this.formValue,
        ...this.superValue
        // id: this.formInline.id,
        // seller: this.formInline.seller,
        // refundType: this.formInline.refundType
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
        // stuName: superValue.stuName,
        // id: superValue.id,
        // cardId: superValue.cardId,
        // purchaseId: superValue.purchaseId
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
.refundMgr_container {
  .search {
    display: flex;
    justify-content: space-between;
    height: 48px;
  }
}
</style>

