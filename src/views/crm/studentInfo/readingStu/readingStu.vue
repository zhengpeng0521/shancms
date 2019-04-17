<template>
  <div class="readingStu_container">
    <!-- 搜索栏 -->
    <div class="search">
      <div>
        <CommonSearch
          :is-inline="true"
          :params="formInline"
          :forms="formInline"
          @toParent="resetFieldHanle"
        />
        <advanced-search v-bind="superSearch" />
      </div>
      <div>
        <el-button
          type="primary"
          size="mini"
          @click="parentBindWX"
        >家长绑定</el-button>
        <el-button
          v-if="hasBtn('402000004')"
          class="cancel_btn"
          size="mini"
          @click="nameImportDialog"
        >导入</el-button>
        <el-button
          v-if="hasBtn('402000005')"
          class="cancel_btn"
          size="mini"
          @click="exportReadingStu"
        >导出</el-button>
      </div>
    </div>
    <!-- 日期搜索 -->
    <CommonDateSearch
      ref="commonDatePicker"
      :common-date-options="commonDateOptions"
      @datePickerChange="commonDatePickerChange"
    />
    <!-- 已选数据操作 -->
    <div class="checked_data">
      <span class="checked_text">已选<i>{{ checkedData || '0' }}</i>条数据</span>
      <el-button
        size="mini"
        class="cancel_btn edit_btn"
        style="margin-right:5px"
        @click="distributeDialog(checkedData)"
      >分配销售</el-button>
      <el-button
        size="mini"
        class="cancel_btn edit_btn"
        style="margin-left:0px"
        @click="teachDistributeDialog(checkedData)"
      >分配老师</el-button>
    </div>
    <!-- 表格 -->
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      :operation="operates"
      table-key="crm_studentInfo_reading"
      @handleSelectionChange="selectionChange"
    />
    <!-- 侧边详情弹框 -->
    <CrmDetailModal
      ref="crmDetailModal"
      v-bind="detailProps"
      :name="studentName"
      :params="idObj"
      :header-data="headerData"
      :base-data="baseData"
      @toUpdateLeadsTable="getUpdateTable"
    />
    <!-- 分配转给他人弹框 -->
    <DistributeDialog
      ref="distributeDialog"
      @toReadingStuPage="getReadingStuList"
      @toParent="getClearData"
    />
    <!-- 家长绑定微信弹框 -->
    <ParentBindWX ref="parentBindWX" />
    <!-- 到访弹框 -->
    <VisitDialog
      ref="visitDialog"
      @toUpdateTable="getUpdateTable"
    />
    <!-- 试听弹框 -->
    <ListenDialog
      ref="listenDialog"
      @toOfflinePage="getUpdateTable"
    />
    <!-- 报名弹框 -->
    <ApplyDialog ref="applyDialog" />
    <!-- 添加潜在学员弹框 -->
    <AddLantentStuDialog
      ref="addLantentStuDialog"
      @toUpdateFollow="getUpdateTable"
      @toUpdateDetailData="getUpdateDetailData"
    />
    <!-- 转给他人弹框 -->
    <TurnOtherDialog ref="turnOtherDialog" />
    <!-- 教师分配在读学员 -->
    <TeachDistributeDialog
      ref="teachDistribute"
      @toParent="getClearData"
      @toUpdateTable="getUpdateTable"
    />
    <!-- 在读学员批量导入弹框 -->
    <NameImportDialog
      ref="nameImportDialog"
      :refresh="refresh"
    />
  </div>
</template>

<script src="./readingStu.js"></script>

<style lang="scss" scoped>
.readingStu_container {
  min-width: 1060px;
  .search {
    display: flex;
    justify-content: space-between;
    height: 48px;
  }
  .checked_data {
    margin: 20px 0 16px;
    .checked_text {
      margin-right: 5px;
    }
    i {
      font-style: normal;
      color: #46b6ee;
      padding: 0 5px;
    }
  }
}
</style>
<style lang="scss">
.readingStu_container {
  .stuName {
    color: #1d9df2;
    text-overflow: ellipsis;
    overflow: hidden;
    // max-width: 80px;
    &:hover {
      color: #56c0f5;
    }
  }
}
</style>
