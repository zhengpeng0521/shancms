<template>
  <div>
    <el-dialog
      :visible.sync="cancelClassDialogShow"
      title="新增消课记录"
      class="addCancelClassDialog_container"
      @close="cancelDialog('cancelClassForm')"
    >
      <el-form
        ref="cancelClassForm"
        :model="cancelClassData"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item
          label="学员账户号:"
          prop="students"
        >
          <span>{{ cancelClassData.cardId || '选择学员自动带出' }}</span>
        </el-form-item>
        <el-form-item
          label="消课学员:"
          prop="selectInput"
        >
          <el-select
            v-model="cancelClassData.selectInput"
            clearable
            placeholder="请选择学员"
            style="width: 100%"
            @change="cancelStuChange(cancelClassData.selectInput,cancelStuList)"
          >
            <el-option
              v-for="item in cancelStuList"
              :key="item.stuId"
              :label="item.name"
              :value="item.stuId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="消课课程:"
          prop="selectArry"
        >
          <el-select
            v-model="cancelClassData.selectArry"
            :loading="loading"
            clearable
            multiple
            placeholder="请选择消课课程"
            style="width: 100%"
            @change="cancelClassValue"
          >
            <el-option
              v-for="item in allClassList"
              :key="item.courseId"
              :label="item.courseName"
              :value="item.courseId"
            />
          </el-select>
        </el-form-item>
        <div
          v-show="isShowUserInput"
          class="classUser_input"
        >
          <el-form-item
            v-for="(child, index) in selectClassList"
            :key="index + 'selectClass'"
            :show-message="false"
            :label="renderProp(child)"
            :prop="cancelClassData[child]"
            :rules="{
              required: true, message: '可精确到小数点后2位，不能超过可消课数', trigger: 'change'
            }"
          >
            <el-input
              v-model="cancelClassData[child]"
              :placeholder="getCourseFreezeHolder(child)"
              clearable
              @change="userInputChange"
            />
            <span
              ref="userInput"
              class="user_class_tip"
            >可精确到小数点后2位, 不能超过可消课时数</span>
          </el-form-item>
        </div>
        <el-form-item
          label="消课原因:"
          prop="cancelBecause"
        >
          <el-input
            v-model="cancelClassData.cancelBecause"
            clearable
            type="textarea"
            placeholder="请输入消课原因"
          />
          <span class="because_textarea_input">温馨提示：手动消课将无法将课时统计到相应的课程和老师，会影响部分<br>统计数据准确性，请慎用
          </span>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('cancelClassForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('cancelClassForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getStuInfoList, getBaseInfo, createRepealCourse } from '@/api/crm/stuAccount/stuAccount.js'
export default {
  data() {
    return {
      cancelClassDialogShow: false,
      cancelClassData: {
        cardId: '',
        reviewer: '',
        selectInput: '',
        selectArry: [],
        classTime: '12',
        cancelBecause: ''
      },
      selectClassList: [], // 选择消课课程的数组
      cancelStuList: [], // 获取取消课程下拉列表所有数据
      allClassList: [], // 获取消课学员下拉列表数据
      isShowUserInput: false, // 通用课程显隐
      loading: false,
      rules: {
        selectInput: [
          { required: true, message: '请选择消课学员', trigger: 'change' }
        ],
        selectArry: [
          { type: 'array', required: true, message: '请选择消课课程', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    renderProp(id) {
      let name = ''
      this.allClassList.forEach(item => {
        if (item.courseId === id) {
          name = item.courseName
        }
      })
      return name
    },
    /* 消课学员输入框值改变 */
    cancelStuChange(value, all) {
      const params = {
        cardId: '',
        stuId: ''
      }
      this.cancelStuList.map((item, index) => {
        if(value == item.stuId){ //eslint-disable-line
          params.cardId = item.cardId
          params.stuId = item.stuId
          this.cancelClassData.reviewer = item.stuId // 学员账户号
          this.cancelClassData.cardId = item.cardId // 会员卡号
        }
      })
      getBaseInfo(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allClassList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 显示弹框 */
    showDialog(row) {
      this.cancelClassData.cardId = row.id
      this.cancelClassData.selectArry = []
      this.cancelClassDialogShow = !this.cancelClassDialogShow
      this.getStuInfoListData()
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.cancelClassDialogShow = false
      this.$refs[formName].resetFields()
    },
    /* 确定提交弹框表单 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const courseInfo = []
          this.selectClassList.map((item, index) => {
            courseInfo.push({ courseId: item, courseNum: this.cancelClassData[item] })
          })
          const params = {
            stuId: this.cancelClassData.reviewer || '',
            cardId: this.cancelClassData.cardId || '',
            courseInfo: JSON.stringify(courseInfo),
            reason: this.cancelClassData.cancelBecause
          }
          createRepealCourse(params).then(res => {
            if (res.data.errorCode === 0) {
              this.cancelClassDialogShow = false
              this.$message.success(res.data.errorMessage)
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        }
      })
    },
    /** 获取课程冻结信息 */
    getCourseFreezeHolder(courseId) {
      let holder = ''
      this.allClassList.forEach(item => {
        if (item.courseId === courseId) {
          holder = '可消' + item.periodLeft + '课时, 已锁定' + item.periodFreeze + '课时'
        }
      })
      return holder
    },
    /* 消课学员下拉列表 */
    getStuInfoListData() {
      if (this.cancelClassData.cardId) {
        this.loading = true
        const params = {
          cardId: this.cancelClassData.cardId
        }
        getStuInfoList(params).then(res => {
          if (res.data.errorCode === 0) {
            this.cancelStuList = res.data.results
            if (this.cancelStuList && this.cancelStuList[0] && this.cancelStuList[0].stuId) {
              this.cancelClassData.selectInput = this.cancelStuList[0] || {}
              this.cancelStuChange(this.cancelStuList[0].stuId)
            }
          } else {
            this.$message.error(res.data.errorMessage)
          }
          this.loading = false
        })
      } else {
        this.$message.error('学员账户不存在')
      }
    },
    /* 通用课程输入框值改变 */
    userInputChange(value) {
    },
    /* 消课课程下拉框值改变 */
    cancelClassValue(value, e) {
      this.selectClassList = value
      value.forEach(item => {
        this.cancelClassData[item] = ''
      })

      this.isShowUserInput = true
    }
  }
}
</script>

<style lang="scss" scoped>
.addCancelClassDialog_container /deep/ {
  .el-dialog {
    width: 600px;
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
</style>

