<template>
  <el-dialog
    :visible.sync="findDialogShow"
    :close-on-click-modal="false"
    title="继续约课"
    width="400px"
  >
    <div style="margin-bottom:14px;">{{ errorMessage }}</div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        class="cancel_btn"
        @click="findDialogShow = false"
      >取消</el-button>
      <el-button
        type="primary"
        @click="submitFindForm()"
      >继续约课</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      findDialogShow: false, // 弹窗显示
      errorMessage: ''
    }
  },
  methods: {
    show(errorMessage) {
      this.errorMessage = errorMessage
      this.findDialogShow = true
    },
    /* 继续约课 */
    submitFindForm() {
      this.findDialogShow = false
      this.$emit('toContinueOrder')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
