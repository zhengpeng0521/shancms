<template>
  <div>
    <el-dialog
      :visible.sync="batchHandCurDialogShow"
      title="批量手动消课"
      class="addbatchHandCurDialog_container"
      @close="cancelDialog('batchHandCurForm')"
    >
      <el-form
        ref="batchHandCurForm"
        :model="batchHandCurData"
        :rules="rules"
        label-width="90px"
      >

        <!-- 消耗课程 -->
        <el-form-item
          label="消耗课程:"
          prop="selectClass"
        >
          <el-select
            v-model="batchHandCurData.selectClass"
            clearable
            placeholder="请选择消耗课程"
            style="width: 60%"
            @change="courseChange"
          >
            <el-option
              key="0"
              label="通用课时"
              value="0"
            />
            <el-option
              v-for="item in allCourseList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <!-- 消耗课时 -->
        <el-form-item
          label="消耗课时:"
          prop="selectInput"
        >
          <el-input
            v-model="batchHandCurData.selectInput"
            clearable
            style="width: 60%"
            placeholder="请输入消耗课时"
          />
        </el-form-item>

        <!-- 选择学员 -->
        <el-form-item
          label="选择学员:"
          prop="students"
        >
          <div>
            <span>
              {{ selectStuStr }}
            </span>
            <el-button slot="append" type="primary" icon="el-icon-circle-plus-outline" @click="selectStudentDialog()">选择学员</el-button>
          </div>
        </el-form-item>

        <!-- 消课原因 -->
        <el-form-item
          label="消课原因:"
          prop="cancelBecause"
        >
          <el-input
            v-model="batchHandCurData.cancelBecause"
            clearable
            type="textarea"
            placeholder="请输入消课原因"
          />
          <span class="because_textarea_input">温馨提示：手动批量消课将无法将课时统计到老师，会影响部分数据的准确性，请慎用！
          </span>
        </el-form-item>

      </el-form>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('batchHandCurForm')"
        >取 消</el-button>
        <el-button
          type="primary"

          @click="submitForm('batchHandCurForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 选择学员 -->
    <SelectStudentDialog
      v-if="selectStuDialogShow"
      ref="selectStudentDialog"
      :select-course="courseChangeVal"
      @toParent="getSelectData"
      @toclose="close"
    />
    <!-- 成功进度条 -->
    <div
      v-if="processDialogShow"
      class="batchHandProcessDiv"
    >
      <el-progress
        v-if="processDialogShow"
        :percentage="percentage"
        type="circle"
        class="batchHandProcess"
      />
    </div>

    <BatchHandCurResultDialog
      v-if="batchHandCurResultDialogVisible"
      ref="batchHandCurResultDialog"
      @close="batchHandCurResultDialogClose"
    />
  </div>
</template>

