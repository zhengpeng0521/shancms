<template>
  <div>
    <FormSearch
      ref="formSearch"
      v-bind="formSearchProps"
      :loading="loading"
    />
    <Media :query="{minWidth: 980}">
      <CommonTable
        ref="classTimeDetail"
        :columns="columns"
        :table-height="'calc(100vh - 182px)'"
        :pagination="listQuery"
        :options="options"
      />
    </Media>
    <Media :query="{maxWidth: 980}">
      <CommonTable
        ref="classTimeDetail"
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
import { getClassTimeDetail } from '@/api/reportForm/classTimeDetail'
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
      startDate: now.format('YYYY-MM-DD'),
      endDate: now.format('YYYY-MM-DD')
    }

    return {
      formSearchProps: {
        mediaWidth: 980,
        searchHandle: this.makeForm,
        exportFile: this.exportFile
      },
      listQuery: {
        show: true // 是否显示
      },
      options: {
        apiService: getClassTimeDetail, // 表格的数据请求接口
        params
      },
      columns: [
        {
          label: '会员卡号',
          prop: 'cardId',
          width: '160px',
          isShowTooltip: true
        }, {
          label: '学员姓名',
          prop: 'stuNames',
          isShowTooltip: true
        }, {
          label: '课时',
          prop: 'periodAll',
          isShowTooltip: true
        }, {
          label: '课时金额',
          prop: 'periodMoney',
          isShowTooltip: true
        }, {
          label: '均价',
          prop: 'periodAvg',
          isShowTooltip: true
        }, {
          label: '消课',
          prop: 'periodExpend',
          isShowTooltip: true
        }, {
          label: '赠课',
          prop: 'periodExt',
          isShowTooltip: true
        }, {
          label: '退课',
          prop: 'periodRefund',
          isShowTooltip: true
        }, {
          label: '剩余课时',
          prop: 'periodLeft',
          isShowTooltip: true
        }, {
          label: '剩余金额',
          prop: 'periodLeftMoney',
          isShowTooltip: true
        }, {
          label: '此段时间消课',
          prop: 'inPeriodCost',
          width: '160px',
          isShowTooltip: true
        }, {
          label: '此段时间消费金额',
          prop: 'inPeriodMoney',
          width: '160px',
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
        startDate: values.date[0],
        endDate: values.date[1]
      }
      this.options.params = payload
      this.searchValue = payload
      this.$refs.classTimeDetail.getList(payload)
    },

    /** 导出 */
    exportFile() {
      const params = {
        ...this.searchValue
      }
      if (this.$refs.classTimeDetail.totalCount > 0) {
        exportFile(`${window.REPORT_URL}/stu/stucard/export`, params)
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
