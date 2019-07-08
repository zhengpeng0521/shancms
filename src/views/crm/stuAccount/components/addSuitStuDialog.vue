<template>
  <div class="addSuitStuDialog_container">
    <el-dialog
      :visible.sync="addSuitStuDialogShow"
      title="添加适用学员"
      @close="cancelDialog('addSuitStuForm')"
    >
      <el-form
        ref="addSuitStuForm"
        :model="deductData"
        :rules="rules"
      >
        <span style="display: inline-block;margin-bottom: 10px;">请选择想添加的适用学员</span>
        <el-form-item
          label=""
          prop="order"
        >
          <el-select
            v-model="deductData.order"
            clearable
            filterable
            placeholder="请选择想添加的适用学员"
            style="width: 100%"
          >
            <el-option
              v-for="item in allStudents"
              :key="item.stuId"
              :label="item.stuName"
              :value="item.stuId"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('addSuitStuForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('addSuitStuForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 适用学员 -->
    <!-- <SuitStudentPage /> -->
  </div>
</template>

<script>
import { addStuByCardId } from '@/api/crm/stuAccount/stuAccount.js'
// import SuitStudentPage from './cardSide/suitStudentPage.vue'
export default {
  components: {
    // SuitStudentPage
  },
  data() {
    return {
      addSuitStuDialogShow: false, // 扣课顺序弹框显隐
      // isFalse: false,
      deductData: {
        order: ''
      },
      rules: {
        order: [
          { required: true, message: '请选择想添加的适用学员', trigger: 'change' }
        ]
      },
      allStudents: [], // 获取学员下拉输入框数据
      cardRowData: {} // 获取会员卡详情数据
    }
  },
  methods: {
    /* 显示扣课顺序弹框 */
    showDialog(rowValue, value) {
      this.cardRowData = rowValue
      this.allStudents = value
      this.addSuitStuDialogShow = !this.addSuitStuDialogShow
    },
    /* 确定提交扣课顺序弹框 */
    submitForm(formName) {
      const params = {
        id: this.cardRowData.id,
        stuId: this.deductData.order
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          addStuByCardId(params).then(res => {
            if (res.data.errorCode === 0) {
              this.addSuitStuDialogShow = false
              this.$emit('updateSuiteStudent')
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        }
      })
    },
    /* 关闭扣课顺序弹框 */
    cancelDialog(formName) {
      this.addSuitStuDialogShow = false
      this.$refs[formName].clearValidate() // 清除校验
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.addSuitStuDialog_container /deep/ {
  .el-dialog {
    width: 500px;
  }
}
</style>

