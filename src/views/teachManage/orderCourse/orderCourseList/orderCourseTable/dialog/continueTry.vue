<template>
  <el-dialog
    :visible.sync="findDialogShow"
    :close-on-click-modal="false"
    title="继续约课"
    width="400px"
  >
    <div>人数已满，是否继续预约试听？</div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        class="cancel_btn"
        @click="findDialogShow = false"
      >否</el-button>
      <el-button
        type="primary"
        @click="submitFindForm()"
      >是</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { tryCreate } from '@/api/teachManage/orderCourse'

export default {
  data() {
    return {
      findDialogShow: false, // 弹窗显示
      detailList: [],
      id: '',
      type: ''
    }
  },
  methods: {
    show(val, id, type) {
      this.detailList = val
      this.id = id
      this.type = type
      this.findDialogShow = true
    },
    submitFindForm() {
      const startDate = this.detailList.studyDate + ' ' + this.detailList.startTime
      const endDate = this.detailList.studyDate + ' ' + this.detailList.endTime
      let source = ''
      if (this.type == '1') { //eslint-disable-line
        source = '1'
      } else if (this.type == '2') { //eslint-disable-line
        source = '2'
      }
      const payload = {
        stuId: this.id,
        auditionTime: startDate,
        auditionEndTime: endDate,
        courseName: this.detailList.courseName,
        source: source,
        cpmId: this.detailList.cpmId,
        cpdId: this.detailList.cpdId,
        subscribeCreateType: '1'
      }
      tryCreate(payload).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.findDialogShow = false
          this.$message.success(data.errorMessage)
          this.$emit('toUpdateOnceOrder', this.detailList)
        } else {
          this.$message.error(data.errorMessage || '预约试听失败')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
