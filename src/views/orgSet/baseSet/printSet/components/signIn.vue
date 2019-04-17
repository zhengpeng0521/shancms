<template>
  <div
    v-loading="loading"
    element-loading-text="拼命加载中"
  >

    <div class="signIn_main">

      <div class="signIn_left">

        <div style="margin-bottom:14px"><span class="form_txt" />
          小票预览（示例）</div>

        <div class="signIn_box">
          <div class="signIn_title">
            杭州XXXXXX校区

          </div>
          <div class="signIn_content">

            <div
              v-if="fileList.length < 1"
              class="null_pic"
            >无LOGO</div>
            <img
              v-else
              :src="signForm.cover"
              style="display: -webkit-inline-box;height:90px;width:90px;margin:20px;border-radius: 4px;"
            >

            <div class="signIn_content_right">
              <span style="font-size:16px;padding-bottom: 10px;">张小宝</span>

              <span v-show="signForm.baseInfo.indexOf('courseName') > -1">课程：游泳课</span>
              <span
                v-show="signForm.baseInfo.indexOf('parentName') > -1"
                style="padding:5px 0"
              >家长：张三丰</span>
              <span style="padding-bottom:5px">签到时间：08-27 09:12</span>
            </div>
          </div>

        </div>
      </div>
      <div class="signIn_right">

        <el-form
          ref="signForm"
          :model="signForm"
          label-width="20px"
        >
          <div style="margin-bottom:14px"><span class="form_txt" />
            打印类型</div>
          <el-form-item style="margin-bottom:20px;">
            <el-radio-group v-model="signForm.mingtie">
              <!-- <el-radio label="1">打印小票</el-radio> -->
              <el-radio label="2">打印名帖</el-radio>
              <!-- <el-radio label="0">都不打印</el-radio> -->
            </el-radio-group>

          </el-form-item>
          <div style="margin-bottom:14px"><span class="form_txt" />
            请勾选需要打印的消息</div>
          <el-form-item prop="baseInfo">
            <el-checkbox-group v-model="signForm.baseInfo">
              <el-checkbox
                label="parentName"
                style="line-height: 16px;"
              >家长姓名</el-checkbox>
              <el-checkbox
                label="courseName"
                style="display: block;margin-left:0;line-height: 16px;"
              >课程名称</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item prop="cover">

            <el-upload
              :file-list="fileList"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :on-preview="logoPreview"
              :on-remove="logoRemove"
              list-type="picture-card"
              class="avatar_uploader"
              action="https://imgsrc.ishanshan.com/gimg/upload"
            >
              <i class="el-icon-plus" />
              <span style="color:#666">选择LOGO</span>
            </el-upload>

          </el-form-item>

          <el-form-item>
            <div class="btn_group">
              <Confirm
                :is-button="true"
                :confirm="resetSign"
                text="还原默认设置并保存"
                content="确定还原默认？"
                btn-class="btn_reset"
              />
              <el-button
                type="primary"
                @click="saveSign('signForm')"
              >
                保存
              </el-button>
            </div>
          </el-form-item>

        </el-form>

        <el-dialog
          :visible.sync="picVisible"
          width="500px"
          custom-class="print_sign_preview"
        >
          <div class="preview_dialog">
            <i
              class="el-icon-close preview_close"
              @click="closePreview"
            />
            <img
              :src="previewUrl"
              width="100%"
            >
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
// eslint-disable-next-line
import { signPrintInfo, saveSignInPrintInfo, querySignTable, setSignTable } from '@/api/orgSet/baseSet'
import Confirm from '@/components/MiniCommon/Confirm'

