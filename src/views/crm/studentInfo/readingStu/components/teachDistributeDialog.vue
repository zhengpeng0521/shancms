<template>
  <div class="distributeDialog_container">
    <el-dialog
      :visible.sync="distributeDialogShow"
      title="分配名单"
      @close="cancelDialog('distributeDialogForm')"
    >
      <el-form
        ref="distributeDialogForm"
        :model="distributeDialogData"
        :rules="rules"
      >
        <div class="title_text">将{{ checkNum }}名学员分配给</div>
        <el-form-item prop="worker">
          <el-select
            v-model="distributeDialogData.worker"
            placeholder="请选择老师"
            clearable
            filterable
            style="width:100%"
          >
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('distributeDialogForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('distributeDialogForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { summaryQueryUsers, allotTeacher2Stu } from '@/api/crm/studentInfo/readingStu'
export default {
  data() {
    return {
      distributeDialogShow: false,
      distributeDialogData: {
        worker: ''
      },
      rules: {
        worker: [
          { required: true, message: '请选择老师', trigger: 'change' }
        ]
      },
      teacherList: [], // 教师列表
      checkNum: '', // 选中的条数
      checkData: [] // 选中的数据
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog(checkedData) {
      if (!!checkedData && checkedData.length > 0) {
        this.distributeDialogShow = true
        this.checkNum = checkedData.length
        this.checkData = checkedData
        this.getUserList()
        // this.getNum()
      }
    },
    /* 获取教师列表 */
    getUserList() {
      summaryQueryUsers().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.teacherList = data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.distributeDialogShow = false
      this.$refs[formName].resetFields()
      this.$emit('toParent')
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let stuIds = ''
          const stuArr = []
          this.checkData && this.checkData.map(item => {
            stuArr.push(item.id)
          })
          stuIds = stuArr && stuArr.join(',')
          const params = {
            stuIds: stuIds,
            teacherId: this.distributeDialogData.worker
          }
          allotTeacher2Stu(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.$message.success(data.errorMessage)
              this.distributeDialogShow = false
              this.$emit('toUpdateTable')
            } else {
              this.$message.error(data.errorMessage)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.distributeDialog_container /deep/ {
  .el-dialog {
    width: 500px;
  }
  .title_text {
    margin-bottom: 16px;
  }
}
.leads_follow_modals_alert_message {
  span {
    color: #ff5500;
    padding: 0 15px;
  }
  div {
    line-height: 20px;
    text-indent: 2.5rem;
  }
  div:last-child {
    color: #ff5500;
  }
}
</style>

