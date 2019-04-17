<template>
  <div class="updateSignType">
    <el-dialog
      :visible.sync="dialogVisible"
      title="取消约课"
      width="400px"
    >
      <div>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
        >
          <el-form-item
            label="选择原因："
            prop="reason"
          >
            <el-select
              v-model="ruleForm.reason"
              placeholder="请选择原因"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
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
import { tryUpdateStatus } from '@/api/teachManage/orderCourse'
export default {
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        reason: '1'
      },
      options: [
        {
          label: '操作有误',
          value: '1'
        },
        {
          label: '节假日放假',
          value: '2'
        },
        {
          label: '老师请假',
          value: '3'
        },
        {
          label: '学员调班',
          value: '4'
        }, {
          label: '从班级移除',
          value: '5'
        },
        {
          label: '老师离职',
          value: '6'
        }
      ],
      rowInfo: {},
      detailList: {}
    }
  },
  methods: {
    show(row, detail) {
      this.rowInfo = row
      this.detailList = detail
      this.dialogVisible = true
      this.ruleForm.reason = '1'
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {
            ids: this.rowInfo.audition_id,
            status: '0',
            reason: this.ruleForm.reason
          }
          tryUpdateStatus(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.dialogVisible = false
              this.$message.success(data.errorMessage)
              this.$emit('toCancelUpdate', this.detailList)
            } else {
              this.$message.error(data.errorMessage || '失败')
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
