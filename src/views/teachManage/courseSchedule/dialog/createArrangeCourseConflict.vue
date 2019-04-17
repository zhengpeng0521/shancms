<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="冲突提示"
    width="400px"
  >
    <div class="arrange_conflict">
      <p class="arrange_conflict_title">修改失败</p>
      <p class="arrange_conflict_sub_title">检测到冲突：</p>
      <div class="arrange_conflict_item">
        <span>时间： {{ conflictInfo.studyTime || '--' }}</span>
      </div>
      <div class="arrange_conflict_item">
        <span>主教： {{ conflictInfo.mtName || '--' }}</span>
        <div v-if="conflictObj.mtName">冲突</div>
      </div>
      <div class="arrange_conflict_item">
        <span>助教： {{ conflictInfo.atName || '--' }}</span>
        <div v-if="conflictObj.atName">冲突</div>
      </div>
      <div class="arrange_conflict_item">
        <span>班主任： {{ conflictInfo.topTeacher || '--' }}</span>
        <div v-if="conflictObj.topTeacher">冲突</div>
      </div>
      <div class="arrange_conflict_item">
        <span>教室： {{ conflictInfo.clsRoom || '--' }}</span>
        <div v-if="conflictObj.clsRoom">冲突</div>
      </div>
      <div class="arrange_conflict_item">
        <span>自主约课： {{ conflictInfo.bookCls || '--' }}</span>
        <div v-if="conflictObj.bookCls">冲突</div>
      </div>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="primary"
        @click="dialogVisible = false"
      >我知道了</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      conflictInfo: {}, // 获取的冲突信息
      conflictObj: {} // 冲突对象
    }
  },
  methods: {
    show(val) {
      this.conflictObj = {}
      this.dialogVisible = true
      this.conflictInfo = val
      if (val && val.fields) {
        const arr = val.fields
        arr.map((item, index) => {
          this.conflictObj[item] = item
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.arrange_conflict {
  margin-bottom: 14px;
  .arrange_conflict_title {
    padding-bottom: 10px;
    width: 100%;
    height: auto;
    overflow: hidden;
    text-align: center;
    font-size: 18px;
    color: red;
  }
  .arrange_conflict_sub_title {
    padding-bottom: 5px;
    width: 100%;
    height: auto;
    overflow: hidden;
  }
  .arrange_conflict_item {
    margin-bottom: 5px;
    width: 100%;
    height: auto;
    overflow: hidden;
    :first-child {
      padding-bottom: 5px;
      height: auto;
      overflow: hidden;
      float: left;
    }
    :nth-child(2) {
      width: 50px;
      display: inline-block;
      height: 20px;
      line-height: 20px;
      text-align: center;
      background: red;
      color: #fff;
      float: left;
      margin-left: 10px;
      border-radius: 5px;
    }
  }
}
</style>
