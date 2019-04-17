<template>
  <div class="arrangeSuccess">
    <el-dialog
      :visible.sync="dialogVisible"
      width="400px"
    >
      <div style="margin-bottom:14px">{{ stuNames }}可用课时不足，是否继续？</div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="look"
        >取消</el-button>
        <el-button
          type="primary"
          @click="continueArrange"
        >提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      stuNames: '', // 学员姓名
      time: '',
      mainTeacherIds: '',
      assistanTeacherIds: '',
      start: '',
      end: '',
      list: []
    }
  },
  methods: {
    show(stuNames, mainTeacherIds, assistanTeacherIds, start, end, list, time) {
      this.dialogVisible = true
      this.stuNames = stuNames
      this.time = time
      this.mainTeacherIds = mainTeacherIds
      this.assistanTeacherIds = assistanTeacherIds
      this.start = start
      this.end = end
      this.list = list
    },
    /* 取消 */
    look() {
      this.dialogVisible = false
    },
    /* 继续排课 */
    continueArrange() {
      this.dialogVisible = false
      this.$emit('toCreateArrage', this.mainTeacherIds, this.assistanTeacherIds, this.start, this.end, this.list, this.time)
    }
  }
}
</script>
<style lang="scss" scoped>
.arrangeSuccess /deep/ {
  .el-dialog__header {
    display: none;
  }
}
</style>
