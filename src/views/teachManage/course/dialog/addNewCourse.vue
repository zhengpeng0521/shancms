<template>
  <div class="newCourse">
    <el-dialog
      :visible.sync="newdialogVisible"
      title="课程信息"
      width="600px"
      @close="cancel"
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
            label="课程名称："
            prop="title"
          >
            <el-input
              v-model="ruleForm.title"
              placeholder="请输入课程名称"
            />
          </el-form-item>
          <el-form-item
            label="课程课系："
            prop="groupName"
          >
            <el-select
              v-model="ruleForm.groupName"
              placeholder="请选择课系"
            >
              <el-option
                v-for="item of groupList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="学员大小："
            prop="ageType"
          >
            <el-radio-group
              v-model="ruleForm.ageType"
              @change="ageTypeChange"
            >
              <el-radio label="1">月龄</el-radio>
              <el-radio label="2">年龄</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-if="ruleForm.ageType == '1'">
            <el-form-item
              label="最小月龄："
              prop="minMonth"
            >
              <el-input
                :min="0"
                v-model="ruleForm.minMonth"
                type="number"
                placeholder="最小上课月龄"
                style="width:178px"
              />
            </el-form-item>
            <el-form-item
              label="最大月龄："
              prop="maxMonth"
            >
              <el-input
                :min="ruleForm.minMonth"
                v-model="ruleForm.maxMonth"
                placeholder="最大上课月龄"
                type="number"
                style="width:178px"
              />
            </el-form-item>
          </div>
          <div v-if="ruleForm.ageType == '2'">
            <el-form-item
              label="最小年龄："
              prop="minYear"
            >
              <el-input
                :min="0"
                v-model="ruleForm.minYear"
                type="number"
                placeholder="最小上课年龄"
                style="width:178px"
              />
            </el-form-item>
            <el-form-item
              label="最大年龄："
              prop="maxYear"
            >
              <el-input
                :min="1"
                v-model="ruleForm.maxYear"
                placeholder="最大上课年龄"
                type="number"
                style="width:178px"
              />
            </el-form-item>
          </div>
          <el-form-item
            label="每节消耗："
            prop="cost"
          >
            <el-input
              :min="0"
              v-model="ruleForm.cost"
              type="number"
              placeholder="填写每节课程所需的课时数"
              style="width:178px"
            />
            <div class="explain">非负数，可精确到小数后2位，一旦保存不可修改</div>
          </el-form-item>
          <el-form-item
            label="耗课类型："
            prop="costType"
          >
            <el-radio-group v-model="ruleForm.costType">
              <el-radio label="0">可消耗专用课时，也可消耗通用课时</el-radio>
              <el-radio label="1">只消耗专用课时</el-radio>
            </el-radio-group>
            <el-popover
              placement="right"
              trigger="hover"
            >
              <div class="tip_content">
                <div>1.第一种方式，适用于当前课程消课先扣减专用课时，再扣减通用课时的情况</div>
                <div>2.第二种方式，适用于该课程消课时候仅扣减专用课时</div>
              </div>
              <i
                slot="reference"
                class="el-icon-question"
              />
            </el-popover>
            <div class="explain">一旦保存不可修改</div>
          </el-form-item>
          <el-form-item
            label="课程介绍："
            prop="intro"
          >
            <el-input
              v-model="ruleForm.intro"
              placeholder="填写课程相对应的介绍信息..."
              type="textarea"
            />
          </el-form-item>
        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancel('ruleForm')"
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
import { queryCoursegroup, createCourse } from '@/api/teachManage/course' //eslint-disable-line
export default {
  data() {
    /* 整数校验 */
    var checkNum = (rule, value, callback) => {
      if (!/^(0|[1-9][0-9]*)$/.test(value)) {
        callback('请输入整数')
      } else {
        callback()
      }
    }
    /* 校验最大与最小月龄的比较 */
    var checkMaxMonth = (rule, value, callback) => {
      if (!/^(0|[1-9][0-9]*)$/.test(value)) {
        callback('请输入整数')
      } else if (Number(value) <= Number(this.ruleForm.minMonth)) {
        callback('最大月龄不能小于或等于最小月龄')
      } else {
        callback()
      }
    }
    /* 校验最大与最小年龄的比较 */
    var checkMaxYear = (rule, value, callback) => {
      if (!/^(0|[1-9][0-9]*)$/.test(value)) {
        callback('请输入整数')
      } else if (Number(value) <= Number(this.ruleForm.minYear)) {
        callback('最大年龄不能小于或等于最小年龄')
      } else {
        callback()
      }
    }
    var checkCourseNum = (rule, value, callback) => {
      if (value == '' || value == undefined || value == null) { //eslint-disable-line
        callback()
      } else if (!/^[0-9]+(.[0-9]{1,2})?$/.test(value)) {
        callback(new Error('数字格式不正确'))
      } else {
        callback()
      }
    }
    return {
      newdialogVisible: false, // 新增课程显示
      ruleForm: {
        title: '', // 课程名称
        groupName: '', // 课系
        ageType: '1', // 学员大小
        minMonth: '', // 最小月龄
        maxMonth: '', // 最大月龄
        minYear: '', // 最小月龄
        maxYear: '', // 最大月龄
        cost: '', // 每节消耗
        costType: '', // 消耗类型
        intro: '' // 课程介绍
      },
      rules: {
        title: [
          { required: true, message: '请输入课程名称', trigger: 'change' }
        ],
        groupName: [
          { required: true, message: '请选择课系', trigger: 'change' }
        ],
        ageType: [
          { required: true, message: '请选择学员大小', trigger: 'change' }
        ],
        minMonth: [
          { required: true, message: '请输入最小上课月龄', trigger: 'change' },
          { validator: checkNum }
        ],
        maxMonth: [
          { required: true, message: '请输入最大上课月龄', trigger: 'change' },
          { validator: checkMaxMonth }
        ],
        minYear: [
          { required: true, message: '请输入最小上课年龄', trigger: 'change' },
          { validator: checkNum }
        ],
        maxYear: [
          { required: true, message: '请输入最大上课年龄', trigger: 'change' },
          { validator: checkMaxYear }
        ],
        cost: [
          { required: true, message: '填写每节课程所需的课时数', trigger: 'change' },
          { validator: checkCourseNum }
        ],
        costType: [
          { required: true, message: '请选择耗课类型', trigger: 'change' }
        ]
      },
      groupList: [] // 课系列表
    }
  },
  methods: {
    show(val) {
      this.ruleForm.ageType = '1'
      this.ruleForm.minMonth = ''
      this.ruleForm.maxMonth = ''
      this.newdialogVisible = true
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate() // 清除校验
      })
      queryCoursegroup().then(res => {
        if (res.data.errorCode === 0) {
          this.groupList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage || '获取课系失败')
        }
      })
    },
    cancel() {
      this.newdialogVisible = false
      this.$refs['ruleForm'].clearValidate() // 清除校验
      this.$refs['ruleForm'].resetFields()
    },
    ageTypeChange(val) {
      this.$nextTick(() => {
        this.$refs['ruleForm'].clearValidate() // 清除校验
        this.ruleForm.minMonth = ''
        this.ruleForm.maxMonth = ''
        this.ruleForm.minYear = ''
        this.ruleForm.maxYear = ''
      })
    },
    sure(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let min = ''
          let max = ''
          if (this.ruleForm.ageType === '1') {
            min = this.ruleForm.minMonth + ''
            max = this.ruleForm.maxMonth + ''
          } else if (this.ruleForm.ageType === '2') {
            min = this.ruleForm.minYear * 12 + ''
            max = this.ruleForm.maxYear * 12 + ''
          }
          const params = {
            cost: this.ruleForm.cost,
            intro: this.ruleForm.intro,
            title: this.ruleForm.title,
            ageType: this.ruleForm.ageType,
            minMa: min,
            maxMa: max,
            groupId: this.ruleForm.groupName,
            cutType: this.ruleForm.costType
          }
          createCourse(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.newdialogVisible = false
              this.$message.success(data.errorMessage)
              this.$refs[formName].resetFields()
              this.$emit('toAddNewCourse')
            } else {
              this.$message.error(data.errorMessage || '新增课程失败')
            }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.newCourse /deep/ {
  .explain {
    color: rgba(0, 0, 0, 0.43);
    font-size: 12px;
  }
  .el-radio + .el-radio {
    margin-right: 16px;
  }
  .tip_content {
    font-size: 12px;
    text-align: left;
  }
}
</style>
