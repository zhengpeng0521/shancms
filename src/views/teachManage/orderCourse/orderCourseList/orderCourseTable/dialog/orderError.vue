<template>
  <el-dialog
    :visible.sync="findDialogShow"
    :close-on-click-modal="false"
    title="预约异常提示"
    width="600px"
  >
    <p>{{ batchOrderLabel }}</p>
    <div
      v-for="(error, i) of keys"
      :key="i"
      style="margin-bottom:14px"
    >
      <p>{{ error }}</p>
      <p
        v-for="(item, index) of arrs"
        :key="index"
      >
        {{ item }}
      </p>
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
    show(val, cutType, detail) {
      this.keys = Object.keys(val)
      this.keys.map(item => {
        this.arrs = val[item]
      })
      if (cutType && detail) {
        if (cutType == '1') { //eslint-disable-line
          this.batchOrderLabel = ' 该课程只能使用专用课时, 所需课时' + detail.cost + '，学员约课失败情况：'
        } else {
          this.batchOrderLabel = '本次约课需课时' + detail.cost + '， 学员约课失败情况：'
        }
      }
      this.findDialogShow = true
    },
    submitFindForm() {
      this.findDialogShow = false
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
