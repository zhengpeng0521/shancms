<template>
  <div>
    <div v-if="!isInit">
      <slot />
    </div>
    <div
      v-else
      :style="{height}"
      class="cust-loading"
    >
      <i class="el-icon-loading cust-loading-icon" />
      <span class="cust-loading-text">拼命加载中...</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isInit: {
      type: Boolean,
      required: true
    },
    height: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.cust-loading {
  @include flex();
  @include boxCol();
  @include flexCenter(center);
  @include itemCenter(center);

  .cust-loading-icon {
    font-size: 30px;
    color: #46b6ee;
  }

  .cust-loading-text {
    margin-top: 10px;
    color: #46b6ee;
  }
}
</style>
