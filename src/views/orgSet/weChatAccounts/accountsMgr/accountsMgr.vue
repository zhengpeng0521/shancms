<template>
  <div class="accounts_mgr">

    <!-- 未开通 -->
    <div
      v-if="isOpenWx == '-1'"
      class="no_accounts"
    >

      <div class="banner">
        <img
          class="banner_img"
          src="https://img.ishanshan.com/gimg/n/20190422/cb1fca45aecb20c721dc53b507eeae62?p=image/format,jpg/quality,q_80"
        >
      </div>

      <div class="account_btn">
        <div>
          <p class="banner_title">绑定你的公众号</p>
          <p class="banner_item">
            <img
              src="https://img.ishanshan.com/gimg/n/20190422/11b52bfe5e39cf9aa01b9646dda488ac"
              class="banner_item_icon"
            >
            <span>公众号吸粉</span>
          </p>
          <p class="banner_item">
            <img
              src="https://img.ishanshan.com/gimg/n/20190422/11b52bfe5e39cf9aa01b9646dda488ac"
              class="banner_item_icon"
            >
            <span>提高公众号粘性</span>
          </p>
          <p class="banner_item">
            <img
              src="https://img.ishanshan.com/gimg/n/20190422/11b52bfe5e39cf9aa01b9646dda488ac"
              class="banner_item_icon"
            >
            <span>给家长发送微信模板消息</span>
          </p>
        </div>
        <img
          class="buy_img"
          src="https://img.ishanshan.com/gimg/n/20190422/e23bbd866cd8df4760d79d45d5d6475f"
          @click="openDialog('buy')"
        >
      </div>
    </div>

    <!-- 未授权 -->
    <div
      v-if="isOpenWx=='0'"
      class="have_accounts"
    >

      <p><span>您当前使用‘{{ accountWeChat }}’公众号为家长发送通知</span></p>
      <p style="color: #49C800;"><span>绑定微信公众号，用自己的公众号给家长发送通知</span></p>
      <p><span>温馨提示：</span><span style="color:#FF0000;" /></p>
      <p><span style="color:#FF0000;">·&nbsp; 为了正常使用，请使用认证服务号进行绑定</span></p>
      <p><span style="color:#FF0000;">·&nbsp; 授权时请保持默认选择，把权限统一授权给闪闪</span></p>
      <el-button
        type="primary"
        style="margin-top:30px"
        @click="openDialog('set')"
      >
        我有微信公众号，立即设置
      </el-button>
    </div>

    <!-- 绑定成功 -->
    <div v-if="isOpenWx=='1'">
      <el-form>
        <el-form-item label="公众号昵称：">

          <span>{{ weChatName }}</span>
          <a
            class="text_btn"
            @click="openDialog('set')"
          >绑定到其他公众号</a>
        </el-form-item>
        <el-form-item label="APPID：">

          <span>{{ weChatId }}</span>

        </el-form-item>

        <el-form-item label="微信账号类型：">

          <span>{{ weChatType==2?'认证服务号':'订阅号' }}</span>

        </el-form-item>

        <el-form-item>
          <div>
            您已获得该公众号所有接口权限，可以正常对接微信

            如果使用过程中发现接口异常，请点击此<span
              class="text_color cp text_btn"
              @click="openDialog('set')"
            >
              重新授权
            </span>试试

            如果想换回“闪闪管家”公众号，请<span
              class="text_color cp text_btn"
              @click="openDialog('buy')"
            >
              联系客服
            </span>

          </div>

        </el-form-item>

      </el-form>

    </div>

    <!-- 弹窗 -->
    <el-dialog
      :visible.sync="isOpen"
      :before-close="closeDialog"
      :custom-class="isClass"
      :title="switchOnOff === 'buy' ? '联系客服' : null"
      width="340px"
    >

      <!-- 购买套餐 -->
      <div
        v-if="switchOnOff==='buy'"
        style="margin-bottom:10px;"
      >
        <!-- <img
          class="connect_popover_img"
          src="//img.ishanshan.com/gimg/img/f696b637df0aba27f96116ca10e6756c"
        > -->
        <img
          class="connect_popover_img"
          src="https://img.ishanshan.com/gimg/user/n///1557308283.png"
        >
        <p class="connect_p">微信扫码，获取专属服务顾问</p>
        <p class="connect_mobile">客服热线：400-660-5733</p>
      </div>
      <!-- <div
        v-if="switchOnOff==='buy'"
        slot="footer"
        class="dialog_footer"
      >
        <el-button
          type="primary"
          @click="openWindow"
        >
          <svg-icon icon-class="qq" /> <span>QQ在线</span>
        </el-button>
      </div> -->

      <!-- 警告 -->
      <div v-if="switchOnOff==='set'">
        <div v-if="isSmallGame">
          <p style="text-align: start;font-size: 18px;">
            <span> <i
              class="el-icon-warning"
              style="color:#F6B243;margin-right:6px;"
            />警告！ </span>
          </p>
          <p class="set_content">
            检测到有微游戏正在进行，继续绑定公众号会导致用户数据丢失！请等微游戏结束后再设置！
          </p>
          <div style="margin-bottom:5px">

            <el-button
              class="cancel_btn"
              @click="continueSet('power')"
            >
              继续设置
            </el-button>
            <el-button
              type="primary"
              @click="closeDialog"
            >
              取消设置
            </el-button>

          </div>
        </div>
      </div>

      <!-- 授权 -->
      <div v-if="switchOnOff==='power'">
        <p style="text-align: start;font-size: 18px; margin-bottom:50px">
          <span> <i
            class="el-icon-warning"
            style="color:#F6B243;margin-right:6px;"
          />请在新窗口完成微信授权！ </span>
        </p>
        <!-- <p class="set_content">
          检测到有微游戏正在进行，继续绑定公众号会导致用户数据丢失！请等微游戏结束后再设置！
        </p> -->
        <div style="margin-bottom:5px">

          <el-button
            class="cancel_btn"
            @click="continueSet('power')"
          >
            授权失败，重试
          </el-button>
          <el-button
            type="primary"
            @click="queryStatus(closeDialog)"
          >
            已成功设置
          </el-button>

        </div>
      </div>

      <!-- 授权失败 -->
      <div v-if="switchOnOff==='fail'">
        <p style="text-align: start;font-size: 18px; margin-bottom:50px">
          <span> <i
            class="el-icon-warning"
            style="color:#F6B243;margin-right:6px;"
          />{{ failText }}</span>
        </p>
        <div class="fail_btn">

          <el-button
            type="primary"
            @click="closeDialog"
          >确 定
          </el-button>

        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import { queryWeChatAuth, queryQrCode } from '@/api/orgSet/weChatAccounts'//eslint-disable-line
