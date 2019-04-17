<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="再次确认"
    width="600px"
  >
    <div style="margin-bottom:14px">该班级内仍然存在学员，是否继续删除班级？</div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        class="cancel_btn"
        @click="dialogVisible = false"
      >取消</el-button>
      <el-button
        type="primary"
        @click="submitForm"
      >继续</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { deleteClass } from '@/api/nurseryClass/gradeManage'
export default {
  data() {
    return {
      dialogVisible: false,
      rowInfo: {}
    }
  },
  methods: {
    show(list) {
      this.rowInfo = list
      this.dialogVisible = true
    },
    submitForm() {
      deleteClass({ id: this.rowInfo.id }).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.dialogVisible = false
          this.$emit('toUpdateTable')
          this.$message.success(data.errorMessage)
        } else {
          this.$message.error(data.errorMessage || '删除班级失败')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
