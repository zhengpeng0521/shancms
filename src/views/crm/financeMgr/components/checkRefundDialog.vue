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

        <!-- 退款单编号 -->
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

        <!-- 退款金额 -->
        <el-form-item
          label="退款金额:"
          prop="inputMoney"
        >
          <el-input
            v-model="refundInfoData.inputMoney"
            clearable
            placeholder="确认时必填，驳回时填写无效"
            style="width: 60%"
            @keyup.native="refundPriceChange"
          />
          <span style="color: rgba(0, 0, 0, 0.4)">最多可退{{ refundInfoData.money || '0' }}元</span>
          <div
            v-if="isMoneyLive"
            style="color: rgba(0,0,0,.4)"
          >已退{{ refundInfoData.refundMoney || '0' }}元，剩下{{ refundInfoData.liveMoney || '0' }}元作为手续费</div>
        </el-form-item>

        <!-- 退款方式 -->
        <el-form-item
          v-if="refundWayShowHidden"
          label="退款方式"
          prop="refundWay"
        >
          <el-select
            v-model="refundInfoData.refund_way"
            placeholder="请选择退款方式"
            @change="refundWayFun(refundInfoData.refund_way)"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <!-- 退款户名 -->
        <el-form-item
          v-if="bankShowHidden"
          label="退款户名"
          prop="username"
        >
          <el-input
            v-model="refundInfoData.username"
            clearable
            placeholder="请输入退款户名"
            style="width: 60%"
          />
        </el-form-item>

        <!-- 退款卡号 -->
        <el-form-item
          v-if="bankShowHidden"
          label="退款卡号"
          prop="cardNum"
        >
          <el-input
            v-model="refundInfoData.cardNum"
            clearable
            placeholder="请输入退款卡号"
            style="width: 60%"
          />
        </el-form-item>

        <!-- 银行名称 -->
        <el-form-item
          v-if="bankShowHidden"
          label="银行名称"
          prop="bankName"
        >
          <el-input
            v-model="refundInfoData.bankName"
            clearable
            placeholder="请输入银行名称"
            style="width: 60%"
          />
        </el-form-item>

        <!-- 支付宝账号 -->
        <el-form-item
          v-if="aliPayShowHidden"
          label="支付宝账号"
          prop="aliPayName"
        >
          <el-input
            v-model="refundInfoData.aliPayName"
            clearable
            placeholder="请输入支付宝账号"
            style="width: 60%"
          />
        </el-form-item>

        <!-- 课程信息 -->
        <el-form-item
          v-for="(item, index) of refundInfoData.peridInfo"
          :key="index + '_peridInfo'"
          label="课程信息:"
          prop="info"
        >
          <div>课程名称: {{ item.courseName || '--' }}</div>
          <div>退课时数: {{ item.periodNum || '--' }}</div>
        </el-form-item>

        <!-- 审核说明 -->
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
      refundWayShowHidden: false, // refundType: 2为课时，3为时长
      bankShowHidden: false, // 银行卡部分的显示和隐藏
      aliPayShowHidden: false, // 支付宝的部分的显隐
      options: [{
        value: 'bank',
        label: '银行卡'
      }, {
        value: 'cash',
        label: '现金'
      }, {
        value: 'wx',
        label: '微信转账'
      }, {
        value: 'ali',
        label: '支付宝'
      }],
      // value: '',
      refundInfoData: {
        id: '',
        refundType: '', // 类型
        inputMoney: '', // 填写的金钱
        refundMoney: '', // 已退款的钱
        liveMoney: '', // 手续费的钱
        money: '', // 最多可退的钱
        because: '',
        refundInfo: {}, // 包含退款的所有信息
        refund_way: '', // 退款方式
        username: '', // 退款户名
        cardNum: '', // 退款卡号
        bankName: '', // 银行名称
        aliPayName: '' // 支付宝账号
      }, // 详情数据
      rules: {
        because: [
          { required: true, message: '请输入审核说明', trigger: 'change' }
        ],
        username: [
          { pattern: /^[\u4e00-\u9fffa-zA-Z]{1,15}$/, message: '请输入中文汉字', trigger: 'change' }
        ],
        cardNum: [
          { pattern: /^([6]{1})([2]{1})(\d{14}|\d{15}|\d{16}|\d{17})$/, message: '请正确输入银行卡号', trigger: 'blur' }
        ],
        bankName: [
          { pattern: /^[\u4e00-\u9fffa-zA-Z]{1,15}$/, message: '请输入中文汉字', trigger: 'change' }
        ],
        aliPayName: [
          { pattern: /^.{1,30}$/, message: '请正确输入支付宝账号', trigger: 'change' }
        ]
        // inputMoney: [
        //   { required: true, message: '请输入退款金额', trigger: 'change' }
        // ]
      },
      isMoneyLive: false // 剩余金额显隐
    }
  },
  methods: {
    // 选择退款方式显隐
    refundWayFun(value) {
      if (value === 'bank') { // 选择银行卡
        this.bankShowHidden = true
        this.aliPayShowHidden = false
      } else if (value === 'ali') { // 选择支付宝
        this.bankShowHidden = false
        this.aliPayShowHidden = true
      } else { // 其他页面
        this.bankShowHidden = false
        this.aliPayShowHidden = false
      }
    },

    /* 获取退款单详情数据 */
    getRefundOrderByIdFun(rowList) {
      const params = {
        id: rowList.id
      }
      getRefundOrderById(params).then(res => {
        if (res.data.errorCode === 0) {
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
        if (parseFloat(this.refundInfoData.money) - parseFloat(this.refundInfoData.inputMoney) >= 0) {
          livePrice = (parseFloat(parseFloat(this.refundInfoData.money) - parseFloat(this.refundInfoData.inputMoney))).toFixed(2)
          this.refundInfoData.liveMoney = livePrice
          this.refundInfoData.refundMoney = parseFloat(this.refundInfoData.inputMoney).toFixed(2)
        } else {
          this.refundInfoData.liveMoney = 0
          this.refundInfoData.inputMoney = this.refundInfoData.money
          this.refundInfoData.refundMoney = this.refundInfoData.money
        }
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
      this.isMoneyLive = false
      if (row.refundType === 2) { // 课时
        this.refundWayShowHidden = true
        this.bankShowHidden = false
        this.aliPayShowHidden = false
        this.refundInfoData.refund_way = ''
      } else if (row.refundType === 3) { // 时长
        this.refundWayShowHidden = false
        this.bankShowHidden = false
        this.aliPayShowHidden = false
      }
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.checkRefundDialogShow = false
      this.$refs[formName].resetFields()
    },
    /* 驳回 */
    backFuendDialog(formName) {
      this.$refs[formName].validate(valid => {
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
          const refundInfo = { //eslint-disable-line
            refund_way: this.refundInfoData.refund_way,
            account: this.refundInfoData.cardNum,
            account_name: this.refundInfoData.username || this.refundInfoData.aliPayName,
            bank_name: this.refundInfoData.bankName
          }
          const str = JSON.stringify(refundInfo)
          const params = {
            id: this.refundInfoData.id,
            money: this.refundInfoData.inputMoney,
            realMoney: this.refundInfoData.money,
            refundWay: this.refundInfoData.because,
            refundInfo: str
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

