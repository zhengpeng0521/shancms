<template>
  <div class="callRecords_container">
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
    </div>
    <!-- 已选数据操作 -->
    <div class="checked_data">
      <span class="checked_text">已选<i>{{ checkedData || '0' }}</i>条数据</span>
      <el-button
        type="text"
        size="mini"
      >下载</el-button>
    </div>
    <!-- 表格 -->
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      @handleSelectionChange="selectionChange"
    />
  </div>
</template>

<script>
import { fetchList } from '@/api/course'
import CommonTable from './../../../components/CommonTable/CommonTable'
import CommonSearch from './../../../components/CommonSearch/CommonSearch'
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
          label: '主叫号码',
          prop: 'title',
          isShowTooltip: true
        },
        {
          label: '销售姓名',
          prop: 'groupName',
          isShowTooltip: true
        },
        {
          label: '被叫人',
          prop: 'title',
          isShowTooltip: true
        },
        {
          label: '被叫号码',
          prop: 'groupName',
          isShowTooltip: true
        },
        {
          label: '通话记录',
          prop: 'title',
          isShowTooltip: true
        },
        {
          label: '通话时长',
          prop: 'groupName',
          isShowTooltip: true
        },
        {
          label: '呼叫类型',
          prop: 'title',
          isShowTooltip: true
        }
      ],
      options: {
        mutiSelect: true, // 是否多选
        apiService: fetchList, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },
      tableHeight: 'calc(100vh - 260px)',
      formInline: {
        searchMethod: () => {
          this.searchHandle('formInline')
        },
        forms: [
          {
            itemType: 'select',
            placeholder: '销售姓名',
            modelValue: 'region',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '已开通',
                value: '1'
              }, {
                label: '已停用',
                value: '0'
              }
            ]
          }, {
            itemType: 'input',
            placeholder: '主叫号码',
            modelValue: 'region',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px'
          }, {
            itemType: 'select',
            placeholder: '呼叫类型',
            modelValue: 'region',
            isFilterable: true,
            isClearable: true,
            itemStyle: 'width:140px',
            selectOption: [
              {
                label: '已开通',
                value: '1'
              }, {
                label: '已停用',
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
            type: 'input',
            key: 'name',
            label: '被叫人'
          }, {
            type: 'input',
            key: 'name',
            label: '被叫号码'
          }, {
            type: 'datePicker',
            key: 'rangeDate',
            dateType: 'daterange',
            label: '通话时间'
          }
        ]
      },
      checkedData: ''
    }
  },
  methods: {
    /* 选择数据条数操作 */
    selectionChange(val) {
      console.info('val--->', val.length)
      this.checkedData = val.length
    },
    /* 搜索 */
    searchHandle(formValue) {
      // 搜索的入参
      const params = {
      }
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 1
      }
      this.$refs.tableCommon.getList(params)
    },
    /** 高级搜索 */
    onSearch(superValue) {
      console.log('onSearch', superValue)
    },
    /** 高级清除 */
    onClear() {
      console.log('onClear')
    }
  }
}
</script>

<style lang="scss" scoped>
.callRecords_container /deep/ {
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 5px;
  }
  .checked_data {
    margin-bottom: 8px;
    .checked_text {
      margin-right: 10px;
    }
    i {
      font-style: normal;
      color: #46b6ee;
      padding: 0 5px;
    }
  }
}
</style>

