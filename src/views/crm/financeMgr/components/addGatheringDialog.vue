<template>
  <div class="addGatheringDialog_container">
    <el-dialog
      :visible.sync="addGatheringDialogShow"
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
            prop="name"
          >
            <el-select
              v-model="addGatheringData.name"
              placeholder="请选择学员姓名"
              clearable
              style="width:80%"
            >
              <el-option
                v-for="item in allShops"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <span style="color:#46b6ee; margin-left: 10px;">精确查找</span>
          </el-form-item>
          <el-form-item
            label="合同编号:"
            prop="number"
          >
            <el-select
              v-model="addGatheringData.number"
              placeholder="请选择合同编号"
              clearable
              style="width:100%"
            >
              <el-option
                v-for="item in allShops"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="合同金额:"
            prop="price"
          >
            <div>123123元</div>
            <div>通用课程1</div>
          </el-form-item>
        </div>
        <div class="from_con_bg">
          <div class="from_con_box">
            <div class="from_con_first">
              <div class="con_first_top">
                <span>定金金额: <i>￥100</i></span>
                <span>方式: <i>现金</i></span>
                <span>时间: <i>2018-10-14 10:44</i></span>
              </div>
              <div class="con_first_bottom">
                <span>确认</span>
                <span style="padding-right: 20px;">选择</span>
              </div>
            </div>
            <div class="from_con_second">
              <el-collapse v-model="activeNames">
                <el-collapse-item name="1">
                  <template slot="title">
                    已收金额:<i>￥100</i>
                  </template>
                  <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
                  <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
                </el-collapse-item>
              </el-collapse>
            </div>
            <div class="from_con_third">
              <div>
                <div class="con_third_left">
                  <el-form-item
                    label="代收金额:"
                    prop="money"
                  >
                    <el-input
                      clearable
                      style="width: 100px;"
                    />
                    <span>元</span>
                  </el-form-item>
                </div>
                <div class="con_third_left con_third_right">
                  <span class="textStyle">手填收款</span>
                  <span
                    style="padding-right: 10px;"
                    class="textStyle"
                    @click="openOnlineDialog()"
                  >在线收款</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </el-dialog>
    <!-- 在线收款弹框 -->
    <el-dialog
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
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {

  },
  data() {
    return {
      addGatheringDialogShow: false,
      addGatheringData: {
        name: ''
      },
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
      activeNames: [],
      onlineMoneyDialogShow: false
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog() {
      this.addGatheringDialogShow = !this.addGatheringDialogShow
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.addGatheringDialogShow = false
      this.$refs[formName].resetFields()
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      console.log('formName', formName)
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

