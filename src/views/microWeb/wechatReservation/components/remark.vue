<template>
  <div class="remarkDialog">
    <el-dialog
      :visible.sync="remarkDialogShow"
      :title="title"
      width="30%"
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
import { updateRemark } from '@/api/microWeb/wechatReservation'
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
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中',
        // spinner: 'el-icon-loading',
        fullscreen: false,
        // background: 'rgba(0, 0, 0, 0.7)',
        target: document.querySelector('.remarkDialog')
      })
      const params = {
        id: this.$parent.remarkObj.id,
        orgId: this.$parent.remarkObj.orgId,
        tenantId: this.$parent.remarkObj.tenantId,
        remark: this.changeRemarkVal
      }
      updateRemark(params).then(res => {
        if (res.data.errorCode === 0) {
          this.$parent.resetFieldHanle()
          this.remarkDialogShow = false
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
</style>

