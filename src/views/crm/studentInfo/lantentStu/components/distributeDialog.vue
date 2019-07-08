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
        label-width="90px"
      >
        <div class="title_text">请为已选中的{{ checkNum }}个名单分配负责销售</div>
        <el-form-item
          label="选择销售:"
          prop="worker"
        >
          <el-select
            v-model="distributeDialogData.worker"
            placeholder="请选择销售"
            clearable
            filterable
            style="width:100%"
            @change="selectChange"
          >
            <el-option
              v-for="item in sellerList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div
        v-show="visible && leadsFollowMax!=-1"
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
          已超出{{ parseInt(checkNum) + parseInt(currentNum) - parseInt(leadsFollowMax) }}个，请重新分配！
        </div>
      </div>
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
import { tenantUserSummaryQuery, queryAllotData, changeLeadsSeller } from '@/api/crm/studentInfo/highSeas' //eslint-disable-line
export default {
  data() {
    return {
      distributeDialogShow: false,
      distributeDialogData: {
        worker: ''
      },
      rules: {
        worker: [
          { required: true, message: '请选择销售', trigger: 'change' }
        ]
      },
      leadsFollowMax: 0, // 可捞取的最大人数
      currentNum: 0, // 当前拥有人数
      sellerList: [], // 销售列表
      checkNum: '', // 选中的条数
      checkData: [], // 选中的数据
      visible: false,
      currentSellerList: [] // 有人数分配的销售
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog(checkedData) {
      if (!!checkedData && checkedData.length > 0) {
        this.checkNum = checkedData.length
        this.checkData = checkedData
        this.getUserList()
        this.getNum()
        this.visible = false
      }
    },
    /* 选择改变 */
    selectChange(val) {
      this.visible = false
      this.currentSellerList && this.currentSellerList.map(item => {
        if (item.sellerId == val) { //eslint-disable-line
          this.currentNum = item.hasNum
          if (parseInt(this.checkNum) + parseInt(this.currentNum) > parseInt(this.leadsFollowMax)) {
            this.visible = true
          }
        }
      })
    },
    /* 分配数量 */
    getNum() {
      queryAllotData().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.distributeDialogShow = !this.distributeDialogShow
          this.leadsFollowMax = data.allowNum
          this.currentSellerList = data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 获取销售列表 */
    getUserList() {
      tenantUserSummaryQuery().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.sellerList = data.results
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
          if (parseInt(this.checkNum) + parseInt(this.currentNum) > parseInt(this.leadsFollowMax) && this.leadsFollowMax != -1) { //eslint-disable-line
            this.distributeDialogShow = false
          } else {
            let stuIds = ''
            const stuArr = []
            if (parseInt(this.checkNum) + parseInt(this.currentNum) > parseInt(this.leadsFollowMax) && this.leadsFollowMax != -1) { //eslint-disable-line
              this.fetchNameDialogShow = false
            } else {
              if (this.checkData && this.checkData.length > 0) {
                this.checkData.map(item => {
                  stuArr.push(item.id)
                })
                stuIds = stuArr && stuArr.join(',')
                const params = {
                  sellerId: this.distributeDialogData.worker,
                  stuIds: stuIds
                }
                changeLeadsSeller(params).then(res => {
                  const data = res.data
                  if (data.errorCode === 0) {
                    this.distributeDialogShow = false
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
    padding: 0 15px;
    margin-bottom: 16px;
    color: #ff7f75;
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

