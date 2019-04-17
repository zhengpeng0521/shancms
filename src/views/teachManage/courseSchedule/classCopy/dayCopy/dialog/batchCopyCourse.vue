<template>
  <div class="batchCopy">
    <el-dialog
      :visible.sync="dialogVisible"
      title="批量复制排课"
      width="600px"
      @close="resetForm('ruleForm')"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item
          label="开始日期："
          prop="startTime"
        >
          <el-date-picker
            v-model="ruleForm.startTime"
            :picker-options="pickerOptions"
            type="date"
            placeholder="请选择开始日期"
            value-format="yyyy-MM-dd"
            style="width:450px"
          />
        </el-form-item>
        <el-form-item
          label="结束日期："
          prop="endTime"
        >
          <el-date-picker
            v-model="ruleForm.endTime"
            :picker-options="pickerOptions"
            type="date"
            placeholder="请选择结束日期"
            value-format="yyyy-MM-dd"
            style="width:450px"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="isConflict">检查冲突</el-checkbox>
        </el-form-item>
      </el-form>
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
        >开始复制</el-button>
      </span>
    </el-dialog>
    <CreateArrangeCourseConflict ref="createConflict" />
  </div>
</template>
<script>
import { batchCopyCoursePlan } from '@/api/teachManage/arrangeCourse'
import CreateArrangeCourseConflict from '../../../dialog/createArrangeCourseConflict'

export default {
  components: {
    CreateArrangeCourseConflict
  },
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        startTime: '', // 开始时间
        endTime: '' // 结束时间
      },
      rules: {
        startTime: [
          { required: true, message: '请选择开始日期', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请选择结束日期', trigger: 'blur' }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      isConflict: true, // 是否检查冲突
      cpdIds: [] // 勾选复制的列表
    }
  },
  methods: {
    show(val) {
      if (val) {
        const cpdIdArr = []
        val.map(item => {
          cpdIdArr.push(item.cpdId)
        })
        this.cpdIds = cpdIdArr && cpdIdArr.join(',')
      }
      this.isConflict = true
      this.dialogVisible = true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (new Date(this.ruleForm.startTime).getTime() < new Date(this.ruleForm.endTime).getTime()) {
            const params = {
              cpdIds: this.cpdIds,
              beginTime: this.ruleForm.startTime,
              endTime: this.ruleForm.endTime,
              checkConflict: this.isConflict ? '1' : '0',
              week: '2'
            }
            batchCopyCoursePlan(params).then(res => {
              const data = res.data
              if (data.errorCode === 0) {
                this.dialogVisible = false
              } else if (data.fields && data.fields.length > 0) {
                this.$refs.createConflict.show(data)
              } else {
                this.$message.error(data.errorMessage || '日复制失败')
              }
            })
          } else {
            this.$message.error('开始日期不能大于结束日期')
          }
        } else {
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
