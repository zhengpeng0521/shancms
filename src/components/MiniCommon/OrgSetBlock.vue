/**
 * 蓝色小方块标题
 * slot
 */
<template>
  <div class="block-title">
    <div class="block-title-blue" />
    <h3 class="block-title-text">
      <slot />
    </h3>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.block-title {
  @include flex();
  @include itemCenter(center);
  height: 16px;
  position: relative;

  .block-title-blue {
    width: 6px;
    height: 14px;
    background: #46b6ee;
    border-radius: 2px;
    margin-right: 6px;
  }

  .block-title-text {
    font-size: 16px;
    width: 100%;
    line-height: 14px;
    color: #333;
  }
}
</style>
