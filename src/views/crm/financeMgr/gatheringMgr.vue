<template>
  <div class="gathering_container">
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
        <advanced-search v-bind="superSearch" />
      </div>
      <div>
        <el-button
          type="primary"
          size="mini"
          @click="addGatheringDialog()"
        >新建收款单</el-button>
        <el-button
          v-if="hasBtn('407000003')"
          class="
          green_btn"
          @click="exportStock"
        >导出</el-button>
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
      table-key="crm_finance_gathering"
    />
    <!-- 到账审核弹框 -->
    <div class="dialog_box">
      <el-dialog
        :visible.sync="auditDialogShow"
        title="到账审核"
        @close="cancelDialog()"
      >
        <span style="display: inline-block; margin-bottom: 10px;">已选择1条收款单，操作后无法更改</span>
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            type="primary"
            @click="submitForm('1')"
          >确认到账</el-button>
          <el-button
            class="redBtn_color"
            @click="submitForm('3')"
          >
            作废
          </el-button>
          <el-button
            class="cancel_btn"
            @click="cancelDialog()"
          >暂不处理</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 新建收款单弹框 -->
    <AddGatheringDialog ref="addGatheringDialog" />
  </div>
</template>

<script>
import { payInfoList, queryPaymentAccountList, checkPayInfo } from '@/api/crm/financeMgr/financeMgr.js'
import CommonTable from './../../../components/CommonTable/CommonTable'
import CommonSearch from './../../../components/CommonSearch/CommonSearch'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import AddGatheringDialog from './components/addGatheringDialog.vue'
import { exportFile } from '@/utils/exportFile'
export default {
  components: {
    CommonTable,
    CommonSearch,
    AdvancedSearch,
    AddGatheringDialog // 新建收款单弹框
  },
  data() {
    return {
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '收款编号',
          prop: 'id',
          isShowTooltip: true
        },
        {
          label: '收款金额',
          prop: 'money',
          align: 'right',
          isShowTooltip: true
        },
        {
          label: '实际到账',
          prop: 'realMoney',
          align: 'right',
          isShowTooltip: true
        },
        {
          label: '收款状态',
          prop: 'status',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.status === '1') {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        ${'已到账'}
                      </div>`
            }
            if (row.status === '2') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        ${'待确认'}
                      </div>`
            }
            if (row.status === '3') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        ${'已作废'}
                      </div>`
            }
          }
        },
        {
          label: '收款类型',
          prop: 'type',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.type === '1') {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        ${'手填收款'}
                      </div>`
            }
            if (row.type === '2') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        ${'pos收款'}
                      </div>`
            }
            if (row.type === '3') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        ${'在线收款'}
                      </div>`
            }
          }
        },
        {
          label: '收款方式',
          prop: 'paymentName',
          isShowTooltip: true
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
          label: '签约家长',
          prop: 'parentName',
          isShowTooltip: true
        },
        {
          label: '收款账号',
          prop: 'acctNo',
          isShowTooltip: true
        },
        {
          label: '对应流水号',
          prop: 'realSerialNumber',
          isShowTooltip: true,
          width: '110px;'
        },
        {
          label: '收款日期',
          prop: 'createTime',
          isShowTooltip: true
        },
        {
          label: '收款人',
          prop: 'receiverName',
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
        apiService: payInfoList, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 244px)',
      operates: {
        width: '140',
        fixed: 'right',
        list: [
          {
            label: '到账审核',
            type: 'normal',
            btnId: '407000002',
            method: (row) => {
              this.showDialog(row)
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
            placeholder: '收款编号',
            modelValue: 'id',
            isClearable: true,
            itemStyle: 'width: 140px'
          }, {
            itemType: 'select',
            placeholder: '收款方式',
            modelValue: 'paymentId',
            isClearable: true,
            apiService: queryPaymentAccountList,
            labelKey: 'name',
            valueKey: 'id',
            itemStyle: 'width:140px'
          }, {
            itemType: 'select',
            placeholder: '收款状态',
            modelValue: 'status',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '已确认',
                value: '1'
              }, {
                label: '待确认',
                value: '2'
              }, {
                label: '已作废',
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
            key: 'orderNum',
            label: '合同号'
          }, {
            type: 'input',
            key: 'receiverName',
            label: '收款人'
          }, {
            type: 'input',
            key: 'acctNo',
            label: '收款账号'
          }, {
            type: 'input',
            key: 'realSerialNumber',
            label: '流水号'
          }
        ]
      },
      superValue: {},
      auditDialogShow: false, // 到账审核弹框显隐
      rowList: {} // 到账审核选中的数据
    }
  },

  mounted() {
    const route = this.$router.history.current.params
    let params = {}
    if (route && route.action && route.action === 'waitPay') {
      params = { status: '2' }
      this.$refs.commonSearch.params.status = '2'
      this.options.params = params
    }
    this.$refs.tableCommon.getList(params)
  },

  methods: {
    /* 显示弹框 */
    showDialog(row) {
      this.auditDialogShow = !this.auditDialogShow
      this.rowList = row
    },
    /* 新建收款单弹框 */
    addGatheringDialog() {
      this.$refs.addGatheringDialog.showDialog()
    },
    /* 关闭弹框 */
    cancelDialog() {
      this.auditDialogShow = false
    },
    /* 确定提交弹框表单内容 */
    submitForm(status) {
      const params = {
        payInfoId: this.rowList.id,
        status: status
      }
      /* 到账审核接口 */
      checkPayInfo(params).then(res => {
        if (res.data.errorCode === 0) {
          this.auditDialogShow = false
          this.$message.success(res.data.errorMessage)
          const param = {
            pageIndex: 0
          }
          this.$refs.tableCommon.getList(param)
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /** 导出 */
    exportStock() {
      const params = {
        ...this.superValue,
        ...this.formValue
        // proId: this.formInline.proId,
        // type: this.formInline.type
      }
      if (this.$refs.tableCommon.totalCount > 0) {
        exportFile(`${window.SS_CRM}/crm/purchaseCollection/exportPayInfoList`, params)
      } else {
        this.$message.error('暂无数据导出')
      }
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      const params = {
        ...this.formValue,
        ...this.superValue
        // id: this.formInline.id,
        // paymentId: this.formInline.paymentId,
        // status: this.formInline.status
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
        // orderNum: superValue.orderNum,
        // receiverName: superValue.receiverName,
        // acctNo: superValue.acctNo,
        // realSerialNumber: superValue.realSerialNumber
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
.gathering_container {
  .search {
    display: flex;
    justify-content: space-between;
    height: 48px;
  }
  .dialog_box /deep/ {
    .el-dialog {
      width: 500px;
    }
  }
  .redBtn_color {
    background-color: #d0021b;
    color: #fff;
  }
}
</style>

