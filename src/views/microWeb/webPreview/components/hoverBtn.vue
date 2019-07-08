<!-- 微官网预览二维码 -->
<template>
  <el-popover
    v-if="message!=''"
    :title="title"
    placement="bottom-start"
    width="240"
    trigger="hover"
    popper-class="hoverDialog"
  >
    <div style="margin:20px 30px">
      <qrcode
        id="qrCode"
        ref="qr"
        :options="{ width: 180,height:180,padding:0,margin:0 }"
        :value="message"
        class="erweima"
      />
    </div>
    <div class="erweima-footer">
      <!-- <div class="ipt">
                <span ref="url">{{ message }}</span>
              </div> -->
      <el-button
        v-clipboard:copy="message"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"
        type="plain"
      >复制地址</el-button>
      <el-button
        type="plain"
        @click="downLoad"
      >下载二维码</el-button>
    </div>
    <el-button
      slot="reference"
      :loading="loading"
      class="cancel_btn"
    >{{ btnText }}</el-button>
  </el-popover>
</template>
<script>
// 二维码装换插件
import Vue from 'vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'
Vue.component(VueQrcode.name, VueQrcode)
// 复制插件
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
export default {
  props: {
    page: {
      type: String,
      default: undefined
    },
    orgHome: {
      type: String,
      default: undefined
    }
  },

  data() {
    return {
      message: '',
      loading: false
    }
  },

  computed: {
    title() {
      const head = this.page && this.page === 'personCnter' ? '手机扫码访问个人中心' : '手机扫码访问微官网'
      return head
    },
    btnText() {
      const text = this.page && this.page === 'personCnter' ? '访问个人中心' : '访问微官网'
      return text
    }
  },
  watch: {
    orgHome(nextValue) {
      let orgHome = nextValue
      if (!orgHome) {
        orgHome = ''
      } else if (orgHome.startsWith('//')) {
        orgHome = window.location.protocol + orgHome
      } else if (!orgHome.startsWith('http')) {
        orgHome = 'http://' + orgHome
      }
      // 访问个人中心
      if (this.page && this.page === 'personCnter') {
        orgHome += '&redirect=personCenter'
      }
      this.message = orgHome
    }
  },
  methods: {
    onCopy: function(e) {
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    },
    onError: function(e) {
      this.$message.error('复制失败')
    },
    downLoad() {
      var oQrcode = document.querySelector('#qrCode')
      var imgSrc = oQrcode.toDataURL('image/png')
      var a = document.createElement('a')
      var event = new MouseEvent('click')
      // 下载图名字
      a.download = '二维码文件'
      // url
      a.href = imgSrc
      // 合成函数，执行下载
      a.dispatchEvent(event)
    }
  }
}
</script>
<style lang="scss">
.hoverDialog {
  padding: 0;
  .erweima-footer {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
  }
}
.hoverDialog .el-popover__title {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 0;
}
</style>

