<template>
  <div class="addRotationBox">
    <el-dialog
      :visible.sync="marketActivityDialogShow"
      :title="marketActivityDialogtitle"
      :append-to-body="true"
      custom-class="addRotain"
      @close="cancelDialog('productFormAddRo')"
    >
      <el-form
        ref="productFormAddRo"
        :model="productData"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item
          label="名称:"
          prop="title"
          checked
        >
          <el-input
            v-model="productData.title"
            clearable
            placeholder="请填写名称"
          />
        </el-form-item>
        <el-form-item
          label="活动封面:"
          prop="picUrl"
        >
          <el-upload
            :on-success="handleSuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
            :file-list="picUrlArr"
            class="activityCover"
            action="https://imgsrc.ishanshan.com/gimg/upload"
            list-type="picture-card"
          >
            <i class="el-icon-plus" />
            <span>选择图片</span>
          </el-upload>
          <el-dialog
            :visible.sync="dialogVisible"
            :append-to-body="true"
            custom-class="previewImg"
          >
            <div style="width:100%;height:100%;text-align:center">
              <img
                :src="previewImg"
                width="560px"
                alt=""
              >
            </div>
          </el-dialog>
          <p class="tips">支持png、jpeg、gif格式的图片, 建议宽高 350*350px; 图片大小小于2M</p>
        </el-form-item>
        <el-form-item
          label="排序值:"
          prop="sort"
          checked
        >
          <el-input
            v-model="productData.sort"
            clearable
            placeholder="请填写排序值"
          />
          <p class="tips">设置0~9999中某个数字，数字大的排在前面，不填则默认为0</p>
        </el-form-item>
        <el-form-item
          label="外链方式:"
          prop="formExteralLink"
          checked
        >
          <el-select
            v-model="productData.formExteralLink"
            placeholder="请选择外链方式"
            clearable
            style="width:100%"
          >
            <el-option
              v-for="item in formExteralLinks"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <transition-group name="el-zoom-in-top">
          <el-form-item
            v-if="productData.formExteralLink === '2'"
            key="activity"
            label="选择活动:"
            prop="activity"
          >
            <el-select
              v-model="productData.activity"
              placeholder="请选择活动"
              clearable
              style="width:100%"
            >
              <el-option
                v-for="item in activitys"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="productData.formExteralLink === '3'"
            key="lesson"
            label="选择课程:"
            prop="lesson"
          >
            <el-select
              v-model="productData.lesson"
              placeholder="请选择课程"
              clearable
              style="width:100%"
            >
              <el-option
                v-for="item in lessons"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="productData.formExteralLink === '1'"
            key="formExteralLinkAdress"
            label="外链地址:"
            prop="formExteralLinkAdress"
            checked
          >
            <el-input
              v-model="productData.formExteralLinkAdress"
              clearable
              placeholder="请填写外链地址（请以http://或https://开头）"
            />
          </el-form-item>

        </transition-group>

      </el-form>
      <div
        slot="footer"
        class="footer"
      >
        <el-button @click="cancelDialog('productFormAddRo')">取消</el-button>
        <el-button
          type="primary"
          @click="submitForm('productFormAddRo')"
        >保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { queryCourseList, getActivityList, createBanner, queryOrgBanner } from '@/api/microWeb/rotation.js'
