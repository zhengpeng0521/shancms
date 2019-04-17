<template>
  <div>
    <el-dialog
      :visible.sync="open"
      class="wx"
      width="600px"
      @close="closeDialog()"
    >

      <div style="text-align: center;position: relative">
        <i
          class="el-icon-close wx-close"
          @click="closeDialog"
        />
        <p>
          绑定<span style="color: #feab11;font-size: 24px;">

            闪闪管家公众号
          </span>
        </p>

        <p style="margin: 5px auto;line-height: 22px;">
          随时接收活动数据提醒，获取机构最新动态
        </p>
      </div>

      <div class="wx_content">

        <div class="wx_left" />

        <div class="wx_right">
          <div
            v-loading="loading"
            v-if="!qrUrl"
            class="right_top"
          />
          <img
            v-else
            :src="qrUrl"
            :style="{width: '170px', height: '170px'}"
          >

          <p style=" margin-top: 58px;">
            第一步：老师微信扫"闪闪管家微信号"二维码-

          </p>
          <p style="text-align: center;">
            手机验证-绑定成功
          </p>
          <p>
            第二步：在设置-消息通知-消息设置中绑定接
            收人,可接收提醒
          </p>
        </div>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import { getQrCode } from '@/api/orgSet/messageNotice.js'

export default {
  data() {
    return {
      open: false,
      loading: false,
      qrUrl: undefined
    }
  },

  methods: {

    openDialog() {
      this.open = true
    },
    closeDialog() {
      this.open = false
    },
    getQr() {
      const { tenantId, orgId } = this.$store.getters
      const data = {
        identity: `tenantId=${tenantId},orgId=${orgId}`,
        expire: 2592000,
        forever: false,
        weChatType: 'manage'
      }
      this.loading = true
      getQrCode(data).then(res => {
        if (res.data.errorCode === 0) {
          this.qrUrl = res.data.data.codeUrl
          this.loading = false
        } else {
          this.$message.error(res.data.errorMessage)
          this.loading = false
        }
      })
    }
  }

}
</script>
<style lang="scss" scoped>
.wx /deep/ {
  .el-dialog__header {
    display: none;
    border-bottom: none !important;
  }
}

.wx_content {
  display: flex;
  margin: 30px;
  justify-content: space-between;
  align-items: center;
}
.wx-close {
  position: absolute;
  top: 0;
  right: -12px;
}

.wx_left {
  width: 196px;
  height: 349px;
  background: #ccc;
  margin-right: 30px;
  background: url("https://img.ishanshan.com/gimg/img/b481e3e79d3f49f5fd6046708856fd63");
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: cover;
}

.wx_right {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #616c7b;
  font-size: 14px;
  p {
    margin: 5px 0;
    width: 288px;
    line-height: 20px;
  }
}
.right_top {
  height: 170px;
  width: 170px;
  background: #ccc;

  background-image: url("../../assets/wechat/wechat.png");
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
