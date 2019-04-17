<template>
  <div class="coursewareOverdue">
    <el-dialog
      :visible.sync="dialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      width="300px"
    >
      <div style="text-align:center;margin-bottom:14px;padding-top:10px">
        当前课件已过期，无法查看！
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >我知道了</el-button>
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
    }
  }
}
</script>
<style lang="scss" scoped>
.coursewareOverdue /deep/ {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__footer {
    text-align: center;
    border-top: 0;
  }
}
</style>
