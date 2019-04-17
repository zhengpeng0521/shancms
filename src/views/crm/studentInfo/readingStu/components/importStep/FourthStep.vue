<template>
  <div
    v-loading="loading"
    class="step-fourth"
    element-loading-text="正在导入中"
  >
    <p>不符合导入规则的将无法导入。</p>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.step-fourth {
  margin: 30px 0 20px;
  p {
    text-align: center;
    line-height: 40px;
  }
}
</style>
