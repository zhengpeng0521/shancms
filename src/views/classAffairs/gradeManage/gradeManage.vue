<template>
  <div class="all">
    <div
      v-if="!isStuAttenShow"
      class="gradeManage"
    >
      <div class="page_title_text">
        班级管理
      </div>
      <CommonSearch
        :is-inline="true"
        :params="formInline"
        :forms="formInline"
        @toParent="resetFieldHanle"
      />
      <advanced-search v-bind="superSearch" />
      <div class="add">
        <el-button
          type="primary"
          @click="addGrade"
        >新建班级</el-button>
      </div>
      <CommonTable
        ref="tableCommon"
        :columns="columns"
        :table-height="tableHeight"
        :pagination="listQuery"
        :options="options"
        :operation="operates"
        :table-key="'classAffairs_gradeManage_gradeManage'"
      />
      <GradeInfo
        ref="gradeInfo"
        @toUpdateTable="getUpdateTable"
      />
      <!-- 编辑班级信息 -->
      <EditGradeInfo
        ref="editGradeInfo"
        @toUpdateTable="getEditUpdate"
      />
    </div>
    <!-- 考勤 -->
    <StuAttendance
      v-if="isStuAttenShow"
      :attendance-id="attendanceId"
      @toParent="getShowStu"
    />
    <!-- 侧边栏 -->
    <ClassDetail
      ref="classDetail"
      @toAddStu="getAddStuData"
      @toEditStuInfo="getEditStuInfoData"
      @toDelClass="getDelClassData"
      @toDelUpdateTable="getEditUpdate"
    />
    <!-- 添加学员 -->
    <AddStudent
      ref="addStu"
      @toUpdateStuList="getUpdateAddStuTable"
    />
    <!-- 删除班级 -->
    <DeleteSureAgain
      ref="delSureAgain"
      @toUpdateTable="getUpdateTable"
    />
  </div>
</template>
<script src="./gradeManage.js"></script>
<style lang="scss" scoped>
.all {
  padding: 20px 20px 0;
  .page_title_text {
    font-weight: 500;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(238, 238, 238, 1);
    margin-bottom: 20px;
    padding-left: 0;
    color: #333;
  }
  .add {
    float: right;
  }
}
</style>
<style lang="scss">
.gradeManage {
  .gradeName {
    color: #1d9df2;
    cursor: pointer;
    &:hover {
      color: #56c0f5;
    }
  }
}
</style>
