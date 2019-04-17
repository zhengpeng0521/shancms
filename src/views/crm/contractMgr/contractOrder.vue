<template>
  <div class="contractOrder_container">
    <!-- 搜索栏 -->
    <div class="search">
      <div>
        <div class="subUserSelect">
          <SubUserSelect
            :options="userBranchOptions"
            v-model="userBranchSelected"
            width="120"
          />
        </div>
        <CommonSearch
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
        <advanced-search
          ref="superSearch"
          v-bind="superSearch"
        />
      </div>
      <div>
        <el-button
          v-if="hasBtn('406000003')"
          class="green_btn"
          size="mini"
          @click="importContractDialog()"
        >导入合同</el-button>
        <el-button
          v-if="tableExportStu == '0' && hasBtn('406000004') ? false : true"
          class="green_btn"
          size="mini"
          @click="exportContract"
        >导出合同</el-button>
        <el-button
          v-if="hasBtn('406000001')"
          class="green_btn"
          size="mini"
          @click="contractOrderDialog()"
        >新建合同</el-button>
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
      table-key="crm_contract_order"
    />
    <!-- 合同订单侧边弹框 -->
    <ContractSideDialog
      ref="contractSideDialog"
      @toContractList="getContractList"
      @toEidtContract="editContractOrderDialog"
    />
    <!-- 合同批量导入弹框 -->
    <ImportContractDialog ref="importContractDialog" />
    <!-- 合同订单弹框 -->
    <ContractOrderDialog
      ref="contractOrderDialog"
      @toContractList="getContractList"
    />
    <!-- 审核合同弹框组件 -->
    <CheckContractDialog
      ref="checkContractDialog"
      @toContractList="getContractList"
    />
    <!-- 收款弹框 -->
    <GatheringDialog
      ref="gatheringDialog"
      @toContractList="getContractList"
    />
  </div>
</template>

