<template>
  <div>
    <side-dialog
      :visible.sync="sideDialogShow"
      class="contractSideDialog_container"
    >
      <div class="contractSide">
        <div class="info_head">
          <div class="head_top">
            <div class="top_left">
              <img src="https://img.ishanshan.com/gimg/n/20190330/632d9f9b8d2a9d0b3b938bd9eaa6b880">
              <div class="name">合同订单</div>
            </div>
            <div class="top_right">
              <el-button
                v-if="isEditBtnShow && hasBtn('406000002')"
                type="primary"
                @click="editContractOrderDialog"
              >编辑</el-button>
              <el-button
                v-if="isUpdateDataShow && hasBtn('406000008')"
                class="cancel_btn"
                style="margin-left: 10px;"
                @click="updateTimeDialog()"
              >修改合同期限</el-button>
              <el-button
                v-if="isOnceComShow"
                class="cancel_btn"
                style="margin-left: 10px;"
                @click="onceCommitDialog"
              >再次提交</el-button>

              <Confirm
                v-if="isDeleConShow"
                :text="'删除'"
                :placement="'top'"
                :content="'确定删除合同吗？'"
                :confirm="()=>{deleteOrderFun()}"
                :is-button="true"
                :btn-class="'cancel_btn'"
                style="margin-left:10px"
              />

              <el-button
                v-if="isMgrFileShow"
                class="cancel_btn"
                style="margin-left: 10px;"
                @click="mgrAccessoryDialog()"
              >管理附件</el-button>

              <Confirm
                v-if="isConInvalidShow && hasBtn('406000005')"
                :text="'作废'"
                :placement="'top'"
                :content="'确定要将该合同作废吗？'"
                :confirm="()=>{invalidOrderFun()}"
                :is-button="true"
                :btn-class="'cancel_btn'"
                style="margin-left: 10px;"
              />
              <el-button
                v-if="normalGiveDialogHidden"
                class="cancel_btn"
                style="margin-left: 5px;"
                @click="printContractFun"
              >打印</el-button>
            </div>
          </div>
          <div class="head_con">
            <div>
              <p>
                <span>合同编号: </span>
                <span>{{ contractRowList.orderNum || '--' }}</span>
              </p>
              <p>
                <span>审核状态: </span>
                <span>{{ contractRowList.orderStateName || '--' }}</span>
              </p>
              <p v-if="normalGiveDialogHidden">
                <span>收款状态: </span>
                <span>{{ contractRowList.receiptStatusName || '--' }}</span>
              </p>
            </div>
            <div>
              <p>
                <span>创建人: </span>
                <span>{{ contractRowList.orderCreatePerson || '--' }}</span>
              </p>
              <p v-if="normalGiveDialogHidden">
                <span>套餐类型: </span>
                <span>{{ contractRowList.orderType && contractRowList.orderType == '2' ? '课时套餐' : '托班套餐' }}</span>
              </p>
            </div>
          </div>
        </div>
        <!-- 表格tab切换 -->
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick(activeName)"
        >
          <el-tab-pane
            v-if="normalGiveDialogHidden"
            label="收款单"
            name="1"
          >
            <ReceiptTabCom ref="receiptTabCom" />
          </el-tab-pane>
          <el-tab-pane
            label="合同详情"
            name="2"
          >
            <DetailTabCom ref="detailTabCom" />
          </el-tab-pane>
          <el-tab-pane
            label="审核记录"
            name="3"
          >
            <CheckTabCom ref="checkTabCom" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </side-dialog>
    <!-- 修改合同期限弹框组件 -->
    <UpdateTimeDialog
      ref="updateTimeDialog"
      @toContractSideList="toContractPage"
    />
    <!-- 再次提交 -->
    <CommitOnceDialog
      ref="commitOnceDialog"
      @toContractSide="toContractPage"
    />
    <!-- 管理附件弹框组件 -->
    <MgrAccessoryDialog
      ref="mgrAccessoryDialog"
      @toContractDetail="getContractInfo"
    />
    <!-- 打印合同弹框组件 -->
    <PrintContractDialog ref="printContractDialog" />
  </div>
</template>

