<template>
  <div class="arrangeSuccess">
    <el-dialog
      :visible.sync="dialogVisible"
      width="400px"
    >
      <div style="margin-bottom:14px">约课成功！</div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="look"
        >查看</el-button>
        <el-button
          type="primary"
          @click="continueArrange"
        >继续约课</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    show() {
      this.dialogVisible = true
    },
    /* 继续排课 */
    continueArrange() {
      this.dialogVisible = false
      this.$emit('toUpdateForm', false)
    },
    /* 查看 */
    look() {
      this.dialogVisible = false
      this.$emit('toUpdateTable')
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
