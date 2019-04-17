<template>
  <div>
    <CommonTable
      ref="commonTable"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :operation="operates"
      :data-source="classTableData"
    />
  </div>
</template>
<script>
import CommonTable from '@/components/CommonTable/CommonTable'
import { isCheckUpdate, stuSign } from '@/api/teachManage/orderCourse'
export default {
  components: {
    CommonTable

  },
  props: {
    classTableData: {
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
        }, {
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
        }, {
          label: '回访确认',
          prop: 'is_check',
          formatter: (row) => {
            if (row.is_check === '1') {
              return `<div style="background-image:url(https://img.ishanshan.com/gimg/img/f1e3ebaa34addae8cbf77eb9203d42da);width:13px;height:13px;background-repeat:no-repeat"></div>`
            }
          }
        }
      ],
      tableHeight: 'calc(100vh - 308px)',
      listQuery: {
        show: false
      },
      operates: {
        width: '250',
        fixed: 'right',
        list: [
          {
            label: '取消',
            method: (row) => {
              this.cancelOrderCourse(row)
            }
          },
          {
            label: '请假',
            type: 'singleCancel',
            method: (row) => {
              this.askForLeave(row)
            },
            prop: 'sign_type',
            popoverCon: [
              {
                contentText: '确认要请假么？',
                status: '1'
              }
            ]
          },
          {
            label: '回访确认',
            type: 'singleCancel',
            method: (row) => {
              this.returnConfirm(row)
            },
            prop: 'is_check',
            popoverCon: [
              {
                contentText: '确认要回访确认么？',
                status: '0'
              }
            ]
          }
        ]
      }
    }
  },
  methods: {
    /* 取消 */
    cancelOrderCourse(row) {
      this.$emit('toParent', row, this.detailList)
    },
    /* 请假 */
    askForLeave(row) {
      const params = {
        cpStuId: row.id,
        signType: '4'
      }
      stuSign(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.dialogVisible = false
          this.$message.success(data.errorMessage)
          this.$emit('toleaveUpdate')
        } else {
          this.$message.error(data.errorMessage || '失败')
        }
      })
    },
    /* 回访确认 */
    returnConfirm(row) {
      const params = {
        cpStuId: row.id
      }
      isCheckUpdate(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$message.success(data.errorMessage)
          this.$emit('toReturnUpdate', this.detailList)
        } else {
          this.$message.error(data.errorMessage || '修改失败')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
