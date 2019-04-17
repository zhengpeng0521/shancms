<template>
  <div>
    <el-alert
      :closable="false"
      type="info"
      title="此表从不同维度反映了近期机构的经营情况，可据此了解机构销售指标，调整经营方案"
      show-icon
    />
    <FormSearch
      ref="formSearch"
      v-bind="formSearchProps"
      :loading="loading"
    />
    <div class="contract-income-box">
      <ChartCard
        v-bind="signProps"
        :loading="loading"
        :data-source="signSource"
      />
      <ChartCard
        v-bind="stuProps"
        :loading="loading"
        :data-source="stuSource"
        class="chart-top"
      />
      <el-alert
        :closable="false"
        type="info"
        title="可以根据合同数，选择重点推介的课时套餐"
        class="chart-top"
        show-icon
      />
      <ChartCard
        v-bind="clsProps"
        :loading="loading"
        :data-source="clsSource"
        class="chart-top"
      />
      <ChartCard
        v-bind="nurseryProps"
        :loading="loading"
        :data-source="nurserySource"
        class="chart-top"
      />
      <ChartCard
        v-bind="teachProps"
        :loading="loading"
        :data-source="teachSource"
        class="chart-top"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { fmtDateFormat } from '@/utils/dateFormat'
import FormSearch from '@/components/ReportForm/FormSearch'
import ChartCard from '@/components/ReportForm/ChartCard'
import { exportFile } from '@/utils/exportFile'

export default {
  components: {
    FormSearch,
    ChartCard
  },

  data() {
    return {
      formSearchProps: {
        searchHandle: this.makeForm
      },
      // 签约图
      signProps: {
        title: '签约类型',
        type: 'bar',
        exportFile: this.exportFile.bind(this, 'sign'),
        allCols: [
          { key: 'money', value: '收入' }
        ],
        showCols: ['type', 'money']
      },
      // 学员图
      stuProps: {
        title: '新老学员',
        type: 'bar',
        exportFile: this.exportFile.bind(this, 'stu'),
        allCols: [
          { key: 'money', value: '收入' }
        ],
        showCols: ['type', 'money']
      },
      // 课时图
      clsProps: {
        title: '课时套餐',
        extraTitle: '最多显示前10，查看全部请导出报表',
        type: 'histogram',
        legend: false,
        exportFile: this.exportFile.bind(this, 'cls'),
        formatter: this.formatter.bind(this, 'cls'),
        allCols: [
          { key: 'money', value: '合同金额' }
        ],
        showCols: ['productName', 'money']
      },
      // 托班
      nurseryProps: {
        title: '托班套餐',
        extraTitle: '最多显示前10，查看全部请导出报表',
        type: 'histogram',
        legend: false,
        exportFile: this.exportFile.bind(this, 'nersury'),
        formatter: this.formatter.bind(this, 'nur'),
        allCols: [
          { key: 'money', value: '合同金额' }
        ],
        showCols: ['productName', 'money']
      },
      // 教材
      teachProps: {
        title: '教材',
        extraTitle: '最多显示前10，查看全部请导出报表',
        type: 'histogram',
        legend: false,
        exportFile: this.exportFile.bind(this, 'teach'),
        formatter: this.formatter.bind(this, 'teach'),
        allCols: [
          { key: 'money', value: '合同金额' }
        ],
        showCols: ['aidName', 'money']
      }
    }
  },

  computed: {
    ...mapState('contractIncome', [
      'loading',
      'searchValue',
      'signSource',
      'stuSource',
      'clsSource',
      'nurserySource',
      'teachSource'
    ])
  },

  mounted() {
    const payload = {
      startDate: fmtDateFormat(this.$refs.formSearch.formSearch.date[0], 'yyyy-MM-dd'),
      endDate: fmtDateFormat(this.$refs.formSearch.formSearch.date[1], 'yyyy-MM-dd')
    }
    this.getContractIncome(payload)
  },

  methods: {
    ...mapActions('contractIncome', [
      'getContractIncome'
    ]),

    /** 生成报表 */
    makeForm(values, extra) {
      const payload = {
        startDate: values.date[0],
        endDate: values.date[1]
      }
      this.getContractIncome(payload)
    },

    /** 导出 */
    exportFile(type) {
      const params = { ...this.searchValue }
      if (type === 'sign') {
        if (this.signSource.length > 0) {
          exportFile(`${window.REPORT_URL}/crm/statistics/seller/exportSignType`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      } else if (type === 'stu') {
        if (this.stuSource.length > 0) {
          exportFile(`${window.REPORT_URL}/crm/statistics/seller/exportStuType`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      } else if (type === 'cls') {
        if (this.clsSource.length > 0) {
          params.proType = '1'
          exportFile(`${window.REPORT_URL}/crm/statistics/seller/exportPeriodPackList`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      } else if (type === 'nersury') {
        if (this.nurserySource.length > 0) {
          params.proType = '3'
          exportFile(`${window.REPORT_URL}/crm/statistics/seller/exportPeriodPackList`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      } else {
        if (this.teachSource.length > 0) {
          exportFile(`${window.REPORT_URL}/crm/statistics/seller/exportTeachAidList`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      }
    },

    /** 柱形图浮层 */
    formatter(type, params, ticket, callback) {
      let newNum = 0
      if (type === 'cls') {
        this.clsSource.forEach((item) => {
          if (item.productName === params[0].name) {
            newNum = item.purNum
          }
        })
      } else if (type === 'nur') {
        this.nurserySource.forEach((item) => {
          if (item.productName === params[0].name) {
            newNum = item.purNum
          }
        })
      } else {
        this.teachSource.forEach((item) => {
          if (item.aidName === params[0].name) {
            newNum = item.purNum
          }
        })
      }

      return `<div>
        <p style="margin-bottom:5px">${params[0].name}</p>
        <p><i style="display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px;background:${params[0].color}"></i>合同数: ${newNum}</p>
        <p><i style="display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px;background:${params[0].color}"></i>${params[0].seriesName}: ${params[0].value}</p>
      </div>`
    }
  }
}
</script>

<style lang="scss" scoped>
.chart-top {
  margin-top: 20px;
}
.contract-income-box {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 10px;
  margin-right: -10px;
}
</style>
