<template>
  <div class="courseware">
    <div class="page_title_text">
      教学课件
    </div>
    <CommonSearch
      :is-inline="true"
      :params="formInline"
      :forms="formInline"
      @toParent="resetFieldHanle"
    />
    <CommonTable
      ref="tableCommon"
      :default-sort="{prop: 'name', order: 'ascending'}"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      :operation="operates"
      :table-key="'teachManage_courseware_courseware'"
      @toChildData="getCheckCol"
      @handleSortChange="handleSortChange"
    />
    <CoursewareOverdue ref="coursewareOverdue" />
    <CoursewareCheck ref="coursewareCheck" />
    <CoursewareVideo ref="coursewareVideo" />
  </div>
</template>
<script src="./courseware.js"></script>
<style lang="scss" scoped>
.courseware {
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
<style lang="scss">
.courseware {
  .coursewareName {
    color: #1d9df2;
    &:hover {
      color: #56c0f5;
    }
  }
}
</style>
