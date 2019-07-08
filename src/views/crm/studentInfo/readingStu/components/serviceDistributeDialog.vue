<template>
  <div class="serviceDistributeDialog_container">
    <el-dialog
      :visible.sync="serviceDistributeDialogShow"
      title="分配名单"
      @close="cancelDialog('serviceDistributeDialogForm')"
    >
      <el-form
        ref="serviceDistributeDialogForm"
        :model="serviceDistributeDialogData"
        :rules="rules"
      >
        <div class="title_text">将{{ checkNum }}名学员分配给</div>
        <el-form-item prop="worker">
          <el-select
            v-model="serviceDistributeDialogData.worker"
            placeholder="请选择客服"
            clearable
            filterable
            style="width:100%"
          >
            <el-option
              v-for="item in serviceList"
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
          @click="cancelDialog('serviceDistributeDialogForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('serviceDistributeDialogForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  summaryQueryUsers, // 员工下拉，员工未分类
  allotWaiter2StuPort // 分配客服接口
} from '@/api/crm/studentInfo/readingStu.js'
export default {
  data() {
    return {
      serviceDistributeDialogShow: false,
      serviceDistributeDialogData: {
        worker: ''
      },
      rules: {
        worker: [
          { required: true, message: '请选择客服', trigger: 'change' }
        ]
      },
      serviceList: [], // 员工（客服）列表
      checkNum: '', // 选中的条数
      checkData: [] // 选中的数据
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog(checkedData) {
      if (!!checkedData && checkedData.length > 0) {
        this.serviceDistributeDialogShow = true
        this.checkNum = checkedData.length
        this.checkData = checkedData
        this.getUserList()
        // this.getNum()
      }
    },
    /* 获取员工（客服）列表 */
    getUserList() {
      summaryQueryUsers().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.serviceList = data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.serviceDistributeDialogShow = false
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
            waiterId: this.serviceDistributeDialogData.worker
          }
          allotWaiter2StuPort(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.$message.success(data.errorMessage)
              this.serviceDistributeDialogShow = false
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
.serviceDistributeDialog_container /deep/ {
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

