<template>
  <div class="achivement-container">
    <el-alert
      :closable="false"
      type="info"
      title="此销售业绩表从不同维度反映了近期机构的获客及经营情况，可据此了解机构销售指标的完成情况。"
      description="最下方为员工的业绩详情"
      show-icon
    />
    <FormSearch
      ref="formSearch"
      v-bind="formSearchProps"
      :loading="loading"
    />
    <media :query="{maxWidth: 1130}">
      <AchivementContent
        :loading="loading"
        :chart-list="chartList"
        :total="total"
        :table-list="tableList"
        :export-file="exportFile"
        :page-count="pageCount"
        size="small"
      />
    </media>
    <media :query="{minWidth: 1130}">
      <AchivementContent
        :loading="loading"
        :chart-list="chartList"
        :total="total"
        :table-list="tableList"
        :export-file="exportFile"
        :page-count="pageCount"
        :page-change="pageChange"
        size="large"
      />
    </media>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Media from 'vue-media'
import FormSearch from '@/components/ReportForm/FormSearch'
import AchivementContent from './AchivementContent'
import { fmtDateFormat } from '@/utils/dateFormat'
import { exportFile } from '@/utils/exportFile'

export default {
  components: {
    FormSearch,
    AchivementContent,
    Media
  },

  data() {
    return {
      formSearchProps: {
        searchHandle: this.makeForm,
        extraForm: [
          {
            type: 'select',
            key: 'sortParam',
            clearable: false,
            initFirst: true,
            options: [
              { value: '1', label: '合同合计数' },
              { value: '2', label: '合同合计金额' },
              { value: '3', label: '合同合计占比金额' }
            ]
          }, {
            type: 'select',
            key: 'inputRoleId',
            options: [],
            optionValue: 'id',
            optionLabel: 'name',
            isAsync: true,
            url: `${window.SYS_URL}/sysBase/role/tenantRoleQuery`,
            asyncParams: { appCode: 'ss' }
          }
        ]
      }
    }
  },

  computed: {
    ...mapState('saleAchivement', [
      'loading',
      'searchValue', // 搜索内容
      'chartList',
      'total',
      'tableList',
      'pageCount'
    ])
  },

  mounted() {
    const payload = {
      startDate: fmtDateFormat(this.$refs.formSearch.formSearch.date[0], 'yyyy-MM-dd'),
      endDate: fmtDateFormat(this.$refs.formSearch.formSearch.date[1], 'yyyy-MM-dd'),
      sortParam: '1'
    }
    this.getAchivementList(payload)
  },

  methods: {
    ...mapActions('saleAchivement', [
      'getAchivementList'
    ]),

    /** 生成报表 */
    makeForm(values, extra) {
      const payload = {
        startDate: values.date[0],
        endDate: values.date[1],
        pageIndex: 0,
        ...extra
      }
      this.getAchivementList(payload)
    },

    /** 分页 */
    pageChange(pageIndex) {
      const payload = {
        ...this.searchValue,
        pageIndex
      }
      this.getAchivementList(payload)
    },

    /** 导出 */
    exportFile(type) {
      const params = { ...this.searchValue }
      delete params.pageIndex
      if (type === 'stu') {
        if (this.chartList.length > 0) {
          params.exportType = '1'
          exportFile(`${window.REPORT_URL}/crm/statistics/seller/dup/exportSellerBrokenForCourse`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      } else if (type === 'sale') {
        if (this.chartList.length > 0) {
          params.exportType = '2'
          exportFile(`${window.REPORT_URL}/crm/statistics/seller/dup/exportSellerBrokenForCourse`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      } else {
        if (this.tableList.length > 0) {
          exportFile(`${window.REPORT_URL}/crm/statistics/seller/dup/exportSellerPerforList`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      }
    }
  }
}
</script>
<style lang="scss">
.el-alert__title.is-bold {
  font-weight: normal;
}
.el-alert--info .el-alert__description {
  color: #666;
}
</style>

<style lang="scss" scoped>
.achivement-container /deep/ {
  .el-alert__icon.is-big {
    font-size: 16px;
    width: 16px;
    margin-top: -18px;
  }
}
</style>
