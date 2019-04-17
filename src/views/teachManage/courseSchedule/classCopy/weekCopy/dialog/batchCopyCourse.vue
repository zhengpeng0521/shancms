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
          label="开始周数："
          prop="startTime"
        >
          <el-date-picker
            v-model="ruleForm.startTime"
            :picker-options="pickerOptions"
            type="week"
            format="yyyy-WW周"
            placeholder="选择周"
            style="width:100%"
          />
        </el-form-item>
        <el-form-item
          label="结束周数："
          prop="endTime"
        >
          <el-date-picker
            v-model="ruleForm.endTime"
            :picker-options="pickerOptions"
            type="week"
            format="yyyy-WW周"
            placeholder="选择周"
            style="width:100%"
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
          { required: true, message: '请选择开始周数', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择结束周数', trigger: 'change' }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      isConflict: true, // 是否检查冲突
      cpdIds: '',
      startWeek: '',
      endWeek: ''
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
    /* 时间戳转日期 */
    fmtDate(obj) {
      var date = new Date(obj)
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return (
        y +
        '-' +
        m.substring(m.length - 2, m.length) +
        '-' +
        d.substring(d.length - 2, d.length)
      )
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var start = new Date(this.ruleForm.startTime)
          this.startWeek = this.fmtDate(start)
          var end = new Date(this.ruleForm.endTime)
          const endWeek1 = this.fmtDate(end)
          const endWeek2 = new Date(endWeek1).getTime() + 6 * 24 * 60 * 60 * 1000
          this.endWeek = this.fmtDate(endWeek2)
          const startWeek = this.$moment(start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate())
          const endWeek = this.$moment(end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate())
          if (startWeek.isAfter(endWeek, 'week') && !startWeek.isSame(endWeek, 'week')) {
            this.$message.error('开始周数不能大于结束周数！')
          } else {
            const params = {
              cpdIds: this.cpdIds,
              beginTime: this.startWeek,
              endTime: this.endWeek,
              checkConflict: this.isConflict ? '1' : '0',
              week: '1'
            }
            batchCopyCoursePlan(params).then(res => {
              const data = res.data
              if (data.errorCode === 0) {
                this.dialogVisible = false
                this.$message.success(data.errorMessage)
              } else if (data.fields && data.fields.length > 0) {
                this.$refs.createConflict.show(data)
              } else {
                this.$message.error(data.errorMessage || '周复制失败')
              }
            })
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
