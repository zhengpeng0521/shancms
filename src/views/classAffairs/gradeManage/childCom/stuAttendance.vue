<template>
  <div class="stuAttendance">
    <!-- <div class="goBack">
      <div @click="goBack">
        <i class="el-icon-arrow-left" />
        <span style="display:inline-block;border-right:1px solid #999;padding-right:6px">返回</span>
        <span>班级管理</span>
      </div>
    </div> -->
    <div class="page_title_text">
      <span>考勤</span>
      <div class="btn">
        <el-button
          class="cancel_btn"
          @click="goBack"
        >关闭</el-button>
      </div>
    </div>
    <CommonSearch
      :is-inline="true"
      :params="formInline"
      :forms="formInline"
      @toParent="resetFieldHanle"
    />
    <advanced-search v-bind="superSearch" />
    <div class="operation">
      <span style="margin-right:10px">已选 <span style="color:#46B6EE">{{ checkNum || '0' }}</span> 条数据</span>
      <el-button
        class="cancel_btn edit_btn"
        @click="batchChangeStatus('signIn')"
      >签到</el-button>
      <el-button
        class="cancel_btn edit_btn"
        @click="batchChangeStatus('signOut')"
      >签退</el-button>
      <el-button
        class="cancel_btn edit_btn"
        @click="batchChangeStatus('signLeave')"
      >请假</el-button>
    </div>
    <div class="common_table">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        height="calc(100vh - 285px)"
        @selection-change="handleSelectionChange"
      >
        <!-- 空数据显示 -->
        <div slot="empty">
          <img
            src="https://img.ishanshan.com/gimg/user/n///1550211410.png"
            alt="无数据"
          >
          <p :style="{marginTop: '10px'}">暂无数据</p>
        </div>
        <el-table-column
          type="selection"
          width="50"
        />
        <el-table-column
          v-for="(item, index) in formThead"
          :key="index"
          :label="item.label"
          :formatter="item.formatter"
          :min-width="item.width || '80px'"
          :show-overflow-tooltip="item.isShowTooltip"
        >
          <template slot-scope="scope">
            <template v-if="!item.render">
              {{ scope.row[item.prop] }}
            </template>
            <template v-else>
              <my-render
                v-if="item.render"
                :row="scope.row"
                :render="item.render"
                :index="index"
                :column="item"
              />
            </template>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="250"
          fixed="right"
        >
          <template slot-scope="scope">
            <div>
              <el-popover
                v-if="scope.row.signIn"
                v-model="scope.row.signVisible"
                :ref="'signIn-' + scope.row.stuId"
                placement="top"
              >
                <p style="margin-bottom:20px">确定要撤销该项操作吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button
                    size="mini"
                    class="delete_btn"
                    @click="signInCancel(scope.row.stuId)"
                  >取消</el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    class="edit_btn"
                    @click="changeSign(scope.row, '4')"
                  >确定</el-button>
                </div>
                <a
                  slot="reference"
                  style="color: #46B6EE"
                >
                  <div class="sign_circle" />撤销
                </a>
              </el-popover>
              <a
                v-if="!scope.row.signIn"
                @click="changeSign(scope.row, '1')"
              >签到</a>
              <el-popover
                v-if="scope.row.signOut"
                v-model="scope.row.signOutVisible"
                :ref="'signOut-' + scope.row.stuId"
                placement="top"
                width="200"
              >
                <p style="margin-bottom:20px">确定要撤销该项操作吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button
                    size="mini"
                    class="delete_btn"
                    @click="signOutCancel(scope.row.stuId)"
                  >取消</el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    class="edit_btn"
                    @click="changeSign(scope.row, '5')"
                  >确定</el-button>
                </div>
                <a
                  slot="reference"
                  style="color:#46B6EE"
                >
                  <div class="sign_circle" />撤销
                </a>
              </el-popover>
              <a
                v-if="!scope.row.signOut"
                @click="changeSign(scope.row, '2')"
              >签退</a>
              <el-popover
                v-if="scope.row.signLeave"
                v-model="scope.row.signLeaveVisible"
                :ref="'signLeave-' + scope.row.stuId"
                placement="top"
                width="200"
              >
                <p style="margin-bottom:20px">确定要撤销该项操作吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button
                    size="mini"
                    class="delete_btn"
                    @click="signLeaveCancel(scope.row.stuId)"
                  >取消</el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    class="edit_btn"
                    @click="changeSign(scope.row, '6')"
                  >确定</el-button>
                </div>
                <a
                  slot="reference"
                  style="color: #46B6EE"
                >
                  <div class="sign_circle" />撤销
                </a>
              </el-popover>
              <a
                v-if="!scope.row.signLeave"
                @click="changeSign(scope.row, '3')"
              >请假</a>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 筛选设置 -->
      <el-popover
        placement="bottom-end"
        visible-arrow
        trigger="click"
        popper-class="setPop"
      >
        <div class="tableList">
          <div class="checkList">
            <template v-for="checkColumn in checkList">
              <el-checkbox-group
                v-if="checkColumn.isShowSet!=false"
                v-model="checkboxVal"
                :key="checkColumn.label"
              >
                <el-checkbox :label="checkColumn.prop">{{ checkColumn.label }}</el-checkbox>
              </el-checkbox-group>
            </template>
          </div>
          <div class="save_btn">
            <el-button
              type="primary"
              size="mini"
              @click="saveTableColumnFun"
            >保存</el-button>
          </div>
        </div>
        <div
          slot="reference"
          class="setting"
        >
          <div class="setting_img">
            <el-tooltip
              content="显示表格字段"
              placement="bottom"
              effect="dark"
            >
              <i class="iconfont icon_gb_jgsz" />
            </el-tooltip>
          </div>
        </div>
      </el-popover>
      <!-- 分页-->
      <el-pagination
        :page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        :current-page="pageIndex"
        :total="totalCount"
        layout=" total, prev, pager, next, sizes"
        @size-change="handleSizeChange"
        @current-change="handleIndexChange"
      />
    </div>
    <!-- 操作成功的弹窗 -->
    <success ref="success" />
    <!-- 备注 -->
    <remark
      ref="remark"
      @toUpdateTable="getUpdateTable"
    />
    <!-- 批量部分失败弹窗 -->
    <fail ref="fail" />
  </div>
