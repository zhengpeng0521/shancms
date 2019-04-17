<template>
  <div class="fetchNameDialog_container">
    <el-dialog
      :visible.sync="fetchNameDialogShow"
      title="捞取名单"
      @close="cancelDialog('distributeDialogForm')"
    >
      <div
        v-if="leadsFollowMax !=-1"
        key="leads_follow_modals_alert_message"
      >
        <div
          v-if="parseInt(checkNum)+parseInt(currentNum)>parseInt(leadsFollowMax)"
          class="leads_follow_modals_alert_message"
        >
          <span>温馨提示</span>
          <div>
            您已选中的名单数：{{ checkNum }}
          </div>
          <div>
            您还能捞取名单数：{{ parseInt(leadsFollowMax) - parseInt(currentNum) }}
          </div>
          <div>
            已超出{{ parseInt(checkNum) + parseInt(currentNum) - parseInt(leadsFollowMax) }}个，请重新捞取！
          </div>
        </div>
        <div
          v-else
          class="title_text"
        >您是否将捞取的{{ checkNum }}个名单分配给自己?</div>
      </div>
      <div
        v-else
        class="warmWarning"
      >
        <span>温馨提示</span>
        <div class="title_text">您将捞取{{ checkNum }}个名单到自己名下，是否确定</div>
      </div>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog()"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm()"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { queryAllotData, changeLeadsSeller } from '@/api/crm/studentInfo/highSeas'
export default {
  data() {
    return {
      fetchNameDialogShow: false,
      checkNum: '',
      leadsFollowMax: '', // 可捞取的最大人数
      currentNum: 0, // 当前拥有人数
      checkedData: [] //  选中的数据
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog(checkedData) {
      if (!!checkedData && checkedData.length > 0) {
        this.checkNum = checkedData.length
        this.checkedData = checkedData
        queryAllotData().then(res => {
          const data = res.data
          if (data.errorCode === 0) {
            this.fetchNameDialogShow = !this.fetchNameDialogShow
            this.leadsFollowMax = data.allowNum
            data.results && data.results.map(item => {
              if (item.sellerId == this.$store.getters.id) { //eslint-disable-line
                this.currentNum = item.hasNum
              }
            })
          } else {
            this.$message.error(data.errorMessage)
          }
        })
      }
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.fetchNameDialogShow = false
      this.$emit('toParent')
    },
    /* 确定提交弹框表单内容 */
    submitForm() {
      let stuIds = ''
      const stuArr = []
      if (parseInt(this.checkNum) + parseInt(this.currentNum) > parseInt(this.leadsFollowMax) && this.leadsFollowMax != -1) { //eslint-disable-line
        this.fetchNameDialogShow = false
      } else {
        if (this.checkedData && this.checkedData.length > 0) {
          this.checkedData.map(item => {
            stuArr.push(item.id)
          })
          stuIds = stuArr && stuArr.join(',')
          const params = {
            sellerId: this.$store.getters.id,
            gain: '1',
            stuIds: stuIds
          }
          changeLeadsSeller(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.fetchNameDialogShow = false
              this.$message.success(data.errorMessage)
              this.$emit('toUpdateTable')
            } else {
              this.$message.error(data.errorMessage)
            }
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fetchNameDialog_container /deep/ {
  .el-dialog {
    width: 500px;
  }
  .title_text {
    margin-bottom: 14px;
    color: #ff5500;
  }
}
.warmWarning {
  span {
    color: #ff5500;
  }
}
.leads_follow_modals_alert_message {
  span {
    color: #ff5500;
  }
  div {
    line-height: 20px;
    text-indent: 2rem;
  }
  div:last-child {
    color: #ff5500;
  }
}
</style>

