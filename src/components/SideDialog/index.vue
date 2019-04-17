<template>
  <transition name="slide-fade">
    <div
      v-show="isVisible"
      ref="sideModal"
      class="side-dialog"
    >
      <div
        class="close-btn"
        @click="close"
      >
        <i class="el-icon-close" />
      </div>
      <slot />
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
      isVisible: this.visible
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
  mounted() {
    const side = this.$refs.sideModal
    document.body.appendChild(side)
  },
  beforeDestroy() {
    const child = this.$el
    child.parentNode && child.parentNode.removeChild(child)
  },
  methods: {
    close() {
      this.isVisible = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/styles/mixin.scss";

.side-dialog {
  bottom: 0px;
  right: 0px;
  z-index: 99;
  width: 900px;
  position: absolute;
  margin-left: -20px;
  height: calc(100vh - 40px);
  background-color: #ffffff;
  -moz-box-shadow: 2px 2px 5px #333333;
  -webkit-box-shadow: 2px 2px 5px #333333;
  box-shadow: 2px 2px 5px #333333;
  .close-btn {
    width: 2.5rem;
    height: 2.5rem;
    position: absolute;
    left: -2.5rem;
    display: -webkit-box;
    -webkit-box-pack: center;
    -webkit-box-orient: vertical;
    text-align: center;
    background: #a2daf6;
    border-radius: 5px 0 0 5px;
    box-shadow: -1px 1px 10px #ddd;
    cursor: pointer;
  }
  .close-icon {
    width: 1rem;
    height: 1rem;
    margin-left: 0.3rem;
    transform: rotate(-180deg);
    transition: 0.5s;
    color: #fff;
  }
  .close-icon:hover {
    transform: rotate(180deg);
    transition: 0.5s;
  }
  .el-icon-close {
    transform: rotate(-180deg);
    transition: 0.5s;
    color: #fff;
  }
  .el-icon-close:hover {
    transform: rotate(180deg);
    transition: 0.5s;
  }
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
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
