<template>
  <div class="week">
    <div class="search">
      <el-form
        ref="form"
        inline
      >
        <el-form-item>
          <WeekDatePicker
            v-model="formInline.modifyTime"
            :picker-options="pickerOptions"
            :clearable="false"
            type="week"
            format="yyyy-W周"
            placeholder="选择周"
            @change="dateChange"
          />
        </el-form-item>
        <el-form-item>
          <div class="common_search_btn">
            <el-button
              size="mini"
              type="primary"
              class="search_btn"
              @click="searchHandle()"
            >
              <img src="https://img.ishanshan.com/gimg/img/77ed55e16b08f3a7b9d986e75a2c1d7c">
            </el-button>
            <el-button
              size="mini"
              class="refresh_btn cancel_btn"
              style="float:right"
              @click="resetFieldHanle()"
            >
              <img src="https://img.ishanshan.com/gimg/img/4967edad7d0d83947070c9a404a3b216">
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
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
      :table-loading="tableLoading"
      :table-height="tableHeight"
      :pagination="listQuery"
      :options="options"
      :table-key="'teachManage_courseSchedule_classCopy_weekCopy_classWeekCopy'"
      @handleSelectionChange="selectionChange"
      @toChildData="getCheckCol"
    />
    <BatchCopyCourse ref="batchCopy" />
  </div>
</template>
<script src="./classWeekCopy.js"></script>
<style lang="scss" scoped>
.week /deep/ {
  .el-form-item.el-form-item--mini {
    margin-right: 6px;
  }
  .select_copy {
    margin: 6px 0 16px;
    .selected {
      margin-right: 10px;
      float: left;
      line-height: 22px;
    }
  }
}
</style>
