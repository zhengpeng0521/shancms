
<template>
  <div class="addExpendDialog_container">
    <el-dialog
      :visible.sync="addExpendDialogShow"
      :title="addExpendData.formNameEditor == false ? '添加支出' : '编辑支出'"
      @close="cancelDialog('addExpendForm')"
    >
      <el-form
        ref="addExpendForm"
        :model="addExpendData"
        :rules="rules"
        label-width="90px"
      >

        <!-- 支出时间 -->
        <el-form-item
          label="支出时间"
          prop="payDate"
        >
          <el-date-picker
            v-model="addExpendData.payDate"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="date"
            clearable
            placeholder="请选择支出时间"
            style="width:60%"/>
        </el-form-item>

        <!-- 支出项目 -->
        <el-form-item
          label="支出项目"
          prop="payProject"
        >
          <el-select
            v-model="addExpendData.payProject"
            placeholder="请选择支出项目"
            clearable
            filterable
            style="width:60%"
          >
            <el-option
              v-for="item in payProjectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-button
            type="text"
            class="el-icon-circle-plus"
            @click="addPayProjectDialogFun()"
          />
        </el-form-item>

        <!-- 支出金额 -->
        <el-form-item
          label="支出金额"
          prop="payMoney"
        >
          <el-input
            v-model="addExpendData.payMoney"
            placeholder="请输入金额"
            style="width:60%"
          />
        </el-form-item>

        <!-- 支付方式 -->
        <el-form-item
          label="支付方式:"
          prop="payment"
        >
          <el-select
            v-model="addExpendData.payment"
            placeholder="请选择支付方式"
            clearable
            filterable
            style="width:60%"
          >
            <el-option
              v-for="item in paymentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <el-button
            type="text"
            class="el-icon-circle-plus"
            @click="addPaymentDialogFun"
          />
        </el-form-item>

        <!-- 收款人 -->
        <el-form-item
          label="收款人"
          prop="payee"
        >
          <el-input
            v-model="addExpendData.payee"
            placeholder="请输入收款人信息"
            style="width:60%"
          />
        </el-form-item>

        <!-- 经办人 -->
        <el-form-item
          label="经办人"
          prop="agent"
        >
          <el-input
            v-model="addExpendData.agent"
            placeholder="请输入经办人姓名"
            style="width:60%"
          />
        </el-form-item>

        <!-- 有无发票 -->
        <el-form-item
          label="有无发票"
          prop="invoiceRadio"
        >
          <el-radio v-model="addExpendData.invoiceRadio" label="0">无</el-radio>
          <el-radio v-model="addExpendData.invoiceRadio" label="1">有</el-radio>
        </el-form-item>
        <!-- 备注 -->
        <el-form-item
          label="备注:"
          prop="remark"
        >
          <el-input
            v-model="addExpendData.remark"
            type="textarea"
            placeholder="请输入备注"
            style="width:80%"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('addExpendForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('addExpendForm')"
        >保 存</el-button>
      </span>
    </el-dialog>

    <!-- 支出项目弹窗 -->
    <addPayProjectDialog
      ref="addPayProjectDialog"
      @payProjectUpdateLine="queryProjectFun"
    />

    <!-- 支付方式弹窗 -->
    <addPaymentDialog
      ref="addPaymentDialog"
      @paymentUpdataLine="queryPayWayFun"
    />
  </div>
</template>

<script>
import {
  queryProject, // 支出项目列表查询
  queryPayWay, // 支出方式-列表查询
  addExpendInfo, // 新增支出记录
  updateExpendInfo, // 支出记录修改
  queryDeatil // 支出记录-详情查询
} from '@/api/crm/financeMgr/expend.js'

import addPayProjectDialog from './addPayProjectDialog.vue' // 支出项目弹窗
import addPaymentDialog from './addPaymentDialog.vue' // 支付方式弹窗
export default {
  components: {
    addPayProjectDialog, // 支出项目窗口
    addPaymentDialog // 支付方式弹窗
  },
  data() {
    return {
      addExpendDialogShow: false,
      addExpendData: {
        formNameEditor: false,
        payDate: null, // 支付时间
        payProject: '', // 支出项目
        payMoney: '', // 支出金额
        payment: '', // 支付方式
        payee: '', // 收款人
        agent: '', // 经办人
        invoiceRadio: '0', // 有无发票
        remark: '' // 备注
      },
      payProjectList: [], // 支出项目下拉列表
      paymentList: [], // 支出方式下拉列表
      rules: {
        payDate: [
          { required: true, message: '请选择支出时间', trigger: 'change' }
        ],
        payProject: [
          { required: true, message: '请选择支出项目', trigger: 'change' }
        ],
        payMoney: [
          { required: true, message: '请输入金额', trigger: 'change' },
          { pattern: /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,7}$/, message: '金额保留两位小数', trigger: 'change' }
        ],
        payment: [
          { required: true, message: '请选择支付方式', trigger: 'change' }
        ],
        payee: [
          { required: true, message: '请输入收款人信息', trigger: 'change' },
          { pattern: /^[\u4e00-\u9fffa-zA-Z]{1,15}$/, message: '请输入中文,最多15个中文汉字', trigger: 'change' }
        ],
        agent: [
          { required: true, message: '请输入经办人姓名', trigger: 'change' },
          { pattern: /^[\u4e00-\u9fffa-zA-Z]{1,8}$/, message: '请输入中文,最多8个中文汉字', trigger: 'change' }
        ],
        invoiceRadio: [
          { required: true }
        ],
        remark: [
          { pattern: /^[\u4e00-\u9fffa-zA-Z]{1,15}$/, message: '请输入中文,最多15个中文汉字', trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    // 支付方式弹窗
    addPaymentDialogFun() {
      this.$refs.addPaymentDialog.showDialog()
    },
    // 添加支出弹窗
    addPayProjectDialogFun() {
      this.$refs.addPayProjectDialog.showDialog()
    },

    /* 显示弹框 */
    showDialog(row) {
      this.queryProjectFun()
      this.queryPayWayFun()
      this.addExpendDialogShow = true
      if (row !== undefined) { // 如果有数据处于编辑状态
        this.$nextTick(() => {
          this.queryDeatilFun(row.id)
        })
      } else {
        this.addExpendData.formNameEditor = false // 处于新增状态
      }
    },

    // 编辑时支出记录-详情查询
    queryDeatilFun(id) {
      const params = {
        id: id
      }
      queryDeatil(params).then(res => {
        this.addExpendData = {
          id: res.data.id, // 编辑入参id
          payDate: res.data.spendTime, // 支付时间
          payProject: res.data.projectId, // 支出项目
          payMoney: res.data.amount, // 支出金额
          payment: res.data.payWayId, // 支付方式
          payee: res.data.agentName, // 收款人
          agent: res.data.collectName, // 经办人
          invoiceRadio: res.data.isInvoice, // 有无发票
          remark: res.data.remark, // 备注
          formNameEditor: true // 编辑时变为true
        }
      })
    },

    /* 支出项目下拉列表 */
    queryProjectFun() {
      queryProject().then(res => {
        if (res.data.errorCode === 0) {
          this.payProjectList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    // 支出方式-列表查询
    queryPayWayFun() {
      queryPayWay().then(res => {
        if (res.data.errorCode === 0) {
          this.paymentList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    /* 关闭弹框 */
    cancelDialog(formName) {
      this.addExpendDialogShow = false
      this.$refs[formName].resetFields()
      this.$emit('updataPayProject')
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.addExpendData.formNameEditor === false) { // 不是编辑状态时，添加
            this.addExpendInfoFun() // 新增提交
          } else {
            this.updataExpendInfoFun() // 编辑提交
          }
        }
      })
    },

    // 增加支出记录
    addExpendInfoFun() {
      const params = {
        spendTime: this.addExpendData.payDate, // 支出时间
        projectId: this.addExpendData.payProject, // 支出项目
        amount: this.addExpendData.payMoney, // 支出金额
        payWayId: this.addExpendData.payment, // 支出方式
        agentName: this.addExpendData.payee, // 收款人
        collectionName: this.addExpendData.agent, // 经办人
        isInvoice: this.addExpendData.invoiceRadio, // 有无发票
        remark: this.addExpendData.remark // 备注
      }
      addExpendInfo(params).then(res => {
        if (res.data.errorCode === 0) {
          this.addExpendDialogShow = false
          this.$emit('toParentEarnest')
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    // 修改支出记录
    updataExpendInfoFun() {
      const params = {
        id: this.addExpendData.id, // 修改时的id
        spendTime: this.addExpendData.payDate, // 支出时间
        projectId: this.addExpendData.payProject, // 支出项目
        amount: this.addExpendData.payMoney, // 支出金额
        payWayId: this.addExpendData.payment, // 支出方式
        agentName: this.addExpendData.payee, // 收款人
        collectName: this.addExpendData.agent, // 经办人
        isInvoice: this.addExpendData.invoiceRadio, // 有无发票
        remark: this.addExpendData.remark // 备注
      }
      updateExpendInfo(params).then(res => {
        if (res.data.errorCode === 0) {
          this.addExpendDialogShow = false
          this.$emit('toParentEarnest')
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.addExpendDialog_container /deep/ {
  .el-dialog {
    width: 500px;
  }
}
</style>

