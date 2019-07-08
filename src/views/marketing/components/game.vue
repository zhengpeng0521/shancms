<template>
  <div class="pic-container">
    <div
      v-if="data.length>0"
      class="pic-box"
    >
      <div
        v-for="(item,index) of data"
        :key="index"
        class="pic"
      >
        <div
          v-if="index<4"
          class="hotIcon"
        >
          <img
            src="https://img.ishanshan.com/gimg/n/20181008/b98bf7b1365be8676ec3985c0691add8"
            alt=""
          >
        </div>
        <div class="zhezhao">
          <div class="erweimaBox">
            <qrcode
              :value="item.demoUrl"
              :options="{ width: 132,height:132,margin:0 }"
              class="erweima"
            />
          </div>
        </div>
        <div class="main">
          <img
            :src="item.icon"
            alt=""
          >
          <div class="tit">{{ item.gameTitle }}</div>
          <div class="main-bottom">
            <div class="box">
              <svg-icon
                icon-class="icon_sy_ck"
                style="color:#999;font-size:26px;padding-top:6px"
              />
              <span>{{ item.allUsers }}</span>
            </div>
            <el-button
              v-if="item.btnType === 'ON'"
              type="primary"
              @click="outerDialog(item)"
            >创建</el-button>
            <el-button
              v-else
              type="primary"
              @click="outerDialog(item)"
            >{{ '￥'+item.price+ ' 购买' }}</el-button>
          </div>
        </div>
      </div>
      <!-- 弹出框 -->
      <el-dialog
        :visible.sync="outerVisible"
        :append-to-body="true"
        custom-class="creatGameDialog"
      >
        <div class="box">
          <div class="box-left">
            <img
              :src="leftImg"
              alt=""
            >
          </div>
          <div class="box-right">
            <h2>{{ tit }}</h2>
            <div class="modelType">
              <span class="dian" />
              <span class="tit">模板类型:</span>
              <div class="modelTypeCont">
                <div
                  v-if="modelType.length<1"
                  class="btn"
                >其他</div>
                <div
                  v-if="modelType.length>0"
                  class="btnBox"
                >
                  <div
                    v-for="(item,index) of modelType"
                    :key="index"
                    class="btn"
                  >{{ item.label_name }}</div>
                </div>
              </div>
            </div>
            <!-- <el-popover placement="bottom"> -->
            <div class="modelIntro">
              <span class="dian" />
              <span class="tit">模板介绍:</span>
              <el-popover
                :content="gameIntro"
                placement="bottom-start"
                trigger="hover"
              >
                <div slot="reference">{{ gameIntro }}</div>
              </el-popover>
            </div>
            <!-- </el-popover> -->
            <div class="otherIntro">
              <span class="dian" />
              <span class="tit">其他推荐:</span>
              <div class="introBtn">
                <img
                  v-for="(itm,index) in otherIntro"
                  :key="index"
                  :src="itm.icon"
                  alt=""
                  @click="imgBtn(itm.gameId)"
                >
              </div>
            </div>
            <div class="footer">
              <div class="erweima">
                <qrcode
                  :options="{ width: 132,height:132,margin:0 }"
                  :value="erweima"
                />
                <span>扫码试玩</span>
              </div>
              <el-button
                v-if="obj.btnType === 'ON'"
                type="primary"
                @click="picDetailBtn()"
              >立即创建</el-button>
              <el-button
                v-else
                type="primary"
                @click="buyDialogShow(true)"
              >
                {{ '￥'+obj.price+ ' 购买' }}
              </el-button>
            </div>
          </div>
        </div>
      </el-dialog>

    </div>
    <div
      v-if="data.length === 0"
      class="pic-box"
    >
      <div class="zhanwei">
        <img
          style="width:51px;height:51px;"
          src="https://img.ishanshan.com/gimg/n/20190327/88826c90471a228009be72f913981612"
          alt=""
        >
        <p>抱歉 没有符合相应条件的模板</p>
      </div>
    </div>
    <GameDetail
      v-if="picDetailShow"
      :visible.sync="picDetailShow"
      @openPreviewDialog="openPreviewDialog"
    />
    <!-- 游戏保存成功后的弹框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      title="保存成功"
      width="400px"
      append-to-body
      @close="closeDialog"
    >
      <div>
        <p class="game_top"><i class="el-icon-circle-check icon_success" />微游戏已保存成功</p>
        <div class="game_qrcode">
          <transition name="el-zoom-in-bottom">
            <Qrcode
              v-if="dialogData.qrcodeUrl"
              :value="dialogData.qrcodeUrl"
              :options="{ width: 190,height:190,margin: 0 }"
            />
          </transition>
        </div>
        <div class="copy_box">
          <el-input
            ref="url"
            v-model="dialogData.qrcodeUrl"
            :readonly="true"
            :style="{marginRight: '20px'}"
          />
          <el-button
            v-clipboard:copy="dialogData.qrcodeUrl"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            type="primary"
          >复制</el-button>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="goMyGame('edit')">再次编辑</el-button>
        <el-button
          type="primary"
          @click="goMyGame"
        >立即查看</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="buyDialogVisible"
      title="游戏开通"
      width="300px"
      append-to-body
    >
      <div style="text-align: center">
        <img
          class="connect_popover_img"
          src="https://img.ishanshan.com/gimg/user/n///1557308283.png"
        >
        <p class="connect_p">微信扫码，获取专属服务顾问</p>
        <p class="connect_mobile">客服热线：400-660-5733</p>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="buyDialogShow(false)">知道了</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Qrcode from '@chenfengyuan/vue-qrcode'
