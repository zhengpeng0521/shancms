<template>
  <div :class="className">
    <ChartCard
      v-bind="stuNumProps"
      :loading="loading"
      :data-source="chartList"
    />
    <ChartCard
      v-bind="saleProps"
      :loading="loading"
      :data-source="chartList"
      class="sale-chart"
    />
    <BlockTitle
      :export-file="() => {exportFile('detail')}"
      class="achivement-title"
    >销售工作详情</BlockTitle>
    <CommonTable
      ref="achivementTotal"
      :columns="columns"
      :is-border="true"
      :table-height="'100px'"
      :table-loading="loading"
      :data-source="total"
      class="achivement-table"
    />
    <FormTable
      :loading="loading"
      :data-source="tableList"
      :columns="detailCols"
      :page-count="pageCount"
      :page-change="pageChange"
      class="form-detail-table"
    />
  </div>
</template>

<script>
import ChartCard from '@/components/ReportForm/ChartCard'
import BlockTitle from '@/components/MiniCommon/BlockTitle'
import CommonTable from '@/components/CommonTable/CommonTable'
import FormTable from '@/components/ReportForm/FormTable'

export default {
  components: {
    ChartCard,
    BlockTitle,
    CommonTable,
    FormTable
  },

  props: {
    size: {
      type: String,
      required: true
    },
    exportFile: {
      type: Function,
      default: undefined
    },
    loading: {
      type: Boolean,
      required: true
    },
    chartList: {
      type: Array,
      required: true
    },
    total: {
      type: Array,
      required: true
    },
    tableList: {
      type: Array,
      required: true
    },
    pageCount: {
      type: Number,
      default: 0
    },
    pageChange: {
      type: Function,
      default: undefined
    }
  },

  data() {
    return {
      // className: this.size === 'small' ? 'achivement-small' : 'achivement-large',
      className: 'achivement-large',
      stuNumProps: {
        title: '按学员数量',
        type: 'line',
        exportFile: this.exportFile.bind(this, 'stu'),
        allCols: [
          { key: 'newStuNum', value: '新学员' },
          { key: 'oldStuNum', value: '续费学员' }
        ],
        showCols: ['signTime', 'newStuNum', 'oldStuNum']
      },
      saleProps: {
        title: '按销售额',
        type: 'line',
        exportFile: this.exportFile.bind(this, 'sale'),
        allCols: [
          { key: 'newPurchaseMoney', value: '新报销售额' },
          { key: 'continuePurchaseMoney', value: '续费销售额' }
        ],
        showCols: ['signTime', 'newPurchaseMoney', 'continuePurchaseMoney']
      },
      columns: [
        {
          label: '统计类型',
          prop: 'totalType',
          formatter: (row, column, cellValue) => {
            return '总计'
          }
        }, {
          label: '新学员数（占比）',
          prop: 'newStuNum',
          width: '96px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            const text = row.newStuNum + row.oldStuNum === 0 ? '0 (0.00%)'
              : `${row.newStuNum} (${(row.newStuNum / (row.newStuNum + row.oldStuNum) * 100).toFixed(2)}%)`
            return text
          }
        }, {
          label: '新学员合同数（占比）',
          prop: 'newPurNum',
          width: '120px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            const text = row.totalPurNum === 0 ? '0 (0.00%)'
              : `${row.newPurNum} (${(row.newPurNum / row.totalPurNum * 100).toFixed(2)}%)`
            return text
          }
        }, {
          label: '新学员合同金额（占比）',
          prop: 'newPurMoney',
          width: '130px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            const text = row.totalPurMoney === 0 ? '0 (0.00%)'
              : `${row.newPurMoney} (${(row.newPurMoney / row.totalPurMoney * 100).toFixed(2)}%)`
            return text
          }
        }, {
          label: '续费学员数（占比）',
          prop: 'oldStuNum',
          width: '120px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            const text = row.oldStuNum + row.newStuNum === 0 ? '0 (0.00%)'
              : `${row.oldStuNum} (${(row.oldStuNum / (row.oldStuNum + row.newStuNum) * 100).toFixed(2)}%)`
            return text
          }
        }, {
          label: '续费学员合同数（占比）',
          prop: 'renewPurNum',
          width: '130px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            const text = row.totalPurNum === 0 ? '0 (0.00%)'
              : `${row.renewPurNum} (${(row.renewPurNum / row.totalPurNum * 100).toFixed(2)}%)`
            return text
          }
        }, {
          label: '续费学员合同金额（占比）',
          prop: 'renewPurMoney',
          width: '145px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            const text = row.totalPurMoney === 0 ? '0 (0.00%)'
              : `${row.renewPurMoney} (${(row.renewPurMoney / row.totalPurMoney * 100).toFixed(2)}%)`
            return text
          }
        }, {
          label: '总合同数',
          prop: 'totalPurNum',
          width: '96px',
          isShowTooltip: true
        }, {
          label: '总合同金额',
          prop: 'totalPurMoney',
          width: '110px',
          isShowTooltip: true
        }, {
          label: '转入/转出合同数',
          prop: 'tranSchInNum',
          width: '135px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            return `${row.tranSchInNum}/${row.tranSchOutNum}`
          }
        }, {
          label: '转入/转出合同金额',
          prop: 'tranSchOutMoney',
          width: '150px',
          isShowTooltip: true,
          formatter: (row, column, cellValue) => {
            return `${row.tranSchInMoney}/${row.tranSchOutMoney}`
          }
        }
      ],
      detailCols: [
        {
          label: '姓名',
          prop: 'userName',
          isShowTooltip: true,
          width: '96px'
        }, {
          label: '新签合同',
          children: [
            {
              label: '新学员合同数',
              prop: 'newPurchaseNum',
              isShowTooltip: true,
              width: '110px',
              align: 'right'
            }, {
              label: '合同金额',
              prop: 'newPurchaseMoney',
              isShowTooltip: true,
              align: 'right'
            }, {
              label: '占比金额',
              prop: 'newProportionMoney',
              isShowTooltip: true,
              align: 'right'
            }
          ]
        }, {
          label: '续费合同',
          children: [
            {
              label: '老学员合同数',
              prop: 'renewPurchaseNum',
              isShowTooltip: true,
              width: '110px',
              align: 'right'
            }, {
              label: '合同金额',
              prop: 'renewPurchaseMoney',
              isShowTooltip: true,
              align: 'right'
            }, {
              label: '占比金额',
              prop: 'renewProportionMoney',
              isShowTooltip: true,
              align: 'right'
            }
          ]
        }, {
          label: '合计',
          children: [
            {
              label: '合同合计数',
              prop: 'totalNum',
              isShowTooltip: true,
              align: 'right'
            }, {
              label: '合同合计金额',
              prop: 'totalMoney',
              isShowTooltip: true,
              width: '110px',
              align: 'right'
            }, {
              label: '占比合计金额',
              prop: 'totalProportionMoney',
              isShowTooltip: true,
              width: '110px',
              align: 'right'
            }
          ]
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.achivement-small {
  max-height: calc(100vh - 264px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 10px;
  margin-right: -10px;
}
.achivement-large {
  max-height: calc(100vh - 214px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 10px;
  margin-right: -10px;
}
.sale-chart {
  margin-top: 20px;
}
.achivement-title {
  margin: 20px 0 10px;
}
.form-detail-table {
  margin-top: 20px;
}
</style>

<style lang="scss">
.achivement-table {
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #ebeef5 !important;
  }
}
</style>
