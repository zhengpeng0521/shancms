<template>
  <div class="checkRefundDialog_container">
    <el-dialog
      :visible.sync="checkRefundDialogShow"
      title="审核退款"
      @close="cancelDialog('checkRefundForm')"
    >
      <el-form
        ref="checkRefundForm"
        :model="refundInfoData"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item
          label="退款单编号:"
          prop="id"
        >
          <span>{{ refundInfoData.id || '--' }}</span>
        </el-form-item>
        <el-form-item
          label="类型:"
          prop="refundType"
        >
          <span>{{ refundInfoData.refundType === 3 ? '退时长' : '退课时' }}</span>
        </el-form-item>
        <el-form-item
          label="退款金额:"
          prop="inputMoney"
        >
          <el-input
            v-model="refundInfoData.inputMoney"
            clearable
            placeholder="确认时必填，驳回时填写无效"
            style="width: 70%"
            @keyup.native="refundPriceChange"
          />
          <span style="color: rgba(0, 0, 0, 0.4)">最多可退{{ refundInfoData.money || '0' }}元</span>
          <div
            v-if="isMoneyLive"
            style="color: rgba(0,0,0,.4)"
          >已退{{ refundInfoData.inputMoney || '0' }}元，剩下{{ refundInfoData.liveMoney || '0' }}元作为手续费</div>
        </el-form-item>
        <el-form-item
          v-for="(item, index) of refundInfoData.peridInfo"
          :key="index + '_peridInfo'"
          label="课程信息:"
          prop="info"
        >
          <div>课程名称: {{ item.courseName || '--' }}</div>
          <div>退课时数: {{ item.periodNum || '--' }}</div>
        </el-form-item>
        <el-form-item
          label="审核说明:"
          prop="because"
        >
          <el-input
            v-model="refundInfoData.because"
            clearable
            type="textarea"
            placeholder="请输入审核说明"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="red_btn"
          @click="backFuendDialog('checkRefundForm')"
        >驳 回</el-button>
        <el-button
          type="primary"
          @click="submitForm('checkRefundForm')"
        >通 过</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRefundOrderById, acceptRefundOrder, rejectRefundOrder } from '@/api/crm/financeMgr/financeMgr.js'
export default {
  components: {

  },
  data() {
    return {
      checkRefundDialogShow: false,
      refundInfoData: {
        id: '',
        refundType: '',
        inputMoney: '',
        liveMoney: '',
        money: '',
        because: ''
      }, // 详情数据
      rules: {
        because: [
          { required: true, message: '请输入审核说明', trigger: 'change' }
        ]
        // inputMoney: [
        //   { required: true, message: '请输入退款金额', trigger: 'change' }
        // ]
      },
      isMoneyLive: false // 剩余金额显隐
    }
  },
  methods: {
    /* 获取退款单详情数据 */
    getRefundOrderByIdFun(rowList) {
      const params = {
        id: rowList.id
      }
      getRefundOrderById(params).then(res => {
        if (res.data.errorCode === 0) {
          console.log('res data', res)
          this.refundInfoData = res.data.data
          this.checkRefundDialogShow = !this.checkRefundDialogShow
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 退款金额值改变 */
    refundPriceChange() {
      if (this.refundInfoData.inputMoney.length > 0) {
        let livePrice = 0
        livePrice = Number(this.refundInfoData.money - this.refundInfoData.inputMoney)
        this.refundInfoData.liveMoney = livePrice
        this.$forceUpdate()
        this.isMoneyLive = true
      } else {
        this.isMoneyLive = false
        this.$forceUpdate()
      }
    },
    /* 显示弹框 */
    showDialog(row) {
      this.getRefundOrderByIdFun(row)
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.checkRefundDialogShow = false
      this.$refs[formName].resetFields()
    },
    /* 驳回 */
    backFuendDialog(formName) {
      this.$refs[formName].validate(valid => {
        console.log('valid', valid)
        if (valid) {
          const params = {
            id: this.refundInfoData.id,
            refundWay: this.refundInfoData.because
          }
          rejectRefundOrder(params).then(res => {
            if (res.data.errorCode === 0) {
              this.checkRefundDialogShow = false
              this.$emit('toRefundList')
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
            id: this.refundInfoData.id,
            money: this.refundInfoData.inputMoney,
            realMoney: this.refundInfoData.money,
            refundWay: this.refundInfoData.because
          }
          acceptRefundOrder(params).then(res => {
            if (res.data.errorCode === 0) {
              this.checkRefundDialogShow = false
              this.$emit('toRefundList')
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
.checkRefundDialog_container /deep/ {
  .el-dialog {
    width: 500px;
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

