<template>
  <div class="mgrAccessoryDialog_container">
    <el-dialog
      :visible.sync="mgrAccessoryDialogShow"
      title="管理附件"
      @close="cancelDialog('mgrAccessoryForm')"
    >
      <el-form
        ref="mgrAccessoryForm"
        :model="mgrAccessoryData"
        label-width="90px"
      >
        <el-form-item
          label="合同附件:"
          prop="image"
        >
          <el-upload
            :class="{'disabled ': imgVisible}"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="onChange"
            :before-upload="beforeAvatarUpload"
            :limit="9"
            :file-list="fileList"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            action="https://imgsrc.ishanshan.com/gimg/upload"
            list-type="picture-card"
          >
            <i class="el-icon-plus" />
            <span>上传照片</span>
          </el-upload>
          <el-dialog :visible.sync="classImgVisible">
            <img
              :src="mgrAccessoryData.imgCont"
              alt=""
            >
          </el-dialog>
          <span class="tip_upload">最多9张,推荐尺寸750*280,支持png,jpeg,gif格式的图片,不大于5M</span>
        </el-form-item>
        <el-form-item
          label="备  注:"
          prop="remark"
        >
          <el-input
            v-model="mgrAccessoryData.remark"
            clearable
            type="textarea"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('mgrAccessoryForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('mgrAccessoryForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updateOrderImg, getOrderImg } from '@/api/crm/contract/contract.js'
export default {
  data() {
    return {
      mgrAccessoryDialogShow: false,
      mgrAccessoryData: {
        remark: '',
        imgCont: [],
        id: ''
      },
      fileList: [], // 图片列表
      classImgVisible: false,
      imgVisible: false,
      rowlistData: {} // 单条合同数据
    }
  },
  methods: {
    /* 上传 */
    handleRemove(file, fileList) {
      const newFileList = []
      if (file.status == 'success') { //eslint-disable-line
        if (fileList && fileList.length > 0) {
          fileList.map(item => {
            if (item.response) {
              const obj = {
                url: item.response.url,
                status: 'success'
              }
              newFileList.push(obj)
            } else {
              newFileList.push(item)
            }
          })
        }
        this.mgrAccessoryData.imgCont = newFileList
        if (fileList.length < 9) {
          this.imgVisible = false
        } else {
          this.imgVisible = true
        }
      }
    },
    onChange(file, fileList) {
      const newFileList = []
      if (file.status == 'success') { //eslint-disable-line
        if (fileList && fileList.length > 0) {
          fileList.map(item => {
            if (item.response) {
              const obj = {
                url: item.response.url,
                status: 'success'
              }
              newFileList.push(obj)
            } else {
              newFileList.push(item)
            }
          })
        }
        this.mgrAccessoryData.imgCont = newFileList
        if (fileList.length === 9) {
          this.imgVisible = true
        }
      }
    },
    beforeAvatarUpload(file) {
      const imageSize = file.size / 1024 / 1024 < 5// 上传图片大小不超过5M
      if (!imageSize) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      return imageSize
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    /* 显示弹框 */
    showDialog(rowlist) {
      this.mgrAccessoryDialogShow = true
      this.fileList = []
      this.rowlistData = rowlist
      const params = {
        id: rowlist.orderNumber
      }
      const self = this
      getOrderImg(params).then(res => {
        if (res.data.errorCode === 0) {
          // 图片处理
          const fileList = []
          let imgArray = []
          if (res.data.imgUrl) {
            imgArray = res.data.imgUrl.split(',')
            if (imgArray && imgArray.length > 0) {
              imgArray.map(item => {
                const obj = {
                  url: item
                }
                fileList.push(obj)
              })
            }
          }
          if (fileList && fileList.length === 9) {
            self.imgVisible = true
          }
          // 返回值处理
          this.fileList = fileList
          self.mgrAccessoryData.id = rowlist.orderNumber
          self.mgrAccessoryData.remark = res.data.remark
          self.mgrAccessoryData.imgCont = fileList
        } else {
          self.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.mgrAccessoryDialogShow = false
      this.$refs[formName].resetFields()
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const imgContArry = []
          this.mgrAccessoryData.imgCont.map(item => {
            imgContArry.push(item.url)
          })
          const params = {
            id: this.mgrAccessoryData.id,
            imgUrl: imgContArry.join(','),
            remark: this.mgrAccessoryData.remark
          }
          updateOrderImg(params).then(res => {
            if (res.data.errorCode === 0) {
              this.mgrAccessoryDialogShow = false
              this.$message.success(res.data.errorMessage)
              this.$emit('toContractDetail')
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mgrAccessoryDialog_container /deep/ {
  .el-dialog {
    width: 500px;
  }
  .tip_upload {
    color: rgba(0, 0, 0, 0.43);
    white-space: nowrap;
    font-size: 10px;
  }
  .disabled .el-upload--picture-card {
    display: none;
  }
}
</style>

