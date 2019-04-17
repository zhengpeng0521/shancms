
<template>
  <div class="sms_log">
    <div class="page_title_text">
      短信记录
    </div>
    <CommonSearch
      :is-inline="true"
      :params="formInline"
      :forms="formInline"
      @toParent="resetFieldHanle"
    />

    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="optionsTab"
      table-key="orgSettings_smsLog_smsLog"
    />

  </div>
</template>

<script>

// import { fetchList } from '@/api/course'
import { getSendHistory } from '@/api/orgSet/smsLog'
import CommonTable from '@/components/CommonTable/CommonTable'
import CommonSearch from '@/components/CommonSearch/CommonSearch'

export default {
  components: {
    CommonSearch,
    CommonTable
  },
  data() {
    return {

      listQuery: {
        show: true // 是否显示
      },
      columns: [

        {
          label: '接收人手机号',
          prop: 'recepMobile',

          formatter: (row, column, cellValue) => {
            return `<div style="color:#1D9DF2;text-overflow:ellipsis;overflow:hidden">${row.recepMobile}</div>`
          }
        },
        {
          label: '姓名',
          prop: 'recepName'
        },
        {
          label: '短信内容',
          prop: 'content',
          width: '140px',
          render: (h, params) => {
            return h('span', { class: 'sms_content' }, [
              h('el-popover', {
                props: { placement: 'top', width: '400', trigger: 'hover', content: params.row.content }
              }, [
                h('a', { slot: 'reference' }, params.row.content)
              ])
            ])
          }
        },

        {
          label: '发送时间',
          prop: 'createTime',
          render: (h, params) => {
            return h('span', {}, [
              h('el-popover', {
                props: { placement: 'top', trigger: 'hover', content: params.row.createTime }
              }, [
                h('a', { slot: 'reference' }, params.row.createTime)
              ])
            ])
          }
        },
        {
          label: '校区',
          prop: 'orgName',
          isColShow: false
        }

      ],
      optionsTab: {
        apiService: getSendHistory, // 表格的数据请求接口
        isSettingShow: true // 是否出现设置
      },

      tableHeight: 'calc(100vh - 225px)',
      formInline: {
        searchMethod: (formValue) => {
          this.searchHandle(formValue)
        },
        forms: [
          {
            itemType: 'input',
            placeholder: '手机号',
            modelValue: 'mobile',
            isClearable: true
          },
          {
            itemType: 'datePicker',
            datePickerType: 'daterange',
            rangeSeparator: '~',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            valueFormat: 'yyyy-MM-dd',
            modelValue: 'date'
          }

        ]
      }

    }
  },

  methods: {

    searchHandle(formValue) {
      // 搜索的入参
      console.log('搜索的入参', formValue)

      const params = {
        mobile: formValue.mobile

      }
      if (formValue.date) {
        params.startTime = formValue.date[0]
        params.endTime = formValue.date[1]
      }
      console.log('parames-----', params)
      this.$refs.tableCommon.getList(params)
    },
    /* 搜索重置 */
    resetFieldHanle(formName) {
      // 重置的入参
      const params = {
        pageIndex: 0
      }
      this.$refs.tableCommon.getList(params)
    }

  }
}
</script>

<style lang="scss" scoped>
.sms_log /deep/ {
  padding: 20px;
  .sms_content {
    flex-wrap: wrap;
    line-height: 20px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
}
.sms_log /deep/ {
  .el-table .cell {
    height: 60px;
  }
  .el-table th > .cell {
    height: 44px;
  }
}
</style>