export default {
  components: {
    Confirm
  },
  data() {
    return {
      signForm: {
        mingtie: '2',
        baseInfo: ['courseName', 'parentName'],
        cover: 'https://img.ishanshan.com/gimg/img/cafd679bb3afeaa7f0095c96f1661afd'
      },
      nameCardArray: [], // 表单设置项
      saveSignInData: [],
      picVisible: false,
      loading: false,
      fileList: [],
      previewUrl: '', // 预览图片

      // 系统默认
      defaultForm: [
        { value: 'courseName' },
        { value: 'parentName' },
        { value: 'logo', content: 'https://img.ishanshan.com/gimg/img/cafd679bb3afeaa7f0095c96f1661afd' },
        { value: 'printType', content: '2' }
      ]
    }
  },
  mounted() {
    this.getSignInInfo()
  },
  methods: {
    getSignInInfo() {
      this.loading = true
      signPrintInfo().then(res => {
        if (res.data.errorCode === 0) {
          this.nameCardArray = res.data.nameCardArray
          this.saveSignInData = res.data.checkedConfArray
          const signForm = { baseInfo: [] }
          res.data.checkedConfArray.forEach(v => {
            if (v.value === 'logo') {
              if (v.content && v.content.length > 0) {
                this.fileList = [{ name: 'logo.jpg', url: v.content }]
                this.previewUrl = v.content
                document.querySelector('.el-upload').setAttribute('style', 'display: none')
              } else {
                document.querySelector('.el-upload').setAttribute('style', '')
              }
              signForm.cover = v.content
            } else if (v.value === 'printType') {
              signForm.mingtie = v.content
            } else if (v.value === 'courseName') {
              signForm.baseInfo.push('courseName')
            } else if (v.value === 'parentName') {
              signForm.baseInfo.push('parentName')
            }
          })
          this.signForm = signForm
          this.loading = false
        } else {
          this.$message.error(res.data.errorMessage)
          this.loading = false
        }
      })
    },

    /** 上传成功 */
    handleAvatarSuccess(res, file) {
      this.fileList = [{ name: file.name, url: res.url }]
      this.signForm.cover = res.url
      this.previewUrl = res.url
      document.querySelector('.el-upload').setAttribute('style', 'display: none')
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

    /** 图片预览 */
    logoPreview(file) {
      this.previewUrl = file.url
      this.picVisible = true
    },

    /** 关闭预览 */
    closePreview() {
      this.picVisible = false
    },

    /** 图片删除 */
    logoRemove(file, fileList) {
      this.signForm.cover = ''
      this.fileList = []
      this.previewUrl = ''
      document.querySelector('.el-upload').setAttribute('style', '')
    },

    // 还原默认设置
    resetSign() {
      const newForm = this.defaultForm.map(item => item)
      const params = {
        configArray: JSON.stringify(newForm)
      }
      saveSignInPrintInfo(params).then(res => {
        if (res.data.errorCode === 0) {
          this.$message.success('保存成功！')
          this.getSignInInfo()
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    // 确认提交
    saveSign(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const arr = []
          for (const i in this.signForm) {
            if (i === 'baseInfo') {
              this.signForm.baseInfo.forEach(item => {
                arr.push({ value: item })
              })
            } else if (i === 'mingtie') {
              arr.push({ value: 'printType', content: '2' })
            } else if (i === 'cover') {
              arr.push({ value: 'logo', content: this.signForm[i] })
            }
          }

          const newData = {
            configArray: JSON.stringify(arr)
          }

          saveSignInPrintInfo(newData).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('保存成功！')
              this.getSignInInfo()
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        } else {
          return false
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.signIn_main {
  display: flex;
}

.signIn_left {
  // background-color: aqua;
  margin-right: 90px;
}

.signIn_title {
  height: 32px;
  width: 300px;
  background: #f0f2f5;
  color: #333;
  padding-left: 20px;
  border-bottom: 1px solid #ddd;
  line-height: 32px;
}

.signIn_box {
  border: 1px solid #dddddd;
  border-radius: 5px;
  overflow: hidden;
}

.signIn_content {
  display: flex;
}

.signIn_content_right {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.signIn_right /deep/ {
  .avatar_uploader .el-upload {
    width: 90px;
    height: 90px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .avatar_uploader .el-upload-list--picture-card .el-upload-list__item {
    margin: 0 8px -8px 0;
  }
}

.null_pic {
  display: -webkit-inline-box;
  height: 90px;
  width: 90px;
  margin: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  line-height: 90px;
  text-align: -webkit-center;
}

.preview_dialog {
  width: 450px;
  position: relative;
  margin: 0 auto;
  padding-top: 5px;

  .preview_close {
    position: absolute;
    right: -14px;
    top: -7px;
    transition: transform 0.4s;

    &:hover {
      transform: rotate(360deg);
    }
  }
}

.btn_group /deep/ {
  display: flex;

  .btn_reset {
    margin-right: 10px;
  }
}
</style>

<style lang="scss">
.print_sign_preview {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 20px !important;
  }
}
</style>