export default {
  // props: {
  //   creatMarketActivity: {
  //     type: Object,
  //     default: () => []
  //   }
  // },
  props: {
    'visible': {
      type: Boolean,
      default: true
    }
  },
  data() {
    // console.log(this.picUrlArr, '1111111111', this.marketActivityDialogShow)
    var validatePass2 = (rule, value, callback) => {
      var Expression = /(http|https):\/\/([\w.]+\/?)\S*/
      if (Expression.test(value) === true) {
        callback()
      } else {
        callback('请填写外链地址（请以http://或https://开头）')
      }
    }
    // var validatePass1 = (rule, value, callback) => {
    //   var Expression = /^\+?[0-9]\d{0,3}(\.\d*)?$/
    //   if (Expression.test(value) === true) {
    //     callback()
    //   } else {
    //     callback('排序值只能设置0~9999中某个数字，数字大的排在前面')
    //   }
    // }
    return {
      id: 0,
      length: 0,
      marketActivityDialogShow: false,
      marketActivityDialogtitle: '新增轮播图',
      picUrlArr: [],
      productData: {
        title: '',
        picUrl: [],
        sort: 0,
        formExteralLink: '',
        formExteralLinkAdress: '',
        activity: '',
        lesson: ''
      },
      formExteralLinks: [{ value: '0', label: '无' }, { value: '1', label: '自定义' }, { value: '2', label: '活动' }, { value: '3', label: '课程' }],
      activitys: [{
        value: 'yizhi',
        label: '一致'
      }],
      lessons: [{
        value: 'yizhi',
        label: '一致'
      }],
      dialogVisible: false,
      previewImg: '',

      rules: {
        title: [{ max: 30, required: true, message: '不能超过30字', trigger: 'change' }],
        picUrl: [
          { required: true, message: '支持png、jpeg、gif格式的图片，建议宽高 750*400px，图片大小不大于2M！', trigger: 'blur' }
        ],
        formExteralLink: [
          { required: true, message: '请选择外链方式', trigger: 'change' }
        ],
        formExteralLinkAdress: [
          { required: true, message: '请填写外链地址', trigger: 'change' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        // sort: [
        //   { validator: validatePass1, trigger: 'blur' }
        // ],
        activity: [
          { required: true, message: '请选择活动', trigger: 'biur' }
        ],
        lesson: [
          { required: true, message: '请选择课程', trigger: 'blur' }
        ]
      }

    }
  },
  watch: {
    picUrlArr(prop) {
      this.$nextTick(() => {
        const uploadBox = document.querySelector('.activityCover .el-upload--picture-card')
        console.log('upload去掉', uploadBox)
        if (this.picUrlArr && this.picUrlArr.length > 0) {
          uploadBox.style.display = 'none'
        } else {
          uploadBox.style.display = 'inline-block'
        }
      })
    }
  },
  // created() {
  //   queryOrgBanner().then(res => {
  //     if (res.data.errorCode === 0) {
  //       this.length = res.data.results.length
  //     } else {
  //       this.$message.error(res.errorMessage)
  //     }
  //   })
  // },
  mounted() {
    // console.log(this.picUrlArr, '1111111111', this.marketActivityDialogShow)
    queryOrgBanner().then(res => {
      if (res.data.errorCode === 0) {
        this.length = res.data.results.length
      } else {
        this.$message.error(res.errorMessage)
      }
    })
    const loading = this.$loading({
      lock: true,
      text: '拼命加载中',
      // spinner: 'el-icon-loading',
      fullscreen: false,
      // background: 'rgba(0, 0, 0, 0.7)',
      target: document.querySelector('.addRotationBox')
    })
    queryCourseList({ status: 1 }).then(res => {
      if (res.data.errorCode === 0) {
        const arr = []
        res.data.results.map((val) => {
          arr.push({ label: val.name, value: val.id })
        })
        this.lessons = arr
      } else {
        this.$message.error(res.errorMessage)
      }
      loading.close()
    })
    const loading1 = this.$loading({
      lock: true,
      text: '拼命加载中。。。',
      // spinner: 'el-icon-loading',
      fullscreen: false,
      // background: 'rgba(0, 0, 0, 0.7)',
      target: document.querySelector('.addRotationBox')
    })
    getActivityList({ status: 1 }).then(res => {
      if (res.data.errorCode === 0) {
        const arr = []
        res.data.results.map((val) => {
          arr.push({ label: val.name, value: val.id })
        })
        this.activitys = arr
      } else {
        this.$message.error(res.errorMessage)
      }
      loading1.close()
    })
  },
  methods: {
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    /* 显示弹框 */
    showDialog(rowlist) {
      if (rowlist == 'add') { //eslint-disable-line
        // console.info(this.$refs, '111')
        this.marketActivityDialogtitle = '新增轮播图'
        this.productData = {
          title: '',
          picUrl: [],
          sort: 0,
          formExteralLink: '',
          formExteralLinkAdress: '',
          activity: '',
          lesson: ''
        }
        this.marketActivityDialogShow = !this.marketActivityDialogShow
      } else {
        console.log('rowlist----->', rowlist)
        this.$nextTick(() => {
          this.id = rowlist.id
          this.marketActivityDialogtitle = '编辑轮播图'
          const obj = JSON.parse(rowlist.uri)
          // this.productData.title = rowlist.title
          this.picUrlArr = [{ url: rowlist.picUrl }]
          this.productData.picUrl = [{ url: rowlist.picUrl }]
          this.productData.formExteralLink = obj.type
          if (obj.type === '1') {
            this.productData.formExteralLinkAdress = obj.uri
            // `http://www.ishanshan.com/wx/h5/weixin/webSite?router=microCourseDetail&tenantId=${rowlist.tenantId}&orgId=${rowlist.orgId}&actId=${rowlist.id}`
          } else if (obj.type === '2') {
            this.productData.activity = obj.uri
            //  `http://www.ishanshan.com/wx/h5/weixin/webSite?router=microActivityDetail&tenantId=${rowlist.tenantId}&orgId=${rowlist.orgId}&actId=${rowlist.id}`
          } else if (obj.type === '3') {
            this.productData.lesson = obj.uri
          }
          this.productData.title = rowlist.title
          this.productData.sort = rowlist.sort
        })

        this.marketActivityDialogShow = !this.marketActivityDialogShow
      }
    },
    /* 关闭弹框 */
    /* 商品弹框关闭 */
    cancelDialog(formName) {
      console.log(formName, 'formName')
      this.$refs[formName].resetFields()
      this.marketActivityDialogShow = false
      this.productData.picUrl = []
      this.picUrlArr = []
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      console.log(this.productData, '111')
      this.$refs[formName].validate(valid => {
        if (/^\+?[0-9]\d{0,3}(\.\d*)?$/.test(this.productData.sort) === false) {
          this.$message.error('排序值只能设置0~9999中某个数字，数字大的排在前面')
        } else if (valid) {
          // console.log(this.productData, 'productData')
          var addUrl = ''
          if (this.productData.formExteralLink === '2') {
            addUrl = this.productData.activity
          } else if (this.productData.formExteralLink === '3') {
            addUrl = this.productData.lesson
          } else if (this.productData.formExteralLink === '1') {
            addUrl = this.productData.formExteralLinkAdress
          }
          const uri = JSON.stringify({ 'type': this.productData.formExteralLink, 'uri': addUrl })
          const picAdress = this.productData.picUrl[0].url
          const params = {
            id: this.id,
            title: this.productData.title,
            sort: this.productData.sort,
            picUrl: picAdress,
            uri: uri
          }
          const loading = this.$loading({
            lock: true,
            text: '拼命加载中',
            // spinner: 'el-icon-loading',
            fullscreen: false,
            // background: 'rgba(0, 0, 0, 0.7)',
            target: document.querySelector('.addRotationBox')
          })
          createBanner(params).then(res => {
            if (res.data.errorCode === 0) {
              this.marketActivityDialogShow = false
              this.$parent.resetFieldHanle()
              // this.$refs[formName].resetFields()
            } else {
              this.$message.error(res.errorMessage)
            }
            loading.close()
          })
        }
      })
    },
    handleSuccess(res, file, fileList) {
      this.picUrlArr.push({ name: file.name, url: res.url })
      this.productData.picUrl.push({ name: file.name, url: res.url })
      if (res.url !== '') {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      } else {
        this.$message.error('上传失败')
      }
    },
    // 上传图片删除
    handleRemove(file, fileList) {
      this.productData.picUrl = []
      this.picUrlArr.map((val, index) => {
        if (val.uid === file.uid) {
          this.picUrlArr.splice(index, 1)
        }
      })
    },
    // 预览
    handlePreview(file) {
      console.log(file, 'file')
      this.previewImg = file.url
      this.dialogVisible = true
    }
  }

}
</script>
<style lang="scss" scoped>
.addRotationBox .footer {
  display: flex;
  justify-content: flex-end;
}
.tips {
  margin-top: 0px;
  margin-bottom: 0px;
  color: #999;
  font-size: 12px;
  line-height: 20px;
}
</style>

<style lang="scss" >
.addRotain {
  .el-dialog__body {
    overflow-y: auto;
  }
}
.previewImg {
  width: 600px;
  .el-dialog__body {
    padding: 20px !important;
  }
}
</style>

