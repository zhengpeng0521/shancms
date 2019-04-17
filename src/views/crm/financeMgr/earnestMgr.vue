<template>
  <div class="earnestMgr_container">
    <!-- 搜索栏 -->
    <div class="search">
      <div>
        <CommonSearch
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
        <advanced-search v-bind="superSearch" />
      </div>
      <div>
        <el-button
          class="green_btn"
          @click="addSubDialog"
        >新建订金</el-button>
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
      table-key="crm_finance_earnest"
    />
    <!-- 新建订金弹框组件 -->
    <AddSubscriptionDialog
      ref="addSubscriptionDialog"
      @toParentEarnest="toUpdateList"
    />
  </div>
</template>

<script>
import {
  purchaseDepositQuery,
  purchaseDepositBack,
  purchaseDepositDelete
} from '@/api/crm/financeMgr/financeMgr.js'
import CommonTable from './../../../components/CommonTable/CommonTable'
import CommonSearch from './../../../components/CommonSearch/CommonSearch'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import AddSubscriptionDialog from './components/addSubscriptionDialog.vue'
export default {
  components: {
    CommonTable,
    CommonSearch,
    AdvancedSearch,
    AddSubscriptionDialog // 新建订金弹框组件
  },
  data() {
    return {
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '订金编号',
          prop: 'id',
          isShowTooltip: true
        },
        {
          label: '状态',
          prop: 'status',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.status === '0') {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(169, 180, 188);border-radius: 50px;margin-right: 5px;"></span>
                        ${'无效'}
                      </div>`
            }
            if (row.status === '1') {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(93, 156, 236);border-radius: 50px;margin-right: 5px;"></span>
                        ${'待关联合同'}
                      </div>`
            }
            if (row.status === '2') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(136, 199, 10);border-radius: 50px;margin-right: 5px;"></span>
                        ${'已关联合同'}
                      </div>`
            }
            if (row.status === '3') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(204, 67, 66);border-radius: 50px;margin-right: 5px;"></span>
                        ${'已退款'}
                      </div>`
            }
          }
        },
        {
          label: '合同编号',
          prop: 'paId',
          isShowTooltip: true
        },
        {
          label: '所属学员',
          prop: 'stuName',
          isShowTooltip: true
        },
        {
          label: '订金金额',
          prop: 'money',
          isShowTooltip: true
        },
        {
          label: '收款方式',
          prop: 'paName',
          isShowTooltip: true
        },
        {
          label: '收款账号',
          prop: 'paAcct',
          isShowTooltip: true
        },
        {
          label: '对应流水号',
          prop: 'realSerialNumber',
          isShowTooltip: true,
          width: '110px;'
        },
        {
          label: '实际到账',
          prop: 'realMoney',
          isShowTooltip: true
        },
        {
          label: '备注',
          prop: 'remarks',
          isShowTooltip: true
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
        apiService: purchaseDepositQuery, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 244px)',
      operates: {
        width: '160',
        fixed: 'right',
        list: [
          {
            label: '退款',
            type: 'normal',
            btnId: '407000004',
            method: (row) => {
              this.refundMoneyFun(row)
            },
            popoverCon: [
              {
                contentText: '确定要退款吗？'
              }
            ]
          },
          {
            label: '删除',
            type: 'normal',
            method: (row) => {
              this.deleteHandle(row)
            },
            popoverCon: [
              {
                contentText: '确定要删除吗？'
              }
            ]
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
            placeholder: '订金编号',
            modelValue: 'id',
            isClearable: true,
            itemStyle: 'width: 140px'
          }, {
            itemType: 'input',
            placeholder: '所属学员',
            modelValue: 'stuName',
            isClearable: true,
            itemStyle: 'width: 140px'
          }, {
            itemType: 'select',
            placeholder: '状态',
            modelValue: 'status',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '待关联合同',
                value: '1'
              }, {
                label: '已关联合同',
                value: '2'
              }, {
                label: '已退款',
                value: '3'
              }, {
                label: '无效',
                value: '0'
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
            type: 'select',
            key: 'paId',
            label: '收款方式',
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/payment/queryPaymentAccountList`
          }, {
            type: 'input',
            key: 'reveiverName',
            label: '收款人'
          }
        ]
      },
      superValue: {}
    }
  },
  methods: {
    /* 退款操作 */
    refundMoneyFun(row) {
      if(row.status == '1') { //eslint-disable-line
        const params = {
          id: row.id
        }
        purchaseDepositBack(params).then(res => {
          if (res.data.errorCode === 0) {
            const params = {
              pageIndex: 0
            }
            this.$refs.tableCommon.getList(params)
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      } else {
        this.$message.warning('只能选择待处理项退款')
      }
    },
    /* 删除操作 */
    deleteHandle(row) {
      if(row.status == '1') { //eslint-disable-line
        const params = {
          id: row.id
        }
        purchaseDepositDelete(params).then(res => {
          if (res.data.errorCode === 0) {
            const params = {
              pageIndex: 0
            }
            this.$refs.tableCommon.getList(params)
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      } else {
        this.$message.warning('只能选择待处理项退款')
      }
    },
    /* 新建订金弹框 */
    addSubDialog() {
      this.$refs.addSubscriptionDialog.showDialog()
    },
    /* 更新列表数据 */
    toUpdateList() {
      const params = {
        pageIndex: 0
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      const params = {
        ...this.formValue,
        ...this.superValue
        // stuName: this.formInline.stuName,
        // id: this.formInline.id,
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
        ...this.superValue,
        ...this.formValue
        // paId: superValue.paName,
        // receiverName: superValue.receiverName
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
.earnestMgr_container {
  .search {
    display: flex;
    justify-content: space-between;
    height: 48px;
  }
}
</style>

