<template>
  <LoadingPage
    :is-init="isInit"
    :height="'calc(100vh - 88px)'"
  >
    <el-alert
      :closable="false"
      title="此销售工作表反映了销售人员的工作情况，其中试听转化率，可反映机构试听流程规范程度、教师试听课质量等要素"
      type="info"
      show-icon
    />
    <FormSearch
      ref="formSearch"
      v-bind="formSearchProps"
      :loading="loading"
    />
    <Media :query="{minWidth: 1090}">
      <CommonTable
        ref="saleWork"
        :columns="columns"
        :table-height="'calc(100vh - 235px)'"
        :pagination="listQuery"
        :options="options"
      />
    </Media>
    <Media :query="{maxWidth: 1090}">
      <CommonTable
        ref="saleWork"
        :columns="columns"
        :table-height="'calc(100vh - 300px)'"
        :pagination="listQuery"
        :options="options"
        class="form-table"
      />
    </Media>
    <WorkModal />
  </LoadingPage>
</template>

<script>
import Media from 'vue-media'
import moment from 'moment'
import { mapState, mapActions, mapMutations } from 'vuex'
import LoadingPage from '@/components/LoadingPage/LoadingPage'
import FormSearch from '@/components/ReportForm/FormSearch'
import CommonTable from '@/components/CommonTable/CommonTable'
import WorkModal from './WorkModal'
import { getSaleWork } from '@/api/reportForm/saleWork'
import { exportFile } from '@/utils/exportFile'

export default {
  components: {
    LoadingPage,
    FormSearch,
    CommonTable,
    WorkModal,
    Media
  },

  data() {
    const now = moment()

    const params = {
      startDate: now.format('YYYY-MM-DD'),
      endDate: now.format('YYYY-MM-DD')
    }

    return {
      isInit: true,
      formSearchProps: {
        mediaWidth: 1090,
        searchHandle: this.makeForm,
        exportFile: this.exportFile,
        extraForm: [
          {
            type: 'select',
            key: 'inputRoleId',
            clearable: false,
            options: [],
            optionValue: 'id',
            optionLabel: 'name',
            initFirst: true
          }
        ]
      },
      listQuery: {
        show: true // 是否显示
      },
      options: {
        apiService: getSaleWork, // 表格的数据请求接口
        params
      },
      columns: [
        {
          label: '姓名',
          prop: 'userName',
          width: '96px',
          isShowTooltip: true
        }, {
          label: '跟进名单',
          prop: 'followLeadsNum',
          width: '96px'
        }, {
          label: '新增名单',
          prop: 'newLeadsNum',
          width: '96px'
        }, {
          label: '跟进记录',
          prop: 'followRecordsNum',
          width: '96px'
        }, {
          label: '到访预约数',
          prop: 'visitMaa',
          width: '110px',
          formatter: (row, column, cellValue) => {
            return `<a style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${row.visitMaa}</a>`
          },
          methods: (row) => {
            this.showModal(row, '1')
          }
        }, {
          label: '到访实到数',
          prop: 'visitedNum',
          width: '110px',
          formatter: (row, column, cellValue) => {
            return `<a style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${row.visitedNum}</a>`
          },
          methods: (row) => {
            this.showModal(row, '2')
          }
        }, {
          label: '试听预约数',
          prop: 'audition',
          width: '110px',
          formatter: (row, column, cellValue) => {
            return `<a style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${row.audition}</a>`
          },
          methods: (row) => {
            this.showModal(row, '3')
          }
        }, {
          label: '试听实到数',
          prop: 'auditionAttend',
          width: '110px',
          formatter: (row, column, cellValue) => {
            return `<a style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${row.auditionAttend}</a>`
          },
          methods: (row) => {
            this.showModal(row, '4')
          }
        }, {
          label: '试听转为学员数',
          prop: 'auditionCadet',
          width: '180px',
          renderHeader: (h, { column, $index }) => {
            return h('div', { 'class': 'sale-work-header', style: { lineHeight: '23px' }}, [
              h('span', '试听转为学员数'),
              h('el-tooltip', { props: { effect: 'dark', content: '排序值越大排在越前面', placement: 'top' }}, [
                h('i', { 'class': 'el-icon-question', style: { marginLeft: '5px', cursor: 'pointer', color: '#1D9DF2', fontSize: '16px', verticalAlign: 'middle' }})
              ])
            ])
          },
          formatter: (row, column, cellValue) => {
            return `<a style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${row.auditionCadet}</a>`
          },
          methods: (row) => {
            this.showModal(row, '5')
          }
        }, {
          label: '试听转化率',
          prop: 'auditionRate',
          width: '110px'
        }, {
          label: '通话总量',
          prop: 'callTotal',
          width: '96px'
        }, {
          label: '通话接通量',
          prop: 'callConn',
          width: '110px'
        }, {
          label: '通话时长',
          prop: 'callTimeLengthStr',
          width: '96px'
        }
      ]
    }
  },

  computed: {
    ...mapState('saleWork', [
      'searchValue', // 搜索内容
      'saleList' // 销售列表
    ]),
    ...mapState('commonTable', [
      'loading'
    ])
  },

  mounted() {
    this.getSelect({ callback: this.callback })
  },

  methods: {
    ...mapActions('saleWork', [
      'getSaleWork',
      'getSelect',
      'getChannel'
    ]),

    ...mapMutations('saleWork', [
      'UPDATE_STATE'
    ]),

    callback(options) {
      this.formSearchProps.extraForm[0].options = options
      const value = options.length > 0 ? options[0][this.formSearchProps.extraForm[0].optionValue] : undefined
      this.options.params = {
        ...this.options.params,
        [this.formSearchProps.extraForm[0].key]: value
      }
      this.UPDATE_STATE({ searchValue: this.options.params })

      this.isInit = false
    },

    /** 生成报表 */
    makeForm(values, extra) {
      const payload = {
        startDate: values.date[0],
        endDate: values.date[1],
        ...extra
      }

      this.UPDATE_STATE({ searchValue: payload })
      this.options.params = payload

      this.$refs.saleWork.getList(payload)
    },
    /** 导出 */
    exportFile() {
      const params = { ...this.searchValue }
      if (this.$refs.saleWork.tableData && this.$refs.saleWork.tableData.length > 0) {
        exportFile(`${window.REPORT_URL}/crm/statistics/seller/dup/exportSellerJobList`, params)
      } else {
        this.$message.error('暂无数据导出')
      }
    },
    /** 显示弹窗 */
    showModal(row, type) {
      const { startDate, endDate } = this.searchValue

      this.UPDATE_STATE({ modalVisible: true })
      this.getChannel({
        type,
        startDate,
        endDate,
        sellerId: row.userId
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-table {
  margin-top: 20px;
}
</style>

<style lang="scss">
.sale-work-header {
  padding: 0 !important;
}
</style>
