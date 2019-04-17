<template>
  <transition name="slide-fade">
    <div
      v-show="isVisible"
      ref="sideModal"
      class="side-zhezhao"
    >
      <div
        v-show="isVisible"
        class="side-dialog"
      >
        <!-- <div class="top">
          <div class="top-left">
            <span>图标</span>
            <span>名字</span>
          </div>
          <div class="top-right">
            <el-popover
              v-model="visible3"
              placement="bottom-end"
              popper-class="tanchukuang"
              width="160"
            >
              <p><span>图标</span>确定要保存吗？</p>
              <div style="text-align: right; margin: 0;">
                <el-button
                  size="mini"
                  class="edit_btn"
                  plain
                  @click="visible3 = false"
                >取消</el-button>
                <el-button
                  type="primary"
                  class="edit_btn"
                  @click="close"
                >确定</el-button>
              </div>
              <el-button
                slot="reference"
                type="primary"
              >提交</el-button>
            </el-popover>
            <el-popover
              v-model="visible2"
              placement="bottom-end"
              width="160"
              popper-class="tanchukuang"
            >
              <p><span>图标</span>确定要关闭窗口吗？</p>
              <div style="text-align: right; margin: 0;">
                <el-button
                  size="mini"
                  class="edit_btn"
                  plain
                  @click="visible2 = false"
                >取消</el-button>
                <el-button
                  type="primary"
                  class="edit_btn"
                  @click="close"
                >确定</el-button>
              </div>
              <el-button
                slot="reference"
                plain
              >关闭</el-button>
            </el-popover>
          </div>
        </div> -->
        <div class="contBox">
          <iframe
            :src="url"
            class="cont"
          />
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
// import { micActivityRequest, sysHostRequest } from '@/api/marketing/microAct.js'
export default {
  props: {
    'visible': {
      type: Boolean,
      default: true
    }
  },
  data() {
    // const iframeUrl = 'http://192.168.1.65/activityhtml/?moduleId=199&moduleCode=132201712221552&moduleInstId=&orgId=3536&orgName=' + encodeURI(encodeURI('更丰富'))
    return {
      visible2: false,
      visible3: false,
      isVisible: this.visible,
      url: ''
    }
  },
  watch: {
    'visible'(val) {
      this.isVisible = val
      console.log(val)
    },
    'isVisible'(val) {
      this.$emit('update:visible', val)
    }
  },
  mounted() {
    const side = this.$refs.sideModal
    document.body.appendChild(side)
    this.url = `${process.env.CONTENT_PATH}/micActivity/index.html?moduleId=${this.$parent.obj.activityId || ''}&moduleCode=&moduleInstId=${this.$parent.obj.id || ''}&orgId=${this.$parent.obj.orgId || ''}&orgName=${encodeURI(encodeURI(this.$store.getters.orgName || ''))}`
    const self = this
    window.addEventListener('message', function(e) {
      if (e.data === 'close') {
        self.close()
      }
    }, false)
  },
  methods: {
    close() {
      this.isVisible = false
      this.visible2 = false
      // this.$parent.resetFieldHanle()
    }
  }
}
</script>
<style lang="scss" scoped>
.side-zhezhao {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0px;
  right: 0px;
  z-index: 10000;
}

.side-dialog {
  top: 0px;
  right: 0px;
  z-index: 1000;
  width: calc(100% - 150px);
  position: fixed;
  margin-left: -20px;
  height: 100%;
  background-color: rgba(255, 255, 255, 1);
  -moz-box-shadow: 2px 2px 5px #333333;
  -webkit-box-shadow: 2px 2px 5px #333333;
  box-shadow: 2px 2px 5px #333333;
  // .top {
  //   width: calc(100vw - 180px) !important;
  //   min-height: 40px;
  //   justify-content: space-between;
  //   border-bottom: 4px solid #5d9cec;
  //   display: flex;
  //   justify-content: space-between;
  //   padding-top: 10px;
  //   margin-left: 20px;
  //   background: pink;
  //   .top-left {
  //     display: flex;
  //     font-size: 16px;
  //     margin-top: 10px;
  //   }
  //   .top-right {
  //     display: flex;
  //     .el-button {
  //       margin-left: 10px;
  //       margin-bottom: 10px;
  //     }
  //   }
  // }
  .contBox {
    width: calc(100vw - 150px);
    height: 100vh;
    .cont {
      width: 100%;
      height: 100%;
    }
  }
}

.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(1000px);
  opacity: 0;
}
.picDetail-container {
  // width: 100vw;
  // height: 100vh;
  // background: rgba(0, 0, 0, 0.5);
  // z-index: 10000;
  // position: fixed;
  // top: 0;
  // left: 0;

  // @keyframes enterAnamation {
  //   10% {
  //     right: -100%;
  //   }
  //   100% {
  //     right: 0;
  //   }
  // }
  // // .picDetailShow {
  // //   animation: enterAnamation 1s linear;
  // // }
  // .picDetail {
  //   animation: enterAnamation 1s linear;
  // }
}
</style>
<style lang="scss" >
.tanchukuang {
  z-index: 20000 !important;
  p {
    font-size: 12px;
    color: #666;
  }
}
</style>

