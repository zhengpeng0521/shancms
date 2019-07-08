<template>
  <div>
    <el-dialog
      :visible.sync="cancelFreezeVisible"
      :title="title+'学员账户'"
      width="400px"
      center
      class="addFreezeAccountDialog_container"
    >
      <div class="icon-box" style="display:inline-block">
        <i class="el-icon-warning confirm-icon" />
      </div>
      <span class="pupContent">{{ content }}</span>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="cancelFreezeVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Confirm from '@/components/MiniCommon/Confirm'
import { thawStuCard, freezeStuCard } from '@/api/crm/stuAccount/stuAccount.js'
export default {
  components: {
    Confirm
  },
  props: {

  },
  data() {
    return {
      cancelFreezeVisible: false,
      title: '',
      content: '',
      freezeData: {},
      freezeItemStatus: '' // 是否解冻状态
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog(row) {
      this.freezeData = row
      this.title = row.status === '1' ? '冻结' : row.status === '2' ? '解冻' : ''
      this.content = row.status === '1' ? '冻结学员账户，学员无法进入班级、考勤、消课，退出所在班级以及已预约的排课，无法查询数据！' : row.status === '2' ? '解冻学员账户，学员可进入班级、考勤、消课、预约排课、查询数据！' : ''
      this.freezeItemStatus = this.freezeData.status
      this.cancelFreezeVisible = true
    },
    /* 确定提交弹框表单 */
    submitForm() {
      const params = {
        stuCardId: this.freezeData.id
      }
      if (this.freezeItemStatus === '1') {
        freezeStuCard(params).then(res => {
          if (res.data.errorCode === 0) {
            this.$message.success(res.data.errorMessage)
            this.$emit('refreshTableList')
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      } else if (this.freezeItemStatus === '2') {
        thawStuCard(params).then(res => {
          if (res.data.errorCode === 0) {
            this.$message.success(res.data.errorMessage)
            this.$emit('refreshTableList')
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      }
      this.cancelFreezeVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.addFreezeAccountDialog_container /deep/ {
  .el-dialog__body {
    padding: 20px 20px 20px 20px !important;
    max-height: 500px;
    overflow-y: auto;
    line-height: 26px;
  }
  .el-dialog__header .el-dialog__title {
    font-weight: 700;
  }
  .icon-box {
    .confirm-icon {
      font-size: 20px;
      color: #ff0015;
    }
    i{
      vertical-align: middle;
    }
  }
  .pupContent{
    margin-left:4px;
    vertical-align: middle
  }
}
</style>

