<template>
  <div>
    <CommonTable
      ref="commonTable"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :operation="operates"
      :data-source="lineTableData"
    />
  </div>
</template>
<script>
import CommonTable from '@/components/CommonTable/CommonTable'
import { inlineChange } from '@/api/teachManage/orderCourse'
export default {
  components: {
    CommonTable
  },
  props: {
    lineTableData: {
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
          prop: 'name',
          isShowTooltip: true
        }, {
          label: '昵称',
          prop: 'nickname',
          isShowTooltip: true
        }, {
          label: '出生日期',
          prop: 'birthday',
          width: '120',
          isShowTooltip: true
        }, {
          label: '联系方式',
          prop: 'mobile',
          width: '120',
          isShowTooltip: true
        }, {
          label: '月龄',
          prop: 'monthAge',
          isShowTooltip: true
        }, {
          label: '年龄',
          prop: 'yearAge',
          isShowTooltip: true
        }, {
          label: '负责销售',
          prop: 'sellerName',
          isShowTooltip: true
        }, {
          label: '负责顾问',
          prop: 'counselorName',
          isShowTooltip: true
        }, {
          label: '剩余课时',
          prop: 'periodLeft',
          isShowTooltip: true
        }, {
          label: '固定位',
          prop: 'fix',
          isShowTooltip: true,
          formatter: (row) => {
            if (row.fix === '1') {
              return `<div>是</div>`
            } else {
              return `<div>否</div>`
            }
          }
        }, {
          label: '状态',
          prop: 'sign_type',
          isShowTooltip: true,
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
        }
      ],
      tableHeight: 'calc(100vh - 308px)',
      listQuery: {
        show: false
      },
      operates: {
        width: '200',
        fixed: 'right',
        list: [
          {
            label: '取消',
            method: (row) => {
              this.cancel(row)
            }
          },
          {
            label: '转为上课学员',
            type: 'normal',
            method: (row) => {
              this.deleteHandle(row)
            },
            popoverCon: [
              {
                contentText: '确认要转为上课学员么'
              }
            ]
          }
        ]
      }
    }
  },
  methods: {
    /* 取消 */
    cancel(row) {
      this.$emit('toParent', row, this.detailList)
    },
    deleteHandle(row) {
      const params = {
        cpStuId: row.id
      }
      inlineChange(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$message.success(data.errorMessage)
          this.$emit('toInlineUpdate', this.detailList)
        } else {
          this.$message.error(data.errorMessage || '转为上课学员失败')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
