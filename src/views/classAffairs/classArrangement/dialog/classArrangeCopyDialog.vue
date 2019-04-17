<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    title="排课复制"
    width="600px"
  >
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="复制类型：">
        <el-radio-group
          v-model="ruleForm.week"
          @change="weekChange"
        >
          <el-radio label="1">周复制</el-radio>
          <el-radio label="2">日复制</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="ruleForm.week == '1'">
        <p>复制从</p>
        <el-form-item
          label="班级："
          prop="clsFrom"
        >
          <el-select
            v-model="ruleForm.clsFrom"
            placeholder="请选择班级"
            style="width:100%"
          >
            <el-option
              v-for="item in classNameList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="周数："
          prop="clsWeek"
        >
          <el-date-picker
            v-model="ruleForm.clsWeek"
            style="width:100%"
            type="week"
            format="yyyy-W周"
            placeholder="选择周"
          />
        </el-form-item>
        <p>复制到</p>
        <el-form-item
          label="班级："
          prop="clsTo"
        >
          <el-select
            v-model="ruleForm.clsTo"
            placeholder="请选择班级"
            style="width:100%"
          >
            <el-option
              v-for="item in classNameList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="开始周数："
          prop="startWeek"
        >
          <el-date-picker
            v-model="ruleForm.startWeek"
            :picker-options="weekOptions"
            style="width:100%"
            type="week"
            format="yyyy-W周"
            placeholder="选择开始周数"
          />
        </el-form-item>
        <el-form-item
          label="结束周数："
          prop="endWeek"
        >
          <el-date-picker
            :picker-options="weekOptions"
            v-model="ruleForm.endWeek"
            style="width:100%"
            type="week"
            format="yyyy-W周"
            placeholder="选择结束周数"
          />
        </el-form-item>
      </div>
      <div v-if="ruleForm.week == '2'">
        <p>复制从</p>
        <el-form-item
          label="班级："
          prop="clsFrom"
        >
          <el-select
            v-model="ruleForm.clsFrom"
            placeholder="请选择班级"
            style="width:100%"
          >
            <el-option
              v-for="item in classNameList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="日期："
          prop="clsDate"
        >
          <el-date-picker
            v-model="ruleForm.clsDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            style="width:100%"
          />
        </el-form-item>
        <p>复制到</p>
        <el-form-item
          label="班级："
          prop="clsTo"
        >
          <el-select
            v-model="ruleForm.clsTo"
            placeholder="请选择班级"
            style="width:100%"
          >
            <el-option
              v-for="item in classNameList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="开始日期："
          prop="startDate"
        >
          <el-date-picker
            v-model="ruleForm.startDate"
            :picker-options="pickerOptions"
            style="width:100%"
            type="date"
            placeholder="选择开始日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item
          label="结束日期："
          prop="endDate"
        >
          <el-date-picker
            v-model="ruleForm.endDate"
            :picker-options="pickerOptions"
            style="width:100%"
            type="date"
            placeholder="选择结束日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </div>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        class="cancel_btn"
        @click="resetForm"
      >取消</el-button>
      <el-button
        type="primary"
        @click="submitForm"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { copyCourse } from '@/api/nurseryClass/classArrange'
export default {
  props: {
    classNameList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        week: '1',
        clsFrom: '',
        clsWeek: '',
        clsTo: '',
        startWeek: '',
        endWeek: '',
        clsDate: '', // 日期
        startDate: '',
        endDate: ''
      },
      rules: {
        week: [
          { required: true, message: '请选择复制类型', trigger: 'change' }
        ],
        clsFrom: [
          { required: true, message: '请选择班级', trigger: 'change' }
        ],
        clsWeek: [
          { required: true, message: '请选择周数', trigger: 'change' }
        ],
        clsTo: [
          { required: true, message: '请选择班级', trigger: 'change' }
        ],
        startWeek: [
          { required: true, message: '请选择开始周数', trigger: 'change' }
        ],
        endWeek: [
          { required: true, message: '请选择结束周数', trigger: 'change' }
        ],
        clsDate: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: '请选择结束日期', trigger: 'change' }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      weekOptions: {
        disabledDate: this.disabledDate,
        firstDayOfWeek: 1
      }
    }
  },
  methods: {
    show() {
      this.dialogVisible = true
      this.ruleForm.week = '1'
    },
    weekChange(val) {
      this.ruleForm.clsFrom = ''
      this.ruleForm.clsTo = ''
      this.$refs['ruleForm'].clearValidate()
      this.$refs['ruleForm'].resetFields()
    },
    /* 周的禁用日期 */
    disabledDate(time) {
      var weekOfday = this.$moment().format('d')
      var lastSunday = this.$moment()
        .subtract(weekOfday, 'days')
        .format('YYYY-MM-DD')
      return time.getTime() < new Date(lastSunday).getTime()
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
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.ruleForm.week == '1') { //eslint-disable-line
            const clsStartDate = this.fmtDate(new Date(this.ruleForm.clsWeek))
            const clsEndDate = this.fmtDate(new Date(clsStartDate).getTime() + 6 * 24 * 60 * 60 * 1000)
            const startDate = this.fmtDate(new Date(this.ruleForm.startWeek))
            const startDate1 = this.fmtDate(new Date(this.ruleForm.endWeek))
            const endDate = this.fmtDate(new Date(startDate1).getTime() + 6 * 24 * 60 * 60 * 1000)
            const params = {
              week: '1',
              clsStartDate: clsStartDate,
              clsEndDate: clsEndDate,
              startDate: startDate,
              endDate: endDate,
              clsFrom: this.ruleForm.clsFrom,
              clsTo: this.ruleForm.clsTo
            }
            copyCourse(params).then(res => {
              const data = res.data
              if (data.errorCode === 0) {
                this.dialogVisible = false
                this.$emit('toUpdateTable')
                this.$refs['ruleForm'].resetFields()
              } else {
                this.$message.error(data.errorMessage || '复制排课失败')
              }
            })
          } else if (this.ruleForm.week == '2') { //eslint-disable-line
            const params = {
              week: '2',
              clsStartDate: this.ruleForm.clsDate,
              clsEndDate: this.ruleForm.clsDate,
              startDate: this.ruleForm.startDate,
              endDate: this.ruleForm.endDate,
              clsFrom: this.ruleForm.clsFrom,
              clsTo: this.ruleForm.clsTo
            }
            copyCourse(params).then(res => {
              const data = res.data
              if (data.errorCode === 0) {
                this.dialogVisible = false
                this.$emit('toUpdateTable')
                this.$refs['ruleForm'].resetFields()
              } else {
                this.$message.error(data.errorMessage || '复制排课失败')
              }
            })
          }
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.dialogVisible = false
      this.$refs['ruleForm'].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
