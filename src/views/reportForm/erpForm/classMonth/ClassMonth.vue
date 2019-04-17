<template>
  <div>
    <el-alert
      :closable="false"
      type="info"
      title="此表可以查看机构每月的运营情况以及每张会员卡的月度余额情况"
      show-icon
    />
    <FormSearch
      ref="formSearch"
      v-bind="formSearchProps"
      :loading="loading"
    />
    <div>
      <CommonTable
        ref="classMonthTotal"
        :columns="columns"
        :table-height="'100px'"
        :table-loading="loading"
        :data-source="total"
      />
      <Media :query="{minWidth: 980}">
        <CommonTable
          ref="classMonthList"
          :columns="listColumns"
          :table-height="'calc(100vh - 345px)'"
          :table-loading="loading"
          :data-source="monthList"
          :pagination="listQuery"
          :page-count="pageCount"
          class="class-month-table"
        />
      </Media>
      <Media :query="{maxWidth: 980}">
        <CommonTable
          ref="classMonthList"
          :columns="listColumns"
          :table-height="'calc(100vh - 372px)'"
          :table-loading="loading"
          :data-source="monthList"
          :pagination="listQuery"
          :page-count="pageCount"
          class="class-month-table"
        />
      </Media>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Media from 'vue-media'
import FormSearch from '@/components/ReportForm/FormSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import { fmtDateFormat } from '@/utils/dateFormat'
import { exportFile } from '@/utils/exportFile'

