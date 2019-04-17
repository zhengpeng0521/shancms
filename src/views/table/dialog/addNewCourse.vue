<template>
  <div class="newCourse">
    <el-dialog
      :visible.sync="newdialogVisible"
      title="课程信息"
      width="600px"
    >
      <div class="form">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item
            label="课程名称"
            prop="title"
          >
            <el-input
              v-model="ruleForm.title"
              size="mini"
            />
          </el-form-item>
          <el-form-item
            label="课程课系"
            prop="groupId"
          >
            <el-select
              v-model="ruleForm.groupId"
              placeholder="请选择活动区域"
              size="mini"
            >
              <el-option
                label="区域一"
                value="shanghai"
              />
              <el-option
                label="区域二"
                value="beijing"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="学员大小"
            prop="age"
          >
            <el-radio-group v-model="ruleForm.age">
              <el-radio label="1">月龄</el-radio>
              <el-radio label="2">年龄</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="最小月龄"
            prop="min"
          >
            <el-input
              v-model="ruleForm.min"
              size="mini"
            />
          </el-form-item>
          <el-form-item
            label="最大月龄"
            prop="resource"
          >
            <el-input
              v-model="ruleForm.resource"
              size="mini"
            />
          </el-form-item>
          <el-form-item
            label="每节消耗"
            prop="desc"
          >
            <el-input
              v-model="ruleForm.desc"
              size="mini"
            />
            <div>非负数，可精确到小数后2位，一旦保存不可修改</div>
          </el-form-item>
          <el-form-item
            label="耗课类型"
            prop="resource"
          >
            <el-radio-group v-model="ruleForm.resource">
              <el-radio label="可消耗专用课时，也可消耗通用课时" />
              <el-radio label="只消耗专用课时" />
            </el-radio-group>
            <div>一旦保存不可修改</div>
          </el-form-item>
          <el-form-item
            label="课程介绍"
            prop="desc"
          >
            <el-input
              v-model="ruleForm.desc"
              type="textarea"
              size="mini"
            />
          </el-form-item>
        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          plain
          @click="cancel"
        >取消</el-button>
        <el-button
          type="primary"
          @click="sure('ruleForm')"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      newdialogVisible: false,
      ruleForm: {
        title: '', // 课程名称
        groupId: '', // 课系
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        age: '',
        min: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    show() {
      this.newdialogVisible = true
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    cancel() {
      this.newdialogVisible = false
    },
    sure(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
          this.newdialogVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.newCourse /deep/ {
  .el-form-item__error {
    position: inherit;
  }
}
</style>
