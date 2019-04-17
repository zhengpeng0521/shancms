<template>
  <div class="integralChange_container">
    <div class="search">
      <CommonSearch
        :is-inline="true"
        :params="formInline"
        :forms="formInline"
        @toParent="resetFieldHanle"
      />
      <advanced-search
        v-bind="superSearch"
        style="margin-botttom: 14px"
      />
    </div>
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      table-key="crm_integral_change"
    />
  </div>
</template>

<script>
import { queryIntegralFlow } from '@/api/crm/Integral/accountMgr'
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
          label: '会员卡号',
          prop: 'cardId',
          isShowTooltip: true,
          isShowSet: false,
          formatter: (row, column, cellValue) => {
            return `<div style="text-overflow:ellipsis;overflow:hidden">${
              row.cardId
            }</div>`
          }
        },
        {
          label: '学员姓名',
          prop: 'stuName',
          isShowTooltip: true
        },
        {
          label: '家长姓名',
          prop: 'parents',
          isShowTooltip: true,
          width: '140px',
          render: (h, params) => {
            return h('span', {}, [
              h(
                'span',
                params.row.parents.length > 1
                  ? [
                    h('span', params.row.parents[0].name + ' '),
                    h('el-popover', {
                      props: { placement: 'top', trigger: 'click' }
                    },
                    [
                      h('div',
                        params.row.parents.map(item => {
                          return h('span', { class: 'manyParent' }, item.name + ',')
                        })
                      ),
                      h('a',
                        { slot: 'reference' }, '共' + params.row.parents.length + '人')
                    ])
                  ]
                  : params.row.parents.map((item, index) => {
                    return h('span', item.name)
                  })
              )
            ])
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
                  props: { placement: 'top', trigger: 'click' }
                },
                [
                  h('div',
                    params.row.parents.map(item => {
                      return h('span', item.name + ':' + item.mobile + ' , ')
                    })
                  ),
                  h('a', { slot: 'reference' }, '查看')
                ]
              )
            ])
          }
        },
        {
          label: '变动类型',
          prop: 'type',
          isShowTooltip: true,
          render: (h, params) => {
            return h('span', {}, [
              h(
                'el-popover',
                {
                  props: { placement: 'top', trigger: 'hover' }
                },
                [
                  h('span',
                    params.row.goodsName + ':' + params.row.goodsNum
                  ),
                  h('span', { slot: 'reference' }, params.row.type)
                ]
              )
            ])
          }
        },
        {
          label: '积分变动',
          prop: 'integralChange',
          isShowTooltip: true
        },
        {
          label: '备注',
          prop: 'remark',
          isShowTooltip: true
        },
        {
          label: '创建人',
          prop: 'createUserName',
          isShowTooltip: true
        },
        {
          label: '创建时间',
          prop: 'createTime',
          isShowTooltip: true,
          width: '120px;'
        }
      ],
      options: {
        apiService: queryIntegralFlow, // 表格的数据请求接口
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
            isClearable: true,
            itemStyle: 'width:160px'
          },
          {
            itemType: 'select',
            placeholder: '请选择变动类型',
            modelValue: 'type',
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '上课加分',
                value: '1'
              },
              {
                label: '评星加分',
                value: '2'
              },
              {
                label: '手动加减分',
                value: '3'
              },
              {
                label: '兑换商品',
                value: '4'
              },
              {
                label: '取消',
                value: '5'
              }
            ]
          },
          {
            itemType: 'input',
            placeholder: '请输入创建人',
            modelValue: 'createUserName',
            isClearable: true,
            itemStyle: 'width:140px'
          }
        ]
      },
      superSearch: {
        onClear: () => {
          this.onClear()
        },
        onSearch: superValue => {
          this.onSearch(superValue)
        },
        fields: [
          {
            type: 'input',
            key: 'cardId',
            label: '会员卡号'
          },
          {
            type: 'datePicker',
            key: 'rangeDate',
            dateType: 'daterange',
            label: '日期范围'
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
        // nameOrMobile: this.formInline.nameOrMobile,
        // type: this.formInline.type,
        // createUserName: this.formInline.createUserName
      }
      if (params && params.rangeDate && params.rangeDate.length > 0) {
        params.createStartTime = params.rangeDate[0]
        params.createEndTime = params.rangeDate[1]
      }
      delete params.rangeDate
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 0,
        ...this.superValue
      }
      if (params && params.rangeDate && params.rangeDate.length > 0) {
        params.createStartTime = params.rangeDate[0]
        params.createEndTime = params.rangeDate[1]
      }
      delete params.rangeDate
      this.formValue = {}
      this.$refs.tableCommon.getList(params)
    },
    /** 高级搜索 */
    onSearch(superValue) {
      this.superValue = superValue
      const params = {
        ...this.superValue,
        ...this.formValue
        // cardId: superValue && superValue.cardId
      }
      if (params && params.rangeDate && params.rangeDate.length > 0) {
        params.createStartTime = params.rangeDate[0]
        params.createEndTime = params.rangeDate[1]
      }
      delete params.rangeDate
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
  display: flex;
  height: 48px;
}
</style>

