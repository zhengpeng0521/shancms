<template>
  <div class="arrangeSuccess">
    <el-dialog
      :visible.sync="dialogVisible"
      width="400px"
    >
      <div style="margin-bottom:14px">{{ time }}为休息日，还要继续排课吗？</div>
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
        >继续</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      time: '',
      mainTeacherIds: '',
      assistanTeacherIds: '',
      start: '',
      end: '',
      list: [],
      type: ''
    }
  },
  methods: {
    show(mainTeacherIds, assistanTeacherIds, start, end, list, time, type) {
      this.dialogVisible = true
      this.time = time
      this.mainTeacherIds = mainTeacherIds
      this.assistanTeacherIds = assistanTeacherIds
      this.start = start
      this.end = end
      this.list = list
      this.type = type
    },
    /* 取消 */
    look() {
      this.dialogVisible = false
    },
    /* 继续排课 */
    continueArrange() {
      this.dialogVisible = false
      this.$emit('toCreateArrage', this.mainTeacherIds, this.assistanTeacherIds, this.start, this.end, this.list, this.type)
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
