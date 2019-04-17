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
import { stuSignCancel } from '@/api/teachManage/orderCourse'
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
      checkList: [] // 选中的列表
    }
  },
  methods: {
    show(arr) {
      this.dialogVisible = true
      this.ruleForm.reason = '1'
      this.checkList = arr
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const checkArr = []
          this.checkList.map(item => {
            checkArr.push(item.cpStuId)
          })
          const cpStuId = checkArr && checkArr.join(',')
          const params = {
            cpStuId: cpStuId,
            reason: this.ruleForm.reason
          }
          stuSignCancel(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.$message.success(data.errorMessage)
              this.dialogVisible = false
              this.$emit('toCancelOrder')
            } else {
              this.$message.error(data.errorMessage || '取消约课失败')
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
