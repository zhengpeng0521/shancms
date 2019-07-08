<template>
  <div class="addDept">
    <el-dialog
      :visible.sync="addDeptVisible"
      :close-on-click-modal="false"
      :title="title"
      width="600px"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="课系名称："
          prop="deptName"
        >
          <el-input
            v-model="ruleForm.deptName"
            placeholder="请输入课系名称"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancel('ruleForm')"
        >关闭</el-button>
        <el-button
          type="primary"
          @click="sureAddFunc('ruleForm')"
        >新增</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { createCoursegroup, updateCoursegroup } from '@/api/teachManage/course'
export default {
  data() {
    return {
      addDeptVisible: false, // 弹窗显示
      ruleForm: {
        deptName: ''
      },
      title: '新增课系',
      groupId: '', // 编辑课系的id
      rules: {
        deptName: [
          { required: true, message: '请输入课系名称', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    show(val) {
      if (val) {
        this.ruleForm.deptName = val.name
        this.groupId = val.id
        this.title = '编辑课系'
      } else {
        this.ruleForm.deptName = ''
        this.title = '新增课系'
      }
      this.addDeptVisible = true
    },
    /* 新增 */
    sureAddFunc(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.title === '编辑课系') {
            const params = {
              name: this.ruleForm.deptName,
              id: this.groupId
            }
            updateCoursegroup(params).then(res => {
              const data = res.data
              if (data.errorCode === 0) {
                this.addDeptVisible = false
                this.$message.success(data.errorMessage)
                this.$emit('toParent')
              } else {
                this.$message.error(data.errorMessage || '编辑课系失败')
              }
            })
          } else if (this.title === '新增课系') {
            const params = {
              name: this.ruleForm.deptName
            }
            createCoursegroup(params).then(res => {
              const data = res.data
              if (data.errorCode === 0) {
                this.addDeptVisible = false
                this.$message.success(data.errorMessage)
                this.$emit('toParent')
              } else {
                this.$message.error(data.errorMessage || '新增课系失败')
              }
            })
          }
        } else {
          return false
        }
      })
    },
    cancel(formName) {
      this.addDeptVisible = false
      this.$refs[formName].clearValidate() // 清除校验
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
