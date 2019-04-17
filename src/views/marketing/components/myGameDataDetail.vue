<template>
  <transition name="slide-fade">
    <div
      v-show="isVisible"
      ref="dataDetail"
      class="side-dialog"
    >
      <div class="top">
        <div class="top-left">
          <img
            src="https://img.ishanshan.com/gimg/img/17f0dfd2429ae6f65391477aee5b7a25"
            alt=""
          >
          <span>数据详情</span>
        </div>
        <el-button
          plain
          @click="close"
        >关闭</el-button>
      </div>
      <div class="body">
        <iframe
          :src="url"
          class="cont"
        />
      </div>
    </div>
  </transition>
</template>
<script>
// import { fetchList } from '@/api/marketing'
// import CommonSearch from '@/components/CommonSearch/CommonSearch'
// import CommonTable from '@/components/CommonTable/CommonTable'
// import { findDetail } from '@/api/marketing/microAct.js'
// import { exportFile } from '@/utils/exportFile.js'
// import { fetchList } from '@/api/marketing'
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
      isVisible: this.visible,
      url: ''
      // isVisible: false

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
    const provider = this.$parent.dataObj.provider
    const dataId = this.$parent.dataObj.dataId
    const gameId = this.$parent.dataObj.gameId
    const tenantId = this.$parent.dataObj.tenantId
    const orgId = this.$parent.dataObj.orgId
    const gameCode = this.$parent.dataObj.gameCode
    const uid = this.$store.getters.id
    const runAs = window.runAs || ''
    this.url = provider + '/page?m=data&dataId=' + dataId + '&tenantId=' + tenantId + '&orgId=' + orgId + '&gameCode=' + gameCode + '&gameId=' + gameId + '&uid=' + uid + '&runAs=' + runAs
  },
  methods: {
    close() {
      this.isVisible = false
      this.visible2 = false
    }

  }
}
</script>
<style lang="scss" scoped>
.el-popper {
  z-index: 10001 !important;
  p {
    font-size: 12px;
    color: #666;
  }
}
.side-dialog {
  top: 40px;
  right: 0px;
  z-index: 1000;
  width: calc(100% - 165px);
  position: fixed;
  margin-left: -20px;
  height: calc(100%);
  background-color: #ffffff;
  -moz-box-shadow: 2px 2px 5px #333333;
  -webkit-box-shadow: 2px 2px 5px #333333;
  box-shadow: 2px 2px 5px #333333;
  .top {
    width: calc(100vw - 185px) !important;
    justify-content: space-between;
    display: flex;
    padding: 20px 10px;
    border: 0;
    .top-left {
      display: flex;
      align-items: center;
      margin: 0;
      img {
        margin-right: 10px;
        width: 35px;
        height: 35px;
      }
      span {
        font-size: 14px;
        color: rgb(89, 89, 89);
      }
    }
  }
  .body {
    width: 100%;
    height: calc(100vh - 75px);
    .cont {
      width: 100%;
      height: 100%;
      border: 0;
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