<script>
// import { getStuInfoList, getBaseInfo, createRepealCourse } from '@/api/crm/stuAccount/stuAccount.js'
import SelectStudentDialog from './selectStudentDialog.vue'
import BatchHandCurResultDialog from './batchHandCurResultDialog.vue'
import {
  summaryQueryCourse, // 选择课时下拉列表
  batchRepealCourse, // 批量消课
  batchRepealResult // 查询批量消课结果
} from '@/api/crm/stuAccount/stuAccount.js'
export default {
  components: {
    SelectStudentDialog,
    BatchHandCurResultDialog
  },
  data() {
    return {
      batchHandCurDialogShow: false, // 消课弹框
      batchHandCurResultDialogVisible: false, // 消课结果弹框
      processDialogShow: false, // 进度条弹框
      percentage: 0, // 进度值
      batchHandCurData: {
        cardId: '',
        reviewer: '',
        selectClass: '',
        cancelBecause: '',
        selectInput: '', // 消耗的课时
        students: '' // 选中的学员
      },
      selectStuDialogShow: false, // 选择学员弹框
      selectInputTimeVal: '', // 要消耗的课时
      courseChangeVal: '', // 课程ID
      selectClassList: [], // 选择消课课程的数组
      cancelStuList: [], // 获取取消课程下拉列表所有数据
      allClassList: [], // 获取消课学员下拉列表数据
      allCourseList: [], // 选择课程下拉列表
      loading: false,
      classStu: [], // 选中学员
      selectStuArr: [],
      rules: {
        selectClass: [
          { required: true, message: '请选择消课课程', trigger: 'change' }
        ],
        selectInput: [
          { required: true, message: '请输入消耗课时', trigger: 'change' }
        ],
        students: [
          { validator: (rule, value, callback) => {
            if (this.selectStuArr.length <= 0) {
              callback(new Error())
            } else {
              callback()
            }
          }, message: '请正确选择学员', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    selectStuStr() {
      let ret = this.selectStuArr.length < 4
        ? this.selectStuArr.map((item, index) => {
          return item.stuName
        }).join(',')
        : this.selectStuArr.slice(0, 3).map((item, index) => {
          return item.stuName
        }).join(',')
      ret += this.selectStuArr.length > 3 ? '等' + this.selectStuArr.length + '人' : ''
      return ret
    }
  },
  methods: {
    close() {
      this.selectStuDialogShow = false
    },
    getSelectData(stuIds, selectItem) {
      this.classStu = stuIds
      this.selectStuArr = selectItem
    },
    courseChange(val) {
      this.courseChangeVal = val
      this.selectStuArr = []
      this.classStu = []
    },
    /* 选择学员框 */
    selectStudentDialog(courseChangeVal) {
      if (!this.courseChangeVal || this.courseChangeVal.length < 0) {
        this.$refs.batchHandCurForm.validateField('selectClass')
        return
      }
      this.selectStuDialogShow = true
      this.$nextTick(() => {
        this.$refs.selectStudentDialog.show(this.classStu, this.selectStuArr)
      })
    },

    /* 显示弹框 */
    showDialog() {
      this.batchHandCurDialogShow = !this.batchHandCurDialogShow
      this.getSummaryQueryCourse()
    },

    /* 获取选择课程下拉列表 */
    getSummaryQueryCourse() {
      summaryQueryCourse().then(res => {
        if (res.data.errorCode === 0) {
          this.allCourseList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    /* 关闭弹框 */
    cancelDialog(formName) {
      this.selectStuArr = []
      this.classStu = []
      this.batchHandCurDialogShow = false
      this.$refs[formName].resetFields()
    },

    /** 提交消课 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const courseInfo = []
          courseInfo.push({
            courseId: this.batchHandCurData.selectClass,
            courseNum: this.batchHandCurData.selectInput
          })
          const params = {
            courseInfo: JSON.stringify(courseInfo),
            reason: this.batchHandCurData.cancelBecause,
            stuInfo: JSON.stringify(this.selectStuArr)
          }
          batchRepealCourse(params).then(res => {
            if (res.data.errorCode === 0) {
              this.batchHandCurDialogShow = false
              this.getBatchRepealResult(res.data.data)
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        }
      })
    },
    /** 查询批量消课结果 */
    getBatchRepealResult(batchKey) {
      this.processDialogShow = true
      const processInterval = setInterval(() => {
        batchRepealResult({ batchKey }).then(res => {
          if (parseInt(res.data.count) === parseInt(res.data.resultSize)) {
            this.percentage = 100
            this.$nextTick(() => {
              this.processDialogShow = false
            })
            clearInterval(processInterval)
            if (res.data.failedResult && res.data.failedResult.length > 0) {
              this.batchHandCurResultDialogShow(res.data.failedResult, batchKey)
            } else {
              this.$message.success('批量消课成功')
            }
          } else {
            this.percentage = parseInt(res.data.resultSize / res.data.count * 100)
          }
        })
      }, 1000)
    },
    /** 消课结果弹框显示 */
    batchHandCurResultDialogShow(results, batchKey) {
      this.batchHandCurResultDialogVisible = true
      this.$nextTick(() => {
        this.$refs.batchHandCurResultDialog.showResults(results, batchKey)
      })
    },
    /** 消课结果弹框关闭 */
    batchHandCurResultDialogClose() {
      this.batchHandCurResultDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.addbatchHandCurDialog_container /deep/ {
  .el-dialog {
    width: 32%;
  }
  .classUser_input {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 0;
    }
    .el-form-item--mini .el-form-item__content,
    .el-form-item--mini .el-form-item__label {
      line-height: 20px;
    }
    .user_class_tip {
      font-size: 10px;
      color: rgba(0, 0, 0, 0.43);
    }
  }
  .because_textarea_input {
    font-size: 10px;
    line-height: 15px;
    display: inline-block;
    color: rgba(0, 0, 0, 0.43);
  }
}
  .batchHandProcess /deep/ {
    position: absolute;
    top: calc( 50% - 63px);
    left: calc( 50% - 63px);
    .el-progress__text {
      color: white;
    }
  }
  .batchHandProcessDiv {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 3000;
  }
</style>

