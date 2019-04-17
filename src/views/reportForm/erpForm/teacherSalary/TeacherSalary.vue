<template>
  <div>
    <FormSearch
      ref="formSearch"
      v-bind="formSearchProps"
      :loading="loading"
    />
    <Media :query="{minWidth: 980}">
      <CommonTable
        ref="teacherSalary"
        :columns="columns"
        :table-height="'calc(100vh - 182px)'"
        :pagination="listQuery"
        :options="options"
      />
    </Media>
    <Media :query="{maxWidth: 980}">
      <CommonTable
        ref="teacherSalary"
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
import { getSalary } from '@/api/reportForm/teacherSalary'
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
        apiService: getSalary, // 表格的数据请求接口
        params
      },
      columns: [
        {
          label: '姓名',
          prop: 'uname',
          width: '150px',
          isShowTooltip: true
        }, {
          label: '授课总节数',
          prop: 'teachTime',
          width: '150px',
          isShowTooltip: true
        }, {
          label: '授课总人次',
          prop: 'teachNum',
          width: '150px',
          isShowTooltip: true
        }, {
          label: '消课总金额',
          prop: 'costMoney',
          width: '150px',
          isShowTooltip: true
        }, {
          label: '基本工资',
          prop: 'baseSalary',
          width: '150px',
          isShowTooltip: true
        }, {
          label: '补贴',
          prop: 'subsidy',
          width: '150px',
          isShowTooltip: true
        }, {
          label: '提成',
          prop: 'royalty',
          width: '150px',
          isShowTooltip: true,
          render: (h, params) => {
            if (!!params.row.courseList && params.row.courseList.length > 0) {
              const prefix = `${params.row.royalty}元 = `
              const content = []
              params.row.courseList.map((item, index) => {
                content.push(`${item.courseName}${item.time}${item.desc}*${item.money}`)
              })
              const renderContent = prefix + content.join(' + ')

              return h('span', {}, [
                h('el-popover', {
                  props: {
                    placement: 'top',
                    width: '260',
                    trigger: 'hover',
                    popperClass: 'teacher-salary-pop',
                    content: renderContent
                  }
                }, [
                  h('a',
                    { slot: 'reference' }, params.row.royalty)
                ])
              ])
            } else {
              return h('span', {}, params.row.royalty)
            }
          }
        }, {
          label: '工资金额',
          prop: 'salary',
          width: '150px',
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
      this.$refs.teacherSalary.getList(payload)
    },

    /** 导出 */
    exportFile() {
      const params = {
        ...this.searchValue
      }
      if (this.$refs.teacherSalary.totalCount > 0) {
        exportFile(`${window.REPORT_URL}/crm/salary/export`, params)
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
<style lang="scss">
.teacher-salary-pop {
  text-align: center;
}
</style>
