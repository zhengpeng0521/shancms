<template>
  <el-form
    ref="shareSettingForm"
    :model="shareSettingForm"
    :rules="rules"
    label-width="140px"
  >
    <el-form-item
      label="分享标题:"
      prop="title"
      checked
    >
      <el-input
        v-model="shareSettingForm.title"
        clearable
        placeholder="请输入分享标题（1-40个字）"
      />
    </el-form-item>

    <el-form-item
      label="分享简介:"
      prop="shareIntro"
      checked
    >
      <el-input
        v-model="shareSettingForm.shareIntro"
        clearable
        placeholder="请输入分享简介（1-80个字）"
      />
    </el-form-item>
    <el-form-item
      label="分享图片:"
      prop="sharePic"
      checked
    >
      <el-upload
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
      >
        <i class="el-icon-plus" />
        <span>选择图片</span>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img
          :src="shareSettingForm.dialogImageUrl"
          width="90px"
          height="90px"
          alt=""
        >
      </el-dialog>

    </el-form-item>
  </el-form>
</template>
<script>
export default {
  data() {
    return {
      shareSettingForm: {
        title: '',
        shareIntro: '',
        dialogImageUrl: ''
      },
      dialogVisible: false,
      rules: {
        title: [{ max: 40, min: 1, message: '分享标题为1-40个字', trigger: 'blur' },
          { required: true, message: '请填写内容', trigger: 'change' }],
        shareIntro: [{ max: 80, min: 1, message: '分享简介为1-80个字', trigger: 'blur' },
          { required: true, message: '请填写内容', trigger: 'change' }],
        sharePic: [
          { required: true, message: '支持png、jpeg、gif格式的图片，建议宽高 750*400px，图片大小不大于2M！', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 上传图片
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 上传图片删除
    handleRemove(file, fileList) {
      // console.log(file, fileList)
    },
    // 预览
    handlePictureCardPreview(file) {
      this.lessonForm.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

