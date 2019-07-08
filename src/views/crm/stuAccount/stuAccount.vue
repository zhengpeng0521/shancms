<template>
  <div class="stuAccount_container">
    <!-- 搜索栏 -->
    <div class="search">
      <CommonSearch
        :is-inline="true"
        :params="formInline"
        :forms="formInline"
        @toParent="resetFieldHanle"
      />
      <!-- <advanced-search v-bind="superSearch" /> -->
      <div>
        <el-button
          v-log="{compName:'学员账户',eventName:'web-【学员CRM】-学员账户-批量手动消课'}"
          type="primary"
          size="mini"
          @click="batchHandCurDialog()"
        >批量手动消课</el-button>
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
      table-key="crm_account_student"
    />
    <!-- 学员详情弹框组件 -->
    <StudentDetailSide ref="studentDetailSide" />
    <!-- 新增消课弹框组件 -->
    <AddCancelClassDialog ref="addCancelClassDialog" />
    <!-- 新增赠送课时弹框组件 -->
    <AddGiveClassDialog ref="addGiveClassDialog" />
    <!-- 会员卡侧边滑弹框 -->
    <CardVipSideDialog ref="cardVipSideDialog" />

    <!-- 批量手动消课弹窗 -->
    <BatchHandCurDialog ref="batchHandCurDialog" />
    <!-- 冻结/解冻弹窗 -->
    <AddFreezeAccountDialog ref="addFreezeAccountDialog" @refreshTableList="refreshList"/>

  </div>
</template>

