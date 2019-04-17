<template>
  <div class="arrangeSuccess">
    <el-dialog
      :visible.sync="dialogVisible"
      width="400px"
    >
      <div style="margin-bottom:14px">排课成功！</div>
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
        >继续排课</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      startDate: '',
      endDate: '',
      orgName: ''
    }
  },
  methods: {
    show(start, end, orgName) {
      this.dialogVisible = true
      this.startDate = start
      this.endDate = end
      this.orgName = orgName
    },
    /* 查看 */
    look() {
      this.dialogVisible = false
      this.$emit('toUpdateTable', this.startDate, this.endDate, this.orgName)
    },
    /* 继续排课 */
    continueArrange() {
      this.dialogVisible = false
      this.$emit('toUpdateOrgName')
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
