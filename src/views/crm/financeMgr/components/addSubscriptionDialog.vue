<template>
  <div class="addSubDialog_container">
    <el-dialog
      :visible.sync="addSubDialogShow"
      title="新建订金"
      @close="cancelDialog('addSubForm')"
    >
      <el-form
        ref="addSubForm"
        :model="addSubData"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item
          label="所属学员:"
          prop="stuId"
        >
          <el-select
            v-model="addSubData.stuId"
            placeholder="请选择所属学员"
            clearable
            filterable
            style="width:100%"
          >
            <el-option
              v-for="item in allStuListData"
              :key="item.stuId"
              :label="item.stuName"
              :value="item.stuId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="订金金额:"
          prop="money"
        >
          <el-input
            v-model="addSubData.money"
            clearable
            placeholder="请输入订金金额"
          />
        </el-form-item>
        <el-form-item
          label="收款方式:"
          prop="paId"
        >
          <el-select
            v-model="addSubData.paId"
            placeholder="请选择收款方式"
            clearable
            filterable
            style="width:100%"
          >
            <el-option
              v-for="item in allOrderTypeData"
              :key="item.id"
              :label="item.paymentKey === 'xianjin' ? item.paymentKeyName : (item.paymentKeyName + '-' + item.name + '-' + item.acctNo)"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="流水号:"
          prop="realSerialNumber"
        >
          <el-input
            v-model="addSubData.realSerialNumber"
            clearable
            placeholder="请输入流水号"
          />
        </el-form-item>
        <el-form-item
          label="备注:"
          prop="remarks"
        >
          <el-input
            v-model="addSubData.remarks"
            type="textarea"
            clearable
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('addSubForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('addSubForm')"
        >保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { summaryQuery, queryPaymentAccountList, purchaseDepositCreate } from '@/api/crm/financeMgr/financeMgr.js'
export default {
  data() {
    return {
      addSubDialogShow: false,
      addSubData: {
        stuId: '', // 学员编号
        money: '', // 定金
        paId: '', // 收款账号
        realSerialNumber: '', // 流水号
        receiverId: '', // 收款人id
        remarks: '' // 备注
      },
      allStuListData: [], // 所有学员下拉列表
      allOrderTypeData: [], // 收款方式下拉列表
      rules: {
        stuId: [
          { required: true, message: '请输入所属学员', trigger: 'change' }
        ],
        money: [
          { required: true, message: '请输入订金金额', trigger: 'change' },
          { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '正数，可精确到小数点后2位', trigger: 'change' }
        ],
        paId: [
          { required: true, message: '请输入收款方式', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog() {
      this.summaryQueryFun()
      this.queryPaymentAccountListFun()
      this.addSubDialogShow = !this.addSubDialogShow
    },
    /* 获取学员下拉列表数据 */
    summaryQueryFun() {
      summaryQuery().then(res => {
        if (res.data.errorCode === 0) {
          this.allStuListData = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 获取定金收款方式下拉列表 */
    queryPaymentAccountListFun() {
      queryPaymentAccountList().then(res => {
        if (res.data.errorCode === 0) {
          this.allOrderTypeData = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.addSubDialogShow = false
      this.$refs[formName].resetFields()
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            stuId: this.addSubData.stuId,
            money: this.addSubData.money,
            paId: this.addSubData.paId,
            realSerialNumber: this.addSubData.realSerialNumber || '',
            remarks: this.addSubData.remarks || '',
            receiverId: this.addSubData.receiverId || ''
          }
          purchaseDepositCreate(params).then(res => {
            if (res.data.errorCode === 0) {
              this.addSubDialogShow = false
              this.$emit('toParentEarnest')
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
.addSubDialog_container /deep/ {
  .el-dialog {
    width: 500px;
  }
}
</style>

