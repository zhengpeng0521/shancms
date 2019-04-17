<template>
  <div class="giveCurrencyDialog_container">
    <el-dialog
      :visible.sync="giveCurrencyDialogShow"
      title="分配通讯币"
      @close="cancelDialog('productForm')"
    >
      <el-form
        ref="productForm"
        :model="giveCurrentData"
        label-width="120px"
      >
        <el-form-item
          label="可分配通讯币:"
          prop="number"
        >
          <span>{{ giveCurrentData.number }}</span>
        </el-form-item>
        <el-form-item
          label="已选择账号:"
          prop="user"
        >
          <span>{{ giveCurrentData.user }}</span>
        </el-form-item>
        <div class="currency_input">
          <el-form-item
            label="分配通讯币:"
            prop="no"
          >
            <el-input
              v-model="giveCurrentData.no"
              style="width: 100%"
            />
            <span>/人</span>
          </el-form-item>
        </div>
        <el-form-item
          label="分配剩余通讯币:"
          prop="number"
        >
          <span>{{ giveCurrentData.last }}</span>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('productForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('productForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {

  },
  data() {
    return {
      giveCurrencyDialogShow: false,
      giveCurrentData: {
        number: '234.00',
        user: '1人',
        no: '',
        last: '234.0'
      }
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog() {
      this.giveCurrencyDialogShow = !this.giveCurrencyDialogShow
    },
    /* 关闭弹框 */
    /* 商品弹框关闭 */
    cancelDialog(formName) {
      this.giveCurrencyDialogShow = false
      this.$refs[formName].resetFields()
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      console.log('formName', formName)
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.giveCurrencyDialogShow = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.giveCurrencyDialog_container /deep/ {
  .el-dialog {
    width: 500px;
  }
  .currency_input {
    .el-form-item__content {
      position: relative;
      width: 40%;
      span {
        position: absolute;
        right: 0;
        top: 0;
        padding: 4px 7px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        text-align: center;
        background-color: #eee;
        border: 1px solid #d9d9d9;
        line-height: 18px;
        border-radius: 0 5px 5px 0;
      }
    }
  }
}
</style>

