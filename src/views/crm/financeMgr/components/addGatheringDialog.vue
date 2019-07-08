<template>
  <div class="addGatheringDialog_container">
    <el-dialog
      :visible.sync="addGatheringDialogShow"
      :close-on-click-modal="false"
      title="合同收款单"
      @close="cancelDialog('addGatheringForm')"
    >
      <el-form
        ref="addGatheringForm"
        :model="addGatheringData"
        label-width="90px"
      >
        <div style="padding: 0 25px; box-sizing: border-box;">
          <el-form-item
            label="学员姓名:"
            prop="stuId"
          >
            <el-select
              v-model="addGatheringData.stuId"
              placeholder="请选择学员姓名"
              clearable
              filterable
              style="width:80%"
              @change="selectStuChange"
            >
              <el-option
                v-for="item in stuList"
                :key="item.stuId"
                :label="item.stuName"
                :value="item.stuId"
              />
            </el-select>
            <span
              style="color:#46b6ee; margin-left: 10px;cursor: pointer;"
              @click="openSearchDialog()"
            >精确查找</span>
          </el-form-item>
          <el-form-item
            label="合同编号:"
            prop="contractNum"
          >
            <el-select
              v-model="addGatheringData.contractNum"
              placeholder="请选择合同编号"
              clearable
              filterable
              style="width:100%"
              @change="contractNumChange"
            >
              <el-option
                v-for="(item,index) in contractList"
                :key="index"
                :label="item.orderNumber"
                :value="item.orderNumber"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="合同金额:"
            prop="price"
          >
            <div>{{ addGatheringData.orderMoney || 0.00 }} 元</div>
            <div>{{ addGatheringData.conOrder }}</div>
          </el-form-item>
        </div>
        <div class="online_box_wrap">
          <div class="online_box_body">
            <!-- 定金信息 -->
            <!-- 定金已经绑定该合同-->
            <div
              v-if="depositChecked && depositSelect && depositSelect.id"
              class="online_body_first"
            >
              <div class="body_first_text">
                <span>
                  定金金额:
                  <i>{{ depositSelect.money }}</i>
                </span>
                <span>
                  方式:
                  <i>{{ depositSelect.paName }}</i>
                </span>
                <span>
                  时间:
                  <i>{{ depositSelect.createTime }}</i>
                </span>
              </div>
              <div class="body_first_btn">
                <a style="color: rgb(0, 134, 28)">已确认</a>
              </div>
            </div>
            <!-- 有定金,并选择其中的一条 -->
            <div
              v-else-if="depositList && depositList.length > 0 && depositSelect && depositSelect.id && addGatheringData.contractNum"
              class="online_body_first"
            >
              <div class="body_first_text">
                <span>
                  定金金额:
                  <i>{{ depositSelect.money }}</i>
                </span>
                <span>
                  方式:
                  <i>{{ depositSelect.paName }}</i>
                </span>
                <span>
                  时间:
                  <i>{{ depositSelect.createTime }}</i>
                </span>
              </div>
              <div class="body_first_btn">
                <el-popover
                  v-model="moneyVisible"
                  placement="top"
                  trigger="click"
                >
                  <div>
                    <i class="el-icon-warning confirm-icon" />
                    <p style="margin:4px 4px 16px 0;display:inline-block">确定收款？</p>
                  </div>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      size="mini"
                      class="cancel_btn edit_btn"
                      @click="moneyVisible = false"
                    >取消</el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      class="edit_btn"
                      @click="sureBindDeposit(depositSelect)"
                    >确定</el-button>
                  </div>
                  <a slot="reference">确认</a>
                </el-popover>
                <el-popover
                  placement="bottom"
                  style="min-width: 50px !important;"
                  trigger="click"
                >
                  <div>
                    <div
                      v-for="(item, index) of depositList"
                      :key="index + '_allPurchaseID'"
                      style="cursor: pointer"
                      @click="selectShowOk(item)"
                    >{{ item.id }}</div>
                    <div
                      style="cursor: pointer"
                      @click="selectNothing"
                    >不关联</div>
                  </div>
                  <a
                    slot="reference"
                    style="padding-right: 20px;color: #46b6ee;"
                  >选择</a>
                </el-popover>
              </div>
            </div>
            <!-- 其他定金行为处理 -->
            <div
              v-else
              class="online_body_first"
              style="height: 36px;line-height: 36px"
            >
              <div style="display: flex; justify-content: space-between;">
                <span>未关联定金</span>
                <el-popover
                  placement="bottom"
                  style="min-width: 50px !important;"
                  trigger="click"
                >
                  <div>
                    <div
                      v-for="(item, index) of depositList"
                      :key="index + '_allPurchaseID'"
                      style="cursor: pointer"
                      @click="selectShowOk(item)"
                    >{{ item.id }}</div>
                    <div
                      style="cursor: pointer"
                      @click="selectNothing"
                    >不关联</div>
                  </div>
                  <a
                    slot="reference"
                    style="color: #46b6ee;"
                  >选择</a>
                </el-popover>
              </div>
            </div>

            <!-- 收款信息  -->
            <div class="from_con_second">
              <el-collapse v-model="activeNames">
                <el-collapse-item name="1">
                  <template slot="title">
                    已收金额:<i>￥{{ allPayMoneyList.allMoneyNum || '0' }}</i>
                  </template>
                  <div
                    v-for="(item, index) of allPayMoneyList"
                    :key="index + '_paymoney'"
                  >
                    <div v-if="item.status !== '3'">
                      <span style="margin-right: 15px;">
                        金额: {{ item.money }}元
                      </span>
                      <span style="margin-right: 15px;">
                        方式: {{ item.paymentName }}
                      </span>
                      <span style="margin-right: 15px;">
                        收款状态: {{ item.statusName }}
                      </span>
                      <span>
                        时间: {{ item.createTime }}
                      </span>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
            <div
              v-if="addGatheringData.needPayMoney > 0 && addGatheringData.contractNum"
              class="from_con_fourth"
            >
              <div class="from_con_wrap">
                <div class="from_con_body">
                  <div class="from_fourth_img">
                    <img src="https://img.ishanshan.com/gimg/img/f4033ff0ece7e09ee302c7927d84edc3">
                  </div>
                  <div style="width: 85%">
                    <el-select
                      v-model="addGatheringData.payType"
                      clearable
                      filterable
                      placeholder="请选择收款方式"
                      style="width: 42%"
                      @change="payTypeChange(addGatheringData.payType)"
                    >
                      <el-option
                        v-for="item in allPaymentList"
                        :key="item.id"
                        :label="item.paymentKey === 'xianjin' ? item.paymentKeyName : (item.paymentKeyName + '-' + item.name + '-' + item.acctNo)"
                        :value="item.id"
                      />
                    </el-select>
                    <el-input
                      v-model="addGatheringData.perMoney"
                      clearable
                      style="width:20%;margin: 0 5px;"
                      @input="perMoneyChange"
                    />
                    <el-input
                      v-model="addGatheringData.rate"
                      clearable
                      placeholder="手续费率:0.00%"
                      class="rateInput"
                      style="width:33%;"
                      disabled
                    />
                    <el-input
                      v-model="addGatheringData.orderId"
                      clearable
                      placeholder="支付宝流水号"
                      style="width:100%;margin-top: 10px;"
                    />
                  </div>
                </div>
                <div class="from_fourth_bottom">
                  <div>
                    <span>实际到账: <i>{{ addGatheringData.realMoney || '0.00' }}</i></span>
                  </div>
                  <div>
                    <el-button
                      class="cancel_btn"
                      size="mini"
                      @click="cancelHandsBtn()"
                    >重填</el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="payOrderSure()"
                    >确认</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </el-dialog>
    <!-- 在线收款弹框 -->
    <!-- <el-dialog
      :visible.sync="onlineMoneyDialogShow"
      title="在线收款"
      @close="closeOnlineDialog()"
    >
      <div class="right_bot_wrap">
        <div class="bottom_img">
          <img src="https://img.ishanshan.com/gimg/img/f4033ff0ece7e09ee302c7927d84edc3">
        </div>
        <div class="bottom_text_box">
          <p>电脑端收银</p>
          <p>合同在线收款，支持支付宝微信，费率低至<br>0.4%</p>
          <div class="open_btn">
            <el-button
              class="cancel_btn"
              @click="noPassBtn()"
            >暂不开通</el-button>
            <el-button
              type="primary"
              size="mini"
            >免费开通</el-button>
          </div>
        </div>
      </div>
    </el-dialog> -->
    <!-- 精确查找弹框组件 -->
    <ExactSearchDialog
      v-if="exactVisible"
      ref="exactSearchDialog"
      @toStudentName="getStudentName"
    />
  </div>
