<template>
  <div>
    <CommonTable
      ref="commonTable"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :data-source="mulTableData"
    />
  </div>
</template>
<script>
import CommonTable from '@/components/CommonTable/CommonTable'
export default {
  components: {
    CommonTable
  },
  props: {
    mulTableData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      columns: [
        {
          label: '状态',
          prop: 'sign_type',
          formatter: (row) => {
            if (row.sign_type === '1') {
              return `<div>预约</div>`
            } else if (row.sign_type === '2') {
              return `<div>排队</div>`
            } else if (row.sign_type === '3') {
              return `<div>出勤</div>`
            } else if (row.sign_type === '4') {
              return `<div>请假</div>`
            } else if (row.sign_type === '5') {
              return `<div>旷课</div>`
            } else if (row.sign_type === '6') {
              return `<div>取消</div>`
            }
          }
        },
        {
          label: '学员姓名',
          prop: 'name'
        }, {
          label: '昵称',
          prop: 'nickname'
        }, {
          label: '出生日期',
          prop: 'birthday',
          width: '120'
        }, {
          label: '联系方式',
          prop: 'mobile',
          width: '120'
        }, {
          label: '月龄',
          prop: 'monthAge'
        }, {
          label: '年龄',
          prop: 'yearAge'
        }, {
          label: '负责销售',
          prop: 'sellerName'
        }, {
          label: '负责顾问',
          prop: 'counselorName'
        }, {
          label: '剩余课时',
          prop: 'periodLeft'
        }, {
          label: '固定位',
          prop: 'fix',
          formatter: (row) => {
            if (row.fix === '1') {
              return `<div>是</div>`
            } else {
              return `<div>否</div>`
            }
          }
        }
      ],
      tableHeight: 'calc(100vh - 308px)',
      listQuery: {
        show: false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
