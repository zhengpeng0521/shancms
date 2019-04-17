<template>
  <div class="turnClass_container">
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
      table-key="crm_account_turnClass"
    />
  </div>
</template>

<script>
import { transferPeriodList } from '@/api/crm/stuAccount/stuAccount.js'
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
          prop: 'stuName',
          isShowTooltip: true
        },
        {
          label: '合同编号',
          prop: 'purchaseId',
          isShowTooltip: true
        },
        {
          label: '转出课程',
          prop: 'outCourseName',
          isShowTooltip: true
        },
        {
          label: '转出数量',
          prop: 'outNum',
          isShowTooltip: true
        },
        {
          label: '转进课程',
          prop: 'inCourseName',
          isShowTooltip: true
        },
        {
          label: '转进数量',
          prop: 'inNum',
          isShowTooltip: true
        },
        {
          label: '类型',
          prop: 'type',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            if (row.type === '1') {//eslint-disable-line
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(93, 156, 236);border-radius: 50px;margin-right: 5px;"></span>
                        ${'平价'}
                      </div>`
            }
            if (row.type === '2') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(136, 199, 10);border-radius: 50px;margin-right: 5px;"></span>
                        ${'补缴'}
                      </div>`
            }
            if (row.type === '3') {
              return `<div style="text-overflow:ellipsis;overflow:hidden">
                        <span style="display: inline-block;width:8px;height:8px;background-color: rgb(204, 67, 66);border-radius: 50px;margin-right: 5px;"></span>
                        ${'退费'}
                      </div>`
            }
          }
        },
        {
          label: '变动金额',
          prop: 'changeAmount',
          align: 'right',
          isShowTooltip: true
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
          width: '160'
        }
        // {
        //   label: '所属校区',
        //   prop: 'orgName',
        //   isShowTooltip: true,
        //   width: '140px;'
        // }
      ],
      options: {
        apiService: transferPeriodList, // 表格的数据请求接口
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
            placeholder: '学员账户号',
            modelValue: 'cardId',
            isClearable: true,
            itemStyle: 'width:140px'
          }, {
            itemType: 'select',
            placeholder: '请选择状态',
            modelValue: 'type',
            // isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '平价',
                value: '1'
              }, {
                label: '补缴',
                value: '2'
              }, {
                label: '退费',
                value: '3'
              }
            ]
          }, {
            itemType: 'input',
            placeholder: '适用学员',
            modelValue: 'stuName',
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
            key: 'creatorName',
            label: '创建人'
          }
        ]
      },
      superValue: {},
      formValue: {}
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
        // cardId: this.formInline.cardId,
        // type: this.formInline.type,
        // stuName: this.formInline.stuName
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
        // creatorName: superValue.creatorName
      }
      this.$refs.tableCommon.getList(params)
    },
    /** 高级清除 */
    onClear() {
      // 重置的入参
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
