<template>
  <div class="refundPrintDialog_container">
    <el-dialog
      :visible.sync="refundPrintDialogShow"
      title="退课时打印"
      @close="printForm()"
    >
      <el-form
        ref="refundPrintForm"
        label-width="90px"
        class="formStyle"
      >
        <div class="from_title">闪宝科技外呼测试</div>
        <div class="from_second_title">退款单（待退款）</div>
        <div class="from_info_base">
          <p>
            <span>学员姓名: </span>
            <span>小宇</span>
          </p>
          <p>
            <span>会员卡号: </span>
            <span>124235235235423421421</span>
          </p>
          <p />
        </div>
        <div class="from_from_head">
          <div>
            交易内容
          </div>
          <div>
            数量
          </div>
        </div>
        <div class="from_from_con">
          <div>
            <span>
              课程: 通用课时
            </span>
          </div>
          <div>
            10
          </div>
        </div>
        <div class="from_con_first">
          <div>账户变动: +1000元</div>
          <div>当前余额: 0元</div>
        </div>
        <div class="from_con_other">
          <div>课时变动: +10</div>
          <div>当前课时: 10/213</div>
        </div>
        <div class="from_con_other">
          <div>经办人: +1000元</div>
          <div>经办日期: 0元</div>
        </div>
        <div class="from_con_other">
          <div>电话: +1000元</div>
        </div>
        <div class="from_con_other">
          <div>处理说明: +1000元</div>
        </div>
        <div class="from_con_other">
          <div>地址: +1000元</div>
        </div>
        <div
          class="from_con_other"
          style="margin-top: 30px;"
        >
          <div>经办人签字: +1000元</div>
          <div>客户签字: </div>
        </div>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="printForm()"
        >打 印</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {

  },
  data() {
    return {
      refundPrintDialogShow: false
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog() {
      this.refundPrintDialogShow = !this.refundPrintDialogShow
    },
    /* 关闭弹框 */
    printForm() {
      this.refundPrintDialogShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.refundPrintDialog_container /deep/ {
  .el-dialog {
    width: 700px;
  }
  .formStyle {
    .from_title {
      width: 100%;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 20px;
    }
    .from_second_title {
      width: 100%;
      height: 25px;
      line-height: 25px;
      text-align: center;
      font-size: 16px;
    }
    .from_info_base {
      width: 100%;
      height: 20px;
      position: relative;
      p:nth-child(1) {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 35%;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
      }
      p:nth-child(2) {
        position: absolute;
        left: 35%;
        top: 0px;
        width: 65%;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
      }
    }
    .from_from_head {
      width: 100%;
      height: 40px;
      margin-top: 10px;
      position: relative;
      div:nth-child(1) {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 80%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border: 1px solid rgb(221, 221, 221);
      }
      div:nth-child(2) {
        position: absolute;
        left: 80%;
        top: 0px;
        width: 20%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-width: 1px 1px 1px 0px;
        border-top-style: solid;
        border-right-style: solid;
        border-bottom-style: solid;
        border-left-style: initial;
        border-top-color: rgb(221, 221, 221);
        border-right-color: rgb(221, 221, 221);
        border-bottom-color: rgb(221, 221, 221);
        border-left-color: initial;
        border-image: initial;
      }
    }
    .from_from_con {
      width: 100%;
      height: 40px;
      position: relative;
      div:nth-child(1) {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 80%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-width: 0px 1px 1px;
        border-top-style: initial;
        border-right-style: solid;
        border-bottom-style: solid;
        border-left-style: solid;
        border-top-color: initial;
        border-right-color: rgb(221, 221, 221);
        border-bottom-color: rgb(221, 221, 221);
        border-left-color: rgb(221, 221, 221);
        border-image: initial;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        padding: 0px 10px;
      }
      div:nth-child(2) {
        position: absolute;
        left: 80%;
        top: 0px;
        width: 20%;
        height: 40px;
        float: right;
        line-height: 40px;
        text-align: center;
        border-width: 0px 1px 1px 0px;
        border-top-style: initial;
        border-right-style: solid;
        border-bottom-style: solid;
        border-left-style: initial;
        border-top-color: initial;
        border-right-color: rgb(221, 221, 221);
        border-bottom-color: rgb(221, 221, 221);
        border-left-color: initial;
        border-image: initial;
      }
    }
    .from_con_first {
      width: 100%;
      height: 40px;
      margin-top: 20px;
      position: relative;
      div:nth-child(1) {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 50%;
        float: left;
        line-height: 40px;
        text-align: left;
        padding-left: 10%;
      }
      div:nth-child(2) {
        position: absolute;
        left: 50%;
        top: 0px;
        width: 50%;
        height: 40px;
        float: left;
        line-height: 40px;
        text-align: left;
      }
    }
    .from_con_other {
      width: 100%;
      height: 35px;
      position: relative;
      div:nth-child(1) {
        position: absolute;
        left: 0px;
        top: 0px;
        width: 50%;
        height: 35px;
        float: left;
        line-height: 35px;
        text-align: left;
        padding-left: 10%;
      }
      div:nth-child(2) {
        position: absolute;
        left: 50%;
        top: 0px;
        width: 50%;
        height: 35px;
        float: left;
        line-height: 35px;
        text-align: left;
      }
    }
  }
}
</style>

