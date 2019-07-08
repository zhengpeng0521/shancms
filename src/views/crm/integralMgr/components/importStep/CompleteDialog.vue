<template>
  <el-dialog
    :visible="visible"
    title="导入完成"
    width="400px"
    @close="$emit('closeComplete')"
  >
    <div class="complete-tip">
      <p>成功{{ completeInfo.sucNum }}条</p>
      <p>失败{{ completeInfo.failNum }}条</p>
    </div>
    <span slot="footer">
      <el-button @click="$emit('closeComplete')">关 闭</el-button>
      <el-button
        v-if="hasFail"
        type="primary"
        @click="$emit('downloadErr')"
      >下载错误日志</el-button>
      <el-button
        v-else
        type="primary"
        @click="$emit('closeDialogAll')"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    hasFail: {
      type: Boolean,
      required: true
    },
    completeInfo: {
      type: Object,
      required: true
    }
  },

  data() {
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.complete-tip p {
  text-align: center;
  &:last-child {
    margin-top: 10px;
  }
}
</style>
