<template>
  <div class="deleteCourse">
    <el-dialog
      :visible.sync="newdialogVisible"
      title="删除班级"
      width="400px"
    >
      <div style="margin-bottom:14px">确定删除此班级么？</div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancel('ruleForm')"
        >取消</el-button>
        <el-button
          type="primary"
          @click="sure('ruleForm')"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { deleteClassGrade } from '@/api/teachManage/grade'
export default {
  data() {
    return {
      newdialogVisible: false, // 新增课程显示
      rowInfo: {}
    }
  },
  methods: {
    show(val) {
      this.newdialogVisible = true
      this.rowInfo = val
    },
    cancel(formName) {
      this.newdialogVisible = false
    },
    sure() {
      const params = {
        clsId: this.rowInfo.clsId
      }
      deleteClassGrade(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.newdialogVisible = false
          this.$message.success(data.errorMessage)
          this.$emit('toDeleteGrade')
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
