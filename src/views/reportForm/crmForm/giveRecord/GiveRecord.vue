<template>
  <div>
    <FormSearch
      ref="formSearch"
      v-bind="formSearchProps"
      :loading="loading"
    />
    <div class="give-record-box">
      <ChartCard
        v-bind="numProps"
        :loading="loading"
        :data-source="giveNumList"
      />
      <ChartCard
        v-bind="timeProps"
        :loading="loading"
        :data-source="giveTimeList"
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
      // 赠送课时
      numProps: {
        title: '赠送课时',
        type: 'bar',
        exportFile: this.exportFile.bind(this, 'num'),
        formatter: this.formatter.bind(this, 'num'),
        allCols: [
          { key: 'num', value: '数量' }
        ],
        showCols: ['type', 'num']
      },
      // 赠送时间
      timeProps: {
        title: '赠送时间',
        type: 'bar',
        exportFile: this.exportFile.bind(this, 'time'),
        formatter: this.formatter.bind(this, 'time'),
        allCols: [
          { key: 'num', value: '数量' }
        ],
        showCols: ['type', 'num']
      }
    }
  },

  computed: {
    ...mapState('giveRecord', [
      'loading',
      'searchValue',
      'giveNumList',
      'giveTimeList'
    ])
  },

  mounted() {
    const payload = {
      startDate: fmtDateFormat(this.$refs.formSearch.formSearch.date[0], 'yyyy-MM-dd'),
      endDate: fmtDateFormat(this.$refs.formSearch.formSearch.date[1], 'yyyy-MM-dd')
    }
    this.getGiveList(payload)
  },

  methods: {
    ...mapActions('giveRecord', [
      'getGiveList'
    ]),

    /** 生成报表 */
    makeForm(values, extra) {
      const payload = {
        startDate: values.date[0],
        endDate: values.date[1]
      }
      this.getGiveList(payload)
    },

    /** 导出 */
    exportFile(type) {
      const params = {
        ...this.searchValue
      }
      if (this.giveNumList.length > 0) {
        exportFile(`${window.REPORT_URL}/crm/statistics/seller/giveRecordExport`, params)
      } else {
        this.$message.error('暂无数据导出')
      }
    },

    /** 自定义浮层 */
    formatter(type, params, ticket, callback) {
      let money = 0
      if (type === 'num') {
        this.giveNumList.forEach((item) => {
          if (item.type === params[0].name) {
            money = item.money
          }
        })
      } else {
        this.giveTimeList.forEach((item) => {
          if (item.type === params[0].name) {
            money = item.money
          }
        })
      }

      return `<div>
        <p style="margin-bottom:5px">${params[0].name}</p>
        <p style="color:${params[0].color};margin-bottom:5px">数量 : ${params[0].value}</p>
        <p style="color:${params[0].color};">成本 : ${money}</p>
      </div>`
    }
  }
}
</script>

<style lang="scss" scoped>
.give-record-box {
  max-height: calc(100vh - 150px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 10px;
  margin-right: -10px;
}
.chart-top {
  margin-top: 20px;
}
</style>
