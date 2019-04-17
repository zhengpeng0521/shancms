<template>
  <div class="tip">
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :show-close="false"
      width="400px"
    >
      <div style="height:24px;line-height:24px">
        <i
          class="el-icon-success"
          style="color:#00a854;font-size:24px;margin-right:16px;padding:0 1px;float:left"
        />
        <div>提示</div>
      </div>
      <div style="margin:8px 0 14px 42px;">学员[{{ stuName }}]{{ status }}成功!</div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogVisible = false"
        >知道了
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      stuName: '',
      status: ''
    }
  },
  methods: {
    show(name, status) {
      this.dialogVisible = true
      this.stuName = name
      if (status === '1') {
        this.status = '签到'
      } else if (status === '2') {
        this.status = '签退'
      } else if (status === '3') {
        this.status = '请假'
      } else if (status === '4') {
        this.status = '撤销签到'
      } else if (status === '5') {
        this.status = '撤销签退'
      } else if (status === '6') {
        this.status = '撤销请假'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.tip /deep/ {
  .el-dialog__header {
    display: none;
  }
}
</style>
