<template>
  <div class="BackHighSeaDialog_container">
    <el-dialog
      :visible.sync="productDialogShow"
      :title="'放入回收站' + '（' + stuName + '）'"
      @close="cancelDialog()"
    >
      <div>确定要将此名单放入回收站吗</div>
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
import { recycle } from '@/api/crm/studentInfo/highSeas'

export default {
  components: {

  },
  data() {
    return {
      productDialogShow: false,
      stuName: '',
      stuId: ''
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog(val) {
      this.stuId = val.id
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
        stauts: '3',
        stuIds: this.stuId
      }
      recycle(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$message.success(data.errorMessage)
          this.productDialogShow = false
          this.$emit('toUpdateTable')
          this.$emit('toCloseSidePage')
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

