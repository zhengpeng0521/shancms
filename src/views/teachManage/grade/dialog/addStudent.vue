<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      title="添加学员"
      width="400px"
      @close="cancel()"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
      >
        <el-form-item prop="stuId">
          <el-select
            v-model="ruleForm.stuId"
            filterable
            multiple
            placeholder="请选择学员"
            style="width:270px"
            @change="selectStuChange"
          >
            <el-option
              v-for="(item,index) of newStuList"
              :key="index"
              :label="item.stuName"
              :value="item.stuId"
              :disabled="item.display"
            />
          </el-select>
          <span
            style="color:#46B6EE;margin-left:10px;cursor:pointer"
            @click="accurateSearch"
          >精确查找</span>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancel()"
        >取消</el-button>
        <el-button
          :loading="submitLoading"
          type="primary"
          @click="submit()"
        >确定</el-button>
      </span>
    </el-dialog>
    <SelectStudent
      v-if="isShow"
      ref="selectStu"
      :select-list="selectList"
      @toParent="getSelectData"
      @toclose="close"
    />
  </div>
</template>
<script>
import SelectStudent from './selectStudent'
import { stuSummaryQuery, addClassStu, queryClassStuList,queryArrageCourseList } from '@/api/teachManage/grade' //eslint-disable-line
export default {
  components: {
    SelectStudent
  },
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        stuId: [] // 学员id
      },
      rules: {
        stuId: [
          { required: true, message: '请选择学员', trigger: 'change' }
        ]
      },
      newStuList: [], // 在读学员列表
      clsStuIdArr: [], // 班级中的学员ID数组
      rowInfo: {},
      selectList: [],
      stuTableData: [], // 学员表格的数据
      isShow: false,
      submitLoading: false // 保存时loading
    }
  },
  mounted() {

  },
  methods: {
    show(row, list) {
      this.dialogVisible = true
      this.rowInfo = row
      const params = {
        type: '2'
      }
      stuSummaryQuery(params).then(res => {
        const data = res.data
        this.clsStuIdArr = []
        if (data.errorCode === 0) {
          const stuList = []
          data.results.map((item, index) => {
            const stuObj = {}
            const name = item.stuName + ' (' + item.month + '月)'
            stuObj.stuName = name
            stuObj.stuId = item.stuId
            stuList.push(stuObj)
          })
          this.newStuList = stuList
          for (const i in list) {
            for (const j in this.newStuList) {
              if (list[i].stuId == this.newStuList[j].stuId) { //eslint-disable-line
                this.newStuList[j].display = true
                this.clsStuIdArr.push(this.newStuList[j].stuId)
                break
              }
            }
          }
        } else {
          this.$message.error(data.errorMessage || '获取在读学员失败')
        }
      })
    },
    cancel() {
      this.dialogVisible = false
      this.$refs['ruleForm'].clearValidate() // 清除校验
      this.$refs['ruleForm'].resetFields()
    },
    submit() {
      this.submitLoading = true
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const stuStr = this.ruleForm.stuId && this.ruleForm.stuId.join(',')
          const params = {
            clsId: this.rowInfo.clsId,
            stuId: stuStr
          }
          addClassStu(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.dialogVisible = false
              this.$message.success(data.errorMessage)
              this.$emit('toUpdateStuList', this.rowInfo)
            } else {
              this.$message.error(data.errorMessage || '添加学员失败')
            }
            this.submitLoading = false
          })
        } else {
          this.submitLoading = false
          return false
        }
      })
    },
    /* 精确查找 */
    accurateSearch() {
      this.isShow = true
      this.$nextTick(() => {
        this.$refs.selectStu.show(this.ruleForm.stuId, this.clsStuIdArr)
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
    },
    selectStuChange(val) {
      this.selectList = val
    }
  }
}
</script>
>