</template>

<script>
import { summaryQuery, queryOrder } from '@/api/crm/financeMgr/financeMgr'
import ExactSearchDialog from './../../integralMgr/components/exactSearchDialog.vue'
import {
  getOrderDetailById, payInfoList, queryPurchaseDeposit, payOrder, queryPaymentAccountList, bindDeposit // 收款方式列表查询
  // 合同详情
} from '@/api/crm/contract/contract.js'
export default {
  components: {
    ExactSearchDialog
  },
  data() {
    return {
      addGatheringDialogShow: false,
      addGatheringData: {
        stuId: '',
        contractNum: '',
        orderMoney: '', // 合同金额
        conOrder: '', // 课程
        perMoney: '', // 待收金额
        needPayMoney: '', // 未收款金额
        payType: '', // 收款方式
        conMoney: '', // 收款金额
        rateInfo: '',
        rate: '', // 手续费率
        orderId: '', // 交易流水号
        realMoney: '' // 实际到账
      },
      moneyVisible: false, // 确定收款气泡
      activeNames: [],
      onlineMoneyDialogShow: false,
      stuList: [], // 学员下拉列表
      selectStu: {},
      exactVisible: false, // 精确查找弹窗
      contractList: [], // 合同下拉列表
      allPayMoneyList: [], // 已收金额数据
      allPaymentList: [], // 收款方式列表查询
      depositList: [], // 定金详情数据
      depositSelect: {}, // 定金选中的选项
      depositChecked: false, // 定金是否已经关联
      contractOrderDetail: {} // 合同收款详情数据
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog() {
      this.getStuList()
      this.queryPaymentAccountListFun()
      this.depositSelect = {}// 定金选中的选项
      this.depositChecked = false// 定金是否已经关联
      this.addGatheringData.contractNum = ''
      this.addGatheringData.orderMoney = '0.00'
      this.addGatheringData.conOrder = ''
      this.addGatheringData.payType = ''
      this.addGatheringData.orderId = ''
      this.addGatheringDialogShow = true
    },
    /* 获取所有在读学员的列表 */
    getStuList() {
      summaryQuery().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.stuList = data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.addGatheringData.orderMoney = 0.00
      this.addGatheringData.conOrder = ''
      this.$nextTick(() => {
        this.addGatheringDialogShow = false
      })
      this.$refs[formName].resetFields()
      this.$emit('close')
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addGatheringDialogShow = false
        }
      })
    },
    /* 在线收款弹框 */
    openOnlineDialog() {
      this.onlineMoneyDialogShow = !this.onlineMoneyDialogShow
    },
    /* 关闭在线收款弹框 */
    closeOnlineDialog() {
      this.onlineMoneyDialogShow = false
    },
    /* 暂不通过 */
    noPassBtn() {
      this.onlineMoneyDialogShow = false
    },
    /* 获取精确查找传的学员信息 */
    getStudentName(value, stuId) {
      this.addGatheringData.stuId = stuId
    },
    /* 学员值改变 */
    selectStuChange(value) {
      this.stuList.map(item => {
        if(value == item.stuId){ //eslint-disable-line
          item.name = item.stuName
          this.selectStu = item
        }
      })
      this.depositSelect = {}// 定金选中的选项
      this.depositChecked = false// 定金是否已经关联
      this.addGatheringData.contractNum = ''
      this.addGatheringData.orderMoney = '0.00'
      this.addGatheringData.conOrder = ''
      this.addGatheringData.payType = ''
      this.addGatheringData.orderId = ''
      queryOrder({ stuId: value }).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.contractList = data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 合同编号改变 */
    contractNumChange(val) {
      this.contractList && this.contractList.map(item => {
        if (item.orderNumber == this.addGatheringData.contractNum) { //eslint-disable-line
          this.addGatheringData.orderMoney = item.orderMoney
          getOrderDetailById({ id: val }).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.contractOrderDetail = data.data
              this.contractOrderDetail.classpkg.map(item => {
                this.addGatheringData.conOrder = item.name + ' X ' + item.amount
              })
              this.queryPurchaseDepositFun(this.contractOrderDetail, this.addGatheringData.stuId)
              this.updateGatheringPerMoney()
            }
          })
          this.payInfoListFun(val)
        }
      })
    },
    /* 定金详情列表数据 */
    queryPurchaseDepositFun(rowlist, stuIdNum) {
      const params = {
        stuId: stuIdNum,
        orderNumber: rowlist.orderNumber,
        pageSize: 99999
      }
      queryPurchaseDeposit(params).then(res => {
        if (res.data.errorCode === 0) {
          // this.depositList = res.data.results
          this.queryMoneyList(res.data.results)
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 定金列表逻辑处理 */
    queryMoneyList(depositList) {
      if (depositList && depositList.length > 0) {
        const dataDepositList = []
        let dataDepositSelect = {}
        let dataDepositChecked = false
        depositList.map((item, index) => {
          if(item.status == '2' && item.purchaseId == this.addGatheringData.contractNum) { //eslint-disable-line
            dataDepositSelect = item
            dataDepositChecked = true
          }else if (item.status == '1') { //eslint-disable-line
            dataDepositList.push(item)
          }
        })
        this.depositList = dataDepositList
        this.depositSelect = dataDepositSelect
        this.depositChecked = dataDepositChecked
        this.updateGatheringPerMoney()
      }
    },
    /** 更新待收款金额 */
    updateGatheringPerMoney() {
      this.addGatheringData.perMoney = this.contractOrderDetail.totalMoney - this.contractOrderDetail.receivedMoney - parseFloat(this.depositSelect && this.depositSelect.money || 0)
      this.addGatheringData.needPayMoney = this.contractOrderDetail.totalMoney - this.contractOrderDetail.receivedMoney - parseFloat(this.depositSelect && this.depositSelect.money || 0)
    },
    /* 选择不关联 */
    selectNothing() {
      this.depositSelect = {}
    },
    /* 确定支付合同 */
    payOrderSure() {
      this.payOrderFun()
    },
    /* 确定支付合同 */
    payOrderFun() {
      const paywayList = [
        {
          rate: this.addGatheringData.rateInfo,
          payid: this.addGatheringData.payType,
          money: this.addGatheringData.perMoney,
          realSerialNumber: this.addGatheringData.orderId
        }
      ]
      const params = {
        orderId: this.addGatheringData.contractNum,
        bextMoney: 0,
        payway: JSON.stringify(paywayList),
        receiverId: '',
        depositId: '',
        payType: '1'
      }
      payOrder(params).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success(res.data.errorMessage)
          this.addGatheringDialogShow = false
          this.$emit('toPayInfoList')
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 取消手动收款 */
    cancelHandsBtn() {
      this.addGatheringData.rate = '手续费率: 0.00%'
      this.addGatheringData.rateInfo = ''
      this.addGatheringData.realMoney = ''
      this.addGatheringData.orderId = ''
      this.addGatheringData.payType = ''
      this.addGatheringData.perMoney = this.addGatheringData.needPayMoney
    },
    /* 精确查找弹框 */
    openSearchDialog() {
      this.exactVisible = true
      this.$nextTick(() => {
        this.$refs.exactSearchDialog.showDialog(this.selectStu)
      })
    },
    /* 已收款金额数据 */
    payInfoListFun(val) {
      const params = {
        purchaseId: val
      }
      payInfoList(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allPayMoneyList = res.data.results
          let allMoneyNum = 0
          if (this.allPayMoneyList && this.allPayMoneyList.length > 0) {
            this.allPayMoneyList.map(item => {
              if (item.status !== '3') {
                allMoneyNum += Number(item.money)
              }
            })
            this.allPayMoneyList.allMoneyNum = allMoneyNum
          }
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /** 待收款金额判断 */
    perMoneyChange(value) {
      if (value < 0) {
        this.addGatheringData.perMoney = 0
      } else if (value > this.addGatheringData.needPayMoney) {
        this.addGatheringData.perMoney = this.addGatheringData.needPayMoney
      } else {
        this.addGatheringData.perMoney = value
      }
      this.addGatheringData.realMoney = parseFloat((this.addGatheringData.perMoney * (1 - this.addGatheringData.rateInfo)).toFixed(2))
    },
    /* 收款方式列表查询 */
    queryPaymentAccountListFun() {
      const params = {
        pageSize: 99999
      }
      queryPaymentAccountList(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allPaymentList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 确认合同绑定定金 */
    sureBindDeposit(itemSelect) {
      const params = {
        purchaseId: this.addGatheringData.contractNum,
        depositId: itemSelect.id
      }
      bindDeposit(params).then(res => {
        if (res.data.errorCode === 0) {
          this.moneyVisible = false
          this.$message.success(res.data.errorMessage)
          // this.getOrderDetailByIdFun(this.rowListData)
          this.depositChecked = true
          this.$forceUpdate()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 可选定金列表数据 */
    selectShowOk(item) {
      this.depositSelect = item
      this.isSelectNothing = false
      this.$forceUpdate()
    },
    /* 收款方式值改变 */
    payTypeChange(value) {
      if (value) {
        this.allPaymentList && this.allPaymentList.map(item => {
          if(item.id == value) { //eslint-disable-line
            this.addGatheringData.rate = '手续费率:' + (item.rate * 100).toFixed(2) + '%'
            this.addGatheringData.rateInfo = item.rate
            this.addGatheringData.realMoney = parseFloat((this.addGatheringData.perMoney * (1 - item.rate)).toFixed(2))
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.addGatheringDialog_container /deep/ {
  .textStyle {
    color: #46b6ee;
  }
  .el-dialog {
    width: 550px;
  }
  .el-dialog__body {
    padding: 25px 0px 6px 0px !important;
  }
  .from_con_bg {
    width: 100%;
    padding: 1px 25px;
    background: #f0f0f4;
    padding-top: 20px;
    .from_con_box {
      i {
        font-style: normal;
        color: #666;
      }
      .from_con_first {
        width: 100%;
        margin-bottom: 20px;
        font-size: 14px;
        height: 66px;
        background: #fff;
        border-radius: 5px;
        padding: 0 10px;
        .con_first_top {
          width: 100%;
          height: 26px;
          padding-top: 12px;
          font-size: 14px;
          color: #999;
          span:nth-child(2) {
            padding-left: 60px;
          }
          span:nth-child(3) {
            display: inline-block;
            float: right;
          }
        }
        .con_first_bottom {
          width: 100%;
          height: 40px;
          line-height: 40px;
          float: right;
          span {
            font-size: 12px;
            display: inline-block;
            float: right;
            color: #46b6ee;
            cursor: pointer;
          }
        }
      }
      .from_con_second /deep/ {
        margin-bottom: 10px;
        i {
          line-height: 48px;
        }
        .el-collapse-item__header {
          color: #999;
          padding-left: 10px;
          border-radius: 5px 5px 0 0;
          border-bottom: 1px solid #ebeef5;
        }
        .el-collapse-item__wrap {
          margin-bottom: 10px;
          padding: 10px;
          box-sizing: border-box;
        }
        .el-collapse-item__content {
          padding: 0;
          color: #999;
        }
      }
      .from_con_third {
        height: 40px;
        line-height: 40px;
        width: 100%;
        margin-bottom: 20px;
        margin-top: 20px;
        font-size: 14px;
        background: #fff;
        border-radius: 5px;
        padding: 0 10px;
        color: #999;
        .con_third_left {
          width: 50%;
          height: 40px;
          line-height: 40px;
          float: left;
          /deep/ .el-form-item--mini.el-form-item,
          .el-form-item--small.el-form-item {
            margin-bottom: 0;
            margin-top: 5px;
          }
          /deep/ .el-form-item__label {
            width: auto !important;
            font-weight: 400;
          }
        }
        .con_third_right {
          span {
            display: block;
            float: right;
            color: #46b6ee;
            cursor: pointer;
          }
        }
      }
    }
  }
  .online_box_wrap {
    width: 100%;
    background: #f0f0f4;
    padding-top: 20px;
    padding-bottom: 20px;
    .online_box_body {
      width: 100%;
      padding: 0 20px;
      overflow: auto;
      i {
        font-style: normal;
      }
      .online_body_first {
        width: 100%;
        margin-bottom: 20px;
        height: 66px;
        background: #fff;
        border-radius: 5px;
        padding: 0 10px;
        .body_first_text {
          width: 100%;
          height: 26px;
          padding-top: 12px;
          font-size: 14px;
          color: #666;
          font-weight: 400;
          i {
            font-style: normal;
          }
          span:nth-child(2) {
            padding-left: 55px;
            padding-right: 55px;
            box-sizing: border-box;
          }
          span:nth-child(3) {
            display: inline-block;
            float: right;
          }
        }
        .body_first_btn {
          width: 100%;
          height: 40px;
          line-height: 40px;
          float: right;
          a {
            color: rgb(70, 182, 238);
            display: inline-block;
            float: right;
          }
        }
      }
      .from_con_second {
        margin-bottom: 10px;
        .el-collapse-item__header {
          color: #666;
          padding-left: 10px;
          border-radius: 5px 5px 0 0;
          border-bottom: 1px solid #ebeef5;
          font-weight: 400;
        }
        .el-collapse-item__wrap {
          margin-bottom: 10px;
          padding: 10px;
          box-sizing: border-box;
        }
        .el-collapse-item__content {
          padding: 0;
          color: #666;
        }
      }
      .from_con_second /deep/ {
        i {
          line-height: 48px;
        }
      }
      .from_con_third {
        height: 40px;
        line-height: 40px;
        width: 100%;
        margin-bottom: 20px;
        margin-top: 20px;
        font-size: 14px;
        background: #fff;
        border-radius: 5px;
        padding: 0 10px;
        color: #666;
        font-weight: 400;
        .con_third_left {
          width: 50%;
          height: 40px;
          line-height: 40px;
          float: left;
          /deep/ .el-form-item--mini.el-form-item,
          .el-form-item--small.el-form-item {
            margin-bottom: 0;
            margin-top: 5px;
          }
          /deep/ .el-form-item__label {
            width: auto !important;
            font-weight: 400;
          }
        }
        .con_third_right {
          span {
            display: block;
            float: right;
            color: #5d9cec;
            cursor: pointer;
          }
        }
      }
      .from_con_fourth {
        width: 100%;
        height: auto;
        overflow: hidden;
        background: #fff;
        margin-top: 20px;
        padding: 10px;
        border-radius: 5px;
        .from_con_wrap {
          position: relative;
          width: 100%;
          .from_con_body {
            display: flex;
            -webkit-box-orient: horizontal;
            -webkit-box-direction: normal;
            flex-direction: row;
            flex-wrap: nowrap;
            width: 100%;
            .el-input--suffix .el-input__inner {
              padding-right: 15px !important;
            }
            .from_fourth_img {
              height: 66px;
              width: 60px;
              margin-right: 10px;
              display: inline-block;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
          .from_fourth_bottom {
            display: flex;
            height: 28px;
            margin-top: 10px;
            justify-content: space-between;
            -webkit-box-align: center;
            align-items: center;
          }
        }
      }
    }
  }
  .right_bot_wrap {
    display: flex;
    margin-top: 20px;
    margin-left: 60px;
    position: relative;
    margin-bottom: 20px;
    .bottom_img {
      width: 140px;
      height: 140px;
      margin-right: 35px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .bottom_text_box {
      p:nth-child(1) {
        width: 100%;
        font-size: 20px;
        color: #333;
        line-height: 20px;
      }
      p:nth-child(2) {
        width: 100%;
        margin-top: 23px;
        font-size: 12px;
        color: #666;
      }
      .open_btn {
        position: absolute;
        right: 20px;
        bottom: 10px;
      }
    }
  }
}
</style>

