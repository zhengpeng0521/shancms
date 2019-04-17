<template>
  <div class="checkContractDialog_container">
    <el-dialog
      :visible.sync="checkContractDialogShow"
      title="审核合同"
      @close="cancelDialog('checkContractForm')"
    >
      <el-form
        ref="checkContractForm"
        :model="checkContractData"
        label-width="90px"
      >
        <el-form-item
          label="合同编号:"
          prop="conNum"
        >
          <span>{{ checkContractData.orderNum }}</span>
        </el-form-item>
        <el-form-item
          label="合同类型:"
          prop="conType"
        >
          <span>{{ checkContractData.orderType }}</span>
        </el-form-item>
        <el-form-item
          label="合同金额:"
          prop="conPrice"
        >
          <span>{{ checkContractData.orderMoney }}</span>
        </el-form-item>
        <div class="detail_text">
          <el-form-item prop="detail">
            <el-input
              v-model="checkContractData.detail"
              clearable
              type="textarea"
              placeholder="请输入备注"
            />
          </el-form-item>
        </div>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="red_btn"
          @click="backContract('checkContractForm')"
        >驳 回</el-button>
        <el-button
          type="primary"
          @click="submitForm('checkContractForm')"
        >通 过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { passOrder, rejectOrder } from '@/api/crm/contract/contract.js'
export default {
  components: {

  },
  data() {
    return {
      checkContractDialogShow: false,
      checkContractData: {
        orderNum: '124523562362352341',
        orderType: '课时套餐',
        orderMoney: '￥322.00',
        detail: ''
      },
      redBtnShow: false,
      rowContractList: {} // 审核单条合同数据
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog(rowList) {
      this.rowContractList = rowList
      if (rowList.orderState == '1') { //eslint-disable-line
        this.checkContractData = {
          orderNum: rowList.orderNum || '--',
          orderType: rowList.orderType && rowList.orderType == '2' ? '课时套餐'  + '/' +  rowList.orderPeriod + '.00课时' : '托班套餐', //eslint-disable-line
          orderMoney: rowList.orderMoney || '0',
          detail: ''
        }
        this.checkContractDialogShow = true
      } else {
        this.checkContractDialogShow = false
        this.$message.error('只有待审核状态下才能审核')
      }
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.checkContractDialogShow = false
      this.$refs[formName].resetFields()
    },
    /* 驳回合同 */
    backContract(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            orderId: this.rowContractList.orderNumber,
            orderRemark: this.checkContractData.detail
          }
          rejectOrder(params).then(res => {
            if (res.data.errorCode === 0) {
              this.checkContractDialogShow = false
              this.$refs[formName].resetFields()
              this.$message.success(res.data.errorMessage)
              this.$emit('toContractList')
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        }
      })
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            orderId: this.rowContractList.orderNumber,
            orderRemark: this.checkContractData.detail
          }
          passOrder(params).then(res => {
            if (res.data.errorCode === 0) {
              this.checkContractDialogShow = false
              this.$message.success(res.data.errorMessage)
              this.$emit('toContractList')
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.checkContractDialog_container /deep/ {
  .el-dialog {
    width: 500px;
  }
  .detail_text /deep/ {
    .el-form-item__content {
      margin-left: 15px !important;
    }
  }
  .red_btn {
    background-color: #cc4342 !important;
    border: 1px solid #cc4342 !important;
    color: #fff;
  }
  .red_btn:hover {
    opacity: 0.8;
  }
}
</style>

