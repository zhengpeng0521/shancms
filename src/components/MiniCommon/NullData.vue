/**
 * 空数据组件
 *   宽高根据父组件变化
 * props:
 *   text       Str       文案显示，默认 暂无数据
 */
<template>
  <div class="null-data">
    <img
      class="null-data-pic"
      src="https://img.ishanshan.com/gimg/user/n///1550211410.png"
      alt="无数据"
    >
    <span class="null-data-text">{{ text }}</span>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '暂无数据'
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";

.null-data {
  width: 100%;
  height: 100%;
  @include flex();
  @include boxCol();
  @include flexCenter(center);
  @include itemCenter(center);
}
.null-data-pic {
  width: 56px;
  height: auto;
}
.null-data-text {
  margin-top: 10px;
  color: #666;
}
</style>
