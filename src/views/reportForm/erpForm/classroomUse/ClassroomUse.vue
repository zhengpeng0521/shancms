<template>
  <div>
    <FormSearch
      ref="formSearch"
      v-bind="formSearchProps"
      :loading="loading"
    />
    <Media :query="{minWidth: 980}">
      <CommonTable
        ref="classroomUse"
        :columns="columns"
        :table-height="'calc(100vh - 182px)'"
        :pagination="listQuery"
        :options="options"
      />
    </Media>
    <Media :query="{maxWidth: 980}">
      <CommonTable
        ref="classroomUse"
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
import { getClassroom } from '@/api/reportForm/classroomUse'
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
        apiService: getClassroom, // 表格的数据请求接口
        params
      },
      columns: [
        {
          label: '教室名称',
          prop: 'roomName',
          width: '150px',
          isShowTooltip: true
        }, {
          label: '排课量',
          prop: 'count',
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
      this.searchValue = payload
      this.options.params = payload
      this.$refs.classroomUse.getList(payload)
    },

    /** 导出 */
    exportFile() {
      const params = {
        ...this.searchValue
      }
      if (this.$refs.classroomUse.totalCount > 0) {
        exportFile(`${window.REPORT_URL}/erp/stats/SQRoom/export`, params)
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
