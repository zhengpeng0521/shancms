<template>
  <div class="parentBindDialog_container">
    <el-dialog
      :visible.sync="parentBindDialogShow"
      title="家长绑定"
      @close="cancelDialog()"
    >
      <div style="margin-bottom: 20px;">
        <div style="height: 230px;">
          <img
            :src="cordUrlImg"
            style="width: 200px;height: 200px;margin-left: 50px;"
            alt=""
          >
          <div style="padding-left: 65px;">绑定流程</div>
        </div>
        <div style="margin-left: 50px;">
          <div>1.使用微信扫一扫，关注公众号</div>
          <div>2.按照公众号提示操作</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parentBindQrCode } from '@/api/crm/studentInfo/readingStu.js'
export default {
  components: {

  },
  data() {
    return {
      parentBindDialogShow: false,
      cordUrlImg: ''
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog() {
      this.parentBindQrCodeFun()
    },
    /* 关闭弹框 */
    cancelDialog() {
      this.parentBindDialogShow = false
    },
    /* 获取二维码 */
    parentBindQrCodeFun() {
      const params = {
        weChatType: 'sys'
      }
      parentBindQrCode(params).then(res => {
        if (res.data.errorCode === 0) {
          console.log('res--二维码->', res)
          this.parentBindDialogShow = !this.parentBindDialogShow
          this.cordUrlImg = res.data.data.codeUrl
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.parentBindDialog_container /deep/ {
  .el-dialog {
    width: 350px;
  }
}
</style>

