<template>
  <div class="BackHighSeaDialog_container">
    <el-dialog
      :visible.sync="productDialogShow"
      :title="'退回公海' + '（' + stuName + '）'"
      @close="cancelDialog()"
    >
      <div>确定要将此名单退回公海吗</div>
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
import { recycle } from '@/api/crm/studentInfo/lantentStu'
export default {
  components: {

  },
  data() {
    return {
      productDialogShow: false,
      stuName: '',
      rowInfo: {}
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog(val) {
      this.rowInfo = val
      this.stuName = val.name
      this.productDialogShow = !this.productDialogShow
    },
    /* 关闭弹框 */
    cancelDialog() {
      this.productDialogShow = false
    },
    /* 确定提交弹框表单内容 */
    submitForm() {
      const params = {
        stauts: '1',
        stuIds: this.rowInfo.id
      }
      recycle(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.productDialogShow = false
          this.$message.success(data.errorMessage)
          this.$emit('toUpdateTable')
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.BackHighSeaDialog_container /deep/ {
  .el-dialog {
    width: 400px;
  }
}
</style>

