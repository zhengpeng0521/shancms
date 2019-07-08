<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    title="班级排课"
    width="600px"
    @close="resetForm()"
  >
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item
        label="班级："
        prop="clsId"
      >
        <el-select
          v-model="ruleForm.clsId"
          placeholder="请选择班级"
          style="width:100%"
          filterable
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
        label="排课方式："
        prop="planType"
      >
        <el-radio-group
          v-model="ruleForm.planType"
          @change="planTypeChange"
        >
          <el-radio label="1">单次</el-radio>
          <el-radio label="2">循环</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="ruleForm.planType == '1'">
        <el-form-item
          ref="singleForm"
          label="日期："
          prop="studyDate"
        >
          <el-date-picker
            v-model="ruleForm.studyDate"
            type="date"
            placeholder="选择日期"
            style="width:100%"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <div class="time">
          <el-form-item
            label="时间："
            prop="startTime"
          >
            <el-time-picker
              v-model="ruleForm.startTime"
              placeholder="开始时间"
              value-format="HH:mm"
              format="HH:mm"
              style="width:120px"
            />
          </el-form-item>
          <div style="line-height:28px;margin:0 5px">~</div>
          <el-form-item
            prop="endTime"
            class="end"
          >
            <el-time-picker
              v-model="ruleForm.endTime"
              placeholder="结束时间"
              value-format="HH:mm"
              format="HH:mm"
              style="width:120px"
            />
          </el-form-item>
        </div>
      </div>
      <div v-if="ruleForm.planType == '2'">
        <el-form-item
          v-if="ruleForm.planType == '2'"
          ref="rangeForm"
          label="日期："
          prop="rangeDate"
        >
          <el-date-picker
            v-model="ruleForm.rangeDate"
            type="daterange"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:449px"
            value-format="yyyy-MM-dd"
            @change="rangeDateChange"
          />
        </el-form-item>
        <div
          v-if="isShow"
          class="class_time_list"
        >
          <el-form-item
            label="上课时间："
            style="margin-bottom:0"
          >
            <ul class="class_time_thead">
              <li>星期</li>
              <li>开始时间</li>
              <li>结束时间</li>
            </ul>
          </el-form-item>
          <ul
            v-for="(child, index) of ruleForm.classTimeList"
            :key="index"
            class="class_time_tbody"
          >
            <li>
              <el-form-item
                :prop="'classTimeList.' + index + '.'+'week'"
                :rules="{
                  required: true, message: '请选择星期', trigger: 'change'
                }"
                style="margin-bottom:0"
              >
                <el-select
                  v-model="child.week"
                  placeholder="请选择星期"
                  filterable
                >
                  <el-option
                    v-for="item in weekOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </li>
            <li>
              <el-form-item
                :prop="'classTimeList.' + index + '.' + 'startTime'"
                :rules="{
                  required: true, message: '请选择上课时间', trigger: 'change'
                }"
                style="margin-bottom:0"
              >
                <el-time-picker
                  v-model="child.startTime"
                  :picker-options="{
                    selectableRange: '00:00:00 - 23:59:00'
                  }"
                  format="HH:mm"
                  value-format="HH:mm"
                  style="width:107px"
                  placeholder="上课时间"
                />
              </el-form-item>
            </li>
            <li style="border-right:1px solid #ddd">
              <el-form-item
                :prop="'classTimeList.' + index + '.' + 'endTime'"
                :rules="{
                  required: true, message: '请选择下课时间', trigger: 'change'
                }"
                style="margin-bottom:0"
              >
                <el-time-picker
                  v-model="child.endTime"
                  :picker-options="{
                    selectableRange: '00:00:00 - 23:59:00'
                  }"
                  format="HH:mm"
                  value-format="HH:mm"
                  style="width:107px"
                  placeholder="下课时间"
                />
              </el-form-item>
            </li>
            <li
              v-if="ruleForm.classTimeList.length>1"
              style="border:none;width:60px"
            >
              <a @click="deleteClassTime(index)">删除</a>
            </li>
          </ul>
          <a
            class="class_time_add"
            @click="addClassTime"
          >添加</a>
          <el-form-item
            class="holiday"
            style="margin-bottom:0"
          >
            <el-checkbox v-model="ruleForm.skipHoliday">跳过节假日</el-checkbox>
          </el-form-item>
        </div>
      </div>
      <el-form-item
        label="课程名称："
        prop="title"
      >
        <el-input
          v-model="ruleForm.title"
          placeholder="请输入课程名称"
        />
      </el-form-item>
      <el-form-item label="课程内容：">
        <el-input
          v-model="ruleForm.content"
          :rows="4"
          type="textarea"
          placeholder="请输入课程内容"
        />
      </el-form-item>
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
import { createCourse, batchCreate } from '@/api/nurseryClass/classArrange'
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
        clsId: '',
        planType: '1',
        studyDate: '',
        startTime: '',
        endTime: '',
        title: '',
        content: '',
        rangeDate: [],
        classTimeList: [{
          week: '',
          startTime: '00:00',
          endTime: '00:00'
        }],
        skipHoliday: true
      },
      flag: true,
      isShow: false,
      weekOption: [
        { label: '周一', value: '1' },
        { label: '周二', value: '2' },
        { label: '周三', value: '3' },
        { label: '周四', value: '4' },
        { label: '周五', value: '5' },
        { label: '周六', value: '6' },
        { label: '周日', value: '7' }
      ], // 渲染周信息
      rules: {
        clsId: [
          { required: true, message: '请选择班级', trigger: 'change' }
        ],
        planType: [
          { required: true, message: '请选择排课方式', trigger: 'change' }
        ],
        studyDate: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        title: [
          { required: true, message: '请输入课程名称', trigger: 'change' }
        ],
        rangeDate: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    show(val) {
      this.dialogVisible = true
      this.ruleForm.planType = '1'
      this.ruleForm.rangeDate = []
      this.ruleForm.studyDate = ''
      this.ruleForm.content = ''
      this.ruleForm.startTime = ''
      this.ruleForm.endTime = ''
      this.ruleForm.content = ''
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate()
      })
    },
    /* 添加 */
    addClassTime() {
      const tempData = {
        week: '',
        startTime: '00:00',
        endTime: '00:00'
      }
      this.ruleForm.classTimeList.push(tempData)
    },
    /* 日期区间 */
    rangeDateChange(val) {
      if (val && val.length > 0) {
        this.isShow = true
      } else {
        this.isShow = false
      }
    },
    /* 删除 */
    deleteClassTime(index) {
      this.ruleForm.classTimeList.splice(index, 1)
    },
    submitForm(formName) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if (this.ruleForm.planType == '1') { //eslint-disable-line
            /* 时间处理 */
            const classTimeStart = this.ruleForm.startTime && this.ruleForm.startTime.split(':')
            const classTimeStart1 = classTimeStart && classTimeStart[0]
            const classTimeStart2 = classTimeStart && classTimeStart[1]
            const classTimeEnd = this.ruleForm.endTime && this.ruleForm.endTime.split(':')
            const classTimeEnd1 = classTimeEnd && classTimeEnd[0]
            const classTimeEnd2 = classTimeEnd && classTimeEnd[1]
            if (classTimeStart1 == classTimeEnd1 && classTimeStart2 == classTimeEnd2) { //eslint-disable-line
              this.$message.warning('结束时间不能早于或等于开始时间')
              return
            } else if (classTimeStart1 > classTimeEnd1) {
              this.$message.warning('结束时间不能早于或等于开始时间')
              return
            } else if (classTimeStart1 == classTimeEnd1 && classTimeStart2 > classTimeEnd2) { //eslint-disable-line
              this.$message.warning('结束时间不能早于或等于开始时间')
              return
            }
            const params = {
              clsId: this.ruleForm.clsId,
              studyDate: this.ruleForm.studyDate,
              startTime: this.ruleForm.startTime,
              endTime: this.ruleForm.endTime,
              title: this.ruleForm.title,
              content: this.ruleForm.content
            }
            createCourse(params).then(res => {
              const data = res.data
              if (data.errorCode === 0) {
                this.$emit('toUpdateTable')
                this.dialogVisible = false
                this.$refs['ruleForm'].resetFields()
              } else {
                this.$message.error(data.errorMessage || '排课失败')
              }
            })
          }else if(this.ruleForm.planType == '2') { //eslint-disable-line
            let start
            let end
            if (this.ruleForm.rangeDate) {
              this.flag = false
              start = this.ruleForm.rangeDate[0]
              end = this.ruleForm.rangeDate[1]
              this.ruleForm.classTimeList && this.ruleForm.classTimeList.map((item, index) => {
                const startTime = this.ruleForm.classTimeList[index].startTime.split(':')
                const endTime = this.ruleForm.classTimeList[index].endTime.split(':')
                if (startTime[0] == endTime[0] && startTime[1] == endTime[1]) { //eslint-disable-line
                  this.$message.warning('结束时间不能早于或等于开始时间')
                  this.flag = true
                  return
                } else if (startTime[0] == endTime[0] && startTime[1] > endTime[1]) { //eslint-disable-line
                  this.$message.warning('结束时间不能早于或等于开始时间')
                  this.flag = true
                  return
                } else if (startTime[0] > endTime[0]) {
                  this.$message.warning('结束时间不能早于或等于开始时间')
                  this.flag = true
                  return
                }
              })
              let list = []
              if (this.ruleForm.classTimeList && this.ruleForm.classTimeList.length > 0) {
                  if (this.ruleForm.planType == '1') { //eslint-disable-line
                  list = []
                  } else if (this.ruleForm.planType == '2') { //eslint-disable-line
                  list = this.ruleForm.classTimeList
                }
              }
              if (this.flag) {
                return
              } else {
                const params = {
                  clsId: this.ruleForm.clsId,
                  beginDate: start,
                  endDate: end,
                  title: this.ruleForm.title,
                  content: this.ruleForm.content,
                  holidaySet: this.ruleForm.skipHoliday ? 2 : 1,
                  weeks: list
                }
                batchCreate(params).then(res => {
                  const data = res.data
                  if (data.errorCode === 0) {
                    this.$emit('toUpdateTable')
                    this.dialogVisible = false
                    this.$refs['ruleForm'].resetFields()
                  } else {
                    this.$message.error(data.errorMessage || '排课失败')
                  }
                })
              }
            }
          }
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.dialogVisible = false
      this.$refs['ruleForm'].resetFields()
    },
    planTypeChange(val) {
      if (val == '1') { //eslint-disable-line
        this.$nextTick(() => {
          this.ruleForm.studyDate = ''
          this.$refs['singleForm'].clearValidate()
        })
      } else if (val == '2') { //eslint-disable-line
        this.$nextTick(() => {
          this.ruleForm.rangeDate = []
          this.$refs['rangeForm'].clearValidate()
        })
      }
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
        this.ruleForm.content = ''
        this.ruleForm.startTime = ''
        this.ruleForm.endTime = ''
        this.ruleForm.title = ''
        this.ruleForm.planType = val
        this.ruleForm.classTimeList = [
          {
            week: '',
            startTime: '00:00',
            endTime: '00:00'
          }
        ]
        this.isShow = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.time {
  display: flex;
}
.end /deep/ .el-form-item__content {
  margin-left: 0 !important;
}
a {
  color: #46b6ee;
}
.dialog-footer /deep/ .el-button--danger {
  background: #d0021b;
  border-color: #d0021b;
  color: #fff;
  margin-right: 10px;
}
.class_time_list {
  margin-bottom: 14px;
  .class_time_thead {
    list-style: none;
    display: flex;
    margin: 0;
    padding: 0;
    li {
      width: 120px;
      border: 1px solid #ddd;
      border-right: none;
      background: #f1f1f1;
      text-align: center;
      margin: 0;
      padding: 0;
    }
    :last-child {
      border-right: 1px solid #ddd;
    }
  }
  .class_time_tbody {
    list-style: none;
    display: flex;
    margin: 0 0 0 18.3%;
    padding: 0;
    li {
      width: 120px;
      border: 1px solid #ddd;
      border-top: none;
      border-right: none;
      text-align: center;
      padding: 6px;
      margin: 0;
    }
    li /deep/ .el-form-item__content {
      margin-left: 0 !important;
    }
    li /deep/ .el-input--prefix .el-input__inner {
      padding-left: 15px;
    }
  }
  .class_time_add {
    margin-left: 18%;
    line-height: 30px;
  }
}
</style>
