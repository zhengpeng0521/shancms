<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="班级成员约课情况"
    width="600"
  >
    <div>
      <div class="studyTime">上课时间：{{ studyTime.studyDate }} {{ studyTime.startTime }}~{{ studyTime.endTime }}</div>
      <div class="orderDetail">
        <div
          v-for="item of stuOrderList"
          :key="item.id"
          class="order_item"
        >
          <div>{{ item.name }}</div>
          <span
            v-if="item.signType=='2'"
            style="color:#D0021B"
          >未预约</span>
          <span
            v-if="item.signType=='1'"
            style="color:#46B6EE"
          >已预约</span>
        </div>
      </div>
    </div>
    <!-- <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        class="cancel_btn"
        @click="dialogVisible = false"
      >取消</el-button>
      <el-button
        type="primary"
        @click="dialogVisible = false"
      >确定</el-button>
    </span> -->
  </el-dialog>
</template>
<script>
import { queryCpStuOfCls } from '@/api/teachManage/grade'
export default {
  data() {
    return {
      dialogVisible: false, // 弹窗显示
      studyTime: '', // 上课时间
      stuOrderList: []
    }
  },
  methods: {
    show(val, id) {
      this.studyTime = val
      this.dialogVisible = true
      const params = {
        cpmId: val.cpmId,
        cpdId: val.cpdId,
        clsId: id
      }
      queryCpStuOfCls(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.stuOrderList = data.result
        } else {
          this.$message.error(data.errorMessage || '班级学员约课查询失败')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.studyTime {
  border-bottom: 1px solid #ddd;
  padding-bottom: 20px;
  margin-bottom: 20px;
}
.orderDetail {
  height: 398px;
  overflow: auto;
  .order_item {
    height: 22px;
    line-height: 22px;
    margin-bottom: 20px;
    :first-child {
      display: inline-block;
      width: 200px;
    }
  }
}
</style>
