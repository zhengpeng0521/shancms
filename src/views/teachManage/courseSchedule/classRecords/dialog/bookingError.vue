<template>
  <el-dialog
    :visible.sync="findDialogShow"
    :close-on-click-modal="false"
    title="预约异常提示"
    width="600px"
  >
    <p style="margin-bottom:10px">{{ errorTitle }}</p>
    <template
      v-if="errorType === 1 || errorType === 4 || errorType===5"
    >
      <div
        v-if="errorType === 4 || errorType===5"
      >
        {{ errorDes }}
      </div>
      <div
        v-for="(error, i) of errorList"
        :key="i"
        style="margin-bottom:14px"
      >
        <p>{{ error }}</p>
      </div>
    </template>
    <template
      v-else
    >
      <div>{{ errorCon }}</div>
    </template>
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
      errorType: 0, // 错误类型, 1.上课 2.补课 3.预约试听 4.班级单次约课 5.班级批量约课
      errorTitle: '', // 错误主提示内容
      errorCon: '', // 错误次级提示信息 类型23
      errorDes: '', // 错误描述, 类型45
      errorList: [] // 错误信息数组, 类型145
    }
  },
  methods: {
    show(data) {
      this.findDialogShow = true

      this.errorType = data.type
      this.errorTitle = data.errorMessageMain
      if (data.type === 1) {
        this.errorList = data.message && data.message.errorInfo
      } else if (data.type === 2) {
        this.errorCon = data.message && data.errorMessage
      } else if (data.type === 3) {
        this.errorCon = data.message && data.errorMessage
      } else if (data.type === 4) {
        this.errorList = data.message && data.message.errorInfo
        this.errorDes = data.errorMessage
      } else if (data.type === 5) {
        this.errorList = data.message && data.message.errorInfo
        this.errorDes = data.errorMap
      } else {
        this.errorCon = data.errorMessage
      }
    },
    submitFindForm() {
      this.findDialogShow = false
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
