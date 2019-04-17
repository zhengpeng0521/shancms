<template>
  <div class="tip">
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="600px"
      title="备注"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="学员姓名：">
          {{ ruleForm.stuName }}
        </el-form-item>
        <el-form-item
          label="备注内容："
          prop="remark"
        >
          <el-input
            v-model="ruleForm.remark"
            :rows="4"
            type="textarea"
            placeholder="请输入备注内容（限500字）"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="resetForm"
        >取消
        </el-button>
        <el-button
          type="primary"
          @click="submit"
        >确定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { createSign } from '@/api/nurseryClass/gradeManage'
export default {
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        stuName: '',
        remark: ''
      },
      rules: {
        remark: [
          { required: true, message: '请输入备注内容', trigger: 'blur' }
        ]
      },
      rowInfo: {},
      clsId: '' // 班级id
    }
  },
  methods: {
    show(row, clsId, type) {
      this.dialogVisible = true
      this.rowInfo = row
      this.clsId = clsId
      this.ruleForm.stuName = row.name
      if (type === 'edit') {
        this.ruleForm.remark = ''
      } else if (type === 'update') {
        this.ruleForm.remark = row.remark
      }
    },
    /* 确定 */
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const params = {
            remark: this.ruleForm.remark,
            stuId: this.rowInfo.stuId,
            clsId: this.clsId
          }
          createSign(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.dialogVisible = false
              this.$emit('toUpdateTable')
              this.$message.success(data.errorMessage)
            } else {
              this.$message.error(data.errorMessage || '备注失败')
            }
          })
        } else {
          return false
        }
      })
    },
    /* 取消 */
    resetForm() {
      this.dialogVisible = false
      this.$refs['ruleForm'].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