import GameDetail from './creatGame'
import { gameChoose } from '@/api/marketing/microGame.js'
import { mapState, mapActions } from 'vuex'
export default {
  components: {
    GameDetail,
    Qrcode
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }

  },
  data() {
    return {
      buyDialogVisible: false, // 开通弹框
      picDetailShow: false,
      // 弹出框参数
      outerVisible: false,
      innerVisible: false,
      // 外层弹窗参数
      tit: '',
      gameIntro: '',
      modelType: [],
      leftImg: '',
      erweima: '',
      otherIntro: [],
      obj: {},
      dialogVisible: false, // 游戏保存后预览弹框显示
      dialogData: {} // 游戏保存后预览弹框显示数据
    }
  },
  computed: {
    ...mapState('changeThirdMain', [
      'tabsName'
    ])
  },
  methods: {
    // 购买游戏显示
    buyDialogShow(val) {
      this.buyDialogVisible = val || false
      this.outerVisible = false
    },
    // 打开游戏保存后的预览弹框, gameUrl: 游戏链接, data: iframe传递的信息
    openPreviewDialog(data) {
      this.dialogVisible = true
      this.dialogData = {
        qrcodeUrl: data.instH5Url
      }
      this.obj = {
        ...this.obj,
        dataId: data.instId
      }
    },
    // 关闭游戏保存后的预览弹框
    closeDialog() {
      this.dialogVisible = false
    },
    onCopy: function(e) {
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    },
    onError: function(e) {
      this.$message.error('复制失败')
    },
    ...mapActions('changeThirdMain', [
      'changeTabs'
    ]),
    /** 跳转我的 */
    goMyGame(type) {
      if (type && type === 'edit') {
        this.dialogVisible = false
        this.picDetailShow = true
      } else {
        this.dialogVisible = false
        this.$nextTick(() => {
          this.changeTabs('myGame')
        })
      }
    },
    picDetailBtn() {
      this.picDetailShow = true
      this.outerVisible = false
    },
    // 弹框方法
    outerDialog(e) {
      this.outerVisible = true
      this.obj = e
      this.tit = e.gameTitle
      this.modelType = e.labels || []
      this.leftImg = e.showImg
      this.erweima = e.demoUrl
      this.gameIntro = e.gameIntro
      const params = { gameId: e.gameId }
      gameChoose(params).then((res) => {
        if (res.data.errorCode === 0) {
          this.otherIntro = res.data.gameList
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    imgBtn(gid) {
      this.outerVisible = false
      this.data.map((val) => {
        if (val.gameId === gid) {
          setTimeout(() => { this.outerDialog(val) }, 300)
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.pic-container {
  min-height: calc(100vh - 328px);
  background: rgba(240, 242, 245, 0.8);
}
.pic-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 15px 0 0 15px;
  .zhanwei {
    height: 200px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 20px;
    p {
      font-size: 14px;
      line-height: 14px;
      color: #666;
      margin-top: 10px;
    }
  }
}
.pic {
  height: 306px;
  min-width: 240px;
  padding: 10px;
  position: relative;
  transition: all 1s;
  border-radius: 5px;
  text-align: left;
  background: rgba(255, 255, 255, 1);
  margin: 15px 15px;
  .hotIcon {
    width: 39px;
    height: 28px;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1000;
    img {
      width: 100%;
    }
  }
  .zhezhao {
    width: 220px;
    height: 220px;
    position: absolute;
    background: rgba(0, 0, 0, 0);
    transition: background 1s;
    display: flex;
    justify-content: center;
    align-items: center;
    .erweimaBox {
      width: 140px;
      height: 140px;
      padding: 4px;
      background: #fff;
      opacity: 0;
      transition: opacity 1s;
    }
    .erweima {
      opacity: 0;
      transition: opacity 1s;
    }
  }

  .main {
    img {
      width: 220px;
      height: 220px;
    }

    .tit {
      font-size: 14px;
      text-align: left;
      padding: 15px 0px 5px 0px;
      white-space: nowrap;
      margin-right: 10px;
      margin-left: 10px;
    }

    .main-bottom {
      display: flex;
      justify-content: space-between;
    }

    .box span {
      margin-left: 3px;
      display: inline-block;
      line-height: 25px;
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      font-size: 12px;
    }
  }
}

.pic:hover .zhezhao {
  background: rgba(0, 0, 0, 0.5);
}
.pic:hover .erweima {
  opacity: 1;
}
.pic:hover .erweimaBox {
  opacity: 1;
}
.pic:hover {
  box-shadow: 10px 10px 15px 0 #999;
}
</style>
<style lang="scss">
.creatGameDialog {
  width: 700px;
  height: 560px;

  .el-dialog__header {
    margin: 0;
    padding: 0 !important;
    border-bottom: 0;
  }
  .el-dialog__body {
    max-height: 560px !important;
    overflow: hidden;
    .box {
      width: 100%;
      height: 500px;
      padding-top: 15px;
      display: flex;
      .box-left {
        width: 311px;
        overflow: hidden;
        overflow-y: scroll;
        img {
          width: 100%;
          min-height: 1000px;
        }
      }
      .box-right {
        display: flex;
        flex-direction: column;
        width: 329px;
        margin-left: 30px;
        position: relative;
        h2 {
          font-size: 16px;
          color: #333;
          letter-spacing: 2px;
          margin-bottom: 30px;
          font-weight: 900;
          margin-top: 0;
        }
        .dian {
          width: 6px;
          height: 6px;
          background: #5d9cec;
          display: inline-block;
          border-radius: 50%;
        }
        .tit {
          font-size: 12px;
          color: #333;
          display: inline-block;
          letter-spacing: 1px;
          margin-bottom: 8px;
          margin-top: 10px;
        }
        .modelType {
          font-size: 12px;
          color: #333;
          letter-spacing: 1px;
          margin-top: 10px;

          .modelTypeCont {
            font-size: 12px;
            color: #5d9cec;
            padding-left: 13px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            margin-top: 8px;
            .btn {
              padding: 4px 6px;
              background: #e0f1ff;
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
              border-radius: 4px;
              display: inline-block;
              margin-right: 8px;
              margin-bottom: 8px;
            }
          }
        }
        .modelIntro {
          font-size: 12px;
          color: #999;
          box-sizing: border-box;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          letter-spacing: 1px;
          div {
            font-size: 12px;
            color: #999;
            padding-left: 13px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
          }
        }
        .otherIntro .introBtn {
          margin-bottom: 20px;
          padding-left: 13px;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          img {
            width: 70px;
            height: 70px;
            background: #ddd;
            display: inline-block;
            margin-right: 10px;
          }
        }
        .footer {
          padding-left: 13px;
          display: flex;
          justify-content: space-between;
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          .erweima {
            display: flex;
            flex-direction: column;
            span {
              margin-left: 43px;
              margin-top: 10px;
            }
          }
          .el-button {
            position: absolute;
            bottom: 0;
            right: 0;
          }
        }
      }
    }
  }
}
//---------------------- 保存成功 start---------------------------
.game_top {
  text-align: center;
  font-size: 20px;
  margin-bottom: 20px;
  .icon_success {
    color: #87d068;
    margin-right: 5px;
  }
}

.game_qrcode {
  text-align: center;
}

.copy_box {
  display: flex;
  margin-top: 20px;
  margin-bottom: 14px;
}
//---------------------- 保存成功 end---------------------------

.connect_p {
  margin: 14px 0 10px 0;
  color: #666;
}
.connect_mobile {
  color: #1d9df2;
}
</style>

