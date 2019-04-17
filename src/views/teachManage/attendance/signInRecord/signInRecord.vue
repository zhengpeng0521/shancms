<template>
  <div class="signRecord">
    <CommonSearch
      :is-inline="true"
      :params="formInline"
      :forms="formInline"
      @toParent="resetFieldHanle"
    />
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
    />
  </div>
</template>
<script src="./signInRecord.js"></script>
<style lang="scss" scoped>
</style>
