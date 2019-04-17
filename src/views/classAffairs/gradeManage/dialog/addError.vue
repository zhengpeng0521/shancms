<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    title="添加异常提示"
    width="600px"
  >
    <div style="margin-bottom:14px">
      <p style="margin-bottom: 10px ">学员添加失败</p>
      <p style="color: #999;line-height:21px">{{ errorMessage }}</p>
      <p style="color: #999;line-height:21px">学员 : <span>{{ students }}</span></p>
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
      errorMessage: '',
      students: ''
    }
  },
  methods: {
    show(data) {
      this.dialogVisible = true
      this.errorMessage = data.errorMessage
      if (data.list && data.list.length > 0) {
        this.students = data.list && data.list.join(',')
      }
    }
  }
}
</script>
