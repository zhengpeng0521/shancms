<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      title="班级信息"
      width="400px"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
      >
        <el-form-item>
          <el-select
            v-model="ruleForm.stuId"
            placeholder="请选择学员"
            multiple
            style="width:280px"
          >
            <el-option
              v-for="item in searchStuList"
              :disabled="item.display"
              :key="item.stuId"
              :label="item.stuName"
              :value="item.stuId"
            />
          </el-select>
          <a @click="accurateSearch">精确查找</a>
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
        >保存</el-button>
      </span>
    </el-dialog>
    <SelectStudent
      v-if="isShow"
      ref="selectStu"
      @toParent="getSelectData"
      @toclose="close"
    />
    <AddError ref="addError" />
  </div>
</template>
<script>
import { stuSummaryQuery, addStudent } from '@/api/nurseryClass/gradeManage'
import SelectStudent from './selectStudent'
import AddError from './addError'
export default {
  components: {
    SelectStudent,
    AddError
  },
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        stuId: []
      },
      rules: {
        stuId: [
          { required: true, message: '请选择学员', trigger: 'change' }
        ]
      },
      searchStuList: [], // 学员下拉列表
      rowInfo: {},
      isShow: false // 精确查找是否显示
    }
  },
  methods: {
    show(list, row) {
      this.dialogVisible = true
      this.rowInfo = row
      this.ruleForm.stuId = []
      this.$nextTick(() => {
        this.$refs['ruleForm'].resetFields()
      })
      this.searchStuList = []
      stuSummaryQuery({ type: '1' }).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          const stuList = data.results
          stuList.map((item, index) => {
            const stuObj = {}
            const name = item.stuName + '(' + Math.floor(item.month / 12) + '岁)'
            stuObj.stuName = name
            stuObj.stuId = item.stuId
            this.searchStuList.push(stuObj)
          })
          for (const i in list) {
            for (const j in this.searchStuList) {
            if (list[i].id == this.searchStuList[j].stuId) { //eslint-disable-line
                this.searchStuList[j].display = true
                break
              }
            }
          }
        }
      })
    },
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const stuStr = this.ruleForm.stuId && this.ruleForm.stuId.join(',')
          const params = {
            clsId: this.rowInfo.id,
            stuIds: stuStr,
            add: '1'
          }
          addStudent(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.dialogVisible = false
              this.$message.success(data.errorMessage)
              this.$emit('toUpdateStuList', this.rowInfo)
            } else if (data.errorCode === 110603) {
              this.$refs.addError.show(data)
            } else {
              this.$message.error(data.errorMessage || '添加学员失败')
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.$refs['ruleForm'].resetFields()
      this.dialogVisible = false
    },
    /* 精确查找 */
    accurateSearch() {
      this.isShow = true
      this.$nextTick(() => {
        this.$refs.selectStu.show(this.ruleForm.stuId)
      })
    },
    close(val) {
      this.isShow = val
    },
    /* 获取精确查找的数据 */
    getSelectData(val) {
      if (this.ruleForm.stuId) {
        this.ruleForm.stuId = val
      } else {
        this.ruleForm.stuId = val
      }
    }
  }
}
</script>
<style lang="scss" scoped>
a {
  color: #46b6ee;
  float: right;
}
</style>
