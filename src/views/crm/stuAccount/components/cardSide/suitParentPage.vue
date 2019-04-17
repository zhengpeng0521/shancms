<template>
  <div class="suitParent_container">
    <el-table
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="家长姓名"
        width="180"
      />
      <el-table-column
        prop="mobile"
        label="联系手机"
        width="180"
      >
        <template slot-scope="scope">
          <el-popover
            :content="scope.row.mobile"
            placement="top"
            width="100"
            trigger="hover"
            style="padding: 6px 10px;"
            class="suit_parent_popover"
          >
            <a
              slot="reference"
              style="color: #46b6ee"
            >查看</a>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="workUnit"
        label="工作单位"
        width="200"
      />
      <el-table-column
        prop="email"
        label="邮箱"
      />
    </el-table>
  </div>
</template>

<script>
import { cardParentInfoById } from '@/api/crm/stuAccount/stuAccount.js'
import CommonTable from '../../../../../components/CommonTable/CommonTable'
export default {
  components: {
    CommonTable
  },
  data() {
    return {
      tableData: [] // 绑定表格数据
    }
  },
  methods: {
    /* 获取适用家长数据 */
    getCardParentInfoById(rowList) {
      const params = {
        id: rowList.id
      }
      cardParentInfoById(params).then(res => {
        if (res.data.errorCode === 0) {
          this.tableData = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.suitParent_container /deep/ {
  .el-table__body,
  .el-table__footer,
  .el-table__header {
    width: 100% !important;
  }
  .el-popover--plain {
    padding: 6px 10px;
    box-sizing: border-box;
  }
  .has-gutter {
    color: #909399;
    font-weight: 500;
  }
  .el-table th {
    background: #f0f2f5;
    font-size: 14px;
    color: #333;
    line-height: 44px;
    padding: 0;
    font-weight: 500;
  }
}
</style>

