<template>
  <div class="addTheme">
    <el-dialog
      :visible.sync="addThemeVisible"
      :close-on-click-modal="false"
      title="新增主题"
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
          label="类型："
          prop="classType"
        >
          <el-select
            v-model="ruleForm.classType"
            placeholder="请选择课系"
            style="width:455px"
          >
            <el-option
              v-for="item of typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="主题名称："
          prop="themeName"
        >
          <el-input
            v-model="ruleForm.themeName"
            placeholder="请输入上课主题名称"
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
import { createCourseTheme, updateCourseTheme } from '@/api/teachManage/course'
export default {
  data() {
    return {
      addThemeVisible: false, // 弹窗显示
      ruleForm: {
        classType: '1',
        themeName: ''
      },
      rules: {
        themeName: [
          { required: true, message: '请输入上课主题名称', trigger: 'blur' }
        ]
      },
      courseId: '',
      type: '', // 新增/编辑
      typeList: [
        {
          label: '正课',
          value: '1'
        }, {
          label: '开学典礼',
          value: '2'
        }, {
          label: '公开课',
          value: '3'
        }, {
          label: '家长会',
          value: '4'
        }, {
          label: '毕业典礼',
          value: '5'
        }
      ]
    }
  },

  methods: {
    show(val, type) {
      this.type = type
      if (type == 'edit') { //eslint-disable-line
        if (val) {
          this.ruleForm.themeName = val.title
          this.courseId = val.id
        }
      } else if (type == 'add') { //eslint-disable-line
        if (val) {
          this.courseId = val
        }
        this.ruleForm.themeName = ''
        this.ruleForm.classType = '1'
      }
      this.addThemeVisible = true
    },
    /* 新增 */
    sureAddFunc(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.info('this', this.ruleForm)
          if (this.type == 'add') { //eslint-disable-line
            const params = {
              courseId: this.courseId,
              title: this.ruleForm.themeName,
              type: this.ruleForm.classType
            }
            createCourseTheme(params).then(res => {
              const data = res.data
              if (data.errorCode === 0) {
                this.addThemeVisible = false
                this.$message.success(data.errorMessage)
                this.$emit('toAddTheme')
              } else {
                this.$message.error(data.errorMessage || '新增课程主题失败')
              }
            })
          }else if( this.type == 'edit') { //eslint-disable-line
            const params = {
              id: this.courseId,
              title: this.ruleForm.themeName,
              type: this.ruleForm.classType
            }
            updateCourseTheme(params).then(res => {
              const data = res.data
              if (data.errorCode === 0) {
                this.addThemeVisible = false
                this.$message.success(data.errorMessage)
                this.$emit('toEditTheme')
              } else {
                this.$message.error(data.errorMessage || '编辑课程主题失败')
              }
            })
          }
        } else {
          return false
        }
      })
    },
    cancel(formName) {
      this.addThemeVisible = false
      this.$refs[formName].clearValidate() // 清除校验
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
