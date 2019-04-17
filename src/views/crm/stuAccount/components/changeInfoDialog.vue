<template>
  <div class="changeInfoDialog_container">
    <el-dialog
      :visible.sync="detailDialogShow"
      title="转校详情"
      @close="submitFormDetail('changeDetailForm')"
    >
      <el-form
        ref="changeDetailForm"
        :model="changeDetailData"
        label-width="90px"
      >
        <el-form-item
          label="转出校区:"
          prop="detail"
        >
          <span>{{ changeDetailData.inOrgName || '--' }}</span>
        </el-form-item>
        <el-form-item
          label="转出学员:"
          prop="detail"
        >
          <span>{{ changeDetailData.outStuName || '--' }}</span>
        </el-form-item>
        <el-form-item
          label="转出合同:"
          prop="detail"
        >
          <span>{{ changeDetailData.outPurNum || '--' }}</span>
        </el-form-item>
        <el-form-item
          label="转出课程:"
          prop="detail"
        >
          <div>
            <table border="1">
              <tr style="background: #f5f6f8">
                <th>课程名称</th>
                <th>转出课时</th>
              </tr>
              <tr
                v-for="(item, index) of changeDetailData.outCourseInfo"
                :key="index + '_changeInfo'"
              >
                <td>{{ item.outCourseName || '--' }}</td>
                <td>{{ item.outNum || '--' }}</td>
              </tr>
              <tr>
                <td>总计</td>
                <td>{{ changeDetailData.outAllNum || '0' }}</td>
              </tr>
            </table>
          </div>
        </el-form-item>
        <el-form-item
          label="转出金额:"
          prop="detail"
        >
          <span>{{ changeDetailData.outMoney + '元' || '--' }}</span>
        </el-form-item>
        <el-form-item
          label="转入校区:"
          prop="detail"
        >
          <span>{{ changeDetailData.inOrgName || '--' }}</span>
        </el-form-item>
        <el-form-item
          label="转入课时:"
          prop="detail"
        >
          <div>
            <table border="1">
              <tr style="background: #f5f6f8">
                <th>课程名称</th>
                <th>转入课时</th>
              </tr>
              <tr
                v-for="(item, index) of changeDetailData.inCourseInfo"
                :key="index+ '_inCourseInfo'"
              >
                <td>{{ item.inCourseName }}</td>
                <td>{{ item.inNum }}</td>
              </tr>
              <tr>
                <td>总计</td>
                <td>{{ changeDetailData.inAllNum || '0' }}</td>
              </tr>
            </table>
          </div>
        </el-form-item>
        <el-form-item
          label="转入金额:"
          prop="detail"
        >
          <span>{{ changeDetailData.inMoney + '元' || '--' }}</span>
        </el-form-item>
        <el-form-item
          label="转校手续费:"
          prop="detail"
        >
          <span>{{ changeDetailData.fee + '元' || '--' }}</span>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitFormDetail('changeDetailForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTransCourseInfo } from '@/api/crm/stuAccount/stuAccount.js'
export default {
  data() {
    return {
      detailDialogShow: false, // 是否转校详情显示
      changeDetailData: {}
    }
  },
  methods: {
    /* 详情数据 */
    getTransCourseInfoFun(rowlist) {
      const params = {
        transId: rowlist.id
      }
      getTransCourseInfo(params).then(res => {
        if (res.data.errorCode === 0) {
          this.detailDialogShow = !this.detailDialogShow
          this.changeDetailData = res.data.data
          let outAllPrice = 0 // 转出课时总数
          this.changeDetailData.outCourseInfo.map((item, index) => {
            outAllPrice += Number(item.outNum)
          })
          this.changeDetailData.outAllNum = outAllPrice
          let inAllPrice = 0 // 转入课时总数
          this.changeDetailData.inCourseInfo.map((item, index) => {
            inAllPrice += Number(item.inNum)
          })
          this.changeDetailData.inAllNum = inAllPrice
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 显示转校详情弹框 */
    showDetail(row) {
      this.getTransCourseInfoFun(row)
    },
    /* 确定提交转校详情弹框 */
    submitFormDetail() {
      this.detailDialogShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.changeInfoDialog_container /deep/ {
  .el-dialog {
    width: 600px;
  }
}
table {
  border-collapse: collapse;
}
table,
td,
th {
  border: 1px solid #ddd;
}
table {
  width: 300px;
}
th {
  height: 32px;
}
td {
  height: 32px;
  text-align: center;
}
</style>

