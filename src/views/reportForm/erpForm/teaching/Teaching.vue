<template>
  <div>
    <FormSearch
      ref="formSearch"
      v-bind="formSearchProps"
      :loading="loading"
    />
    <div class="teaching-box">
      <!-- 授课总节数 -->
      <ChartCard
        v-if="chart === '1'"
        v-bind="teachProps"
        :loading="loading"
        :data-source="teachSource"
      />
      <!-- 教学总人次 -->
      <ChartCard
        v-else-if="chart === '2'"
        v-bind="numProps"
        :loading="loading"
        :data-source="teachSource"
      />
      <!-- 授课课时数 -->
      <ChartCard
        v-else-if="chart === '3'"
        v-bind="timesProps"
        :loading="loading"
        :data-source="teachSource"
      />
      <FormTable
        :loading="loading"
        :data-source="teachTotal"
        :columns="totalCols"
        :has-page="false"
        class="table-top"
      />
      <FormTable
        :loading="loading"
        :data-source="teachList"
        :columns="detailCols"
        :page-count="pageCount"
        :page-change="pageChange"
        class="table-top"
      />
      <DetailModal
        :detail-visible="detailVisible"
        :close-detail="closeDetail"
        :detail-loading="detailLoading"
        :detail-list="detailList"
        :detail-total="detailTotal"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// import Media from 'vue-media'
import { fmtDateFormat } from '@/utils/dateFormat'
import FormSearch from '@/components/ReportForm/FormSearch'
import ChartCard from '@/components/ReportForm/ChartCard'
import FormTable from '@/components/ReportForm/FormTable'
import DetailModal from './DetailModal'
import { exportFile } from '@/utils/exportFile'

export default {
  components: {
    FormSearch,
    ChartCard,
    FormTable,
    DetailModal
  },

  data() {
    return {
      detailVisible: false,
      chart: '1',
      formSearchProps: {
        searchHandle: this.makeForm,
        exportFile: this.exportFile,
        extraForm: [
          {
            type: 'select',
            key: 'sortParam',
            clearable: false,
            initFirst: true,
            options: [
              { value: '1', label: '授课总节数' },
              { value: '2', label: '教学总人次' },
              { value: '3', label: '授课课时数' }
            ]
          }
        ]
      },
      // 授课总节数
      teachProps: {
        title: '授课总节数',
        type: 'histogram',
        legend: false,
        allCols: [
          { key: 'tattend', value: '上课' }
        ],
        showCols: ['title', 'tattend']
      },
      // 教学总人次
      numProps: {
        title: '教学总人次',
        type: 'histogram',
        allCols: [
          { key: 'sattend', value: '上课' },
          { key: 'smakeup', value: '补课' },
          { key: 'taudition', value: '试听' }
        ],
        showCols: ['title', 'sattend', 'smakeup', 'taudition']
      },
      // 授课课时数
      timesProps: {
        title: '授课课时数',
        type: 'histogram',
        legend: false,
        allCols: [
          { key: 'teacherHours', value: '课时数' }
        ],
        showCols: ['title', 'teacherHours']
      },
      // 总计
      totalCols: [
        {
          label: '统计类型',
          prop: 'countType',
          width: '96px'
        }, {
          label: '授课节数',
          children: [
            {
              label: '上课',
              prop: 'tAttend',
              isShowTooltip: true,
              width: '110px'
            }, {
              label: '补课',
              prop: 'tMakeup',
              isShowTooltip: true
            }, {
              label: '试听',
              prop: 'tAudition',
              isShowTooltip: true
            }, {
              label: '合计',
              prop: 'tTotal',
              isShowTooltip: true
            }
          ]
        }, {
          label: '教学人次',
          children: [
            {
              label: '上课',
              prop: 'sAttend',
              isShowTooltip: true,
              width: '110px'
            }, {
              label: '补课',
              prop: 'sMakeup',
              isShowTooltip: true
            }, {
              label: '试听',
              prop: 'sAudition',
              isShowTooltip: true
            }, {
              label: '合计',
              prop: 'sTotal',
              isShowTooltip: true
            }
          ]
        }, {
          label: '授课课时数',
          prop: 'teacherHours',
          width: '96px'
        }
      ],
      // 授课列表
      detailCols: [
        {
          label: '姓名',
          prop: 'name',
          width: '96px',
          methods: this.openDetail
        }, {
          label: '授课节数',
          children: [
            {
              label: '上课',
              prop: 'tattend',
              isShowTooltip: true,
              width: '110px'
            }, {
              label: '补课',
              prop: 'tmakeup',
              isShowTooltip: true
            }, {
              label: '试听',
              prop: 'taudition',
              isShowTooltip: true
            }, {
              label: '合计',
              prop: 'ttotal',
              isShowTooltip: true
            }
          ]
        }, {
          label: '教学人次',
          children: [
            {
              label: '上课',
              prop: 'sattend',
              isShowTooltip: true,
              width: '110px'
            }, {
              label: '补课',
              prop: 'smakeup',
              isShowTooltip: true
            }, {
              label: '试听',
              prop: 'saudition',
              isShowTooltip: true
            }, {
              label: '合计',
              prop: 'stotal',
              isShowTooltip: true
            }
          ]
        }, {
          label: '授课课时数',
          prop: 'teachHours',
          width: '96px'
        }
      ]
    }
  },

  computed: {
    ...mapState('teaching', [
      'loading',
      'searchValue',
      'teachSource',
      'teachTotal',
      'teachList',
      'pageCount',
      'detailLoading',
      'detailList',
      'detailTotal'
    ])
  },

  mounted() {
    const payload = {
      startDate: fmtDateFormat(this.$refs.formSearch.formSearch.date[0], 'yyyy-MM-dd'),
      endDate: fmtDateFormat(this.$refs.formSearch.formSearch.date[1], 'yyyy-MM-dd'),
      sortParam: '1'
    }
    this.getTeachingList(payload)
  },

  methods: {
    ...mapActions('teaching', [
      'getTeachingList',
      'getTachingDetail'
    ]),

    /** 生成报表 */
    makeForm(values, extra) {
      this.chart = extra.sortParam
      const payload = {
        startDate: values.date[0],
        endDate: values.date[1],
        pageIndex: 0,
        ...extra
      }

      this.getTeachingList(payload)
    },

    /** 分页 */
    pageChange(pageIndex) {
      const payload = {
        ...this.searchValue,
        pageIndex
      }

      this.getTeachingList(payload)
    },

    /** 导出 */
    exportFile(type) {
      const params = {
        endDate: this.searchValue.endDate,
        sortParam: this.searchValue.sortParam,
        startDate: this.searchValue.startDate,
        flag: 'detail'
      }
      exportFile(`${window.REPORT_URL}/cerp/stuClass/exportExcelDetail`, params)
    },

    // 打开详情
    openDetail(row) {
      this.detailVisible = true
      this.getTachingDetail({
        ...this.searchValue,
        inputUid: row.uid,
        pageSize: 99999,
        pageIndex: 0
      })
    },

    // 关闭详情
    closeDetail() {
      this.detailVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.table-top {
  margin-top: 20px;
}
.teaching-box {
  max-height: calc(100vh - 150px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 10px;
  margin-right: -10px;
}
</style>
