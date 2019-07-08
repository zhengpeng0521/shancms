<template>
  <div class="stuProduction">
    <CommonSearch
      ref="search"
      :is-inline="true"
      :params="formInline"
      :forms="formInline"
      @toParent="resetFieldHanle"
    />
    <advanced-search v-bind="superSearch" />
    <div class="add">
      <div class="use_space">
        已用空间 : {{ sizeChange(usedSize) }} 剩余空间 : {{ sizeChange( allSize - usedSize ) }}
      </div>
      <el-button
        class="green_btn"
        @click="manageWorksType"
      >管理分类</el-button>
      <el-button
        class="green_btn"
        style="float:right"
        @click="uploadWorks"
      >上传作品</el-button>
    </div>
    <div class="operation">
      <span style="margin-right:10px">已选 <span style="color:#46B6EE">{{ checkNum || '0' }}</span> 条数据</span>
      <Confirm
        :text="'删除'"
        :placement="'top'"
        :content="'确定要删除吗?'"
        :confirm="()=>{deleteSureFunc()}"
        :is-button="true"
        :btn-class="'cancel_btn edit_btn'"
        :is-visible-fun="true"
        :select-data="checkNum"
      />
    </div>
    <CommonTable
      ref="tableCommon"
      :columns="columns"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      :operation="operates"
      :table-key="'teachManage_homeSchoolConnection_stuProduction_stuProductTable'"
      @handleSelectionChange="selectionChange"
    />
    <!-- 管理分类 -->
    <ManageProType
      ref="manageType"
      @toUpdateTable="getUpdateTable"
    />
    <!-- 上传作品 -->
    <StuWorkInfo
      ref="stuWorkInfo"
      @toUpdateTable="getUpdateTable"
    />
    <!-- 修改 -->
    <EditStuWorkInfo
      ref="editStuWorkInfo"
      @toUpdateTable="getUpdateTable"
    />
  </div>
</template>
<script src="./stuProductTable.js"></script>
<style lang="scss" scoped>
.stuProduction {
  min-width: 1060px;
  .add {
    float: right;
  }
  .operation {
    margin: 0px 0 16px;
  }
  .use_space {
    padding: 5px 8px 5px 16px;
    border-radius: 6px;
    color: #666;
    border: 1px solid #d5f1fd;
    background: #eaf8fe;
    float: left;
    margin-right: 10px;
  }
}
</style>
