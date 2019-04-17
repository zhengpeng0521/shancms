<template>
  <div class="delReason">
    <el-dialog
      :visible.sync="dialogVisible"
      title="删除排课"
      width="400px"
      @close="cancel"
    >
      <div style="margin-bottom:14px">
        <span>选择原因：</span>
        <el-select
          v-model="reason"
          placeholder="请选择"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancel"
        >取消</el-button>
        <el-button
          type="primary"
          @click="submit"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { deleteArrange } from '@/api/teachManage/arrangeCourse'
export default {
  data() {
    return {
      dialogVisible: false,
      reason: '1',
      options: [
        {
          label: '操作有误',
          value: '1'
        },
        {
          label: '节假日放假',
          value: '2'
        }, {
          label: '老师请假',
          value: '3'
        }, {
          label: '学员调班',
          value: '4'
        }, {
          label: '老师离职',
          value: '6'
        }
      ],
      checkList: [] // 选中删除的信息
    }
  },
  methods: {
    show(val) {
      this.dialogVisible = true
      this.checkList = val
    },
    cancel() {
      this.reason = '1'
      this.dialogVisible = false
    },
    submit() {
      const cpdIdArr = []
      this.checkList.map(item => {
        cpdIdArr.push(item.cpdId)
      })
      const cpdIds = cpdIdArr && cpdIdArr.join(',')
      const params = {
        cpdIds: cpdIds,
        reason: this.reason
      }
      deleteArrange(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$message.success(data.errorMessage)
          this.dialogVisible = false
          this.$emit('toUpdateTable')
        } else {
          this.$message.error(data.errorMessage || '删除排课失败')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
