<template>
  <div
    :isloading="isloading"
    class="gatheringDialog_container"
  >
    <el-dialog
      :visible.sync="gatheringDialogShow"
      :close-on-click-modal="false"
      title="合同收款"
      @close="cancelDialog('gatheringForm')"
    >
      <el-form
        ref="gatheringForm"
        :model="gatheringData"
        :rules="rules"
        class="form_wrap"
      >
        <div class="right_box">
          <div class="left_box">
            <img src="https://img.ishanshan.com/gimg/img/76b4f9887dbe6d49f80218c85901a0ca">
          </div>
          <div style="width: 100%">
            <el-form-item
              label="学员姓名:"
              prop="orderStuNames"
            >
              <span>{{ gatheringData.orderStuNames }}</span>
              <span
                :model="isSetGathering"
                class="set_btn"
                @click="setGatherBtn()"
              >{{ setGatherText }}</span>
            </el-form-item>
            <el-form-item
              label="合同编号:"
              prop="orderNum"
            >
              <span>{{ gatheringData.orderNum }}</span>
            </el-form-item>
            <el-form-item
              label="合同金额:"
              prop="totalMoney"
            >
              <span>{{ gatheringData.totalMoney }}</span>
            </el-form-item>
            <el-form-item
              label="合同清单:"
              prop="conOrder"
            >
              <span>{{ gatheringData.conOrder }}</span>
            </el-form-item>
          </div>
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
              v-else-if="depositList && depositList.length > 0 && depositSelect && depositSelect.id"
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
                  <p>确定收款？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      size="mini"
                      class="cancel_btn"
                      @click="moneyVisible = false"
                    >取消</el-button>
                    <el-button
                      type="primary"
                      size="mini"
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

            <!-- 收款选择 -->
            <!--
            <div
              v-show="isTrueHand"
              class="from_con_third"
            >
              <div>
                <div class="con_third_left">
                  <el-form-item
                    label="待收金额:"
                    prop="perMoney"
                  >
                    <el-input
                      v-model="gatheringData.perMoney"
                      clearable
                      style="width: 100px;"
                    />
                    <span>元</span>
                  </el-form-item>
                </div>
                <div class="con_third_left con_third_right">
                  <span @click="handsFromShow()">手填收款</span>
                  <span
                    style="padding-right: 10px;"
                    @click="openOnlineDialog()"
                  >在线收款</span>
                </div>
              </div>
            </div>
            -->
            <!-- 手动收款  v-show="isHandsFromShow" -->
            <div
              v-if="gatheringData.needPayMoney > 0"
              class="from_con_fourth"
            >
              <div class="from_con_wrap">
                <div class="from_con_body">
                  <div class="from_fourth_img">
                    <img src="https://img.ishanshan.com/gimg/img/f4033ff0ece7e09ee302c7927d84edc3">
                  </div>

                  <!-- 收款方式 -->
                  <div style="width: 85%">
                    <el-form-item
                      label=""
                      prop="payType"
                      class="payItemStyle"
                      style="width:40%"
                    >
                      <el-select
                        v-model="gatheringData.payType"
                        clearable
                        placeholder="请选择收款方式"
                        filterable
                        @change="payTypeChange(gatheringData.payType)"
                      >
                        <el-option
                          v-for="item in allPaymentList"
                          :key="item.id"
                          :label="item.paymentKey === 'xianjin' ? item.paymentKeyName : (item.paymentKeyName + '-' + item.name + '-' + item.acctNo)"
                          :value="item.id"
                        />
                      </el-select>
                    </el-form-item>

                    <!-- 待收金额 -->
                    <el-form-item
                      label=""
                      prop="perMoney"
                      class="payItemStyle"
                      style="width: 25%;"
                    >
                      <el-input
                        v-model="gatheringData.perMoney"
                        clearable
                        @input="perMoneyChange"
                      />
                    </el-form-item>

                    <!-- 手续费率 -->
                    <el-form-item
                      label=""
                      prop="rate"
                      class="payItemStyle"
                      style="width:29%; margin-left: 19px"
                    >
                      <el-input
                        v-model="gatheringData.rate"
                        clearable
                        placeholder="手续费率:0.00%"
                        class="rateInput"
                        disabled
                      />
                    </el-form-item>

                    <!-- 支付宝流水号 -->
                    <el-form-item
                      label=""
                      prop="orderId"
                      class="payItemStyle"
                      style="width:100%;margin-top: 5px;"
                    >
                      <el-input
                        v-model="gatheringData.orderId"
                        clearable
                        placeholder="支付宝流水号"
                      />
                    </el-form-item>
                  </div>
                </div>
                <div class="from_fourth_bottom">
                  <div>
                    <span>实际到账: <i>{{ gatheringData.realMoney || '0.00' }}</i></span>
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
                      @click="payOrderSure('gatheringForm')"
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
    <!--
    <el-dialog
      :visible.sync="onlineMoneyDialogShow"
      title="在线收款"
      style="margin-top: 10vh;"
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
    </el-dialog>
    -->
  </div>
