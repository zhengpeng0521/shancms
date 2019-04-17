<template>
  <div>
    <CommonTable
      ref="commonTable"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :operation="operates"
      :data-source="tryTableData"
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
    tryTableData: {
      type: Array,
      default() {
        return []
      }
    },
    detailList: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      columns: [
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
          label: '备注',
          prop: 'remark'
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
          label: '性别',
          prop: 'sex',
          formatter: (row) => {
            if (row.sex === '1') {
              return `<div>男</div>`
            } else {
              return `<div>女</div>`
            }
          }
        }, {
          label: '状态',
          prop: 'sign_type',
          formatter: (row) => {
            if (row.sign_type === '0') {
              return `<div>已取消</div>`
            } else if (row.sign_type === '1') {
              return `<div>已预约</div>`
            } else if (row.sign_type === '2') {
              return `<div>已试听</div>`
            } else if (row.sign_type === '3') {
              return `<div>旷课</div>`
            }
          }
        }
      ],
      tableHeight: 'calc(100vh - 308px)',
      listQuery: {
        show: false
      },
      operates: {
        width: '100',
        fixed: 'right',
        list: [
          {
            label: '取消',
            method: (row) => {
              this.cancel(row)
            }
          }
        ]
      }
    }
  },
  methods: {
    /* 取消 */
    cancel(row) {
      this.$emit('toParent', row, this.detailList)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
