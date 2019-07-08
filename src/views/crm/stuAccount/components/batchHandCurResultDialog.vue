<template>
  <div class="batchHandResult">
    <el-dialog
      :visible.sync="resultsDialogShow"
      title="未完成消课学员"
      width="800px"
      @close="closeResultsDialog()"
    >
      <span>
        学员课时不足,未完成消课! 总计: {{ totalCount }}人
      </span>
      <el-table
        :data="tableData"
        :fit="true"
        height="350"
        stripe
      >
        <el-table-column
          prop="stuName"
          label="学员姓名"
          width="150"/>
        <el-table-column
          prop="tel"
          label="手机号"
          width="150"
        >
          <template slot-scope="scope">
            <span>
              <el-popover placement="top" trigger="click">
                <div>{{ scope.row.tel }}</div>
                <a slot="reference">查看</a>
              </el-popover>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="cardId"
          label="学员账户"
          width="180"/>
        <el-table-column
          prop="reason"
          label="错误原因"
          width="280"/>
      </el-table>
      <!-- 分页-->
      <el-pagination
        :page-size="pageSize"
        :page-sizes="[20]"
        :current-page.sync="pageIndex"
        :total="totalCount"
        :layout="'total, prev, pager, next, sizes'"
        @size-change="sizeChange"
        @current-change="indexChange"
      />
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="exportTable()"
        >导出表格</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { exportFile } from '@/utils/exportFile.js'
export default {
  components: {
  },
  props: {
    selectCourse: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      resultsDialogShow: false, // 弹窗显示

      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      results: [], // 错误数据
      tableData: [], // 表格数据

      batchKey: ''
    }
  },
  methods: {
    telFormatter: (row, column, cellValue, index) => {
      if (row && row.tel) {
        return `<span><el-popover placement='top' trigger='click'><div>${row.tel}</div><a>查看</a></el-popover></span>`
      } else {
        return ''
      }
    },
    closeResultsDialog() {
      this.batchKey = ''
      this.results = []
      this.pageIndex = 1
      this.resultsDialogShow = false
      this.$emit('close')
    },
    showResults(results, batchKey) {
      this.resultsDialogShow = true
      this.batchKey = batchKey
      this.results = results
      this.pageIndex = 1
      this.totalCount = results && results.length || 0
      this.showTableData()
    },
    exportTable() {
      exportFile(`${window.SS_CRM}/crm/stucard/exportBatchResult`, { batchKey: this.batchKey })
    },
    // 显示表格数据
    showTableData() {
      if (this.results && this.results.length > 0) {
        this.tableData = this.results.slice((this.pageIndex - 1) * this.pageSize, this.pageIndex * this.pageSize)
      }
    },
    /** 页数改变 */
    indexChange(pageIndex) {
      this.pageIndex = pageIndex
      this.showTableData()
    },
    /** 每页条数改变 */
    sizeChange(pageSize) {
      this.pageSize = pageSize
      this.showTableData()
    }

  }
}
</script>
<style lang="scss" scoped>

  a {
    color: #1d9df2;
    font-size: 14px;
    cursor: pointer;
    margin-right: 20px;
  }
  a:hover {
    color: #56c0f5;
  }
