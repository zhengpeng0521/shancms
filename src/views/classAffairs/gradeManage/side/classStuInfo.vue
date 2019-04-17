<template>
  <CommonTable
    ref="commonTable"
    :columns="columns"
    :table-height="tableHeight"
    :pagination="listQuery"
    :options="options"
    :operation="operates"
    :data-source="stuTableData"
  />
</template>
<script>
import { addStudent } from '@/api/nurseryClass/gradeManage'
import CommonTable from '@/components/CommonTable/CommonTable'
export default {
  components: {
    CommonTable
  },
  props: {
    stuTableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    rowInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      columns: [
        {
          label: '学生姓名',
          prop: 'name'
        },
        {
          label: '昵称',
          prop: 'nickname'
        },
        {
          label: '性别',
          prop: 'sex',
          formatter: (row, column, cellValue) => {
            if (row.sex == '1') { //eslint-disable-line
              return `<div>男</div>`
            } else {
              return `<div>女</div>`
            }
          }
        },
        {
          label: '生日',
          prop: 'birthday'
        },
        {
          label: '负责销售',
          prop: 'sellerName'
        },
        {
          label: '负责老师',
          prop: 'counselorName'
        }
      ],
      tableHeight: 'calc(100vh - 332px)',
      listQuery: {
        show: true,
        sizes: true
      },
      options: {
        // apiService: clsDetailStuInfo,
        // params : {
        //   id:
        // }
      },
      operates: {
        width: '150',
        fixed: 'right',
        list: [
          {
            label: '移除',
            type: 'normal',
            method: (row) => {
              this.deleteHandle(row)
            },
            popoverCon: [
              {
                contentText: '确认移除学员？'
              }
            ]
          }
        ]
      }
    }
  },
  methods: {
    /* 移除 */
    deleteHandle(row) {
      const params = {
        clsId: this.rowInfo.id,
        stuIds: row.id,
        add: '2'
      }
      addStudent(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.dialogVisible = false
          this.$message.success(data.errorMessage)
          this.$emit('toUpdateStuList', this.rowInfo)
        } else if (data.errorCode === 110603) {
          this.$refs.addError.show(data)
        } else {
          this.$message.error(data.errorMessage || '添加学员失败')
        }
      })
    }
  }
}
</script>
