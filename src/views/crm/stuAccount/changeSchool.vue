<template>
  <div class="changeSchool_container">
    <!-- 搜索栏 -->
    <div class="search">
      <CommonSearch
        :is-inline="true"
        :params="formInline"
        :forms="formInline"
        @toParent="resetFieldHanle"
      />
    </div>
    <!-- 表格 -->
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      :operation="operates"
      table-key="crm_account_changeSchool"
    />
    <!-- 审核弹框 -->
    <ChangeAuditDialog
      ref="changeAuditDialog"
      @changeStuStatue="changeStuState"
    />
    <!-- 转校详情弹框 -->
    <ChangeInfoDialog ref="changeInfoDialog" />
  </div>
</template>

<script>
import { queryTransList } from '@/api/crm/stuAccount/stuAccount.js'
import CommonTable from '../../../components/CommonTable/CommonTable'
import CommonSearch from '../../../components/CommonSearch/CommonSearch'
import ChangeInfoDialog from './components/changeInfoDialog.vue'
import ChangeAuditDialog from './components/changeAuditDialog.vue'
export default {
  components: {
    CommonTable,
    CommonSearch,
    ChangeInfoDialog, // 转校详情弹框组件
    ChangeAuditDialog // 转校审核弹框组件
  },
  data() {
    return {
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '转课记录编号',
          prop: 'id',
          isShowTooltip: true,
          width: '120px',
          render: (h, params) => {
            return h(
              'div',
              {
                class: 'stuId',
                on: {
                  click: () => {
                    this.changeDetail(params.row)
                  }
                }
              }, params.row.id
            )
          }
          // formatter: (row, column, cellValue) => {
          //   return `<div style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${
          //     row.id
          //   }</div>`
          // },
          // methods: row => {
          //   this.changeDetail(row)
          // }
        },
        {
          label: '转出校区',
          prop: 'outOrgName',
          isShowTooltip: true
        },
        {
          label: '转出学员',
          prop: 'outStuName',
          isShowTooltip: true
        },
        {
          label: '联系方式',
          prop: 'outParentMobile',
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'el-popover',
                {
                  props: { placement: 'top', trigger: 'click' }
                },
                [
                  h('div',
                    params.row.outParents.map(item => {
                      return h('span', item.name + ':' + item.mobile + ' ')
                    })
                  ),
                  h('a', { slot: 'reference' }, '查看')
                ]
              )
            ])
          }
        },
        {
          label: '转出合同编号',
          prop: 'outPurNum',
          width: '120px',
          isShowTooltip: true
        },
        {
          label: '转出课时',
          prop: 'outNum',
          isShowTooltip: true
        },
        {
          label: '转出金额',
          prop: 'outMoney',
          align: 'right',
          isShowTooltip: true
        },
        {
          label: '转入校区',
          prop: 'inOrgName',
          isShowTooltip: true
        },
        {
          label: '转入学员',
          prop: 'inStuName',
          isShowTooltip: true
        },
        {
          label: '转入课时',
          prop: 'inNum',
          isShowTooltip: true
        },
        {
          label: '转入金额',
          prop: 'inMoney',
          align: 'right',
          isShowTooltip: true
        },
        {
          label: '状态',
          prop: 'status',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.status === '1') {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(255, 127, 117);border-radius: 50px;margin-right: 5px;"></span>
                        ${'待审核'}
                      </div>`
            }
            if (row.status === '2') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: #87D068;border-radius: 50px;margin-right: 5px;"></span>
                        ${'已通过'}
                      </div>`
            }
            if (row.status === '3') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(204, 67, 66);border-radius: 50px;margin-right: 5px;"></span>
                        ${'已驳回'}
                      </div>`
            }
          }
        },
        {
          label: '审核结果',
          prop: 'checkResult',
          isShowTooltip: true
        },
        {
          label: '创建时间',
          prop: 'createTime',
          isShowTooltip: true,
          width: '140'
        }
      ],
      options: {
        apiService: queryTransList, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },
      operates: {
        width: '140',
        fixed: 'right',
        list: [
          {
            label: '审核',
            type: 'normal',
            method: row => {
              this.auditDialog(row)
            }
          }
        ]
      },
      tableHeight: 'calc(100vh - 242px)',
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '转校学员姓名',
            modelValue: 'outStuName',
            isClearable: true,
            itemStyle: 'width:140px'
          },
          {
            itemType: 'input',
            placeholder: '联系方式',
            modelValue: 'outParentMobile',
            isClearable: true,
            itemStyle: 'width:140px'
          },
          {
            itemType: 'select',
            placeholder: '请选择状态',
            modelValue: 'status',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '待审核',
                value: '1'
              },
              {
                label: '已通过',
                value: '2'
              },
              {
                label: '已驳回',
                value: '3'
              }
            ]
          }
        ]
      },
      formValue: {}
    }
  },
  methods: {
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      const params = {
        ...this.formValue
        // outStuName: this.formInline.outStuName,
        // outParentMobile: this.formInline.outParentMobile,
        // status: this.formInline.status
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 0
      }
      this.formValue = {}
      this.$refs.tableCommon.getList(params)
    },
    /* 显示审核弹框 */
    auditDialog(row) {
      this.$refs.changeAuditDialog.auditDialog(row)
    },
    /* 是否通过单选框值改变 */
    radioChange(value) {
      if (value && value === '1') {
        this.isShowStuInput = !this.isShowStuInput
      } else {
        this.isShowStuInput = true
      }
    },
    /* 显示转校详情弹框 */
    changeDetail(row) {
      this.$refs.changeInfoDialog.showDetail(row)
    },
    // 刷新状态
    changeStuState() {
      this.$refs.tableCommon.getList()
    }
  }
}
</script>

<style lang="scss">
.changeSchool_container {
  .stuId {
    color: #1d9df2;
    text-overflow: ellipsis;
    overflow: hidden;
    &:hover {
      color: #56c0f5;
    }
  }
  .search {
    height: 48px;
  }
}
</style>

