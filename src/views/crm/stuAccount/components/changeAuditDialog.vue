<template>
  <div>
    <el-dialog
      :visible.sync="auditDialogShow"
      title="转校审核"
      @close="cancelDialogAudit('auditForm')"
    >
      <el-form
        ref="auditForm"
        :model="auditData"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item
          label="是否通过:"
          prop="radio"
        >
          <el-radio-group
            v-model="auditData.radio"
            @change="radioChange(auditData.radio)"
          >
            <el-radio label="0">通过</el-radio>
            <el-radio label="1">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="isShowStuInput"
          label="转入学员:"
          prop="joinStu"
        >
          <el-select
            v-model="auditData.joinStu"
            placeholder="请选择转入学员"
            clearable
            style="width:100%"
          >
            <el-option
              v-for="item in allStuListData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="审核结果:"
          prop="detail"
        >
          <el-input
            v-model="auditData.detail"
            clearable
            type="textarea"
            placeholder="请输入审核结果"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialogAudit('auditForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitFormAudit('auditForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryCRMStuList, passTransSchool, rejectTransSchool } from '@/api/crm/stuAccount/stuAccount.js'
export default {
  data() {
    return {
      auditDialogShow: false, // 是否审核弹框显示
      isShowStuInput: true, // 是否显示转入学员输入框
      auditData: {
        radio: '0',
        joinStu: '',
        detail: ''
      },
      rules: {
        radio: [{ required: true }]
      },
      changeSchoolList: {}, // 转校列表数据单条
      allStuListData: [] // 转入学员下拉列表数据
    }
  },
  methods: {
    /* 获取学员下拉列表数据 */
    queryCRMStuListFun(row) {
      queryCRMStuList().then(res => {
        if (res.data.errorCode === 0) {
          this.allStuListData = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 单选框值改变 */
    radioChange(value) {
      if (value === '0') {
        this.isShowStuInput = true
        this.auditData = {
          radio: '0',
          joinStu: '',
          detail: ''
        }
        this.rules = {
          radio: [{ required: true }],
          joinStu: [
            { required: true, message: '请选择转入学员', trigger: 'change' }
          ]
        }
      }
      if (value === '1') {
        this.auditData = {
          radio: '1',
          joinStu: '',
          detail: ''
        }
        this.isShowStuInput = false
        this.rules = {
          radio: [{ required: true }]
        }
      }
    },
    /* 显示弹框 */
    auditDialog(row) {
      this.changeSchoolList = row
      this.queryCRMStuListFun(row)
      this.auditDialogShow = !this.auditDialogShow
      this.isShowStuInput = true
    },
    /* 关闭审核弹框 */
    cancelDialogAudit(formName) {
      this.auditDialogShow = false
      this.$refs[formName].resetFields()
    },
    /* 提交审核弹框 */
    submitFormAudit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.auditData.radio == '0') { //eslint-disable-line
            const params = {
              transId: this.changeSchoolList.id,
              inStuId: this.auditData.joinStu,
              checkResult: this.auditData.detail || ''
            }
            passTransSchool(params).then(res => {
              if (res.data.errorCode === 0) {
                this.auditDialogShow = false
                this.$message.success(res.data.errorMessage)
                this.$emit('changeStuStatue')
              } else {
                this.$message.error(res.data.errorMessage)
              }
            })
          } else {
            const params = {
              transId: this.changeSchoolList.id,
              checkResult: this.auditData.detail || ''
            }
            rejectTransSchool(params).then(res => {
              const data = res.data
              if (data.errorCode === 0) {
                this.auditDialogShow = false
                this.$message.success(data.errorMessage)
                this.$emit('changeStuStatue')
              } else {
                this.$message.error(data.errorMessage)
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

