<template>
  <div class="evaluation">
    <CommonSearch
      ref="search"
      :is-inline="true"
      :params="formInline"
      :forms="formInline"
      @toParent="resetFieldHanle"
    />
    <div class="add">
      <el-button
        type="primary"
        @click="exportContent"
      >导出</el-button>
    </div>
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      :operation="operates"
      :table-key="'teachManage_homeSchoolConnection_homeSchoolReview_homeSchoolReviewTable'"
    />
    <!-- 侧边栏 -->
    <CourseNameDetail
      ref="courseNameDetail"
      @toTeachCommentEdit="getTeachCommentEdit"
      @toClassContentEdits="getEditClassContent"
      @toComment="commentFunc"
    />
    <!-- 编辑老师评价 -->
    <TeachComment
      ref="teachComment"
      @toUpdateTable="getUpdateTable"
    />
    <!-- 编辑上课内容 -->
    <EditClassContent
      ref="editClassContent"
      @toUpdateTable="getUpdateTable"
    />
    <!-- 点评 -->
    <comment
      ref="commentEdit"
      @toUpdateTable="getUpdateCommentTable"
    />
  </div>
</template>
<script src="./homeSchoolReviewTable.js"></script>
<style lang="scss" scoped>
.evaluation {
  .add {
    float: right;
  }
}
</style>
<style lang="scss">
.evaluation {
  .courseName {
    color: #1d9df2;
    &:hover {
      color: #56c0f5;
    }
  }
}
</style>
