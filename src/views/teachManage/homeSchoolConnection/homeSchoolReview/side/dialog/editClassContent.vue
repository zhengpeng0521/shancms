<template>
  <div class="teachComment">
    <el-dialog
      :visible.sync="dialogVisible"
      :title="title"
      width="600px"
      @close="resetForm"
    >
      <div>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          label-width="90px"
        >
          <el-form-item label="课堂内容：">
            <el-input
              v-model="ruleForm.content"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请填写老师点评（限300字）"
              type="textarea"
            />
          </el-form-item>
          <el-form-item label="课后作业：">
            <el-input
              v-model="ruleForm.homework"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请填写老师点评（限300字）"
              type="textarea"
            />
          </el-form-item>
          <el-form-item label="上课图片：">
            <el-upload
              :class="{'disabled ': imgVisible}"
              :on-remove="handleRemove"
              :on-change="onChange"
              :before-upload="beforeAvatarUpload"
              :limit="3"
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
                :src="ruleForm.classImg"
                width="90px"
                height="90px"
                alt=""
              >
            </el-dialog>
            <div style="color:rgba(0,0,0,.43);font-size:12px">最多3张，支持png、jpg、jpeg、gif格式的图片，不大于10M</div>
          </el-form-item>
        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="resetForm"
        >取消</el-button>
        <el-button
          type="primary"
          @click="saveForm"
        >保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { cpContentUpdate } from '@/api/teachManage/homeSchoolConnect'
export default {
  data() {
    return {
      dialogVisible: false,
      title: '',
      ruleForm: {
        content: '', // 课堂内容
        homework: '', // 课后作业
        classImg: [] // 上课图片
      },
      classImgVisible: false,
      imgVisible: false,
      fileList: [], // 图片显示列表
      rowInfo: {}
    }
  },
  methods: {
    show(row) {
      this.rowInfo = row
      this.dialogVisible = true
      this.ruleForm.content = row.content
      this.ruleForm.homework = row.homework
      this.fileList = []
      if (row.picList && row.picList.length > 0) {
        row.picList.map(item => {
          const obj = {
            url: item
          }
          this.fileList.push(obj)
          if (this.fileList && this.fileList.length === 3) {
            this.imgVisible = true
          }
        })
      }
      this.title = row.title
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
        this.ruleForm.classImg = newFileList
        if (fileList.length === 3) {
          this.imgVisible = true
        }
      }
    },
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
        this.ruleForm.classImg = newFileList
        if (fileList.length < 3) {
          this.imgVisible = false
        } else {
          this.imgVisible = true
        }
      }
    },
    beforeAvatarUpload(file) {
      const imageSize = file.size / 1024 / 1024 < 10// 上传图片大小不超过5M
      if (!imageSize) {
        this.$message.error('上传图片大小不能超过 10MB!')
      }
      return imageSize
    },
    resetForm() {
      this.dialogVisible = false
      this.imgVisible = false
      this.fileList = []
      this.$refs['ruleForm'].resetFields()
    },
    saveForm() {
      const imgArr = []
      let picNum = 0
      this.ruleForm.classImg.map(item => {
        imgArr.push(item.url)
        picNum = imgArr && imgArr.length
      })
      const params = {
        cpdId: this.rowInfo.cpdId,
        cpmId: this.rowInfo.cpmId,
        content: this.ruleForm.content,
        homework: this.ruleForm.homework,
        pictures: imgArr,
        picNum: picNum
      }
      cpContentUpdate(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.dialogVisible = false
          this.rowInfo.homework = this.ruleForm.homework
          this.rowInfo.content = this.ruleForm.content
          this.rowInfo.picList = imgArr
          this.$emit('toUpdateTable', this.rowInfo)
          this.$message.success(data.errorMessage)
        } else {
          this.$message.error(data.errorMessage || '老师评价编辑失败')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.disabled /deep/ .el-upload--picture-card {
  display: none;
}
</style>
>
