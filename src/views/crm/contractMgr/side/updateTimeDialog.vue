<template>
  <div class="updateTimeDialog_container">
    <el-dialog
      :visible.sync="updateTimeDialogShow"
      title="合同期限"
      @close="cancelDialog('updateTimeForm')"
    >
      <el-form
        ref="updateTimeForm"
        :model="updataTimeData"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item
          label="开始时间:"
          prop="startTime"
        >
          <el-date-picker
            v-model="updataTimeData.startTime"
            clearable
            type="datetime"
            style="width:100%"
            disabled
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请输入开始时间"
          />
        </el-form-item>
        <el-form-item
          label="结束时间:"
          prop="endTime"
        >
          <el-date-picker
            v-model="updataTimeData.endTime"
            format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            style="width:100%"
            placeholder="请输入结束时间"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('updateTimeForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('updateTimeForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fmtDateFormat } from '@/utils/dateFormat.js'
import { putOffOrder } from '@/api/crm/contract/contract.js'
export default {
  data() {
    return {
      updateTimeDialogShow: false,
      updataTimeData: {
        purId: '',
        startTime: '',
        endTime: null
      },
      rules: {
        startTime: [
          { required: true, message: '请输入开始时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请输入结束时间', trigger: '' }
        ]
      }
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog(rowlist) {
      this.updataTimeData.purId = rowlist.orderNumber
      this.updataTimeData.startTime = rowlist.startTime || ''
      this.updataTimeData.endTime = rowlist.endTime || ''
      this.updateTimeDialogShow = !this.updateTimeDialogShow
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.updateTimeDialogShow = false
      this.$refs[formName].resetFields()
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            endDate: fmtDateFormat(this.updataTimeData.endTime, 'yyyy-MM-dd hh:mm:ss'),
            purId: this.updataTimeData.purId
          }
          putOffOrder(params).then(res => {
            if (res.data.errorCode === 0) {
              this.updateTimeDialogShow = false
              this.$message.success(res.data.errorMessage)
              this.$emit('toContractSideList')
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
.updateTimeDialog_container /deep/ {
  .el-dialog {
    width: 500px;
  }
}
</style>

