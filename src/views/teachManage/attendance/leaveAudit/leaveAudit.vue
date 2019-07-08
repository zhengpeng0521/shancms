<template>
  <div class="leaveAudit">
    <CommonSearch
      ref="commonSearch"
      :is-inline="true"
      :params="formInline"
      :forms="formInline"
      @toParent="resetFieldHanle"
    />
    <advanced-search v-bind="superSearch" />
    <div class="select">
      <span style="margin-right:10px">已选 <span style="color:#46B6EE">{{ checkNum || '0' }}</span> 条数据</span>
      <el-button
        type="cancel_btn edit_btn"
        @click="reviewContract"
      >审核</el-button>
    </div>
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      :table-key="'teachManage_attendance_leaveAudit_leaveAudit'"
      @handleSelectionChange="selectionChange"
    />
    <ReviewContract
      ref="review"
      @toUpdateTable="getUpdateTable"
    />
  </div>
</template>
<script src="./leaveAudit.js"></script>
<style lang="scss" scoped>
.select {
  margin-bottom: 16px;
}
</style>
