<template>
  <div class="turnOtherDialog_container">
    <el-dialog
      :visible.sync="turnOtherDialogShow"
      title="转给他人"
      @close="cancelDialog('turnOtherForm')"
    >
      <el-form
        ref="turnOtherForm"
        :model="turnOtherData"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item
          label="选择销售:"
          prop="seller"
        >
          <el-select
            v-model="turnOtherData.seller"
            placeholder="请选择销售"
            clearable
            style="width:100%"
            @change="turnChange"
          >
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div
          v-if="isWarnVisible"
          class="turn_tip_text"
        >
          <span>温馨提示</span>
          <span v-if="isNumOutVisible">该员工名单数已达上限，请重新处理</span>
          <span v-if="!isNumOutVisible">可以分配给该员工</span>
        </div>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('turnOtherForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('turnOtherForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { tenantUserSummaryQuery, queryAllotData, changeLeadsSeller } from '@/api/crm/studentInfo/lantentStu'
export default {
  data() {
    return {
      turnOtherDialogShow: false,
      turnOtherData: {
        seller: ''
      },
      rules: {
        seller: [
          { required: true, message: '请选择销售', trigger: 'change' }
        ]
      },
      rowInfo: {},
      isWarnVisible: false,
      userList: [], // 员工列表
      leadsFollowMax: 0, // 可捞取的最大人数
      currentNum: 0, // 当前拥有人数
      currentSellerList: [], // 销售分配人数
      isNumOutVisible: false // 是否超出人数
    }
  },
  methods: {
    /* 选择销售输入框 */
    turnChange(value) {
      if (this.leadsFollowMax == -1) { //eslint-disable-line
        this.isWarnVisible = false
      } else {
        this.isWarnVisible = true
        let flag = false // 判断此员工是否分配过名单
        this.currentSellerList && this.currentSellerList.map(item => {
          if (item.sellerId == value) { //eslint-disable-line
            this.currentNum = item.hasNum
            if (parseInt(this.currentNum) + 1 > parseInt(this.leadsFollowMax)) {
              flag = true // 员工已分配过leads
              this.isNumOutVisible = true
            }
          }
        })
        if (!flag) {
          if (this.leadsFollowMax < 1) {
            this.isNumOutVisible = true
          } else {
            this.isNumOutVisible = false
          }
        }
      }
    },
    /* 员工列表 */
    getTeacher() {
      tenantUserSummaryQuery({ status: '1' }).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.userList = data.results
        } else {
          this.$message.error(data.errorMessage || '获取员工列表失败')
        }
      })
    },
    /* 分配数量 */
    getNum() {
      queryAllotData().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.getTeacher()
          this.turnOtherDialogShow = !this.turnOtherDialogShow
          this.leadsFollowMax = data.allowNum
          this.currentSellerList = data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 显示弹框 */
    showDialog(row) {
      this.rowInfo = row
      this.getNum()
      this.isWarnVisible = false
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.turnOtherDialogShow = false
      this.$refs[formName].resetFields()
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.isNumOutVisible) {
            const params = {
              sellerId: this.turnOtherData.seller,
              stuIds: this.rowInfo.id
            }
            changeLeadsSeller(params).then(res => {
              const data = res.data
              if (data.errorCode === 0) {
                this.turnOtherDialogShow = false
                this.$message.success(data.errorMessage)
                this.$emit('toUpdateTable', this.row)
              } else {
                this.$message.error(data.errorMessage)
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.turnOtherDialog_container /deep/ {
  .el-dialog {
    width: 500px;
  }
  .turn_tip_text {
    padding-left: 90px;
    margin-bottom: 16px;
    span:first-child {
      color: #ff7f75;
    }
  }
}
</style>
