<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="班级排课"
    width="600px"
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
          :disabled="true"
          filterable
          placeholder="请选择班级"
          style="width:449px"
        >
          <el-option
            v-for="item in classNameList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item
        v-if="!isEdit"
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
      </el-form-item> -->
      <!-- <div v-if="ruleForm.planType == '1' || isEdit"> -->
      <el-form-item
        label="日期："
        prop="studyDate"
      >
        <el-date-picker
          :disabled="true"
          v-model="ruleForm.studyDate"
          type="date"
          placeholder="选择日期"
          style="width:449px"
        />
      </el-form-item>
      <div class="time">
        <el-form-item
          label="时间："
          prop="startTime"
        >
          <el-time-picker
            :disabled="true"
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
            :disabled="true"
            v-model="ruleForm.endTime"
            placeholder="结束时间"
            value-format="HH:mm"
            format="HH:mm"
            style="width:120px"
          />
        </el-form-item>
      </div>
      <!-- </div> -->
      <!-- <div v-if="ruleForm.planType == '2'">
        <el-form-item
          v-if="ruleForm.planType == '2'"
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
          />
        </el-form-item>
        <div
          v-if="ruleForm.rangeDate && ruleForm.rangeDate.length>0"
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
      </div> -->
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
      <el-popover
        v-model="delVisible"
        placement="top"
        width="160"
      >
        <p style="margin:8px 0 20px 0">确定要删除该课程吗?</p>
        <div style="text-align: right; margin: 0">
          <el-button
            size="mini"
            class="delete_btn"
            @click="delVisible = false"
          >取消</el-button>
          <el-button
            type="primary"
            size="mini"
            class="edit_btn"
            @click="deleteCourse"
          >确定</el-button>
        </div>
        <el-button
          slot="reference"
          type="danger"
        >删除该课程</el-button>
      </el-popover>
      <el-button
        class="cancel_btn"
        @click="resetForm"
      >取消</el-button>
      <el-button
        type="primary"
        @click="submitForm"
      >确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { courseDetail, courseUpdate, courseDelete } from '@/api/nurseryClass/classArrange'
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
      },
      delVisible: false,
      rowInfo: {}
    }
  },
  methods: {
    show(val) {
      if (val) {
        this.dialogVisible = true
        this.rowInfo = val
        this.getCourseDetail()
      }
    },
    getCourseDetail() {
      const params = {
        id: this.rowInfo.id
      }
      courseDetail(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.ruleForm = data
          this.ruleForm.clsId = data.clsName
        }
      })
    },
    /* 添加 */
    addClassTime() {
      const tempData = {
        week: '',
        startTime: '',
        endTime: ''
      }
      this.ruleForm.classTimeList.push(tempData)
    },
    /* 删除 */
    deleteClassTime(index) {
      this.ruleForm.classTimeList.splice(index, 1)
    },
    /* 确定 */
    submitForm(formName) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const params = {
            id: this.rowInfo.id,
            clsId: this.rowInfo.clsId,
            studyDate: this.ruleForm.studyDate,
            startTime: this.ruleForm.startTime,
            endTime: this.ruleForm.endTime,
            title: this.ruleForm.title,
            content: this.ruleForm.content
          }
          courseUpdate(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.dialogVisible = false
              this.$refs['ruleForm'].resetFields()
              this.$emit('toUpdateTable')
              this.$message.success(data.errorMessage)
            } else {
              this.$message.error(data.errorMessage || '修改失败')
            }
          })
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
      this.$refs['ruleForm'].clearValidate()
    },
    /* 删除课程 */
    deleteCourse() {
      const params = {
        ids: this.rowInfo.id
      }
      courseDelete(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.delVisible = false
          this.dialogVisible = false
          this.$emit('toUpdateTable')
          this.$message.success(data.errorMessage)
        } else {
          this.$message.error(data.errorMessage || '删除失败')
        }
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
