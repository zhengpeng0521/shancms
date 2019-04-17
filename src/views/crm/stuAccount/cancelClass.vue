<template>
  <div class="cancelClass_container">
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
    <!-- 表格 -->
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      table-key="crm_account_cancelClass"
    />
  </div>
</template>

<script>
import { queryRepealCourseInfo } from '@/api/crm/stuAccount/stuAccount.js'
import CommonTable from '../../../components/CommonTable/CommonTable'
import CommonSearch from '../../../components/CommonSearch/CommonSearch'
import AdvancedSearch from '@/components/AdvancedSearch/AdvancedSearch'
export default {
  components: {
    CommonTable,
    CommonSearch,
    AdvancedSearch
  },
  data() {
    return {
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '学员账户号',
          prop: 'cardId',
          isShowTooltip: true,
          isShowSet: false
        },
        {
          label: '适用学员',
          prop: 'applicableStu',
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span',
                params.row.applicableStu.map((item, index) => {
                  return h('span', item.stuName)
                })
              )
            ])
          }
        },
        {
          label: '适用家长',
          prop: 'applicableParent',
          isShowTooltip: true,
          width: '155',
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span',
                params.row.applicableParent.length > 1
                  ? [
                    h('span', params.row.applicableParent[0].name + ' '),
                    h('el-popover', {
                      props: { placement: 'top', trigger: 'click' }
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
                  : params.row.applicableParent.map((item, index) => {
                    return h('span', item.name)
                  })
              )
            ])
          }
        },
        {
          label: '手机号',
          prop: 'content_short',
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'el-popover',
                {
                  props: { placement: 'top', width: 'auto', trigger: 'click' }
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
          label: '消课课程',
          prop: 'courseName',
          isShowTooltip: true
        },
        {
          label: '消课数量',
          prop: 'courseNum',
          isShowTooltip: true
        },
        {
          label: '消课日期',
          prop: 'createTime',
          isShowTooltip: true
        },
        {
          label: '消课原因',
          prop: 'reason',
          isShowTooltip: true
        },
        {
          label: '创建人',
          prop: 'userName',
          isShowTooltip: true
        }
        // {
        //   label: '所属校区',
        //   prop: 'orgName',
        //   isShowTooltip: true,
        //   width: '130px;'
        // }
      ],
      options: {
        apiService: queryRepealCourseInfo, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 242px)',
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
            placeholder: '请输入学员账户号',
            modelValue: 'cardId',
            isClearable: true
          }, {
            itemType: 'input',
            placeholder: '创建人',
            modelValue: 'userName',
            isClearable: true,
            itemStyle: 'width:140px'
          }
        ]
      },
      superSearch: {
        onClear: () => { this.onClear() },
        onSearch: (superValue) => { this.onSearch(superValue) },
        fields: [
          {
            type: 'input',
            key: 'parentName',
            label: '家长姓名'
          }
        ]
      },
      formValue: {},
      superValue: {}
    }
  },
  methods: {
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
.search {
  height: 48px;
}
</style>
