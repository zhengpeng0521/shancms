<template>
  <div class="attendanceRecord">
    <div class="page_title_text">
      考勤记录
    </div>
    <CommonSearch
      :is-inline="true"
      :params="formInline"
      :forms="formInline"
      @toParent="resetFieldHanle"
    />
    <advanced-search v-bind="superSearch" />
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      :table-key="'classAffairs_attendanceRecord_attendanceRecordTable'"
      @toChildData="getCheckCol"
    />
  </div>
</template>
<script src="./attendanceRecordTable.js"></script>
<style lang="scss" scoped>
.attendanceRecord {
  padding: 20px 20px 0;
  .page_title_text {
    font-weight: 500;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(238, 238, 238, 1);
    margin-bottom: 20px;
    padding-left: 0;
    color: #333;
  }
}
</style>
