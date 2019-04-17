/**
 * 状态点
 * props:
 *    text         String       文案
 *    color        String       点的颜色
 * slot
 */
<template>
  <span>
    <i
      :style="{background: color}"
      class="status-point"
    />
    {{ text }}
  </span>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.status-point {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
</style>
