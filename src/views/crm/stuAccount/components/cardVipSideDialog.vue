<template>
  <div>
    <side-dialog
      :visible.sync="cardSideDialogShow"
      class="cardVipSide_container"
    >
      <div class="cardVip_side">
        <div class="info_head">
          <div class="head_top">
            <div class="top_left">
              <img src="https://img.ishanshan.com/gimg/n/20190404/90991e157699f7a6079d74c6748aa904">
              <div class="name">会员卡</div>
            </div>
            <div class="top_right">
              <el-button
                v-log="{compName:'学员账户',eventName:'web-【学员CRM】-学员账户-学员账户号-添加适用学员'}"
                type="primary"
                @click="addSuitDialog()"
              >添加适用学员</el-button>
              <el-button
                v-log="{compName:'学员账户',eventName:'web-【学员CRM】-学员账户-学员账户号-转课'}"
                v-if="hasBtn('408000003')"
                type="primary"
                @click="returnClassDialog"
              >转课</el-button>
              <el-button
                v-log="{compName:'学员账户',eventName:'web-【学员CRM】-学员账户-学员账户号-转校'}"
                v-if="hasBtn('408000004')"
                class="cancel_btn"
                @click="returnSchoolDialog"
              >转校</el-button>
            </div>
          </div>
        </div>
        <div class="info_detail">
          <el-tabs
            v-model="activeName"
            @tab-click="handleClick(activeName)"
          >
            <el-tab-pane
              label="基础信息"
              name="1"
            >
              <!-- 基础信息组件 -->
              <BasicInfoPage ref="basicInfoPage" />
            </el-tab-pane>
            <el-tab-pane
              label="适用学员"
              name="2"
            >
              <!-- 适用学员 -->
              <SuitStudentPage ref="suitStudentPage" />
            </el-tab-pane>
            <el-tab-pane
              label="适用家长"
              name="3"
            >
              <!-- 适用家长 -->
              <SuitParentPage ref="suitParentPage" />
            </el-tab-pane>
            <el-tab-pane
              label="合同"
              name="4"
            >
              <!-- 合同 -->
              <ContractPage ref="contractPage" />
            </el-tab-pane>
            <el-tab-pane
              label="退费"
              name="5"
            >
              <!-- 退费 -->
              <ReturnMoneyPage ref="returnMoneyPage" />
            </el-tab-pane>
            <el-tab-pane
              label="课时变动"
              name="6"
            >
              <!-- 课时变动 -->
              <HourChangePage ref="hourChangePage" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </side-dialog>
    <!-- 添加适用学员弹框组件 -->
    <AddSuitStuDialog ref="addSuitStuDialog" @updateSuiteStudent="updateSuiteStudent" />
    <!-- 转移课时弹框组件 -->
    <ReturnClassDialog ref="returnClassDialog" />
    <!-- 转校弹框组件 -->
    <ReturnSchoolDialog
      v-if="returnSchoolVisible"
      ref="returnSchoolDialog"
      @toClose="getReturnSchoolClose"
    />
  </div>
</template>

