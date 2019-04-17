<!-- 扫码签到vue写法,未使用vuex,页面焦点未加 -->
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
            v-model="qrcode"
            autofocus="true"
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
import { Message } from 'element-ui'
import moment from 'moment'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import { stuQuickSign, querySignSelf } from '@/api/home/signBySelf'
import { lodopPrintStuSignSelf } from '@/utils/lodopPrintUtils'

export default {
  components: {
    VueQrcode
  },

  data() {
    return {
      loading: false,
      visible: false,
      stepFlg: true, // 是否安装了lodoop控件
      qrcode: '',

      qrcodeUrl: undefined,
      stuSignList: [], // 学员签到数据
      lodopResourceDownloadUrl: 'http://saas.ishanshan.com/saas3.0/lodop_pring_resource.rar'
    }
  },
  watch: {
  },
  mounted() {
    this.showSwitch()
    this.$refs.qrcodeScanInput.focus()
  },
  methods: {
    showSwitch() {
      if (!window.LODOP) {
        this.initLodopConfing()
      }

      // const sleep = function(ms) {
      //   return new Promise(function(resolve, reject) {
      //     setTimeout(function() {
      //       resolve()
      //     }, ms)
      //   })
      // }
      // sleep(500)

      this.validateLodopConfig()
      this.qrcode = ''
    },

    // 初始化lodop打印配置
    initLodopConfing() {
      //            let {ret} = yield call(getLodopConfig)
      const ret = {
        errorCode: 9000,
        host: '127.0.0.1',
        port: '18000'
      }
      if (ret && ret.errorCode === 9000) {
        this.host = ret.host
        this.port = ret.port
        const host = ret.host
        const port = ret.port
        const head = document.getElementsByTagName('body')[0]
        const lodopjs_script = document.createElement('script')
        lodopjs_script.type = 'text/javascript'
        lodopjs_script.name = 'lodopjs'
        lodopjs_script.src = 'http://' + host + ':' + port + '/CLodopfuncs.js'

        lodopjs_script.onreadystatechange = function() {
          if (this.readyState === 'complete') {
            initGetCLodopFunc()
          }
        }
        lodopjs_script.onload = function() {
          initGetCLodopFunc()
        }
        head.appendChild(lodopjs_script)

        // eslint-disable-next-line no-inner-declarations
        function initGetCLodopFunc() {
          // eslint-disable-next-line no-undef
          window.LODOP = getCLodop(
            document.getElementById('LODOP_OB'),
            document.getElementById('LODOP_EM')
          )
        }
      }
    },

    // 校验lodop的配置是否正确
    validateLodopConfig() {
      try {
        if (window.LODOP && window.LODOP.VERSION) {
          this.stepFlg = true
          this.visible = true
          this.querySignSelf()
        } else {
          this.stepFlg = false
          this.visible = true
        }
      } catch (err) {
        console.info('err', err)
      }
    },

    // 扫码签到记录
    querySignSelf() {
      window.query_sign_self = true // 打开自助扫码签到扫描
      const params = {
        pageIndex: 0,
        pageSize: 5,
        status: '2',
        onlyToday: true
      }
      querySignSelf(params).then(ret => {
        if (ret.data && ret.data.errorCode === 0) {
          this.stuSignList = ret.data.results
          this.qrcodeUrl = ret.data.linkUrl
        } else {
          Message.error(
            (ret.data && ret.data.errorMessage) || '查询扫码签到记录出错啦!'
          )
        }
      })
      // const sleep = function(ms) {
      //   return new Promise(function(resolve, reject) {
      //     setTimeout(function() {
      //       resolve()
      //     }, ms)
      //   })
      // }
      // while (window.query_sign_self) {
      //   querySignSelf(params).then(data => {
      //     if (data && data.errorCode === 0) {
      //       this.stuSignList = data.results
      //       this.qrcodeUrl = data.linkUrl
      //     } else {
      //       Message.error(
      //         (data && data.errorMessage) || '查询扫码签到记录出错啦!'
      //       )
      //     }
      //   })
      //   sleep(2000)
      // }
    },

    // 扫码签到
    signByQrcode(qrcodeStr) {
      const arr = qrcodeStr.split('@@')
      const cont = arr[1].split('#')

      const orgId = cont[1]
      const stuId = cont[2]
      const parentId = cont[3]
      const key = orgId + '_' + stuId + '_' + parentId

      const dayStr = moment().format('YYYY-MM-DD HH:mm')
      const signBySelf = window.signBySelf || {}
      const signBySelfDayObj = signBySelf[dayStr] || {}
      const signBySelfValue = signBySelfDayObj[key]
      console.info('signBySelfValue', signBySelfValue)
      if (!signBySelfValue || signBySelfValue === '') {
        signBySelfDayObj[key] = '1'
        signBySelf[dayStr] = signBySelfDayObj
        window.signBySelf = signBySelf // 用来控制当天签到过得不会重复签到

        // 打印签到情况 orgName, stuName, scheduleType, courseName, classroomName, signType, costNum, signTime
        // LODOP_PrintStuSignSelf('杭州美吉姆早教中心滨江店', '王大海', '班课', '音乐课二届', '玉兰山', '补课', 4, '2017-04-23 13:33:22')

        // 自主 快速签到
        const params = {
          orgId: orgId,
          stuId: stuId,
          parentId: parentId,
          status: '2'
        }
        stuQuickSign(params).then(ret => {
          const data = ret.data
          if (data && data.errorCode === 0) {
            if (!!data.courseName && data.courseName.length > 0) {
              if (data.courseNamePrint) {
                for (const i in data.courseName) {
                  lodopPrintStuSignSelf(
                    data.orgName || '',
                    data.stuName || '',
                    data.courseName[i] || '',
                    data.parentName || '',
                    data.signTimeStr || '',
                    data.logoUrl || ''
                  )
                }
              } else {
                lodopPrintStuSignSelf(
                  data.orgName || '',
                  data.stuName || '',
                  '',
                  data.parentName || '',
                  data.signTimeStr || '',
                  data.logoUrl || ''
                )
              }
            } else {
              Message.warning(`${data.stuName}本日无排课信息`)
              lodopPrintStuSignSelf(
                data.orgName || '',
                data.stuName || '',
                '',
                data.parentName || '',
                data.signTimeStr || '',
                data.logoUrl || ''
              )
            }
          } else {
            Message.error(
              data && data.errorMessage ? data.errorMessage : '签到失败'
            )
            window.signBySelf[dayStr][key] = ''
          }
        }).then(() => { this.qrcode = '' }).then(() => this.querySignSelf())
      } else {
        this.qrcode = ''
      }
    },

    /** 关闭 */
    close() {
      this.stuSignList = []
      this.visible = false
      window.query_sign_self = false// 关闭自助扫码签到扫描
    },

    /** change事件 */
    qrcodeInputChange(value) {
      if ((/^@@[0-9]*#[0-9]*#[0-9]*#[0-9]*@@$/.test(value))) {
        this.signByQrcode(value)
      } else {
        this.qrcode = value
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
  width: 800px;
  opacity: 1;
  position: absolute;
  bottom: 0;
  z-index: 1;
}
</style>
