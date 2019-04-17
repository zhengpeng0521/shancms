<template>
  <transition name="slide-fade">
    <div
      v-show="isVisible"
      class="side-zhezhao"
    >
      <div
        v-show="isVisible"
        class="side-dialog"
      >
        <div class="top">
          <div class="top-left">
            <span>数据分析</span>
          </div>
          <div class="top-right">
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
              >保存</el-button>
            </el-popover>

          </div>
        </div>
        <div class="cont" />
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    'visible': {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible2: false,
      visible3: false,
      isVisible: this.visible
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
  methods: {
    close() {
      this.isVisible = false
      this.visible2 = false
      this.visible3 = false
      console.log('1111')
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
  .top {
    width: calc(100vw - 190px) !important;
    min-height: 40px;
    height: 48px;
    justify-content: space-between;
    border-bottom: 1px solid rgba(238, 238, 238, 1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 20px;
    .top-left {
      span {
        font-size: 14px;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 14px;
      }
    }
    // .top-left span:nth-of-type(1) {
    //   display: inline-block;
    //   width: 6px;
    //   height: 14px;
    //   background: rgba(70, 182, 238, 1);
    //   border-radius: 2px;
    // }
    // .top-left span:nth-of-type(2) {
    //   display: inline-block;
    //   width: 64px;
    //   height: 14px;
    //   font-size: 16px;
    //   font-family: PingFangSC-Regular;
    //   font-weight: 400;
    //   color: rgba(51, 51, 51, 1);
    //   line-height: 14px;
    //   margin-left: 6px;
    // }
    .top-right {
      display: flex;
      .el-button {
        margin-left: 10px;
      }
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

