<template>
  <div class="day">
    <CommonSearch
      :is-inline="true"
      :params="formInline"
      :forms="formInline"
      @toParent="resetFieldHanle"
    />
    <div class="select_copy">
      <span class="selected">已选 {{ checkNum }} 条数据</span>
      <el-button
        style="padding:0;height:14px"
        class="cancel_btn edit_btn"
        @click="batchCopy"
      >批量复制</el-button>
    </div>
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :data-source="tableData"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      :table-key="'teachManage_courseSchedule_classCopy_dayCopy_classDayCopy'"
      @handleSelectionChange="selectionChange"
      @toChildData="getCheckCol"
    />
    <BatchCopyCourse ref="batchCopy" />
  </div>
</template>
<script src="./classDayCopy.js"></script>
<style lang="scss" scoped>
.day {
  .select_copy {
    margin: 0px 0 16px;
    .selected {
      margin-right: 10px;
      float: left;
      line-height: 22px;
    }
  }
}
</style>