export default {

  data() {
    return {
      isOpen: false,
      accountWeChat: '闪闪早教',
      switchOnOff: '',
      isOpenWx: '',
      isGame: '',
      weChatId: '',
      weChatName: '',
      weChatType: '',
      failText: ''
    }
  },
  computed: {
    // 进行微游戏判定方案
    isSmallGame: function() {
      return this.isGame == '1'//eslint-disable-line
    },

    isClass: function() {
      if (this.switchOnOff === 'buy') {
        return ''
      } else {
        return 'set_hearder'
      }
    }

  },
  mounted() {
    this.queryStatus()
  },
  methods: {
    queryStatus(callback) {
      queryWeChatAuth().then(res => {
        if (res.data.errorCode === 0) {
          // 未开通
          this.isOpenWx = res.data.data.weChatStatus
          this.isGame = res.data.data.isGameExit
          this.weChatName = res.data.data.weChatAppName
          this.weChatId = res.data.data.weChatAppId
          this.weChatType = res.data.data.weChatType
          if (res.data.data.weChatStatus + '' === '1' && res.data.data.weChatType + '' === '2') {
            this.$message.success('绑定成功')
            callback && callback()
          } else if (res.data.data.weChatStatus + '' !== '1') {
            this.switchOnOff = 'fail'
            this.failText = '授权失败、请重试！'
          } else if (res.data.data.weChatType + '' !== '2') {
            this.switchOnOff = 'fail'
            this.failText = '授权失败，请使用认证服务号进行绑定！'
          }
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    /** 授权 */
    openDialog(val) {
      if (!this.isSmallGame && val === 'set') {
        queryQrCode().then(res => {
          if (res.data.errorCode === 0) {
            window.open(`${res.data.data.authUrl}`, '_blank', 'height=644, width=644,toolbar=no,scrollbars=no,menubar=no,status=no')
            this.switchOnOff = 'power'
          } else {
            this.$message.error(res.data.errorMessage)
            this.switchOnOff = val
          }
        })
      } else {
        this.switchOnOff = val
      }

      this.isOpen = true
    },

    /** 关闭 */
    closeDialog() {
      this.isOpen = false
    },

    /** 购买套餐 */
    openWindow() {
      window.open('http://wpa.qq.com/msgrd?v=3&uin=3519232593&site=qq&menu=yes', '_blank', 'height=502, width=644,toolbar=no,scrollbars=no,menubar=no,status=no')
    },

    /** 继续设置 */
    continueSet(val) {
      queryQrCode().then(res => {
        if (res.data.errorCode === 0) {
          this.switchOnOff = val
          window.open(`${res.data.data.authUrl}`, '_blank', 'height=644, width=644,toolbar=no,scrollbars=no,menubar=no,status=no')
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    }

  }
}
</script>
<style lang="scss" scoped>
.accounts_mgr /deep/ {
  padding: 20px;
  .banner {
    min-width: 1366;
    width: 100%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    // background-image: url("https://img.ishanshan.com/gimg/n/20190422/2423db644fab158ba4f50abdaa6f8377?p=image/format,jpg/quality,q_80");
  }
  .banner_title {
    font-size: 80px;
    color: #333333;
    padding: 160px 0 40px 0;
  }
  .banner_item {
    font-size: 25px;
    color: #333333;
    margin-top: 16px;
    line-height: 34px;
    vertical-align: middle;
    .banner_item_icon {
      width: 30px;
      line-height: 34px;
      vertical-align: middle;
    }
    span {
      line-height: 34px;
      margin-left: 20px;
      vertical-align: middle;
    }
  }
  .banner_img {
    min-width: 1366px;
    width: 100%;
    height: auto;
  }

  .account_btn {
    position: absolute;
    top: 0%;
    left: 40px;
    text-align: left;
  }

  .buy_img {
    width: 200px;
    height: 70px;
    margin-top: 70px;
  }

  .el-dialog__body {
    text-align: center;
    padding: 20px 20px 10px 20px !important;
  }
  .fail_btn {
    margin: 20px 0 0 0;
    text-align: right;
  }
  .text_btn {
    color: #46b6ee;
    &:hover {
      opacity: 0.8;
    }
  }

  .set_content {
    text-align: start;
    line-height: 20px;
    margin: 10px;
  }
  .set_hearder {
    .el-dialog__header {
      display: none;
    }
  }

  .have_accounts {
    p {
      line-height: 30px;
    }
  }
}
.dialog_footer {
  text-align: center;
}
.connect_p {
  margin: 14px 0 10px 0;
  color: #666;
}
.connect_mobile {
  color: #1d9df2;
}
</style>
