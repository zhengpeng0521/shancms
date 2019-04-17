/**
 * 蓝色小方块标题
 * props:
 *    exportFile         Func       //导出
 * slot
 */
<template>
  <div class="block-title">
    <div class="block-title-blue" />
    <h3 class="block-title-text">
      <slot />
    </h3>
    <el-button
      v-if="!!exportFile"
      type="primary"
      icon="el-icon-document"
      class="block-title-export"
      @click="exportFile"
    >按查询结果导出</el-button>
  </div>
</template>

<script>
export default {
  props: {
    exportFile: {
      type: Function,
      default: undefined
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.block-title {
  @include flex();
  @include itemCenter(center);
  height: 28px;
  position: relative;

  .block-title-blue {
    width: 8px;
    height: 14px;
    background: #46b6ee;
    border-radius: 3px;
    margin-right: 10px;
  }

  .block-title-text {
    font-size: 14px;
    width: 100%;
  }

  .block-title-export {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