</template>
<script src="./stuAttendance.js"></script>
<style lang="scss" scoped>
.common_table /deep/ {
  // ::-webkit-scrollbar {
  //   width: 8px;
  //   height: 8px;
  //   background: transparent !important;
  //   border-radius: 4px;
  // }
  // ::-webkit-scrollbar-thumb {
  //   background: rgba(70, 182, 238, 0.5);
  //   border-radius: 4px;
  // }
  // ::-webkit-scrollbar-button {
  //   height: 0;
  //   width: 0;
  // }
}
.setting {
  position: absolute;
  top: 1px;
  right: 0;
  height: 44px;
  line-height: 44px;
  border-left: 1px solid #ddd;
  padding: 0 15px;
  background: #f0f2f5;
  cursor: pointer;
  z-index: 11;
  .setting_img {
    display: inline-block;
    position: relative;
    top: 0px;
    content: "";
  }
  &:hover .setting_img {
    color: #46b6ee;
  }
}
</style>

<style scoped>
/* 筛选框 */
.checkList {
  max-height: 300px;
  overflow: auto;
  padding-left: 14px;
}
.checkList >>> .el-checkbox-group {
  margin: 0 20px 10px 0;
}
.save_btn {
  text-align: center;
  border-top: 1px solid #ddd;
  padding-top: 14px;
  margin-top: 4px;
}
.sign_circle {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #87d068;
  margin: 8px 6px 0 2px;
  vertical-align: top;
}
.common_table {
  background: #fff;
  position: relative;
}
/*分页 start*/
.common_table >>> .el-pagination {
  text-align: end;
  padding: 7px 5px;
  color: #666;
  font-weight: normal;
  border-top: 1px solid #eee;
}
.common_table >>> .el-pager {
  padding: 5px 0 !important;
}
.common_table >>> .el-pager li.active {
  color: #fff;
  background: #46b6ee;
  border-radius: 4px;
  /*		width:30px;*/
  height: 18px;
  min-width: 18px;
  line-height: 18px;
  font-size: 12px;
}
.common_table >>> .el-pager li.active:hover {
  color: #fff !important;
}
.common_table >>> .el-pager li {
  height: 18px;
  font-size: 12px;
  /*		width: 30px;*/
  min-width: 18px;
  line-height: 18px;
}
.common_table >>> .el-pagination__sizes {
  height: 22px;
  line-height: 28px;
  margin: 0 10px;
}
.common_table >>> .el-pagination .el-select .el-input {
  width: 82px;
}
.common_table >>> .el-pagination__jump {
  margin-left: 10px;
  font-size: 12px;
  color: #666;
}
.common_table >>> .el-pagination__editor.el-input .el-input__inner {
  height: 22px;
  width: 36px;
}
.common_table >>> .el-pager li:hover {
  color: #46b6ee !important;
}
.common_table >>> .el-pagination button,
.el-pagination span:not([class*="suffix"]) {
  font-size: 12px;
}
.common_table >>> .el-input--mini .el-input__inner {
  height: 22px;
  line-height: 22px;
  font-size: 12px;
  color: #666;
}
.el-select-dropdown__item.selected {
  color: #46b6ee !important;
}
.common_table >>> .el-select .el-input.is-focus .el-input__inner {
  border-color: #46b6ee;
}
.common_table >>> .el-pagination__sizes .el-input .el-input__inner:hover {
  border-color: #46b6ee;
}
.common_table >>> .el-pagination__jump .el-input .el-input__inner:focus {
  border-color: #46b6ee;
}
.common_table >>> .el-select .el-input__inner:focus {
  border-color: #ddd;
}
/*end*/