<script>
import {
  summaryQuery,
  cardPurInfoById, // 合同接口
  cardRefInfoById, // 退费接口
  cardPeriodInfoById // 课时变动接口
} from '@/api/crm/stuAccount/stuAccount.js'
import SideDialog from '@/components/SideDialog'
import BasicInfoPage from './cardSide/basicInfoPage.vue'
import SuitStudentPage from './cardSide/suitStudentPage.vue'
import SuitParentPage from './cardSide/suitParentPage.vue'
import ContractPage from './cardSide/contractPage.vue'
import ReturnMoneyPage from './cardSide/returnMoneyPage.vue'
import HourChangePage from './cardSide/hourChangePage.vue'
import AddSuitStuDialog from './addSuitStuDialog.vue'
import ReturnClassDialog from './returnClassesDialog.vue'
import ReturnSchoolDialog from './returnSchoolDialog.vue'
export default {
  components: {
    SideDialog,
    BasicInfoPage, // 基础信息组件
    SuitStudentPage, // 适用学员组件
    SuitParentPage, // 适用家长组件
    ContractPage, // 合同组件
    ReturnMoneyPage, // 退费组件
    HourChangePage, // 课时变动组件
    AddSuitStuDialog, // 添加使用学员组件
    ReturnClassDialog, // 转移课时弹框组件
    ReturnSchoolDialog // 转校弹框组件
  },
  data() {
    return {
      cardInfoData: {},
      returnSchoolVisible: false, // 转校弹窗显隐
      cardSideDialogShow: false,
      activeName: '1',
      summaryListData: [] // 获取添加使用学员输入框下拉列表
    }
  },
  methods: {
    /* 显示侧边弹框 */
    showSideDialog(row) {
      this.activeName = '1'
      this.cardInfoData = row
      this.cardSideDialogShow = true
      this.$refs.basicInfoPage.getBaseInfoList(row)
    },
    /* tab切换点击 */
    handleClick(tab, event) {
      if (tab === '1') {
        this.$refs.basicInfoPage.getBaseInfoList(this.cardInfoData)
      }
      if (tab === '2') {
        this.$refs.suitStudentPage.getCardStuInfoById(this.cardInfoData)
      }
      if (tab === '3') {
        this.$refs.suitParentPage.getCardParentInfoById(this.cardInfoData)
      }
      if (tab == '4') { //eslint-disable-line
        this.$refs.contractPage.options.apiService = cardPurInfoById
        this.$refs.contractPage.getOpenList(this.cardInfoData)
      }
      if (tab == '5') { //eslint-disable-line
        this.$refs.returnMoneyPage.options.apiService = cardRefInfoById
        this.$refs.returnMoneyPage.getOpenList(this.cardInfoData)
      }
      if (tab == '6') { //eslint-disable-line
        this.$refs.hourChangePage.options.apiService = cardPeriodInfoById
        this.$refs.hourChangePage.getOpenList(this.cardInfoData)
      }
    },
    /** 适用学员更新 */
    updateSuiteStudent() {
      this.$refs.suitStudentPage.getCardStuInfoById(this.cardInfoData)
    },
    /* 添加适用学员弹框 */
    addSuitDialog(cardInfoData) {
      summaryQuery().then(res => {
        if (res.data.errorCode === 0) {
          this.summaryListData = res.data.results
          this.$refs.addSuitStuDialog.showDialog(this.cardInfoData, this.summaryListData)
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    /* 转移课时弹框 */
    returnClassDialog() {
      this.$refs.returnClassDialog.showDialog(this.cardInfoData)
    },
    /* 转校弹框 */
    returnSchoolDialog() {
      this.returnSchoolVisible = true
      this.$nextTick(() => {
        this.$refs.returnSchoolDialog.showDialog(this.cardInfoData)
      })
    },
    /* 关闭转校弹窗 */
    getReturnSchoolClose() {
      this.returnSchoolVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.cardVipSide_container {
  .cardVip_side {
    .info_head {
      display: flex;
      flex-wrap: wrap;
      -webkit-box-pack: start;
      justify-content: flex-start;
      overflow: hidden;
      margin-bottom: 20px;
      .head_top {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        -webkit-box-align: center;
        width: 100%;
        padding: 20px 20px 0px 20px;
        -webkit-box-pack: justify;
        justify-content: space-between;
        .top_left {
          display: flex;
          flex-wrap: nowrap;
          -webkit-box-align: center;
          align-items: center;
          img {
            width: 40px;
            height: 40px;
            margin-right: 20px;
          }
        }
      }
    }
    .info_detail /deep/ {
      .el-tabs__content {
        padding: 0 20px;
        box-sizing: border-box;
      }
    }
  }
}
</style>

