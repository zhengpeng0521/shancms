<template>
  <div class="deleteCourse">
    <el-dialog
      :visible.sync="newdialogVisible"
      title="删除确认"
      width="400px"
    >
      <div style="margin-bottom:14px">确定删除此课程吗</div>
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
import { statusUpdateCourse } from '@/api/teachManage/course'
export default {
  data() {
    return {
      newdialogVisible: false, // 新增课程显示
      info: {}
    }
  },
  methods: {
    show(val) {
      this.info = val
      this.newdialogVisible = true
    },
    cancel(formName) {
      this.newdialogVisible = false
    },
    sure(formName) {
      const params = {
        ids: this.info.id,
        status: '0'
      }
      statusUpdateCourse(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$message.success(data.errorMessage)
          this.newdialogVisible = false
          this.$emit('toDeleteSure')
        } else {
          this.$message.error(data.errorMessage || '删除课程失败')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
