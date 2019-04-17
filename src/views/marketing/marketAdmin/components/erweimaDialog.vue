<template>
  <div class="erweimaDialog">
    <el-dialog
      :visible.sync="erweimaDialogShow"
      :append-to-body="true"
      title="下载二维码"
      width="fit-content"
    >
      <div
        ref="erweimaDialog"
        :style="{'width':list.length === 2 ?'368px':list.length === 1 ? '200px':'550px'}"
        class="erweimaContainer"
      >
        <div
          v-for="(item,index) in list"
          :key="index"
          class="erweimaBox"
        >
          <h2>{{ item.name }}</h2>
          <qrcode
            :options="{ width: 150,height:150,padding:0,margin:0 }"
            :value="item.message"
            class="erweima"
          />
          <el-button
            v-if="hasBtn('204000005')"
            plain
            class="uploadBtn"
            @click="upload(item,index)"
          >下载二维码</el-button>
        </div>
      </div>
      <span
        v-show="list.length>1"
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          v-if="hasBtn('204000005')"
          type="primary"
          @click="packUpload(list)"
        >打包下载</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 二维码装换插件
import Vue from 'vue'
import VueQrcode from '@chenfengyuan/vue-qrcode'
Vue.component(VueQrcode.name, VueQrcode)
import { exportFile } from '@/utils/exportFile.js'
import { queryMembers } from '@/api/marketing/marketAdmin.js'
// import { exportFile } from '@/utils/exportFile.js'
export default {
  // props: {
  //   id: {
  //     type: String,
  //     required: true
  //   }

  // },
  data() {
    return {
      message: '',
      id: '',
      erweimaDialogShow: false,
      name: '',
      list: []
    }
  },
  methods: {
    queryMembers(id, orgId) {
      // if (this.id) {
      this.id = id
      const params = {
        activityId: id
      }
      this.erweimaDialogShow = true
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中。。。',
        spinner: 'el-icon-loading',
        fullscreen: true,
        // background: 'rgba(0, 0, 0, 0.7)',
        target: document.querySelector('.erweimaDialog')
      })
      queryMembers(params).then(res => {
        if (res.data.errorCode === 0) {
          const arr = []
          res.data.members.map((val) => {
            var url = `${process.env.BASE_LOCATION}/thinknode/html/market/activity?tenantId=${val.tenant_id}&orgId=${val.org_id}&activityId=${val.activity_id}&memberId=${val.id}&instanceOrgId=${orgId}`
            arr.push({ message: url, name: val.member_name })
          })
          this.list = arr
        } else {
          this.$message.error(res.errorMessage)
        }
        loading.close()
      })
      // }
    },
    upload(val, index) {
      // console.log(val, index)
      var oQrcode = document.getElementsByClassName('erweima')[index]
      var imgSrc = oQrcode.toDataURL('image/png')
      var a = document.createElement('a')
      var event = new MouseEvent('click')
      // 下载图名字
      a.download = val.name
      // url
      a.href = imgSrc
      // 合成函数，执行下载
      a.dispatchEvent(event)
    },
    packUpload(val) {
      // console.log(this.id, '-----id')
      const path = '/ss-mic-provider/mic/market/img/zip'
      const params = { activityId: this.id }
      exportFile(path, params)
    }
  }
}
</script>
<style lang="scss" scoped>
.erweimaContainer {
  // max-width: 600px;
  max-height: 450px;
  overflow: auto;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  .erweimaBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    .uploadBtn {
      margin-top: 10px !important;
    }
    .uploadBtn:hover {
      color: #46b6ee !important;
      border-color: #46b6ee !important;
    }

    // border: 1px solid #f00;
    h2 {
      width: 180px;
      text-align: center;
      font-size: 14px;
      color: #666;
      margin-top: 10px;
      margin-bottom: 10px;
      font-weight: 500;
    }
    .el-button {
      margin-top: 20px;
      margin-bottom: 10px;
    }
  }
  .el-dialog__footer {
    border-top: 1px #ddd solid;
  }
}
</style>
<style lang="scss">
.erweimaDialog .el-dialog {
  min-width: 250px !important;
  max-width: 640px !important;
  min-height: 329px !important;
  padding: 0 !important; // width: auto !important;
  // width: 20%;
  .el-dialog__footer {
    border-top: 1px #ddd solid;
    // display:flex;
    text-align: center;
    margin-top: 20px;
    padding: 20px 10px !important;
    // box-sizing: content-box;
    width: calc(100% - 40px);
    margin-left: 10px;
  }
}
</style>