<script>
import {
  payInfoList, // 收款单
  invalidOrder, // 合同作废
  deleteOrder, // 删除合同
  getOrder // 编辑合同详情
} from '@/api/crm/contract/contract.js'
import SideDialog from '@/components/SideDialog'
import ReceiptTabCom from './receiptTabCom.vue'
import DetailTabCom from './detailTabCom.vue'
import CheckTabCom from './checkTabCom.vue'
import UpdateTimeDialog from './updateTimeDialog.vue'
import MgrAccessoryDialog from './mgrAccessoryDialog.vue'
import CommitOnceDialog from './commitOnceDialog.vue'
import ContractOrderDialog from './../components/contractOrderDialog.vue'
import Confirm from '@/components/MiniCommon/Confirm'
import PrintContractDialog from './printContractDialog.vue'
export default {
  components: {
    SideDialog,
    ContractOrderDialog,
    CommitOnceDialog, // 再次提交
    ReceiptTabCom, // 收款单组件
    DetailTabCom, // 合同详情组件
    CheckTabCom, // 审核记录组件
    UpdateTimeDialog, // 修改合同期限弹框组件
    MgrAccessoryDialog, // 管理附件弹框组件
    PrintContractDialog, // 打印合同弹框
    Confirm // 确认弹框
  },
  data() {
    return {
      sideDialogShow: false,
      activeName: '1',
      visible2: false, // 合同作废气泡显隐
      visibleDelete: false, // 删除合同气泡显隐
      contractRowList: {}, // 单条合同详情信息
      isEditBtnShow: false, // 编辑按钮显隐
      isUpdateDataShow: false, // 修改合同期限按钮显隐
      isOnceComShow: false, // 再次提交按钮显隐
      isDeleConShow: false, // 删除按钮显隐
      isMgrFileShow: false, // 管理附件按钮显隐
      isConInvalidShow: false, // 合同作废按钮显隐
      isPaperShow: true, // 合同打印按钮显隐
      rowList: {},
      normalGiveDialogHidden: true // 合同详情正式合同显示，但是赠送合同不显示的内容
    }
  },
  methods: {
    /* 打开侧边弹框 */
    showSideDialog(rowlist) {
      this.rowList = rowlist
      this.normalGiveDialogShowHidden(rowlist) // 正常合同和赠送合同详情弹窗显示不同
      // 待审核 代收款
      if(rowlist.orderState == '1' && rowlist.receiptStatus == '0') { //eslint-disable-line
        this.isEditBtnShow = true
        this.isUpdateDataShow = true
        this.isDeleConShow = true
        this.isOnceComShow = false
        this.isMgrFileShow = false
        this.isConInvalidShow = false
        this.isPaperShow = true
      }
      // 已审核 代收款
      if(rowlist.orderState == '4' && rowlist.receiptStatus == '0') { //eslint-disable-line
        this.isUpdateDataShow = true
        this.isMgrFileShow = true
        this.isConInvalidShow = true
        this.isEditBtnShow = false
        this.isOnceComShow = false
        this.isDeleConShow = false
        this.isPaperShow = true
      }
      // 已审核 已收款
      if(rowlist.orderState == '4' && rowlist.receiptStatus == '1') { //eslint-disable-line
        this.isUpdateDataShow = true
        this.isMgrFileShow = true
        this.isConInvalidShow = true
        this.isEditBtnShow = false
        this.isOnceComShow = false
        this.isDeleConShow = false
        this.isPaperShow = true
      }
      // 未通过 未收款
      if(rowlist.orderState == '3' && rowlist.receiptStatus == '0') { //eslint-disable-line
        this.isEditBtnShow = true
        this.isOnceComShow = true
        this.isUpdateDataShow = false
        this.isDeleConShow = false
        this.isMgrFileShow = false
        this.isConInvalidShow = false
        this.isPaperShow = true
      }
      // 已通过 部分收款
      if(rowlist.orderState == '4' && rowlist.receiptStatus == '2') { //eslint-disable-line
        this.isUpdateDataShow = true
        this.isMgrFileShow = true
        this.isConInvalidShow = true
        this.isEditBtnShow = false
        this.isOnceComShow = false
        this.isDeleConShow = false
        this.isPaperShow = true
      }
      // 已作废
      if(rowlist.orderState == '5') { //eslint-disable-line
        this.isEditBtnShow = false
        this.isUpdateDataShow = false
        this.isOnceComShow = false
        this.isDeleConShow = false
        this.isMgrFileShow = false
        this.isConInvalidShow = false
        this.isPaperShow = false
      }
      this.sideDialogShow = true
      // 包含正式，赠送
      if (rowlist.purchaseType === '1') { // 弹窗出现后显示的第一个tab
        this.contractRowList = rowlist
        this.activeName = '1'
        this.$refs.receiptTabCom.options.apiService = payInfoList
        this.$refs.receiptTabCom.getOpenList(this.contractRowList.orderNumber)
      // 赠送
      } else if (rowlist.purchaseType === '2') {
        this.contractRowList = rowlist
        this.activeName = '2'
        this.$refs.detailTabCom.getDetailList(this.contractRowList.orderNumber)
      // 正式合同， 不包含赠送
      } else {
        this.$nextTick(() => {
          this.contractRowList = rowlist
          this.activeName = '1'
          this.$refs.receiptTabCom.options.apiService = payInfoList
          this.$refs.receiptTabCom.getOpenList(this.contractRowList.orderNumber)
        })
      }
    },

    // 正常合同和赠送合同打开的详情弹窗不同，进行显隐操作
    normalGiveDialogShowHidden(rowlist) {
      if (rowlist.purchaseType === '1') {
        this.normalGiveDialogHidden = true // 正式合同显示全部
      } else if (rowlist.purchaseType === '2') {
        this.normalGiveDialogHidden = false // 赠送合同显示部分
      } else {
        this.normalGiveDialogHidden = true // 正式合同和赠送合同显示全部
      }
    },

    /* 打印合同弹框 */
    printContractFun() {
      this.$refs.printContractDialog.showDialog(this.rowList)
    },
    /* 编辑合同订单 */
    editContractOrderDialog() {
      this.getOrderFun()
    },
    /* 合同编辑数据接口 */
    getOrderFun() {
      const params = {
        orderId: this.contractRowList.orderNumber
      }
      getOrder(params).then(res => {
        if (res.data.errorCode === 0) {
          this.$emit('toEidtContract', res.data)
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 修改合同期限组件 */
    updateTimeDialog() {
      this.$refs.updateTimeDialog.showDialog(this.contractRowList)
    },
    /* 再次提交弹框 */
    onceCommitDialog() {
      this.$refs.commitOnceDialog.showDialog(this.contractRowList)
    },
    /* 更新合同列表 */
    toContractPage() {
      this.sideDialogShow = false
      this.$emit('toContractList')
    },
    /* 合同作废 */
    invalidOrderFun() {
      const params = {
        purchaseId: this.contractRowList.orderNumber
      }
      invalidOrder(params).then(res => {
        if (res.data.errorCode === 0) {
          this.visible2 = false
          this.sideDialogShow = false
          this.$message.success(res.data.errorMessage)
          this.$emit('toContractList')
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 删除合同 */
    deleteOrderFun() {
      const params = {
        orderId: this.contractRowList.orderNumber
      }
      deleteOrder(params).then(res => {
        if (res.data.errorCode === 0) {
          this.visibleDelete = false
          this.sideDialogShow = false
          this.$message.success(res.data.errorMessage)
          this.$emit('toContractList')
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 管理附件弹框组件 */
    mgrAccessoryDialog() {
      this.$refs.mgrAccessoryDialog.showDialog(this.contractRowList)
    },
    /* 附件修改后更新合同详情 */
    getContractInfo() {
      this.$refs.detailTabCom.getDetailList(this.contractRowList.orderNumber)
    },
    /* tab切换点击 */
    handleClick(tab, event) {
      if (tab == '1') { //eslint-disable-line
        this.$refs.receiptTabCom.options.apiService = payInfoList
        this.$refs.receiptTabCom.getOpenList(this.contractRowList.orderNumber)
      }
      if(tab == '2'){ //eslint-disable-line
        this.$refs.detailTabCom.getDetailList(this.contractRowList.orderNumber)
      }
      if(tab == '3') { //eslint-disable-line
        this.$refs.checkTabCom.getCheckTabList(this.contractRowList.orderNumber)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.contractSideDialog_container {
  .contractSide /deep/ {
    .el-tabs__nav-wrap {
      background-color: #fff;
    }
  }
  .info_head {
    display: flex;
    flex-wrap: wrap;
    -webkit-box-pack: start;
    justify-content: flex-start;
    overflow: hidden;
    .head_top {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      -webkit-box-align: center;
      width: 100%;
      padding: 20px 20px 0 20px;
      -webkit-box-pack: justify;
      justify-content: space-between;
      .top_left {
        width: 50%;
        display: flex;
        flex-wrap: nowrap;
        -webkit-box-align: center;
        align-items: center;
        img {
          width: 40px;
          height: 40px;
          margin-right: 20px;
        }
        .name {
          font-size: 16px;
          color: #333;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
        }
      }
      .top_right {
        -webkit-box-pack: end;
        justify-content: flex-end;
        width: 50%;
        display: flex;
        flex-wrap: nowrap;
        -webkit-box-align: center;
        align-items: center;
      }
    }
    .head_con {
      width: 100%;
      padding: 0 20px 5px 80px;
      color: #999;
      margin-top: 10px;
      div {
        display: flex;
        p {
          width: calc((100% - 80px) / 3);
          margin-right: 20px;
          margin-bottom: 10px;
          span:nth-child(2) {
            color: #666;
          }
        }
      }
    }
  }
}
</style>