<script>
import { stuCardListByCon } from '@/api/crm/stuAccount/stuAccount.js'
import CommonTable from '../../../components/CommonTable/CommonTable'
import CommonSearch from '../../../components/CommonSearch/CommonSearch'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
import StudentDetailSide from './components/studentDetailSide.vue'
import AddCancelClassDialog from './components/addCancelClassDialog.vue'
import AddFreezeAccountDialog from './components/addFreezeAccount.vue'
import AddGiveClassDialog from './components/addGiveClassDialog.vue'
import CardVipSideDialog from './components/cardVipSideDialog.vue'
import BatchHandCurDialog from './components/batchHandCurDialog.vue'
export default {
  components: {
    CommonTable,
    CommonSearch,
    AdvancedSearch,
    StudentDetailSide, // 学员详情侧边弹框组件
    AddCancelClassDialog, // 新增消课弹框组件
    AddGiveClassDialog, // 新增赠送课时弹框组件
    CardVipSideDialog, // 会员卡侧边滑弹框组件
    BatchHandCurDialog, // 批量手动消课弹窗
    AddFreezeAccountDialog // 冻结 or 解冻弹窗组件
  },
  data() {
    return {
      listQuery: {
        show: true, // 是否显示
        sizes: true
      },
      columns: [
        {
          label: '学员账户号',
          prop: 'id',
          isShowSet: false,
          isShowTooltip: true,
          width: '120',
          render: (h, params) => {
            return h(
              'div',
              {
                class: 'stuId',
                on: {
                  click: () => {
                    this.cardVipSide(params.row)
                  }
                }
              }, params.row.id
            )
          }
        },
        {
          label: '适用学员',
          prop: 'stuName',
          isShowTooltip: true,
          width: '120',
          render: (h, params) => {
            return h('span', {}, [
              h(
                'div',
                params.row.applicableStu.map((item, index) => {
                  return h('a', {
                    on: {
                      click: () => {
                        this.stuDetailDialog(item)
                      }
                    }
                  }, item.stuName)
                })
              )
            ])
          }
        },
        {
          label: '生日',
          prop: 'pageviews',
          isShowTooltip: true,
          width: '120px',
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span',
                params.row.applicableStu.map((item, index) => {
                  return h('span', item.stuBirthday)
                })
              )
            ])
          }
        },
        {
          label: '适用家长',
          prop: 'applicableParent',
          isShowTooltip: true,
          width: '165px;',
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span',
                params.row.applicableParent && params.row.applicableParent.length > 1
                  ? [
                    h('span', params.row.applicableParent[0].name + ' '),
                    h('el-popover', {
                      props: { placement: 'top', trigger: 'hover' }
                    },
                    [
                      h('div',
                        params.row.applicableParent.map(item => {
                          return h('span', { class: 'manyParent' }, item.name + '  ')
                        })
                      ),
                      h('a',
                        { slot: 'reference' }, '共' + params.row.applicableParent.length + '人')
                    ])
                  ]
                  : params.row.applicableParent && params.row.applicableParent.map((item, index) => {
                    return h('span', item.name)
                  })
              )
            ])
          }
        },
        {
          label: '手机号',
          prop: 'mobile',
          render: (h, params) => {
            return h('span', {}, [
              h(
                'el-popover',
                {
                  props: { placement: 'top', trigger: 'hover' }
                },
                [
                  h('div',
                    params.row.applicableParent.map(item => {
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
          label: '总课时(赠送)',
          prop: 'periodAll',
          isShowTooltip: true,
          width: '110px;',
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span', { slot: 'reference' }, params.row.periodAll + ' (' + params.row.periodExt + ')'
              )
            ])
          }
        },
        {
          label: '剩余课时',
          prop: 'periodLeft',
          isShowTooltip: true
        },
        {
          label: '可用课时',
          prop: 'periodAvailable',
          isShowTooltip: true
        },
        {
          label: '已预约课时',
          prop: 'periodForward',
          isShowTooltip: true,
          width: '110px;'
        },
        {
          label: '已消耗课时',
          prop: 'periodExpend',
          isShowTooltip: true,
          width: '110px;'
        },
        {
          label: '已退课时',
          prop: 'periodRefund',
          isShowTooltip: true
        },
        {
          label: '创建时间',
          prop: 'createTime',
          isShowTooltip: true,
          width: '165px'
        }
        // {
        //   label: '所属校区',
        //   prop: 'orgName',
        //   isShowTooltip: true
        // }
      ],
      options: {
        apiService: stuCardListByCon, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 227px)',
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
          }, {
            itemType: 'input',
            placeholder: '学员账户号',
            modelValue: 'id',
            isClearable: true
          }
        ]
      },
      superSearch: {
        onClear: () => { this.onClear() },
        onSearch: (superValue) => { this.onSearch(superValue) },
        fields: [
          {
            type: 'input',
            key: 'id',
            label: '学员账户号'
          }
        ]
      },
      operates: {
        width: '210',
        fixed: 'right',
        list: [
          {
            label: '手动消课',
            type: 'normal',
            btnId: '408000001',
            method: (row) => {
              this.addCancelClass(row)
            }
          },
          {
            label: '赠课',
            type: 'normal',
            btnId: '408000002',
            method: (row) => {
              this.addGiveClass(row)
            }
          },
          {
            label: '冻结',
            type: 'general',
            prop: 'status',
            btnId: '408000006',
            popoverCon: [
              {
                contentText: '冻结',
                status: '1'
              }, {
                contentText: '解冻',
                status: '2'
              }
            ],
            method: (row) => {
              this.addIfFreeze(row)
            }
          }
        ]
      },
      cardInfoData: {},
      superValue: {}
    }
  },
  methods: {
    /* 学员详情弹框显示 */
    stuDetailDialog(row) {
      this.cardInfoData = row
      this.$refs.studentDetailSide.showSideDialog(row)
    },
    /* 新增消课弹框显示 */
    addCancelClass(row) {
      this.$refs.addCancelClassDialog.showDialog(row)
    },
    /* 新增赠送课时弹框 */
    addGiveClass(row) {
      this.$refs.addGiveClassDialog.showDialog(row)
    },
    /* 会员卡侧边滑弹框 */
    cardVipSide(row) {
      this.$refs.cardVipSideDialog.showSideDialog(row)
    },
    /* 新增预约试听弹框 */
    batchHandCurDialog() {
      this.$refs.batchHandCurDialog.showDialog()
    },
    /*  冻结或者解冻弹窗  */
    addIfFreeze(row) {
      this.$refs.addFreezeAccountDialog.showDialog(row)
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
    // 刷新列表
    refreshList() {
      this.$refs.tableCommon.getList()
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
.manyParent {
  padding: 0 5px;
  box-sizing: border-box;
}
</style>
<style lang="scss">
.stuAccount_container {
  .stuId {
    color: #1d9df2;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
    &:hover {
      color: #56c0f5;
    }
  }
  .search {
    height: 48px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
