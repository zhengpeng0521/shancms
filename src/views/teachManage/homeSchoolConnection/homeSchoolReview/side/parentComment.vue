<template>
  <div class="common_table">
    <el-table
      :data="parentEvaLit"
      style="width: 100%"
      fit
      stripe
      height="calc(100vh - 280px)"
    >
      <el-table-column
        prop="stu_name"
        label="学员姓名"
      />
      <el-table-column
        prop="score"
        label="综合评分"
      >
        <template slot-scope="scope">
          <el-rate
            v-model="scope.row.score"
            disabled
          />
        </template>
      </el-table-column>
      <el-table-column
        :formatter="teachFormatter"
        prop="comment"
        label="家长评价"
      />
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    parentEvaLit: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {

    }
  },
  methods: {
    /* 老师评价 */
    teachFormatter(row) {
      return `${row.comment || '--'}`
    }
  }
}
</script>
<style scoped>
a {
  color: #46b6ee;
  font-size: 14px;
  cursor: pointer;
  margin-right: 20px;
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
  background: #f0f2f5;
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
.common_table >>> .el-table--enable-row-hover .el-table__body tr:hover > td {
  background: rgba(70, 182, 238, 0.1);
  cursor: pointer;
}
.common_table >>> .el-table__row.hover-row {
  background: rgba(70, 182, 238, 0.1);
  cursor: pointer;
}
.common_table >>> .el-table__row.el-table__row--striped.hover-row {
  background: rgba(70, 182, 238, 0.1);
  cursor: pointer;
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
</style>