export default {
  components: {
    Media,
    FormSearch,
    CommonTable
  },

  data() {
    return {
      formSearchProps: {
        DateType: 'month',
        monthExport: true,
        mediaWidth: 980,
        searchHandle: this.makeForm,
        exportCourse: this.exportFile.bind(this, 'course'),
        exportVip: this.exportFile.bind(this, 'vip')
      },
      columns: [
        {
          label: '统计类型',
          prop: 'countType',
          width: '96px'
        }, {
          label: '上月底剩余课时',
          prop: 'periodEndLeftNumTotal',
          width: '140px'
        }, {
          label: '上月底剩余金额',
          prop: 'periodEndLeftMoneyTotal',
          width: '140px'
        }, {
          label: '本月增加课时',
          prop: 'periodAddNumTotal',
          width: '140px'
        }, {
          label: '本月实收金额',
          prop: 'payMoneyTotal',
          width: '140px'
        }, {
          label: '本月应收金额',
          prop: 'oriMoneyTotal',
          width: '140px'
        }, {
          label: '总剩余课时',
          prop: 'totalPeriodLeftNumTotal',
          width: '140px'
        }, {
          label: '总剩余金额',
          prop: 'totalPeriodLeftMoneyTotal',
          width: '140px'
        }, {
          label: '本月已消耗课时',
          prop: 'periodCostNumTotal',
          width: '140px'
        }, {
          label: '本月已消耗金额',
          prop: 'periodCostMoneyTotal',
          width: '140px'
        }, {
          label: '转课转出总课时',
          prop: 'periodTranOutNumTotal',
          width: '140px'
        }, {
          label: '转课转出总金额',
          prop: 'periodTranOutMoneyTotal',
          width: '140px'
        }, {
          label: '转课转入总课时',
          prop: 'periodTranInNumTotal',
          width: '140px'
        }, {
          label: '转课转入总金额',
          prop: 'periodTranInMoneyTotal',
          width: '140px'
        }, {
          label: '转校转出总数量',
          prop: 'periodTranSchOutNumTotal',
          width: '140px'
        }, {
          label: '转校转出总金额',
          prop: 'periodTranSchOutMoneyTotal',
          width: '140px'
        }, {
          label: '转校转入总数量',
          prop: 'periodTranSchInNumTotal',
          width: '140px'
        }, {
          label: '转校转入总金额',
          prop: 'periodTranSchInMoneyTotal',
          width: '140px'
        }, {
          label: '总退课时',
          prop: 'periodRefundNumTotal',
          width: '140px'
        }, {
          label: '总退课金额',
          prop: 'periodRefundMoneyTotal',
          width: '140px'
        }, {
          label: '总退课手续费',
          prop: 'periodRefundFeeTotal',
          width: '140px'
        }, {
          label: '总过期作废课时',
          prop: 'periodExpireNumTotal',
          width: '140px'
        }, {
          label: '总过期作废金额',
          prop: 'periodExpireMoneyTotal',
          width: '140px'
        }, {
          label: '剩余课时',
          prop: 'periodLeftNumTotal',
          width: '140px'
        }, {
          label: '剩余金额',
          prop: 'periodLeftMoneyTotal',
          width: '140px'
        }
      ],
      // 列表
      listQuery: {
        show: true, // 是否显示
        sizeChange: this.sizeChange,
        indexChange: this.indexChange
      },
      listColumns: [
        {
          label: '会员卡号',
          prop: 'cardId',
          width: '150px',
          isShowTooltip: true
        }, {
          label: '学员姓名',
          prop: 'stuNames',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '家长手机号',
          prop: 'mobile',
          width: '140px',
          render: (h, params) => {
            const mobiles = []
            params.row.parents && params.row.parents.forEach((item) => {
              const text = (item.name || '--') + ' : ' + (item.mobile || '--')
              mobiles.push(h('p', {}, text))
            })

            return h('span', {}, [
              h('el-popover', {
                props: { placement: 'top', trigger: 'click' }
              }, [
                ...mobiles,
                h('a', { slot: 'reference' }, '查看')
              ])
            ])
          }
        }, {
          label: '上月底剩余课时',
          prop: 'periodEndLeftNum',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '上月底剩余金额',
          prop: 'periodEndLeftMoney',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '本月增加课时',
          prop: 'periodAddNum',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '本月实收金额',
          prop: 'payMoney',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '本月应收金额',
          prop: 'oriMoney',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '总剩余课时',
          prop: 'totalPeriodLeftNum',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '总剩余金额',
          prop: 'totalPeriodLeftMoney',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '课时均价',
          prop: 'periodAveragePrice',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '本月已消耗课时',
          prop: 'periodCostNum',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '本月已消耗金额',
          prop: 'periodCostMoney',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '转课转出课时',
          prop: 'periodTranOutNum',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '转课转出金额',
          prop: 'periodTranOutMoney',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '转课转入课时',
          prop: 'periodTranInNum',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '转课转入金额',
          prop: 'periodTranInMoney',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '转校转出数量',
          prop: 'periodTranSchOutNum',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '转校转出金额',
          prop: 'periodTranSchOutMoney',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '转校转入数量',
          prop: 'periodTranSchInNum',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '转校转入金额',
          prop: 'periodTranSchInMoney',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '退课时',
          prop: 'periodRefundNum',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '退课金额',
          prop: 'periodRefundMoney',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '退课手续费',
          prop: 'periodRefundFee',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '过期作废课时',
          prop: 'periodExpireNum',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '过期作废金额',
          prop: 'periodExpireMoney',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '剩余课时',
          prop: 'periodLeftNum',
          width: '140px',
          isShowTooltip: true
        }, {
          label: '剩余金额',
          prop: 'periodLeftMoney',
          width: '140px',
          isShowTooltip: true
        }
      ]
    }
  },

  computed: {
    ...mapState('classMonth', [
      'loading',
      'total',
      'monthList',
      'pageCount',
      'searchValue'
    ])
  },

  mounted() {
    const payload = {
      month: fmtDateFormat(this.$refs.formSearch.formSearch.date, 'yyyy-MM'),
      pageIndex: 0,
      pageSize: 20
    }
    this.getClassMonth(payload)
  },

  methods: {
    ...mapActions('classMonth', [
      'getClassMonth'
    ]),

    /** 生成报表 */
    makeForm(value) {
      const payload = {
        ...this.searchValue,
        month: value.date
      }
      this.getClassMonth(payload)
    },

    /** 页数改变 */
    indexChange(pageIndex) {
      const payload = {
        ...this.searchValue,
        pageIndex
      }
      this.getClassMonth(payload)
    },
    /** 每页条数改变 */
    sizeChange(pageSize) {
      const payload = {
        ...this.searchValue,
        pageSize
      }
      this.getClassMonth(payload)
    },

    /** 导出 */
    exportFile(type) {
      const params = {
        month: this.searchValue.month
      }
      if (type === 'course') {
        if (this.total.length > 0) {
          exportFile(`${window.REPORT_URL}/crm/cardReport/exportCoursePeriodMonthList`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      } else {
        if (this.total.length > 0) {
          exportFile(`${window.REPORT_URL}/crm/cardReport/exportPeriodMonthList`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.class-month-table {
  margin-top: 10px;
}
</style>
