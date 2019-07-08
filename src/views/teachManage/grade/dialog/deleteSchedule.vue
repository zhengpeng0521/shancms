<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="修改信息"
    width="600px"
  >
    <div style="margin-bottom:14px">
      <div class="text">班级还有{{ num }}名学员预约了这次上课日程</div>
      <div class="text">删除日程会自动取消这些学员的预约</div>
      <div>
        <span>选择原因：</span>
        <el-select v-model="reason" filterable>
          <el-option
            value="1"
            label="操作有误"
          />
          <el-option
            value="2"
            label="节假日放假"
          />
          <el-option
            value="3"
            label="老师请假"
          />
          <el-option
            value="4"
            label="学员调班"
          />
        </el-select>
      </div>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        class="cancel_btn"
        @click="dialogVisible = false"
      >取消</el-button>
      <el-button
        type="primary"
        @click="submit"
      >确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { deleteArrangeCourse } from '@/api/teachManage/grade'
export default {
  data() {
    return {
      dialogVisible: false, // 弹窗显示
      reason: '1',
      num: '', // 学员预约的人数
      rowInfo: {},
      clsId: ''
    }
  },
  methods: {
    show(val, id) {
      this.rowInfo = val
      this.clsId = id
      this.num = val.stuNum
      this.dialogVisible = true
    },
    submit() {
      const params = {
        cpdIds: this.rowInfo.cpdId,
        reason: this.reason,
        clsId: this.clsId
      }
      deleteArrangeCourse(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.dialogVisible = false
          this.$message.success(data.errorMessage)
          this.$emit('toDeleteSchedule', this.clsId)
        } else {
          this.$message.error(data.errorMessage || '删除日程失败')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.text {
  margin-bottom: 15px;
}
</style>
