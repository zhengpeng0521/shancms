<template>
  <div class="delArrangeCourse">
    <el-dialog
      :visible.sync="dialogVisible"
      :show-close="false"
      width="400px"
    >
      <div class="content">
        <div class="content_text">
          <img src="https://img.ishanshan.com/gimg/n/20190125/46049c37bbcd47e5c75f08ca8a9cac96">
          <div>是否删除已选中的{{ checkNum }}条排课记录</div>
        </div>
        <div style="padding-left:40px;color:rgb(255, 127, 117)">已预约的上课和试听学员将全部取消</div>
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
          @click="sure"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { deleteArrange } from '@/api/teachManage/arrangeCourse'
export default {
  data() {
    return {
      dialogVisible: false,
      checkNum: '0',
      checkIds: [] // 选中的列表
    }
  },
  methods: {
    show(val, rowArr) {
      this.checkNum = val
      this.checkList = rowArr
      this.dialogVisible = true
      console.info(this.checkList)
    },
    sure() {
      const cpdIdArr = []
      this.checkList.map(item => {
        cpdIdArr.push(item.cpdId)
      })
      const cpdIds = cpdIdArr && cpdIdArr.join(',')
      const params = {
        cpdIds: cpdIds,
        reason: '7'
      }
      deleteArrange(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.$message.success(data.errorMessage)
          this.dialogVisible = false
          this.$emit('toUpdateTable')
        } else {
          this.$message.error(data.errorMessage || '删除排课失败')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.delArrangeCourse /deep/ {
  .el-dialog__header {
    display: none;
  }
  .content {
    margin: 15px 20px 14px;
    .content_text {
      margin-bottom: 15px;
      img {
        margin-right: 12px;
      }
      :last-child {
        display: inline-block;
        vertical-align: super;
        color: #666;
      }
    }
  }
}
</style>
