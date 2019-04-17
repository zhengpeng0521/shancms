<template>
  <div class="accountMgr_container">
    <!-- 搜索栏 -->
    <div class="search">
      <CommonSearch
        :is-inline="true"
        :params="formInline"
        :forms="formInline"
        @toParent="resetFieldHanle"
      />
      <div>
        <el-button
          class="green_btn"
          @click="changeDialog()"
        >兑换商品</el-button>
        <el-button
          class="green_btn"
          @click="productDialog()"
        >积分变动</el-button>
        <el-button
          class="green_btn"
          @click="importDialog()"
        >积分导入</el-button>
      </div>
    </div>
    <!-- 表格 -->
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      table-key="crm_integral_account"
    />
    <!-- 兑换商品组件弹框组件 -->
    <ConProductDialog ref="conProductDialog" />
    <!-- 积分变动弹框组件 -->
    <IntChangeDialog ref="intChangeDialog" />
    <!-- 积分导入弹框组件 -->
    <IntImportDialog
      ref="intImportDialog"
      :refresh="refresh"
    />
  </div>
</template>

<script>
import { getInterialList } from '@/api/crm/Integral/accountMgr'
import CommonTable from '../../../components/CommonTable/CommonTable'
import CommonSearch from '../../../components/CommonSearch/CommonSearch'
import ConProductDialog from './components/conProductDialog.vue'
import IntImportDialog from './components/intImportDialog.vue'
import IntChangeDialog from './components/intChangeDialog.vue'
export default {
  components: {
    CommonSearch,
    CommonTable,
    ConProductDialog, // 兑换商品组件
    IntImportDialog, // 积分导入组件
    IntChangeDialog // 积分变动组件
  },
  data() {
    return {
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '会员卡号',
          prop: 'cardId',
          isShowTooltip: true,
          isShowSet: false
        },
        {
          label: '适用学员',
          prop: 'stuName',
          width: '120px',
          isShowTooltip: true,
          render: (h, params) => {
            let text = ''
            params.row.applicableStu && params.row.applicableStu.forEach((item, index) => {
              // eslint-disable-next-line
              if (index == 0) {
                text = item.stuName || ''
              } else {
                text += `, ${item.stuName || ''}`
              }
            })
            if (params.row.applicableStu && params.row.applicableStu.length > 1) {
              return h('span', {}, [
                h(
                  'el-popover',
                  {
                    props: {
                      placement: 'top',
                      trigger: 'click',
                      content: text
                    }
                  },
                  [
                    h('span', { slot: 'reference' }, [
                      params.row.applicableStu[0].stuName,
                      h('a', { style: { marginLeft: '4px' }}, `共${params.row.applicableStu.length}人`)
                    ])
                  ]
                )
              ])
            } else if(params.row.applicableStu && params.row.applicableStu.length == 0){ //eslint-disable-line
              return h('span', {}, '')
            } else {
              return h('span', {}, params.row.applicableStu && params.row.applicableStu[0].stuName || '')
            }
          }
        },
        {
          label: '昵称',
          prop: 'stuNickName',
          isShowTooltip: true,
          render: (h, params) => {
            if (params.row.applicableStu && params.row.applicableStu.length > 0) {
              return h('span', {}, [
                h(
                  'el-popover',
                  {
                    props: {
                      placement: 'top',
                      trigger: 'click'
                    }
                  },
                  [
                    params.row.applicableStu && params.row.applicableStu.map(item => (h('p', {}, `${item.stuName}: ${item.stuNickName}`))),
                    h('span', { slot: 'reference' }, params.row.applicableStu && params.row.applicableStu[0].stuNickName || '')
                  ]
                )
              ])
            } else {
              return h('span', {}, '')
            }
          }
        },
        {
          label: '适用家长',
          prop: 'name',
          isShowTooltip: true,
          width: '120px',
          render: (h, params) => {
            let text = ''
            params.row.applicableParents && params.row.applicableParents.forEach((item, index) => {
              // eslint-disable-next-line
              if (index == 0) {
                text = item.name
              } else {
                text += `, ${item.name}`
              }
            })
            if (params.row.applicableParents && params.row.applicableParents.length > 1) {
              return h('span', {}, [
                h(
                  'el-popover',
                  {
                    props: {
                      placement: 'top',
                      trigger: 'click',
                      content: text
                    }
                  },
                  [h('span', { slot: 'reference' }, [
                    params.row.applicableParents[0].name,
                    h('a', { style: { marginLeft: '4px' }}, `共${params.row.applicableParents.length}人`)
                  ])]
                )
              ])
            } else if(params.row.applicableParents && params.row.applicableParents.length == 0){ //eslint-disable-line
              return h('span', {}, '--')
            } else {
              return h('span', {}, params.row.applicableParents && params.row.applicableParents[0].name || '')
            }
          }
        },
        {
          label: '手机号',
          prop: 'mobile',
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'el-popover',
                {
                  props: {
                    placement: 'top',
                    trigger: 'click'
                  }
                },
                [
                  params.row.applicableParents && params.row.applicableParents.map(parent => (h('p', {}, `${parent.name || ''}: ${parent.mobile || ''}`))),
                  h('a', { slot: 'reference' }, '查看')
                ]
              )
            ])
          }
        },
        {
          label: '可用积分',
          prop: 'integral',
          isShowTooltip: true
        }
      ],
      options: {
        apiService: getInterialList, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 239px)',
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
            placeholder: '请输入会员卡号',
            modelValue: 'cardId',
            isClearable: true
          }
        ]
      },
      formValue: {}
    }
  },
  methods: {
    /* 积分变动弹框显示 */
    changeDialog(val) {
      this.$refs.intChangeDialog.showDialog()
    },
    /* 兑换商品弹框 */
    productDialog() {
      this.$refs.conProductDialog.showDialog()
    },
    /* 积分导入弹框显示 */
    importDialog() {
      this.$refs.intImportDialog.showDialog()
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      this.formValue = formValue
      const params = {
        ...this.formValue
        // cardId: this.formInline.cardId,
        // nameOrMobile: this.formInline.nameOrMobile
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
    /** 导入后刷新列表 */
    refresh() {
      const params = {
        // ...this.superValue,
        ...this.formValue
      }
      // if (this.commonDateOptions.pickerDateArr && this.commonDateOptions.pickerDateArr.length > 0) {
      //   params.startNextFollowTime = this.commonDateOptions.pickerDateArr[0]
      //   params.endNextFollowTime = this.commonDateOptions.pickerDateArr[1]
      // }
      for (const i in params) {
        if (!params[i]) {
          delete params[i]
        }
      }
      // this.getTimeSearch(params)
      this.$refs.tableCommon.getList(params)
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  justify-content: space-between;
  height: 48px;
}
</style>

