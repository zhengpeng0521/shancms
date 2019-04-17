<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
    class="report-form-table"
  >
    <el-table
      :data="dataSource"
      style="width: 100%"
    >
      <template v-for="(col, index) in columns">
        <el-table-column
          v-if="col.children"
          :key="'formTable_' + index"
          :prop="col.prop"
          :label="col.label"
          :formatter="col.formatter"
          :show-overflow-tooltip="true"
          :min-width="col.width"
          :align="col.align"
          :label-class-name="col.children ? 'cols-has-leaf' : ''"
          class-name="form-table-col"
        >
          <el-table-column
            v-for="(item, key) in col.children"
            :key="'formTableItem_' + key"
            :prop="item.prop"
            :label="item.label"
            :formatter="item.formatter"
            :show-overflow-tooltip="true"
            :min-width="item.width || '96px'"
            :align="item.align"
            class-name="form-table-col"
          />
        </el-table-column>
        <el-table-column
          v-else
          :key="'formTable_' + index"
          :prop="col.prop"
          :label="col.label"
          :formatter="col.formatter"
          :show-overflow-tooltip="true"
          :min-width="col.width"
          :align="col.align"
          :label-class-name="col.children ? 'cols-has-leaf' : ''"
          class-name="form-table-col"
        >
          <template slot-scope="scope">
            <span
              v-if="col.methods"
              class="table_text_btn"
              @click.prevent="()=>{col.methods(scope.row)}"
            >{{ scope.row[col.prop] }}</span>
            <span v-else>{{ scope.row[col.prop] }}</span>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <el-pagination
      v-if="hasPage"
      :current-page.sync="currentPage"
      :page-size="20"
      :total="pageCount"
      layout="total, prev, pager, next"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: true
    },
    // 数据源
    dataSource: {
      type: Array,
      required: true
    },
    // 列配置
    columns: {
      type: Array,
      required: true
    },
    hasPage: {
      type: Boolean,
      default: true
    },
    // 总条数
    pageCount: {
      type: Number,
      default: 0
    },
    // 分页
    pageChange: {
      type: Function,
      default: undefined
    }
  },

  data() {
    return {
      currentPage: 1
    }
  },

  methods: {
    handleCurrentChange(val) {
      this.pageChange(val - 1)
    }
  }
}
</script>

<style lang="scss">
.report-form-table {
  .el-table__body {
    padding-bottom: 4px;
  }
  .el-table,
  .el-table thead {
    color: #666;
  }
  .el-table thead.is-group th {
    background: #f0f2f5;
  }
  .el-table--mini,
  .el-table--small,
  .el-table__expand-icon {
    font-size: 14px;
  }
  .el-table th > .cell {
    font-weight: normal !important;
  }
  .el-pager .more::before {
    line-height: 12px;
  }
  .el-table::before {
    height: 0;
  }
  .el-pagination {
    border-top: none;
  }

  .cols-has-leaf {
    background: #46b6ee !important;
    color: #fff;
  }
  .form-table-col {
    height: 44px;
  }

  .table_text_btn {
    color: #46b6ee;
    cursor: pointer;
  }

  .el-table__row.hover-row td {
    background: #ecf7fd;
    cursor: pointer;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background: #ecf7fd;
    cursor: pointer;
  }
}
</style>