</style>
<style scoped>
a {
  color: #1d9df2;
  font-size: 14px;
  cursor: pointer;
  margin-right: 20px;
}
a:hover {
  color: #56c0f5;
}
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
.batchHandResult {
  background: #fff;
  position: relative;
}
/*分页 start*/
.batchHandResult >>> .el-pagination {
  text-align: end;
  padding: 7px 5px;
  color: #666;
  font-weight: normal;
  border-top: 1px solid #eee;
}
.batchHandResult >>> .el-pager {
  padding: 5px 0 !important;
}
.batchHandResult >>> .el-pager li.active {
  color: #fff;
  background: #46b6ee;
  border-radius: 4px;
  /*		width:30px;*/
  height: 18px;
  min-width: 18px;
  line-height: 18px;
  font-size: 12px;
}
.batchHandResult >>> .el-pager li.active:hover {
  color: #fff !important;
}
.batchHandResult >>> .el-pager li {
  height: 18px;
  font-size: 12px;
  /*		width: 30px;*/
  min-width: 18px;
  line-height: 18px;
}
.batchHandResult >>> .el-pagination__sizes {
  height: 22px;
  line-height: 28px;
  margin: 0 10px;
}
.batchHandResult >>> .el-pagination .el-select .el-input {
  width: 82px;
}
.batchHandResult >>> .el-pagination__jump {
  margin-left: 10px;
  font-size: 12px;
  color: #666;
}
.batchHandResult >>> .el-pagination__editor.el-input .el-input__inner {
  height: 22px;
  width: 36px;
}
.batchHandResult >>> .el-pager li:hover {
  color: #46b6ee !important;
}
.batchHandResult >>> .el-pagination button,
.el-pagination span:not([class*="suffix"]) {
  font-size: 12px;
}
.batchHandResult >>> .el-input--mini .el-input__inner {
  height: 22px;
  line-height: 22px;
  font-size: 12px;
  color: #666;
}
.el-select-dropdown__item.selected {
  color: #46b6ee !important;
}
.batchHandResult >>> .el-select .el-input.is-focus .el-input__inner {
  border-color: #46b6ee;
}
.batchHandResult >>> .el-pagination__sizes .el-input .el-input__inner:hover {
  border-color: #46b6ee;
}
.batchHandResult >>> .el-pagination__jump .el-input .el-input__inner:focus {
  border-color: #46b6ee;
}
.batchHandResult >>> .el-select .el-input__inner:focus {
  border-color: #ddd;
}
/*end*/

.batchHandResult >>> .el-table td,
.el-table th.is-leaf {
  border-bottom: 0;
}
.batchHandResult >>> .el-table th {
  background: #f6f7f9;
  font-size: 14px;
  color: #333;
  line-height: 44px;
  padding: 0;
  font-weight: 500;
}
.batchHandResult >>> .el-table td {
  font-size: 14px;
  color: #666;
  line-height: 44px;
  padding: 0;
  font-weight: 400;
}
.batchHandResult >>> .el-table__row.hover-row td {
  background: #ecf7fd;
  cursor: pointer;
}
.batchHandResult >>> .el-table--enable-row-hover .el-table__body tr:hover > td {
  background: #ecf7fd;
  cursor: pointer;
}
.batchHandResult >>> tr.el-table__row.el-table__row--striped:hover {
  background: #ecf7fd !important;
}
.batchHandResult >>> .el-table--striped .el-table__body tr.el-table__row--striped {
  background: #fcfcfd;
}
.batchHandResult >>> .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #46b6ee;
}
.batchHandResult >>> .el-checkbox__input.is-checked .el-checkbox__inner {
  background: #46b6ee;
  border-color: #46b6ee;
}
.batchHandResult >>> .el-checkbox__inner:hover {
  border-color: #46b6ee;
}
.batchHandResult >>> .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background: #46b6ee;
  border-color: #46b6ee;
}
.batchHandResult >>> .el-table-column--selection .cell {
  padding-left: 26px;
}
.batchHandResult >>> .el-table__fixed-right::before,
.el-table__fixed::before {
  background-color: transparent;
}
.batchHandResult >>> .el-table--border::after,
.el-table--group::after,
.el-table::before {
  background-color: transparent;
}
.batchHandResult >>> .el-table .descending .sort-caret.descending {
  border-top-color: #46b6ee;
}
.batchHandResult >>> .el-table .ascending .sort-caret.ascending {
  border-bottom-color: #46b6ee;
}
.batchHandResult >>> .el-table .sort-caret.ascending {
  border-bottom-color: #ccc;
}
.batchHandResult >>> .el-table .sort-caret.descending {
  border-top-color: #ccc;
}
/*loading*/
.batchHandResult >>> .el-loading-spinner .path {
  stroke: #46b6ee;
}
.batchHandResult >>> .el-loading-spinner .el-loading-text {
  color: #46b6ee;
}
.batchHandResult >>> .el-table .cell {
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  height: 44px;
  display: flex;
  align-items: center;
  /* line-height: 44px; */
  /* display: -webkit-box; */
  /* white-space: normal !important; */
}
.batchHandResult >>> .el-table .cell,
.el-table th div,
.el-table--border td:first-child .cell,
.el-table--border th:first-child .cell {
  padding-left: 20px;
}
.batchHandResult >>> .el-icon--right {
  margin-left: -2px;
}
.dropMenu.el-popper[x-placement^="bottom"] {
  margin-top: 0;
}
.dropMenu >>> .popper__arrow {
  display: none;
}
</style>
