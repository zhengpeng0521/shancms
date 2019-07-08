<template>
  <div class="bindingFaceOrderDialog_container">
    <el-dialog
      :visible.sync="bindingFaceOrderDialogShow"
      :modal-append-to-body="false"
      :modal="false"
      :limit="1"
      :title="contentTypeData.isFaceBind == '0' ? '绑定人脸' : '重设人脸'"
      @close="cancelDialog()"
    >
      <!-- 人脸识别照片 -->
      <div class="bindingFaceImg">
        <el-upload
          v-loading="loading"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
          class="avatar-uploader"
          action="https://imgsrc.ishanshan.com/gimg/upload"
        >
          <img v-if="contentTypeData.faceUrl" :src="contentTypeData.faceUrl" style="width: 200px;height: 200px;">
          <div v-else class="avatar-uploader-icon">
            <span class="el-icon-plus"/>
            <p>选择图片</p>
          </div>

        </el-upload>
        <div class="bindingFaceWord">图片大小限2M以内</div>
        <div class="bindingFaceImgButton">
          <el-button type="primary" @click="bindingFaceImgButton(contentTypeData, tenantId, orgId)">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  bindMemberToStuEx, // 绑定学生用户人脸信息
  bindMemberToParentEx // 绑定家长用户人脸信息
} from '@/api/crm/studentInfo/bindingFaceOrder.js'
export default {
  data() {
    return {
      bindingFaceOrderDialogShow: false,
      // imageUrl: '',
      dialogVisible: false,
      loading: false, // 上传时的加载样式控制
      boyBigPic: 'https://img.ishanshan.com/gimg/n/20190610/3826e5ed9f1241e30269d7f9918d0c59', // 男孩大图
      girlBigPic: 'https://img.ishanshan.com/gimg/n/20190610/bbe5a7250a9bcb14eba6a8d177e1a900', // 女孩大图
      manBigPic: 'https://img.ishanshan.com/gimg/n/20190610/2e42a117f400dc8c7c9322863a6fcc6d', // 男家长大图
      womanBigPic: 'https://img.ishanshan.com/gimg/n/20190610/98a78bb40338ee3e07fcb6de90614aa0', // 女家长大图
      tenantId: '',
      orgId: '',
      contentTypeData: { // 当前数据
        faceUrl: null,
        id: null,
        isFaceBind: '0',
        isStudent: '0',
        name: '闪闪'
      }
    }
  },
  methods: {
    // 点击绑定人脸操作
    bindingFaceImgButton(contentTypeData, tenantId, orgId) {
      if (contentTypeData.faceUrl === '' || contentTypeData.faceUrl === null || contentTypeData.faceUrl === undefined) {
        this.$message.error('请选择图片后再上传')
      } else {
        if (contentTypeData.isStudent === '1') {
          this.bindStuFace(contentTypeData, tenantId, orgId)
        } else if (contentTypeData.isStudent === '0') {
          this.bindParentFace(contentTypeData, tenantId, orgId)
        }
      }
    },

    // 学生绑定人脸操作
    bindStuFace(contentTypeData, tenantId, orgId) {
      this.loading = true
      const params = {
        appId: '1630396076961824769',
        tenantId: tenantId,
        orgId: orgId,
        stuId: contentTypeData.id,
        stuName: contentTypeData.name,
        faceUrl: contentTypeData.faceUrl
      }
      bindMemberToStuEx(params).then(res => {
        if (res.data.errorCode === 0) {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.bindingFaceOrderDialogShow = false
          this.$emit('closeCreateDialog')
          this.loading = false
        } else if (res.data.errorCode === 1001) {
          this.$message.error('抽取特征值失败')
          this.loading = false
        } else {
          this.$message.error(res.data.errorMessage)
          this.loading = false
        }
      })
    },

    // 家长绑定人脸操作
    bindParentFace(contentTypeData, tenantId, orgId) {
      this.loading = true
      const params = {
        appId: '1630396076961824769',
        tenantId: tenantId,
        orgId: orgId,
        stuParentId: contentTypeData.id,
        stuParentName: contentTypeData.name,
        faceUrl: contentTypeData.faceUrl
      }
      bindMemberToParentEx(params).then(res => {
        if (res.data.errorCode === 0) {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.bindingFaceOrderDialogShow = false
          this.$emit('closeCreateDialog')
          this.loading = false
        } else if (res.data.errorCode === 1001) {
          this.$message.error('抽取特征值失败')
          this.loading = false
        } else {
          this.$message.error(res.data.errorMessage)
          this.loading = false
        }
      })
    },

    // 图片上传（文件上传成功时的钩子）
    handleAvatarSuccess(res, file) { // 选择图片地址
      // this.imageUrl = URL.createObjectURL(file.raw)
      // this.contentTypeData.faceUrl = URL.createObjectURL(file.raw)
      this.contentTypeData.faceUrl = res.url
    },

    // 上传文件之前的钩子
    beforeAvatarUpload(file) { // 图片上传时限制
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG) && isLt2M
    },

    /* 显示弹框 */
    showDialog(data, tenantId, orgId) {
      this.bindingFaceOrderDialogShow = true
      this.contentTypeData.id = data.id
      this.contentTypeData.isFaceBind = data.isFaceBind
      this.contentTypeData.isStudent = data.isStudent
      this.contentTypeData.name = data.name
      this.tenantId = tenantId
      this.orgId = orgId
      // 根据不同的属性显示不同的默认照片
      if (data.isFaceBind === '0') { // 判断是否绑定人脸
        // if (data.isStudent === '0') { // 判断是否是学生（学生默认男孩，家长默认女家长）
        //   if (data.sex === '0') { // 判断性别
        //     this.contentTypeData.faceUrl = this.womanBigPic
        //   } else if (data.sex === '1') {
        //     this.contentTypeData.faceUrl = this.manBigPic
        //   } else {
        //     this.contentTypeData.faceUrl = this.womanBigPic
        //   }
        // } else {
        //   if (data.sex === '0') {
        //     this.contentTypeData.faceUrl = this.girlBigPic
        //   } else {
        //     this.contentTypeData.faceUrl = this.boyBigPic
        //   }
        // }
        this.contentTypeData.faceUrl = null
      } else {
        this.contentTypeData.faceUrl = data.faceUrl
      }
    },
    /* 关闭弹框 */
    cancelDialog() {
      this.bindingFaceOrderDialogShow = false
      this.loading = false
      this.contentTypeData.faceUrl = null // 关闭弹窗后，图片变成空
    }

  }
}
</script>

<style lang="scss" scoped>
.bindingFaceOrderDialog_container /deep/ {
  .el-dialog {
    width: 400px;
    overflow: hidden;
  }
  .bindingFaceImg {
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      width: 200px;
      height: 200px;
      margin: 0 auto;
      .avatar {
        width: 200px;
        height: 200px;
        display: block;
      }
      .avatar-uploader-icon {
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        .el-icon-plus:before {
          font-size: 37px;
          color: #999999;
        }
        p {
          font-size: 14px;
          display: block;
          width: 56px;
          height: 14px;
          margin-top: -12px;
        }
      }
    }
    .bindingFaceWord {
      width: 122px;
      height: 20px;
      margin: 14px auto 0;
      font-size:14px;
      font-family:PingFangSC-Medium;
      font-weight:500;
      color:rgba(153,153,153,1);
      line-height:20px;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
   .bindingFaceImgButton {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 14px 0;
   }
  }
}
</style>