.common_table >>> .el-table td,
.el-table th.is-leaf {
  border-bottom: 0;
}
.common_table >>> .el-table th {
  background: #f6f7f9;
  font-size: 14px;
  color: #333;
  line-height: 44px;
  padding: 0;
  font-weight: 500;
}
.common_table >>> .el-table td {
  font-size: 14px;
  color: #666;
  line-height: 44px;
  padding: 0;
  font-weight: 400;
}
.common_table >>> .el-table__row.hover-row {
  background: #ecf7fd !important;
  cursor: pointer;
}
.common_table >>> tr.el-table__row.el-table__row--striped:hover {
  background: #ecf7fd !important;
}
.common_table >>> .el-table--striped .el-table__body tr.el-table__row--striped {
  background: #fcfcfd;
}
.checkList {
  max-height: 300px;
  overflow: auto;
}
.common_table >>> .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #46b6ee;
}
.common_table >>> .el-checkbox__input.is-checked .el-checkbox__inner {
  background: #46b6ee;
  border-color: #46b6ee;
}
.common_table >>> .el-checkbox__inner:hover {
  border-color: #46b6ee;
}
.common_table >>> .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background: #46b6ee;
  border-color: #46b6ee;
}
.common_table >>> .el-table-column--selection .cell {
  padding-left: 26px;
}
.common_table >>> .el-table__fixed-right::before,
.el-table__fixed::before {
  background-color: transparent;
}
.common_table >>> .el-table--border::after,
.el-table--group::after,
.el-table::before {
  background-color: transparent;
}
.common_table >>> .el-table .descending .sort-caret.descending {
  border-top-color: #46b6ee;
}
.common_table >>> .el-table .ascending .sort-caret.ascending {
  border-bottom-color: #46b6ee;
}
.common_table >>> .el-table .sort-caret.ascending {
  border-bottom-color: #ccc;
}
.common_table >>> .el-table .sort-caret.descending {
  border-top-color: #ccc;
}
/*loading*/
.common_table >>> .el-loading-spinner .path {
  stroke: #46b6ee;
}
.common_table >>> .el-loading-spinner .el-loading-text {
  color: #46b6ee;
}
.common_table >>> .el-table .cell {
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  height: 44px;
  /* line-height: 44px; */
  /* display: -webkit-box; */
  /* white-space: normal !important; */
}
.common_table >>> .el-table .cell,
.el-table th div,
.el-table--border td:first-child .cell,
.el-table--border th:first-child .cell {
  padding-left: 20px;
}
.common_table >>> .el-icon--right {
  margin-left: -2px;
}
.dropMenu.el-popper[x-placement^="bottom"] {
  margin-top: 0;
}
.dropMenu >>> .popper__arrow {
  display: none;
}
</style>
<style lang="scss">
@import "@/styles/mixin.scss";

.common_table .el-table .cell {
  @include flex();
  @include itemCenter(center);
  span {
    // width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.common_table .el-table td.is-center .cell,
.common_table .el-table th.is-center .cell {
  @include flexCenter(center);
}
.common_table .el-table td.is-right .cell,
.common_table .el-table th.is-right .cell {
  @include flexCenter(flex-end);
}
.setPop {
  padding: 14px 0;
}
</style>
<style lang="scss" scoped>
.stuAttendance {
  a {
    color: #1d9df2;
    font-size: 14px;
    cursor: pointer;
    margin-right: 20px;
  }
  a:hover {
    color: #56c0f5;
  }
  .page_title_text {
    font-weight: 500;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(238, 238, 238, 1);
    margin-bottom: 20px;
    padding-left: 0;
    color: #333;
    line-height: 28px;
    height: 43px;
    .btn {
      float: right;
    }
  }
  .goBack {
    margin-bottom: 18px;
    color: #999999;
    border-bottom: 1px solid #eee;
    padding-bottom: 14px;
    div {
      cursor: pointer;
    }
  }
  .operation {
    margin: 0px 0 16px 0;
  }
}
</style>