</template>

<script>
import {
  getOrderDetailById, // 合同详情
  queryPurchaseDeposit, // 定金详情列表
  bindDeposit, // 合同绑定定金
  payInfoList, // 已收款单数据
  queryPaymentAccountList, // 收款方式列表查询
  payOrder // 支付合同
} from '@/api/crm/contract/contract.js'
export default {
  components: {

  },
  data() {
    return {
      gatheringDialogShow: false,
      gatheringData: {
        orderStuNames: '', // 学员姓名
        orderNum: '', // 合同编号
        totalMoney: '', // 合同金额
        conOrder: '', // 合同清单
        perMoney: '', // 待收金额
        needPayMoney: '', // 未收款金额
        payType: '', // 收款方式
        conMoney: '', // 收款金额
        rateInfo: '',
        rate: '', // 手续费率
        orderId: '', // 交易流水号
        realMoney: '' // 实际到账
      },

      rules: {
        payType: [
          { required: true, message: '请选择收款方式', trigger: 'change' }
        ],
        perMoney: [
          { required: true, message: '请正确输入待收金额', trigger: 'change' },
          { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '正数,2位小数', trigger: 'change' }
        ]
      },
      depositList: [], // 定金详情数据
      depositSelect: {}, // 定金选中的选项
      depositChecked: false, // 定金是否已经关联
      allShops: [
        {
          value: 'yizhi',
          label: '一致'
        },
        {
          value: 'fankui',
          label: '反馈'
        },
        {
          value: 'xiaolv',
          label: '效率'
        },
        {
          value: 'kekong',
          label: '可控'
        }
      ],
      isSetGathering: false,
      isloading: false,
      setGatherText: '',
      // isSetPcShow: true,
      moneyVisible: false, // 确定收款气泡
      rowListData: {}, // 合同数据
      contractOrderDetail: {}, // 合同收款详情数据
      isPurListShow: false, // 定金详情显隐
      isSelectNothing: false, // 选择不关联 有数据切换
      activeNames: '',
      onlineMoneyDialogShow: false, // 在线收款弹框显隐
      isTrueHand: true, // 在线收款和手动填款显示
      isHandsFromShow: false, // 手动填款显隐
      allPayMoneyList: [], // 已收金额数据
      allPaymentList: [] // 收款方式列表查询
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog(rowlist) {
      this.rowListData = rowlist
      this.activeNames = ''
      this.isHandsFromShow = false
      this.isTrueHand = true
      this.getOrderDetailByIdFun(rowlist)
      this.payInfoListFun(rowlist)
      this.queryPaymentAccountListFun()
      this.depositSelect = {}
      this.depositChecked = false
      this.gatheringDialogShow = !this.gatheringDialogShow
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.$nextTick(() => {
        this.gatheringDialogShow = false
        this.isSetGathering = false
      })
      // this.isSetPcShow = true
      this.$refs[formName].resetFields()
    },
    /* 获取合同详情数据 */
    getOrderDetailByIdFun(rowlist) {
      const params = {
        id: rowlist.orderNumber
      }
      this.isloading = true
      getOrderDetailById(params).then(res => {
        if (res.data.errorCode === 0) {
          this.contractOrderDetail = res.data.data
          let stuIdNum = ''
          this.contractOrderDetail.stuInfo.map(item => {
            this.gatheringData.orderStuNames = item.stuName
            stuIdNum = item.stuId
          })
          this.queryPurchaseDepositFun(rowlist, stuIdNum)
          this.contractOrderDetail.classpkg.map(item => {
            this.gatheringData.conOrder = item.name + 'X' + item.amount
          })
          this.gatheringData = {
            orderStuNames: this.gatheringData.orderStuNames,
            orderNum: this.contractOrderDetail.orderNum,
            totalMoney: this.contractOrderDetail.totalMoney,
            conOrder: this.gatheringData.conOrder,
            perMoney: this.contractOrderDetail.totalMoney - this.contractOrderDetail.receivedMoney - parseFloat(this.depositSelect.money || 0),
            needPayMoney: this.contractOrderDetail.totalMoney - this.contractOrderDetail.receivedMoney - parseFloat(this.depositSelect.money || 0)
          }
          this.updateGatheringPerMoney()
        } else {
          this.$message.error(res.data.errorMessage)
        }
        this.isloading = false
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
          if(item.status == '2' && item.purchaseId == this.rowListData.orderNumber) { //eslint-disable-line
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
      this.gatheringData.perMoney = this.contractOrderDetail.totalMoney - this.contractOrderDetail.receivedMoney - parseFloat(this.depositSelect && this.depositSelect.money || 0)
      this.gatheringData.needPayMoney = this.contractOrderDetail.totalMoney - this.contractOrderDetail.receivedMoney - parseFloat(this.depositSelect && this.depositSelect.money || 0)
    },
    /* 可选定金列表数据 */
    selectShowOk(item) {
      this.depositSelect = item
      this.isSelectNothing = false
      this.$forceUpdate()
    },
    /* 选择不关联 */
    selectNothing() {
      this.depositSelect = {}
    },
    /* 确认合同绑定定金 */
    sureBindDeposit(itemSelect) {
      const params = {
        purchaseId: this.rowListData.orderNumber,
        depositId: itemSelect.id
      }
      bindDeposit(params).then(res => {
        if (res.data.errorCode === 0) {
          this.moneyVisible = false
          this.$message.success(res.data.errorMessage)
          this.getOrderDetailByIdFun(this.rowListData)
          this.$forceUpdate()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 已收款金额数据 */
    payInfoListFun(rowlist) {
      const params = {
        purchaseId: rowlist.orderNumber
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
    /* 收款方式值改变 */
    payTypeChange(value) {
      if (value) {
        this.allPaymentList && this.allPaymentList.map(item => {
          if(item.id == value) { //eslint-disable-line
            this.gatheringData.rate = '手续费率:' + (item.rate * 100).toFixed(2) + '%'
            this.gatheringData.rateInfo = item.rate
            this.gatheringData.realMoney = parseFloat((this.gatheringData.perMoney * (1 - item.rate)).toFixed(2))
          }
        })
      }
    },
    /* 确定支付合同 */
    payOrderFun() {
      const paywayList = [
        {
          rate: this.gatheringData.rateInfo,
          payid: this.gatheringData.payType,
          money: this.gatheringData.perMoney,
          realSerialNumber: this.gatheringData.orderId
        }
      ]
      const params = {
        orderId: this.rowListData.orderNumber,
        bextMoney: 0,
        payway: JSON.stringify(paywayList),
        receiverId: '',
        depositId: '',
        payType: '1'
      }
      payOrder(params).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success(res.data.errorMessage)
          this.gatheringDialogShow = false
          this.$emit('toContractList')
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 创建收款单按钮 */
    setGatherBtn() {
      this.isSetGathering = !this.isSetGathering
      if (this.isSetGathering === true) {
        // this.setGatherText = '开通在线收款'
        // this.isSetPcShow = false
      } else {
        // this.setGatherText = '创建收款单'
        // this.isSetPcShow = true
      }
    },
    /* 在线收款弹框 */
    openOnlineDialog() {
      this.onlineMoneyDialogShow = !this.onlineMoneyDialogShow
    },
    /* 手动填款 */
    handsFromShow() {
      this.isHandsFromShow = true
      this.isTrueHand = false
    },
    /* 暂不通过 */
    noPassBtn() {
      this.onlineMoneyDialogShow = false
    },
    /* 取消手动收款 */
    cancelHandsBtn() {
      this.isHandsFromShow = false
      this.isTrueHand = true
      this.gatheringData.rate = '手续费率: 0.00%'
      this.gatheringData.rateInfo = ''
      this.gatheringData.realMoney = ''
      this.gatheringData.orderId = ''
      this.gatheringData.payType = ''
      this.gatheringData.perMoney = this.gatheringData.needPayMoney
    },

    /* 确定支付合同 */
    payOrderSure(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.payOrderFun()
          this.$emit('toContractList')
        } else {
          return false
        }
      })
    },

    /** 待收款金额判断 */
    perMoneyChange(value) {
      if (value < 0) {
        this.gatheringData.perMoney = 0
      } else if (value > this.gatheringData.needPayMoney) {
        this.gatheringData.perMoney = this.gatheringData.needPayMoney
      } else {
        this.gatheringData.perMoney = value
      }
      this.gatheringData.realMoney = parseFloat((this.gatheringData.perMoney * (1 - this.gatheringData.rateInfo)).toFixed(2))
    }
  }
}
</script>

<style lang="scss" scoped>
.gatheringDialog_container /deep/ {
  .el-dialog {
    width: 600px !important;
  }
  .el-dialog__body {
    padding: 25px 0px 6px 0px !important;
  }
  .form_wrap {
    .left_box {
      margin-right: 10px;
    }
    .right_box {
      width: 100%;
      position: relative;
      display: flex;
      padding: 0 25px;
      box-sizing: border-box;
    }
    .right_box {
      width: 100%;
      .el-form-item--mini.el-form-item,
      .el-form-item--small.el-form-item {
        margin-bottom: 0;
      }
      .set_btn {
        color: #5d9cec;
        position: absolute;
        right: 0;
        cursor: pointer;
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
              padding-right: 70px;
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
              color: #5d9cec;
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
              width: 0px;
            }
            /deep/ .el-form-item__content {
              margin-left: 0px;
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
              .el-form-item__label /deep/ {
                width: auto !important;
                font-weight: 400;
                width: 0px;
              }
              .payItemStyle {
                display: inline-block;
                margin: 5px 0;
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

