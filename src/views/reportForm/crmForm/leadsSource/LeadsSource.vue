<template>
  <div>
    <el-alert
      :closable="false"
      title="此名单来源表反映了机构名单的收集情况，机构可根据此表调整名单收集的方式和地点"
      type="info"
      show-icon
    />
    <FormSearch
      v-bind="formSearchProps"
      :loading="loading"
    />
    <div class="chart-content">
      <media :query="{minWidth: 1200}">
        <el-row :gutter="20">
          <el-col :span="12">
            <ChartCard
              v-bind="firstProps"
              :loading="loading"
              :data-source="firstSource"
              :all-cols="firstCols"
            />
          </el-col>
          <el-col :span="12">
            <ChartCard
              v-bind="secProps"
              :loading="loading"
              :data-source="secSource"
              :all-cols="secCols"
            />
          </el-col>
        </el-row>
      </media>
      <media :query="{maxWidth: 1200}">
        <div>
          <ChartCard
            v-bind="firstProps"
            :loading="loading"
            :data-source="firstSource"
            :all-cols="firstCols"
          />
          <ChartCard
            v-bind="secProps"
            :loading="loading"
            :data-source="secSource"
            :all-cols="secCols"
            class="second-chart"
          />
        </div>
      </media>
      <SpecialTable
        :loading="loading"
        :first-source="firstSource"
        :sec-source="secSource"
        :total-source="totalSource"
      />
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Media from 'vue-media'
import FormSearch from '@/components/ReportForm/FormSearch'
import ChartCard from '@/components/ReportForm/ChartCard'
import SpecialTable from './SpecialTable'
import { fmtDateFormat } from '@/utils/dateFormat'
import { exportFile } from '@/utils/exportFile'

export default {
  components: {
    FormSearch,
    ChartCard,
    SpecialTable,
    Media
  },

  data() {
    return {
      formSearchProps: {
        searchHandle: this.makeForm
      },
      firstProps: {
        title: '一级来源',
        type: 'pie',
        exportFile: this.exportFile.bind(this, 'first'),
        showCols: ['sourceName', 'sourceNum']
      },
      secProps: {
        title: '二级来源',
        type: 'pie',
        exportFile: this.exportFile.bind(this, 'second'),
        showCols: ['sourceName', 'sourceNum']
      }
    }
  },

  computed: {
    ...mapState('leadsSource', [
      'loading',
      'searchValue',
      'firstSource',
      'firstCols',
      'secSource',
      'secCols',
      'totalSource'
    ])
  },

  created() {
    const now = new Date()
    const payload = {
      startDate: fmtDateFormat(now, 'yyyy-MM-dd'),
      endDate: fmtDateFormat(now, 'yyyy-MM-dd')
    }
    this.getLeadsData(payload)
  },

  methods: {
    ...mapActions('leadsSource', [
      'getLeadsData'
    ]),

    /** 生成报表 */
    makeForm(values, extra) {
      const payload = {
        startDate: values.date[0],
        endDate: values.date[1]
      }
      this.getLeadsData(payload)
    },
    /** 导出 */
    exportFile(type) {
      const params = { ...this.searchValue }
      if (type === 'first') {
        if (this.firstSource.length > 0) {
          params.type = '1'
          exportFile(`${window.REPORT_URL}/crm/statistics/exportLeadsSource`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      } else {
        if (this.secSource.length > 0) {
          params.type = '2'
          exportFile(`${window.REPORT_URL}/crm/statistics/exportLeadsSource`, params)
        } else {
          this.$message.error('暂无数据导出')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.second-chart {
  margin-top: 20px;
}
</style>

<style lang="scss">
.chart-content {
  max-height: calc(100vh - 200px);
  overflow: auto;
  padding-right: 10px;
  margin-right: -10px;
}
</style>
