<template>
  <div class="hourChange_container">
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
    />
  </div>
</template>

<script>
import CommonTable from '../../../../../components/CommonTable/CommonTable'
export default {
  components: {
    CommonTable
  },
  data() {
    return {
      listQuery: {
        show: true // 是否显示
      },
      columns: [
        {
          label: '课时变动',
          prop: 'periodChange',
          isShowTooltip: true
        },
        {
          label: '关联合同',
          prop: 'orderNum',
          isShowTooltip: true
        },
        {
          label: '交易类型',
          prop: 'tradeType',
          isShowTooltip: true
        },
        {
          label: '变动描述',
          prop: 'tradeDesc',
          isShowTooltip: true
        },
        {
          label: '创建时间',
          prop: 'createTime',
          isShowTooltip: true
        }
        // {
        //   label: '所属校区',
        //   prop: 'orgName',
        //   isShowTooltip: true
        // }
      ],
      options: {
        isSettingShow: false // 是否出现设置
      },
      tableHeight: 'calc(100vh - 218px)'
    }
  },
  methods: {
    /*  */
    getOpenList(rowList) {
      this.$refs.tableCommon.getList({ id: rowList.id })
    }
  }
}
</script>

<style lang="scss" scoped>
.hourChange_container /deep/ {
  .el-table__body,
  .el-table__footer,
  .el-table__header {
    width: 100% !important;
  }
}
</style>

