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
            <Confirm
              :text="'关闭'"
              :placement="'top'"
              :content="'确认关闭么?'"
              :confirm="close"
              :is-button="true"
              :btn-type="'plain'"
            />
          </div>
        </div>
        <div class="body">
          <el-button
            plain
            @click="handelSwitch"
          >{{ detailTitle }}</el-button>
          <div class="cont">
            <baseData v-if="baseDataShow" />
            <userData
              v-if="userDataShow"
              ref="userData"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import baseData from './baseData'
import userData from './userData'
import Confirm from '@/components/MiniCommon/Confirm'
export default {
  components: { baseData, userData, Confirm },
  props: {
    'visible': {
      type: Boolean,
      default: true
    },
    'id': {
      type: String,
      required: true
    },
    'time': {
      type: Object,
      required: true
    },
    'createTime': {
      type: String,
      required: true
    }
  },
  data() {
    return {
      visible2: false,
      visible3: false,
      isVisible: this.visible,
      address: 'https://img.ishanshan.com/gimg/n/20190116/e8a4dcec601a9f23ef2c97826cee671a',
      detailTitle: '切换为用户数据',
      // 基础数据
      baseDataShow: true,
      // 用户数据
      userDataShow: false
    }
  },
  watch: {
    'visible'(val) {
      this.isVisible = val
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
      this.baseDataShow = true
      this.userDataShow = false
    },
    submitForm() {
      this.isVisible = false
      this.visible3 = false
    },
    // 数据弹窗
    // 基础数据，用户数据组件切换
    handelSwitch() {
      if (this.baseDataShow === true) {
        this.baseDataShow = false
        this.userDataShow = true
        this.detailTitle = '切换为基础数据'
      } else {
        this.baseDataShow = true
        this.userDataShow = false
        this.detailTitle = '切换为用户数据'
      }
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
  z-index: 2000;
}

.side-dialog {
  top: 0px;
  right: 0px;
  z-index: 1000;
  width: calc(100% - 150px);
  position: fixed;
  height: 100%;
  background-color: rgba(255, 255, 255, 1);
  -moz-box-shadow: 2px 2px 5px #333333;
  -webkit-box-shadow: 2px 2px 5px #333333;
  box-shadow: 2px 2px 5px #333333;
  padding: 0 20px;
  .top {
    min-height: 40px;
    justify-content: space-between;
    border-bottom: 1px solid #dddddd;
    display: flex;
    justify-content: space-between;
    padding: 10px 0 10px 0;
    .top-left {
      display: flex;
      font-size: 16px;
    }
    .top-right {
      display: flex;
      .el-button {
        margin-left: 10px;
      }
    }
  }
  .body {
    padding-top: 20px;
    height: calc(100vh - 70px);
    overflow: auto;
    .cont {
      margin-top: 20px;
      overflow: hidden;
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
</style>
<style lang="scss">
.el-select-dropdown {
  z-index: 10005 !important;
}
.el-date-range-picker {
  z-index: 10005 !important;
}
.el-tooltip__popper {
  z-index: 10005 !important;
}
.tanchukuang {
  z-index: 20000 !important;

  p {
    font-size: 12px;
    color: #666;
  }
  .sortTip {
    z-index: 200001 !important;
  }
}
</style>

