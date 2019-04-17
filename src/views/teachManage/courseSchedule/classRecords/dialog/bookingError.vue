<template>
  <el-dialog
    :visible.sync="findDialogShow"
    :close-on-click-modal="false"
    title="预约异常提示"
    width="600px"
  >
    <p style="margin-bottom:10px">{{ batchOrderLabel }}</p>
    <div
      v-for="(error, i) of keys"
      :key="i"
      style="margin-bottom:14px"
    >
      <p>{{ error }}</p>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button
        type="primary"
        @click="submitFindForm()"
      >我知道了</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      findDialogShow: false, // 弹窗显示
      arr: [],
      keys: [],
      batchOrderLabel: ''
    }
  },
  methods: {
    show(mainError, errorArr) {
      this.findDialogShow = true
      this.batchOrderLabel = mainError
      this.keys = errorArr
    },
    submitFindForm() {
      this.findDialogShow = false
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
