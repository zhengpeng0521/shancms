<template>
  <div class="suitStudent_container">
    <el-table
      ref="suitStudentTable"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="学员姓名"
        width="180"
      />
      <el-table-column
        prop="sex"
        label="性别"
        width="180"
      />
      <el-table-column
        prop="birthday"
        label="生日"
        width="180"
      />
      <el-table-column
        prop="optaion"
        label="操作"
      >
        <template slot-scope="scope">
          <Confirm
            :text="'移除'"
            :placement="'top'"
            :content="'确定移除该学员？'"
            :confirm="()=>{sureDeleteStu(scope.row.id)}"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { cardStuInfoById, delStuByCardId } from '@/api/crm/stuAccount/stuAccount.js'
import CommonTable from '../../../../../components/CommonTable/CommonTable'
import Confirm from '@/components/MiniCommon/Confirm'
export default {
  components: {
    CommonTable,
    Confirm
  },
  data() {
    return {
      tableData: [], // 绑定表格的数据
      visible2: false, // 控制移除气泡框的显隐
      rowListData: {} // 获取会员卡的详情数据
    }
  },
  methods: {
    /* 获取适用学员数据 */
    getCardStuInfoById(rowList) {
      const params = {
        id: rowList.id
      }
      this.rowListData = rowList
      cardStuInfoById(params).then(res => {
        if (res.data.errorCode === 0) {
          this.tableData = Object.assign([], res.data.results)
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    sureDeleteStu(stuId) {
      const params = {
        id: this.rowListData.id,
        stuId: stuId
      }
      delStuByCardId(params).then(res => {
        if (res.data.errorCode === 0) {
          this.visible2 = false
          this.getCardStuInfoById(this.rowListData)
          this.$message({
            message: '移除成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.suitStudent_container /deep/ {
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

