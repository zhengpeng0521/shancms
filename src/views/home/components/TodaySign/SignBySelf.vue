<template>
  <div>
    <el-dialog
      :visible="visible && !stepFlg"
      title="提示"
      width="500px"
      @close="close"
    >
      <div class="sign_soft_download">
        <div class="sign_soft_desc_item">1.请下载<a :href="lodopResourceDownloadUrl">签到软件</a></div>
        <div class="sign_soft_desc_item">2.安装签到软件</div>
        <div class="sign_soft_desc_item">3.安装成功后请重新打开签到窗口</div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="close"
        >我知道了</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible="visible && stepFlg"
      title="扫码签到功能已开启"
      width="700px"
      @close="close"
    >
      <div class="stu_sign_self_cont">
        <div class="sign_self_content">
          <div class="left_content">
            <div class="message_text">*扫码期间请不要切换到其他网页或软件</div>

            <div class="sign_record_cont">
              <div class="sign_record_title_cont">
                <div>学员姓名</div>
                <div>所在机构</div>
                <div>签到时间</div>
              </div>

              <div
                v-if="stuSignList && stuSignList.length > 0"
                class="sign_list_box"
              >
                <transition-group name="el-zoom-in-top">
                  <div
                    v-for="(recordItem, index) in stuSignList"
                    :key="'sign_record_item_cont_' + index"
                    class="sign_record_item_cont"
                  >
                    <div>{{ recordItem.stuName }}</div>
                    <div>{{ recordItem.orgName }}</div>
                    <div>{{ recordItem.signTimeStr }}</div>
                  </div>
                </transition-group>
              </div>

              <div
                v-else
                class="no_sign_record_cont"
              >
                <img
                  class="no_sign_record_img"
                  src="https://img.ishanshan.com/gimg/user/n///1550211410.png"
                >
                <div class="no_sign_record_text">今日没有学员签到</div>
              </div>
            </div>

            <div class="desc_text">
              显示最新5条信息
            </div>

          </div>

          <div class="right_cont">
            <div class="title_text_one">学员查询码</div>
            <div class="title_text_two">仅供家长微信使用</div>
            <div class="qrcode_cont">
              <transition name="el-zoom-in-bottom">
                <VueQrcode
                  v-if="qrcodeUrl"
                  :value="qrcodeUrl"
                  :options="{ width: 190,height:190,margin:0 }"
                />
              </transition>
            </div>
          </div>
        </div>

        <div class="qrcode_input_cont">
          <el-input
            ref="qrcodeScanInput"
            v-model="qrUrl"
            :autofocus="true"
            placeholder="请扫描二维码进行自主签到"
            @input="(value) => qrcodeInputChange(value)"
            @blur="onQrcodeInputBlur"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import VueQrcode from '@chenfengyuan/vue-qrcode'

export default {
  components: {
    VueQrcode
  },

  data() {
    return {
      qrUrl: ''
    }
  },
  computed: {
    ...mapState('signBySelf', [
      'visible',
      'stepFlg',
      'qrcode',

      'qrcodeUrl',
      'stuSignList',
      'lodopResourceDownloadUrl'
    ])
  },
  watch: {
    qrcode(val) {
      this.qrUrl = val
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.qrcodeScanInput.$el.querySelector('input').focus()
    })
  },
  methods: {
    ...mapMutations('signBySelf', [
      'UPDATE_STATE'
    ]),
    ...mapActions('signBySelf', [
      'showSwitch',
      'signByQrcode'
    ]),

    /** 关闭 */
    close() {
      this.UPDATE_STATE({ stuSignList: [], visible: false })
      window.query_sign_self = false// 关闭自助扫码签到扫描
      this.$parent.isShow = false
    },

    /** change事件 */
    qrcodeInputChange(value) {
      if ((/^@@[0-9]*#[0-9]*#[0-9]*#[0-9]*@@$/.test(value))) {
        this.signByQrcode({ qrcodeStr: value })
        this.UPDATE_STATE({ qrcode: '' })
      } else {
        this.UPDATE_STATE({ qrcode: value })
      }
    },

    /** 聚焦 */
    onQrcodeInputBlur(e, a, b, c) {
      e.target.focus()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

/*安装软件的窗口*/
.sign_soft_download {
  position: relative;
  padding: 30px;
  padding-bottom: 50px;
  padding-right: 0;
  text-align: center;
}
.sign_soft_desc_item {
  font-size: 16px;
  margin-top: 10px;

  &:first-child {
    margin: 0;
  }

  a {
    color: #46b6ee;
  }
}

/*扫码签到窗口*/
.sign_self_content {
  @include flex;
}
.message_text {
  font-size: 12px;
  color: #fa4816;
  margin-bottom: 14px;
}

.sign_record_cont {
  width: 465px;
  height: 182px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.sign_record_title_cont {
  line-height: 32px;
  border-bottom: 1px solid #ddd;
  background: rgba(240, 242, 245, 0.6);
  padding: 0 20px;
  @include flex;
  div {
    width: 40%;
  }
  div:first-child {
    width: 20%;
  }
}
.sign_list_box {
  padding: 20px;
}
.sign_record_item_cont {
  line-height: 14px;
  margin-bottom: 10px;
  @include flex;
  &:last-child {
    margin: 0;
  }
  div {
    width: 40%;
  }
  div:first-child {
    width: 20%;
  }
}
.no_sign_record_cont {
  height: 150px;
  @include flex;
  @include boxCol;
  @include flexCenter(center);
  @include itemCenter(center);
  .no_sign_record_img {
    height: 56px;
  }
}
.desc_text {
  margin: 14px 0 15px;
  font-size: 12px;
  color: #999;
}
.right_cont {
  width: 165px;
  margin-left: 20px;
  @include flex;
  @include boxCol;
  @include itemCenter(center);

  .title_text_one {
    color: #333;
  }
  .title_text_two {
    font-size: 12px;
    color: #999;
    margin: 6px 0;
  }
}
.qrcode_input_cont{
  overflow: hidden;
  width: 80px;
  opacity: 0;
  position: absolute;
  bottom: 0;
  z-index: -1;
}
</style>