<script>
import { queryOrder, querySubName } from '@/api/crm/contract/contract.js'
import CommonTable from './../../../components/CommonTable/CommonTable'
import CommonSearch from './../../../components/CommonSearch/CommonSearch'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import ContractSideDialog from './side/contractSideDialog.vue'
import ImportContractDialog from './components/importContractDialog.vue'
import ContractOrderDialog from './components/contractOrderDialog.vue'
import CheckContractDialog from './components/checkContractDialog.vue'
import GatheringDialog from './components/gatheringDialog.vue'
import SubUserSelect from './../../../components/SubUserSelect/SubUserSelect.vue'
import { exportFile } from '@/utils/exportFile'
export default {
  components: {
    CommonTable,
    CommonSearch,
    AdvancedSearch,
    ContractSideDialog, // 合同订单侧边弹框
    ImportContractDialog, // 合同批量导入弹框
    ContractOrderDialog, // 合同订单弹框
    CheckContractDialog, // 审核合同弹框组件
    GatheringDialog, // 收款弹框
    SubUserSelect // 用户下拉树
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
          isShowTooltip: true,
          render: (h, params) => {
            return h(
              'div',
              {
                class: 'orderNum',
                on: {
                  click: () => {
                    this.openSideDialog(params.row)
                  }
                }
              }, params.row.orderNum
            )
          }
          // formatter: (row, column, cellValue) => {
          //   return `<div style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${row.orderNum}</div>`
          // },
          // methods: (row) => {
          //   this.openSideDialog(row)
          // }
        },
        {
          label: '学员姓名',
          prop: 'orderStuNames',
          isShowTooltip: true
        },
        {
          label: '学员类型',
          prop: 'orderNewOldstuName',
          isShowTooltip: true
        },
        {
          label: '签约类型',
          prop: 'signTypeName',
          isShowTooltip: true
        },
        {
          label: '购买类型',
          prop: 'orderType',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if(row.orderType == '2') { //eslint-disable-line
              return `<div>${'课时套餐'}</div>`
            }
            if(row.orderType == '3') { //eslint-disable-line
              return `<div>${'托班套餐'}</div>`
            }
          }
        },
        {
          label: '会员卡号',
          prop: 'stuCardId',
          isShowTooltip: true
        },
        {
          label: '签约家长',
          prop: 'parentName',
          isShowTooltip: true
        },
        {
          label: '家长手机号',
          prop: 'mobile',
          isShowTooltip: true,
          width: '110px',
          render: (h, params) => {
            return h('span', {}, [
              h('el-popover', {
                props: { placement: 'top', trigger: 'click', content: params.row.mobile }
              }, [
                h('a',
                  { slot: 'reference' }, '查看')
              ])
            ])
          }
        },
        {
          label: '合同期限',
          prop: 'startEndTime',
          isShowTooltip: true
        },
        {
          label: '过期作废',
          prop: 'expireInvalid',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if(row.expireInvalid == '0'){ //eslint-disable-line
              return `<div>${'否'}</div>`
            }
            if(row.expireInvalid == '1'){ //eslint-disable-line
              return `<div>${'是'}</div>`
            }
          }
        },
        {
          label: '合同金额',
          prop: 'orderMoney',
          align: 'right',
          isShowTooltip: true
        },
        {
          label: '合同来源',
          prop: 'sourceName',
          isShowTooltip: true
        },
        {
          label: '审核人',
          prop: 'checkUserName',
          isShowTooltip: true
        },
        {
          label: '审核状态',
          prop: 'orderStateName',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if(row.orderState == '0') { //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: #D0021B;border-radius: 50px;margin-right: 5px;"></span>
                        ${'无效'}
                      </div>`
            } else if(row.orderState == '1'){ //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(93, 156, 236);border-radius: 50px;margin-right: 5px;"></span>
                        ${'待审核'}
                      </div>`
            } else if(row.orderState == '3'){ //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(204, 67, 66);border-radius: 50px;margin-right: 5px;"></span>
                        ${'已驳回'}
                      </div>`
            } else if(row.orderState == '4'){ //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(136, 199, 10);border-radius: 50px;margin-right: 5px;"></span>
                        ${'已通过'}
                      </div>`
            } else {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(252, 192, 71);border-radius: 50px;margin-right: 5px;"></span>
                        ${'已作废'}
                      </div>`
            }
          }
        },
        {
          label: '收款状态',
          prop: 'receiptStatusName',
          isShowTooltip: true,
          width: '110px;',
          formatter: (row, column, cellValue) => {
            if(row.receiptStatus == '0') { //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(255, 127, 117);border-radius: 50px;margin-right: 5px;"></span>
                        ${'待收款'}
                      </div>`
            } else if(row.receiptStatus == '1'){ //eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(136, 199, 10);border-radius: 50px;margin-right: 5px;"></span>
                        ${'收款完成'}
                      </div>`
            } else {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(255, 127, 117);border-radius: 50px;margin-right: 5px;"></span>
                        ${'部分收款'}
                      </div>`
            }
          }
        },
        {
          label: '签订日期',
          prop: 'signTime',
          isShowTooltip: true
        },
        {
          label: '创建人',
          prop: 'orderCreatePerson',
          isShowTooltip: true
        },
        {
          label: '创建时间',
          prop: 'orderCreateTime',
          isShowTooltip: true
        }
      ],
      options: {
        apiService: queryOrder, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 244px)',
      operates: {
        width: '140',
        fixed: 'right',
        list: [
          {
            label: '审核',
            type: 'normal',
            btnId: '406000006',
            method: (row) => {
              this.checkContractDialog(row)
            }
          },
          {
            label: '收款',
            type: 'normal',
            btnId: '406000007',
            method: (row) => {
              this.gatheringDialog(row)
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
            placeholder: '合同编号',
            modelValue: 'orderNum',
            isClearable: true,
            itemStyle: 'width: 140px'
          }, {
            itemType: 'input',
            placeholder: '学员姓名/家长手机号',
            modelValue: 'stuNameOrMobile',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:160px'
          }
        ]
      },
      superSearch: {
        onClear: () => { this.onClear() },
        onSearch: (superValue) => { this.onSearch(superValue) },
        fields: [
          {
            type: 'input',
            key: 'stuCardId',
            label: '会员卡号'
          }, {
            type: 'select',
            key: 'signType',
            label: '签约类型',
            optionValue: 'id',
            optionLabel: 'name',
            options: [
              { id: '0', name: '新签约' },
              { id: '1', name: '续约' }
            ]
          }, {
            type: 'select',
            key: 'type',
            label: '购买类型',
            optionValue: 'id',
            optionLabel: 'name',
            options: [
              { id: '2', name: '课时套餐' },
              { id: '3', name: '托班套餐' }
            ]
          }, {
            type: 'input',
            key: 'parentName',
            label: '签约家长'
          }, {
            type: 'select',
            key: 'orderState',
            label: '审核状态',
            optionValue: 'id',
            optionLabel: 'name',
            options: [
              { id: '1', name: '待审核' },
              { id: '3', name: '已驳回' },
              { id: '4', name: '已通过' },
              { id: '5', name: '已作废' }
            ]
          }, {
            type: 'select',
            key: 'receiptStatus',
            label: '收款状态',
            optionValue: 'id',
            optionLabel: 'name',
            options: [
              { id: '0', name: '待收款' },
              { id: '2', name: '部分收款' },
              { id: '1', name: '收款完成' }
            ]
          }, {
            type: 'input',
            key: 'sellerName',
            label: '销售姓名'
          }, {
            type: 'datePicker',
            key: 'firstDate',
            dateType: 'daterange',
            label: '签约日期',
            name: ['startTime', 'endTime']
          }, {
            type: 'datePicker',
            key: 'secondData',
            dateType: 'daterange',
            label: '到期日期',
            name: ['estartTime', 'eendTime']
          }, {
            type: 'select',
            key: 'expireInvalid',
            label: '过期作废',
            optionValue: 'id',
            optionLabel: 'name',
            options: [
              { id: '0', name: '否' },
              { id: '1', name: '是' }
            ]
          }, {
            type: 'datePicker',
            key: 'createTime',
            dateType: 'daterange',
            label: '创建时间',
            name: ['cstartTime', 'cendTime']
          }, {
            type: 'input',
            key: 'createPersonName',
            label: '创建人'
          }
        ]
      },
      tableExportStu: '', // 获取合同是否可以导出
      userBranchOptions: [],
      userBranchSelected: '0',
      operatorType: 0, // 操作类型, 0.全部,1.我的, 2.我的下属
      operatorUser: '' // 查询用户
    }
  },

  mounted() {
    const params = {}
    const route = this.$router.history.current.params
    if (route && route.action && route.action === 'waitCheck') {
      this.$refs.superSearch.ruleForm.orderState = '1'
      params.orderState = '1'
    }

    // 查询下属
    this.querySubUser()
    // 查询列表
    this.searchHandle()
  },

  methods: {
    /* 合同列表 */
    queryOrderFun(params) {
      // // 我的下属数据
      // querySubName().then(res => {
      //   if (res.data.errorCode === 0) {
      //     this.options.apiService = queryOrder
      //     // 获取合同是否可以导出
      //     this.tableExportStu = this.$refs.tableCommon.tableAllData.exportSta
      //     this.$refs.tableCommon.getList({ ...params, pageIndex: 0 })
      //   } else {
      //     this.$message.error(res.data.errorMessage)
      //   }
      // })
    },
    /** 查询下属 */
    querySubUser() {
      const userBranchOptions = [{ id: '0', type: 0, name: '全部', children: [] }, { id: '1', type: 1, name: '我的', children: [] }]
      const children = []
      const self = this
      querySubName().then(res => {
        if (res.data.errorCode === 0) {
          const results = res.data.data
          if (results && results.length > 0) {
            results.map((item) => {
              children.push({
                pid: '2',
                id: item.id,
                name: item.name,
                type: 2
              })
            })
            userBranchOptions.push({ id: '2', type: 2, name: '我的下属', children: children })
            self.userBranchOptions = userBranchOptions
          }
        }
      })
      this.userBranchSelected = '0'
      this.userBranchOptions = userBranchOptions
    },
    /* 刷新合同列表 */
    getContractList() {
      const params = {
        pageIndex: 0
      }
      this.$refs.tableCommon.getList(params)
      this.$refs.contractSideDialog.sideDialogShow = false
    },
    /* 打开合同订单侧边弹框 */
    openSideDialog(row) {
      this.$refs.contractSideDialog.showSideDialog(row)
    },
    /* 合同批量导入弹框 */
    importContractDialog() {
      this.$refs.importContractDialog.showDialog()
    },
    /* 合同导出 */
    exportContract() {
      const params = {
        ...this.superValue,
        condition: 'all'
      }
      for (const key in params) {
        if (!params[key]) {
          delete params[key]
        }
      }
      if (this.$refs.tableCommon.totalCount > 0) {
        exportFile(`${window.SS_CRM}/crm/contract/exportOrder`, params)
      } else {
        this.$message.error('暂无数据导出')
      }
    },
    /* 合同订单弹框 */
    contractOrderDialog() {
      this.$refs.contractOrderDialog.showDialog('add')
    },
    /* 编辑合同订单弹框 */
    editContractOrderDialog(rowEidt) {
      this.$refs.contractOrderDialog.showDialog(rowEidt)
    },
    /* 审核合同弹框 */
    checkContractDialog(row) {
      this.$refs.checkContractDialog.showDialog(row)
    },
    /* 收款弹框 */
    gatheringDialog(row) {
      if(row.orderState == '5') { //eslint-disable-line
        this.$message.error('该合同已作废')
      } else {
        this.$refs.gatheringDialog.showDialog(row)
      }
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 用户权限选择
      const userBranchParams = {}
      if (this.userBranchSelected === '0' || this.userBranchSelected === '1') { // 全部、我的
        userBranchParams.operatorType = this.userBranchSelected
      } else if (parseFloat(this.userBranchSelected) > 1) { // 我的下属
        userBranchParams.operatorType = '2'
        if (this.userBranchSelected !== '2') { // 选择的下属
          userBranchParams.orderSellerPerson = this.userBranchSelected
        }
      }
      // 搜索的入参
      this.formValue = formValue
      const params = {
        ...this.formValue,
        ...this.superValue,
        // orderNum: this.formInline.orderNum,
        // stuNameOrMobile: this.formInline.stuNameOrMobile
        ...userBranchParams
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      this.userBranchSelected = 0
      this.searchHandle({})
    },
    /** 高级搜索 */
    onSearch(superValue) {
      // 用户权限选择
      const userBranchParams = {}
      if (this.userBranchSelected === '0' || this.userBranchSelected === '1') { // 全部、我的
        userBranchParams.operatorType = this.userBranchSelected
      } else if (parseFloat(this.userBranchSelected) > 1) { // 我的下属
        userBranchParams.operatorType = '2'
        if (this.userBranchSelected !== '2') { // 选择的下属
          userBranchParams.orderSellerPerson = this.userBranchSelected
        }
      }

      this.superValue = superValue
      const params = {
        ...this.superValue,
        ...this.formValue,
        ...userBranchParams
        // stuCardId: superValue.stuCardId, // 会员卡号
        // signType: superValue.signType, // 签约类型
        // type: superValue.type, // 购买类型
        // parentName: superValue.parentName, // 签约家长
        // orderState: superValue.orderState, // 审核状态
        // receiptStatus: superValue.receiptStatus, // 收款状态
        // sellerName: superValue.sellerName, // 销售姓名
        // startTime: superValue.firstDate && superValue.firstDate[0], // 签约日期开始
        // endTime: superValue.firstDate && superValue.firstDate[1], // 签约日期结束
        // estartTime: superValue.secondData && superValue.secondData[0], // 到期日期开始
        // eendTime: superValue.secondData && superValue.secondData[1], // 到期日期结束
        // expireInvalid: superValue.expireInvalid, // 过期是否作废
        // cstartTime: superValue.createTime && superValue.createTime[0], // 创建时间开始
        // cendTime: superValue.createTime && superValue.createTime[1], // 创建时间结束
        // createPersonName: superValue.createPersonName // 创建人
      }
      this.$refs.tableCommon.getList(params)
    },
    /** 高级清除 */
    onClear() {
      this.onSearch({})
    }
  }
}
</script>

<style lang="scss" scoped>
.contractOrder_container {
  min-width: 1060px;
  .search {
    display: flex;
    justify-content: space-between;
    height: 48px;
  }
}
.subUserSelect {
  vertical-align: top;
  float: left;
  margin-right: 10px;
}
</style>
<style lang="scss">
.contractOrder_container {
  .orderNum {
    color: #1d9df2;
    text-overflow: ellipsis;
    overflow: hidden;
    &:hover {
      color: #56c0f5;
    }
  }
}
</style>
