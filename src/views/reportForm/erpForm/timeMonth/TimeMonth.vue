<template>
  <div>
    <FormSearch
      ref="formSearch"
      v-bind="formSearchProps"
      :loading="loading"
    />
    <Media :query="{minWidth: 800}">
      <CommonTable
        ref="timeMonth"
        :columns="columns"
        :table-height="'calc(100vh - 182px)'"
        :pagination="listQuery"
        :options="options"
      />
    </Media>
    <Media :query="{maxWidth: 800}">
      <CommonTable
        ref="timeMonth"
        :columns="columns"
        :table-height="'calc(100vh - 230px)'"
        :pagination="listQuery"
        :options="options"
        class="form-table"
      />
    </Media>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Media from 'vue-media'
import moment from 'moment'
import FormSearch from '@/components/ReportForm/FormSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import { getTimeMonth } from '@/api/reportForm/timeMonth'
import { exportFile } from '@/utils/exportFile'

export default {
  components: {
    Media,
    FormSearch,
    CommonTable
  },

  data() {
    const now = moment()
    const params = {
      month: now.format('YYYY-MM')
    }

    return {
      formSearchProps: {
        DateType: 'month',
        mediaWidth: 800,
        searchHandle: this.makeForm,
        exportFile: this.exportFile
      },
      listQuery: {
        show: true // 是否显示
      },
      options: {
        apiService: getTimeMonth, // 表格的数据请求接口
        params
      },
      columns: [
        {
          label: '合同编号',
          prop: 'orderNum',
          width: '120px',
          isShowTooltip: true
        }, {
          label: '学员姓名',
          prop: 'stuName',
          isShowTooltip: true
        }, {
          label: '课时套餐',
          prop: 'packageName',
          width: '120px',
          isShowTooltip: true,
          render: (h, params) => {
            let text = ''
            params.row.packageName && params.row.packageName.forEach((item, index) => {
              if (index === 0) {
                text = item
              } else {
                text = text + ', ' + item
              }
            })

            return h('span', {}, [
              h('el-popover', {
                props: { placement: 'top', trigger: 'click', content: text }
              }, [
                h('span', { slot: 'reference' }, text)
              ])
            ])
          }
        }, {
          label: '套餐金额',
          prop: 'oriMoney',
          isShowTooltip: true
        }, {
          label: '实收金额',
          prop: 'dicMoney',
          isShowTooltip: true
        }, {
          label: '签订日期',
          prop: 'signTime',
          width: '120px',
          isShowTooltip: true
        }, {
          label: '合同开始日期',
          prop: 'startTime',
          width: '120px',
          isShowTooltip: true
        }, {
          label: '合同结束日期',
          prop: 'endTime',
          width: '120px',
          isShowTooltip: true
        }, {
          label: '有效月份',
          prop: 'month',
          isShowTooltip: true
        }, {
          label: '本月消耗金额',
          prop: 'monthMoney',
          width: '120px',
          isShowTooltip: true
        }, {
          label: '剩余金额',
          prop: 'balanceMoney',
          isShowTooltip: true
        }
      ],
      searchValue: params
    }
  },

  computed: {
    ...mapState('commonTable', [
      'loading'
    ])
  },

  methods: {
    /** 生成报表 */
    makeForm(values) {
      const payload = {
        month: values.date
      }
      this.options.params = payload
      this.searchValue = payload
      this.$refs.timeMonth.getList(payload)
    },

    /** 导出 */
    exportFile() {
      const params = {
        month: this.searchValue.month
      }
      if (this.$refs.timeMonth.totalCount > 0) {
        exportFile(`${window.REPORT_URL}/crm/order/exportResultForMonth`, params)
      } else {
        this.$message.error('暂无数据导出')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-table {
  margin-top: 20px;
}
</style>
