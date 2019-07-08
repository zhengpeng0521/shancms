<template>
  <div class="updateSignType">
    <el-dialog
      :visible.sync="dialogVisible"
      title="修改固定位"
      width="400px"
    >
      <div>
        <div style="margin-bottom:20px">已选中{{ checkNum }}条数据</div>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
        >
          <el-form-item
            label="请选择固定位状态"
            prop="fix"
          >
            <el-select
              v-model="ruleForm.fix"
              placeholder="请选择固定位状态"
              filterable
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
import { updateFix } from '@/api/teachManage/orderCourse'
export default {
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        fix: '0'
      },
      options: [
        {
          label: '否',
          value: '0'
        },
        {
          label: '是',
          value: '1'
        }
      ],
      checkNum: '0',
      checkList: [] // 选中的列表
    }
  },
  methods: {
    show(val) {
      this.dialogVisible = true
      this.ruleForm.fix = '0'
      this.checkNum = val.length
      this.checkList = val
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
            cpStuIds: cpStuId,
            fix: this.ruleForm.fix
          }
          updateFix(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.$message.success(data.errorMessage)
              this.dialogVisible = false
              this.$emit('toUpdateFix')
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
