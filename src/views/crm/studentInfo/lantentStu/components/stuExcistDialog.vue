<template>
  <div class="nameCheckDialog_container">
    <el-dialog
      :visible.sync="nameCheckDialogShow"
      :append-to-body="true"
      title="提示"
      width="400px"
    >
      <div style="margin-bottom:14px;">
        该学员已存在，不可重复添加
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="cancelDialog()"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nameCheckDialogShow: false
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog() {
      this.nameCheckDialogShow = !this.nameCheckDialogShow
    },
    /* 关闭弹框 */
    cancelDialog() {
      this.nameCheckDialogShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

