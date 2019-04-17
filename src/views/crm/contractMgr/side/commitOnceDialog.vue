<template>
  <div class="commitOnceDialog_container">
    <el-dialog
      :visible.sync="commitOnceDialogShow"
      title="再次提交"
      @close="cancelDialog()"
    >
      <div>
        请确保合同已修改，再次提交合同会重新处于待审核状态，是否继续？
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog()"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm()"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { resubmit } from '@/api/crm/contract/contract.js'
export default {
  data() {
    return {
      commitOnceDialogShow: false,
      rowListData: {
        orederNumber: ''
      }
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog(rowlist) {
      this.rowListData.orederNumber = rowlist.orderNumber
      this.commitOnceDialogShow = !this.commitOnceDialogShow
    },
    /* 关闭弹框 */
    cancelDialog() {
      this.commitOnceDialogShow = false
    },
    /* 确定提交弹框表单内容 */
    submitForm() {
      const params = {
        purchaseId: this.rowListData.orederNumber
      }
      resubmit(params).then(res => {
        if (res.data.errorCode === 0) {
          this.commitOnceDialogShow = false
          this.$message.success(res.data.errorMessage)
          this.$emit('toContractSide')
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.commitOnceDialog_container /deep/ {
  .el-dialog {
    width: 400px;
  }
}
</style>

