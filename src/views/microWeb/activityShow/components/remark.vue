<template>
  <div class="remarkDialog">
    <el-dialog
      :visible.sync="remarkDialogShow"
      :title="title"
      :append-to-body="true"
      width="30%"
      custom-class="remarkDialogZhezhao"
    >
      <el-input
        v-model="changeRemarkVal"
        type="textarea"
        placeholder="请输入提醒内容"
      />
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="remarkDialogShow = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handelSubmit"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { addRemark } from '@/api/microWeb/activityShow'
export default {
  // props: ['changeRemarkVal'],
  data() {
    return {
      remarkDialogShow: false,
      title: '预约设置',
      changeRemarkVal: ''

    }
  },
  methods: {
    handelSubmit() {
      console.log(this.$parent.actObj, 'actObj')
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        // spinner: 'el-icon-loading',
        fullscreen: false,
        // background: 'rgba(0, 0, 0, 0.7)',
        target: document.querySelector('.remarkDialog')
      })
      const params = {
        id: this.$parent.actObj.id,
        activityId: this.$parent.actObj.activityId,
        remark: this.changeRemarkVal
      }
      addRemark(params).then((res) => {
        if (res.data.errorCode === 0) {
          this.remarkDialogShow = false
          this.$parent.resetFieldHanle(res)
          // this.$parent.onSearch()
        } else {
          this.$message.error(res.errorMessage)
        }
        loading.close()
      })

      // console.log(this.desc, '1234')
    }
  }
}
</script>
<style lang="scss">
.remarkDialog .el-dialog__footer {
  padding: 20px !important;
}
.remarkDialogZhezhao {
  z-index: 4000 !important;
}
</style>

