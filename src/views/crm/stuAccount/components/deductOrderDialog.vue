<template>
  <div class="deductOrderDialog_container">
    <!-- 扣课顺序弹框 -->
    <el-dialog
      :visible.sync="deductDialogShow"
      :append-to-body="true"
      title="扣课顺序"
      @close="cancelDialog('deductForm')"
    >
      <el-form
        ref="deductForm"
        :model="deductData"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item
          label="扣课顺序:"
          prop="order"
        >
          <el-input
            v-model="deductData.order"
            clearable
            placeholder="请输入扣课顺序"
          />
          <span style="color: rgba(0,0,0,.43); font-size: 10px;">填写数字，大的先扣</span>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('deductForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('deductForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updateSort } from '@/api/crm/stuAccount/stuAccount.js'
export default {
  data() {
    return {
      deductDialogShow: false, // 扣课顺序弹框显隐
      deductData: {
        order: ''
      },
      rules: {
        order: [
          { required: true, message: '请输入扣课顺序', trigger: 'change' }
        ]
      },
      contractRowData: {}
    }
  },
  methods: {
    /* 显示扣课顺序弹框 */
    showDialog(row) {
      this.contractRowData = row
      this.deductDialogShow = !this.deductDialogShow
    },
    /* 扣课弹框输入框 */
    updataSortFunction() {
      const params = {
        purchaseId: this.contractRowData.id,
        cardId: this.contractRowData.stuCardId,
        sort: this.deductData.order
      }
      updateSort(params).then(res => {
        if (res.data.errorCode === 0) {
          this.cancelDialog('deductForm')
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 确定提交扣课顺序弹框 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updataSortFunction()
        }
      })
    },
    /* 关闭扣课顺序弹框 */
    cancelDialog(formName) {
      this.deductDialogShow = false
      this.$refs[formName].clearValidate() // 清除校验
      this.$refs[formName].resetFields()
      this.$emit('afterSumit')
    }
  }
}
</script>

<style lang="scss" scoped>
.deductOrderDialog_container /deep/ {
  .el-dialog {
    width: 400px;
  }
}
</style>

