<template>
  <div class="leafletDialog">
    <el-dialog
      :visible.sync="leafletDialogShow"
      :append-to-body="true"
      title="下载传单"
      width="500px"
      custom-class="leafletDialog"
    >
      <div class="cont">
        <div class="imgBox">
          <div class="cover">
            <img
              :src="imgObj.index1"
              alt=""
            >
            <p>正面</p>
          </div>
          <div class="oppositeCover">
            <img
              :src="imgObj.index2"
              alt=""
            >
            <p>反面</p>
          </div>
        </div>
        <div class="contFoot">
          <span>下载格式:</span>
          <el-radio-group v-model="imgRadio">
            <el-radio label="png">png</el-radio>
            <el-radio label="pdf">pdf</el-radio>
          </el-radio-group>
          <p>备注： 点击"打包下载"按钮，则自动下载所有对应釆单员的传单</p>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button type="primary">打包下载</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

import { queryMembers } from '@/api/marketing/marketAdmin.js'
import { getInstMsg } from '@/api/marketing/offlineLeaflet.js'
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

      leafletDialogShow: false,
      imgObj: {},
      imgRadio: 'png'
    }
  },
  methods: {
    queryMembers(id) {
      // if (this.id) {
      const params = {
        activityId: id
      }
      queryMembers(params).then(res => {
        if (res.data.errorCode === 0) {
          const arr = []
          res.data.members.map((val) => {
            var url = `http://192.168.1.52 + html/market/activity?tenantId=${val.tenant_id}&orgId=${val.org_id}&activityId=${val.activity_id}&memberId=${val.id}`
            arr.push({ message: url, name: val.member_name })
          })
          this.list = arr
          this.leafletDialogShow = true
        } else {
          this.$message.error(res.errorMessage)
        }
      })
      // }
    },
    upload() {
      // const params = {}
      // path =

    },
    getInstMsg(id) {
      const params = {
        id: id
      }
      getInstMsg(params).then((res) => {
        if (res.data.errorCode === 0) {
          console.log(JSON.parse(res.data.detailData))
          this.imgObj = JSON.parse(res.data.pageImgs)
          console.log(this.imgObj)
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.leafletDialog {
  .cont .imgBox {
    display: flex;
    // justify-content: center;
    // .cover {
    //   margin-left: 30px;
    // }
    .cover,
    .oppositeCover {
      margin-left: 20px;
      // width: 223px;
      height: 318px;
      text-align: center;
      img {
        width: 220px;
        height: 299px;
      }
    }
  }
  .contFoot {
    margin-top: 20px;
    margin-left: 20px;
    p {
      margin-top: 10px;
      // clear: both;
      // position: relative;
      // top: 10px;
      // margin-bottom: 40px;
      font-size: 14px;
      line-height: 14px;
      color: rgba(230, 67, 64, 1);
    }
  }
  // .dialog-footer {
  //   border-top: 1px #ddd solid;
  //   margin-top: 20px;
  // }
}
</style>
<style lang="scss">
.leafletDialog {
  .el-dialog__title {
    height: 16px;
    font-size: 16px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 16px;
  }
  .el-dialog__body {
    padding: 0px !important;
    margin-top: 20px;
    overflow-y: hidden;
  }
  .el-dialog__footer {
    margin-top: 20px;
  }
}
</style>

