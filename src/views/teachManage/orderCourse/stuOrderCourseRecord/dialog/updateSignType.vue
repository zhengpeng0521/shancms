<template>
  <div class="updateSignType">
    <el-dialog
      :visible.sync="dialogVisible"
      title="修改状态"
      width="400px"
      @close="resetForm('ruleForm')"
    >
      <div>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item
            label="状态："
            prop="signType"
          >
            <el-select
              v-model="ruleForm.signType"
              placeholder="请选择"
              style="width:220px"
            >
              <el-option
                label="出勤"
                value="3"
              />
              <el-option
                label="请假"
                value="4"
              />
              <el-option
                label="旷课"
                value="5"
              />
              <el-option
                label="取消"
                value="6"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="resetForm('ruleForm')"
        >取消</el-button>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { updateSignType } from '@/api/teachManage/orderCourse'
export default {
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        signType: ''
      },
      rules: {
        signType: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ]
      },
      rowInfo: {}
    }
  },
  methods: {
    show(row) {
      this.rowInfo = row
      this.dialogVisible = true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            cpStuId: this.rowInfo.cpStuId,
            signType: this.ruleForm.signType
          }
          updateSignType(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.dialogVisible = false
              this.$emit('toUpdateSignType')
            } else {
              this.$message.error(data.errorMessage || '修改考勤状态失败')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
