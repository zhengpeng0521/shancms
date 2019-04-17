<template>
  <div>
    <div class="upload_files_box">
      <div class="upload_input">
        <el-input
          v-model="fileName"
          disabled
          placeholder="请上传文件"
        />
      </div>
      <el-upload
        :show-file-list="false"
        :on-change="uploadChange"
        :file-list="fileList"
        :action="action"
      >
        <el-button
          :loading="loading"
          type="primary"
        >选择文件</el-button>
      </el-upload>
    </div>
    <div class="upload_tip">
      您可以下载<a @click="download">数据模板</a>来准备数据后上传，也可以上传添加自己的文件
    </div>
  </div>
</template>

<script>
import { exportFile } from '@/utils/exportFile'

export default {

  props: {
    loading: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      action: `/api/saas/${window.SS_CRM}/crm/integral/excel/uploadExcel`,
      fileName: '',
      fileList: []
    }
  },

  methods: {
    /** 上传 */
    uploadChange(file, fileList) {
      if (file.status === 'ready') {
        this.$emit('start')
      } else if (file.status === 'success') {
        if (file.response && file.response.errorCode === 0) {
          this.fileName = file.name
          this.fileList = fileList.slice(-1)
          this.$message.success('上传成功，正在检测文件类型')
          this.$emit('isModle', { id: file.response.id })
        } else {
          this.$message.error(file.response && file.response.errorMessage || '上传失败')
        }
      } else if (file.status === 'fail') {
        this.$emit('faild')
      }
    },

    /** 下载 */
    download() {
      exportFile(`${window.SS_CRM}/crm/stuInfo/clue/excel/downloadStuInfoModel`, { type: '40' })
    }
  }
}
</script>

<style lang="scss" scoped>
.upload_files_box {
  display: flex;
  justify-content: center;
  margin: 30px 0 10px;
  .upload_input {
    width: 200px;
    margin-right: 10px;
  }
}
.upload_tip {
  font-size: 12px;
  text-align: center;
  margin-bottom: 14px;
  a {
    color: #46b6ee;
  }
}
</style>
