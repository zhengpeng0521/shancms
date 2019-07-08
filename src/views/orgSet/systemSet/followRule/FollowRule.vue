<template>
  <div class="follow_container">
    <!-- 原系统规则部分 -->
    <SystemRule page="follow" />

    <!-- 原查重规则 -->
    <DupCheckRule :no-scroll="true" />
  </div>
</template>

<script>
import SystemRule from '@/views/orgSet/systemSet/systemRule/systemRule'
import DupCheckRule from '@/views/orgSet/systemSet/dupCheckRule/dupCheckRule'

export default {
  components: {
    SystemRule,
    DupCheckRule
  }
}
</script>

<style lang="scss" scoped>
.follow_container {
  border-bottom: 1px solid #ddd;
  overflow: auto;
}
</style>
