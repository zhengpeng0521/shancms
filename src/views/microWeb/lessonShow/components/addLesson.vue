<template>
  <transition name="slide-fade">
    <div
      v-show="isVisible"
      class="side-zhezhao"
    >
      <div
        v-show="isVisible"
        class="side-dialog"
      >
        <div class="top">
          <div class="top-left">
            <span>{{ addLessonDialogTitlt }}</span>
          </div>
          <div class="top-right">
            <Confirm
              :text="'关闭'"
              :placement="'top'"
              :content="'确认关闭么?'"
              :confirm="close"
              :is-button="true"
              :btn-type="'plain'"
            />
            <Confirm
              :text="'保存'"
              :placement="'top'"
              :content="'确认保存么?'"
              :confirm="()=>{submitForm('addLesson')}"
              :is-button="true"
              :btn-type="'primary'"
            />
            <!-- <el-popover
              v-model="visible2"
              placement="bottom-end"
              width="160"
              popper-class="tanchukuang"
            >
              <p><span>图标</span>确定要关闭窗口吗？</p>
              <div style="text-align: right; margin: 0;">
                <el-button
                  size="mini"
                  class="edit_btn"
                  plain
                  @click="visible2 = false"
                >取消</el-button>
                <el-button
                  type="primary"
                  class="edit_btn"
                  @click="close"
                >确定</el-button>
              </div>
              <el-button
                slot="reference"
                plain
              >关闭</el-button>
            </el-popover>
            <el-popover
              v-model="visible3"
              placement="bottom-end"
              popper-class="tanchukuang"
              width="160"
            >
              <p><span>图标</span>确定要保存吗？</p>
              <div style="text-align: right; margin: 0;">
                <el-button
                  size="mini"
                  class="edit_btn"
                  plain
                  @click="visible3 = false"
                >取消</el-button>
                <el-button
                  type="primary"
                  class="edit_btn"
                  @click="submitForm('addLesson')"
                >确定</el-button>
              </div>
              <el-button
                slot="reference"
                type="primary"
              >保存</el-button>
            </el-popover> -->
          </div>
        </div>
        <div class="body">
          <div class="body-left-box">
            <div class="body-left">
              <div class="body-left-header">
                <img
                  src="https://img.ishanshan.com/gimg/n/20190320/7520a62ea0b5b3eb8af55fefc2a8779c"
                  alt=""
                >
              </div>
              <div class="body-left-cont">
                <span style="display:inline-block;width:100%;height:150px">
                  <img
                    v-if="lessonForm.detailPic===[]"
                    src=""
                    alt=""
                  >

                  <img
                    v-else-if="lessonForm.detailPic[0]"
                    :src="lessonForm.detailPic[0].url"
                    alt=""
                  >
                </span>
                <div class="course-title">
                  <span class="tubiao" />
                  {{ lessonForm.courseName }}
                </div>
                <div class="orgDetail">
                  <div class="orgName">机构名字</div>
                  <div class="orgAdd">
                    <i class="el-icon-location" />
                    <span>地址</span>
                    <i class="el-icon-phone" />
                  </div>
                </div>
                <div class="lessonDetail">
                  <div><span class="tubiao" />课程详情</div>
                  <div class="detailCont">
                    <div class="detailCont-item">
                      <div class="detailCont-item-title">
                        <span class="dian" />
                        课程类型
                      </div>
                      <div class="detailCont-item-cont">
                        <span
                          v-for="(item,index) in typeLabel(lessonForm.courseType)"
                          :key="index"
                          style="margin:0px 2px;line-height:20px"
                        >{{ item }}</span>
                      </div>
                    </div>
                    <div class="detailCont-item">
                      <div class="detailCont-item-title">
                        <span class="dian" />
                        适和年龄
                      </div>
                      <div class="detailCont-item-cont">{{ lessonForm.adAge }}</div>
                    </div>
                    <div class="detailCont-item">
                      <div class="detailCont-item-title">
                        <span class="dian" />
                        每节时长
                      </div>
                      <div class="detailCont-item-cont">{{ lessonForm.perTime }}</div>
                    </div>
                    <!-- 循环添加详情内容 -->
                    <div
                      v-for="(data,index) in lessonForm.detailContent"
                      :key="index"
                      class="detailCont-item"
                    >
                      <div class="detailCont-item-title">
                        <span class="dian" />{{ data.title }}
                      </div>
                      <div class="detailCont-item-cont">{{ data.content[0].contentDetail }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="body-left-footer">
                <div class="yuyue">预约试听</div>
                <!-- <div class="btn">
                <i class="el-icon-arrow-left" />
                <i class="el-icon-arrow-right" />
              </div> -->
              </div>
            </div>
          </div>
          <div class="body-right">
            <div class="body-right-header">
              <span class="tubiao" />
              基本信息
            </div>
            <el-form
              ref="addLesson"
              :model="lessonForm"
              :rules="rules"
              label-width="90px"
            >
              <el-form-item
                label="课程名称:"
                prop="courseName"
              >
                <el-input
                  v-model="lessonForm.courseName"
                  clearable
                  placeholder="限20字"
                />
              </el-form-item>
              <el-form-item
                label="课程封面:"
                prop="courseCover"
              >
                <el-upload
                  :on-success="handleCourseCoverSuccess"
                  :on-preview="handleCourseCoverPreview"
                  :on-remove="handleCourseCoverRemove"
                  :before-upload="beforeAvatarUpload"
                  :file-list="courseCoverArr"
                  class="activityCover"
                  action="https://imgsrc.ishanshan.com/gimg/upload"
                  list-type="picture-card"
                >
                  <i class="el-icon-plus" />
                  <span>选择图片</span>
                </el-upload>
                <el-dialog
                  :visible.sync="courseCoverDialogVisible"
                  :append-to-body="true"
                  custom-class="previewImg"
                >
                  <div style="width:100%;height:100%;text-align:center">
                    <img
                      :src="previewImg"
                      style="width:560px;height:360px"
                      alt=""
                    >
                  </div>
                </el-dialog>
                <p class="tips">课程首图, 支持png、jpeg、gif格式的图片, 建议宽高 350*350px; 图片大小小于2M</p>
              </el-form-item>
              <el-form-item
                label="详情图片:"
                prop="detailPic"
              >
                <el-upload
                  :on-preview="handlePreview"
                  :on-success="handleBannerSuccess"
                  :on-remove="handleBannerRemove"
                  :before-upload="beforeAvatarUpload"
                  :file-list="detailPicArr"
                  class="banner"
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
                      style="width:560px;height:360px"
                      alt=""
                    >
                  </div>
                </el-dialog>
                <p class="tips">课程详情图, 最多5张; 支持png、jpeg、gif格式的图片, 建议宽高 750*400px; 图片大小小于2M</p>
              </el-form-item>
              <el-form-item prop="sort">
                <label slot="label">
                  <span>
                    <el-tooltip
                      effect="dark"
                      content="排序值越大排在越前面"
                      placement="top"
                      popper-class="sortTip"
                    >
                      <i
                        class="el-icon-warning"
                        style="margin-right:2px"
                      />
                    </el-tooltip>
                    排序值
                  </span>
                </label>
                <el-input
                  v-model="lessonForm.sort"
                  clearable
                  placeholder="0-9999"
                />
              </el-form-item>
              <div class="body-right-foot">
                <span class="tubiao" />
                课程详情
              </div>
              <el-form-item
                label="课程类型:"
                prop="courseType"
              >
                <el-checkbox-group v-model="lessonForm.courseType">
                  <!-- <span
                    v-for="(item,index) in lessonArr"
                    :key="index"
                  > -->
                  <el-checkbox
                    v-for="(item,index) in lessonArr"
                    :label="item.label"
                    :key="index"
                    name="type"
                  >{{ item.value }}</el-checkbox>
                  <!-- </span> -->
                </el-checkbox-group>
              </el-form-item>
              <el-form-item
                label="适合年龄:"
                prop="adAge"
              >
                <el-input
                  v-model="lessonForm.adAge"
                  clearable
                  placeholder="限20字"
                />
              </el-form-item>
              <el-form-item
                label="每节时长:"
                prop="perTime"
              >
                <el-input
                  v-model="lessonForm.perTime"
                  clearable
                  placeholder="限20字"
                />
              </el-form-item>
              <el-form-item
                label="详情内容:"
                prop="detailContent"
              >
                <div
                  v-for="(itm,index) in lessonForm.detailContent"
                  :key="index"
                  class="box-container"
                >
                  <div class="box">
                    <el-form-item
                      :prop="'detailContent.' + index + '.title'"
                      label="标题"
                    >
                      <el-input
                        v-model="itm.title"
                        :rules="[
                          { max:15, message: '不能超过15个字符', trigger: 'blur'}
                        ]"
                        clearable
                        placeholder="限15字"
                      />
                    </el-form-item>
                    <el-form-item
                      :prop="'detailContent.' + index + '.content'"
                      label="内容"
                    >
                      <el-input
                        v-model="itm.content[0].contentDetail"
                        :rules="[
                          { max:500, message: '请输入内容，不能超过500个字符', trigger: 'blur'}
                        ]"
                        type="textarea"
                        placeholder="限500字"
                      />
                    </el-form-item>
                  </div>
                  <i
                    class="el-icon-remove-outline delete_icon"
                    @click="deleteDetailCont(index)"
                  />

                </div>

                <el-button
                  plain
                  style="margin-top:10px"
                  class="add_btn"
                  @click="addDetailCont"
                >添加详情</el-button>

              </el-form-item>
            </el-form>

          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { createCourse } from '@/api/microWeb/lessonShow.js'
import Confirm from '@/components/MiniCommon/Confirm'
export default {
  components: {
    Confirm
  },
  props: {
    'visible': {
      type: Boolean,
      default: true
    },
    'id': {
      type: String,
      default: undefined
    }
  },
  data() {
    var validatePass1 = (rule, value, callback) => {
      var Expression = /^\+?[0-9]\d{0,3}(\.\d*)?$/
      if (Expression.test(value) === true) {
        callback()
      } else {
        callback('排序值只能设置0~9999中某个数字，数字大的排在前面')
      }
    }
    return {
      visible2: false,
      visible3: false,
      isVisible: this.visible,
      address: 'https://img.ishanshan.com/gimg/n/20190116/e8a4dcec601a9f23ef2c97826cee671a',
      // 表格参数
      addLessonDialogTitlt: '新建课程',
      lessonForm: {
        courseName: '',
        courseCover: [],
        detailPic: [],
        sort: 1000,
        courseType: [],
        adAge: '',
        perTime: '',
        detailContent: [{ title: '', content: [{ contentDetail: '' }] }]
      },
      lessonArr: [{ label: '1100', value: '启蒙类' }, { label: '1200', value: '创意类' }, { label: '1300', value: '益智类' }, { label: '1400', value: '情商类' }, { label: '1500', value: '运动类' }, { label: '1600', value: '才艺类' }, { label: '1700', value: '语言类' }, { label: '1800', value: '父母教育' }, { label: '1900', value: '托班' },
        { label: '1501', value: '体能' }, { label: '1502', value: '游泳' }, { label: '1503', value: '球类运动' }, { label: '1504', value: '跆拳道' },
        { label: '1601', value: '音乐' }, { label: '1602', value: '美术' }, { label: '1603', value: '乐器' }, { label: '1604', value: '手工' }, { label: '1605', value: '舞蹈' }, { label: '1606', value: '书法' }, { label: '1607', value: '棋艺' },
        { label: '1701', value: '英语' }, { label: '1702', value: '日语' }, { label: '1703', value: '韩语' }, { label: '1704', value: '西班牙语' }, { label: '1705', value: '其他语种' },
        { label: '2100', value: '语数外' }, { label: '2000', value: '中小学教辅' }],
      courseCoverDialogVisible: false,
      courseCoverArr: [],
      detailPicArr: [],
      previewImg: '',
      dialogVisible: false,
      limit: 1,
      rules: {
        courseName: [{ max: 20, message: '不能超过20字', trigger: 'blur' },
          { required: true, message: '请填写内容', trigger: 'change' }],
        courseCover: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ],
        detailPic: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ],
        sort: [
          { validator: validatePass1, trigger: 'blur' }
        ],
        courseType: [{ required: true, message: '请选择类型', trigger: 'change' }],
        adAge: [{ max: 20, message: '不能超过20字', trigger: 'blur' },
          { required: true, message: '请填写适合年龄,限20字', trigger: 'change' }],
        perTime: [{ max: 20, message: '不能超过20字', trigger: 'blur' },
          { required: true, message: '请填写内容,限20字', trigger: 'change' }],
        detailContent: [{ required: true, message: '请填写内容', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'visible'(val) {
      this.isVisible = val
      // console.log(val)
    },
    'isVisible'(val) {
      this.$emit('update:visible', val)
    },
    detailPicArr(prop) {
      const uploadBox = document.querySelector('.banner .el-upload--picture-card')
      if (this.detailPicArr.length > 4) {
        uploadBox.style.display = 'none'
      } else if (this.detailPicArr.length <= 4) {
        uploadBox.style.display = 'inline-block'
      }
    },
    courseCoverArr() {
      const activityCoverBox = document.querySelector('.activityCover .el-upload--picture-card')
      if (this.courseCoverArr && this.courseCoverArr.length > 0) {
        activityCoverBox.style.display = 'none'
      } else {
        activityCoverBox.style.display = 'inline-block'
      }
    }
  },
  mounted() {
    // console.log(this.editObj,'editObj')
  },
  methods: {
    typeLabel(values) {
      const labels = []
      this.lessonArr.forEach(item => {
        const index = values.indexOf(item.label)
        if (index > -1) {
          labels.push(item.value)
        }
      })
      return labels
    },
    close() {
      this.$refs.addLesson.resetFields()
      this.courseCoverArr = []
      this.lessonForm.courseCover = []
      this.lessonForm.detailPic = []
      this.detailPicArr = []
      this.detailContent = [{ title: '', content: [{ contentDetail: '' }] }]
      this.isVisible = false
      this.visible2 = false
      this.visible3 = false
      // console.log('1111')
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      console.log('formName', this.lessonForm.courseType)
      this.$refs.addLesson.validate((valid, obj) => {
        this.visible3 = false
        console.log(valid, obj)
        if (valid) {
          console.log(this.lessonForm, 'lessonForm')
          var courseCoverStr = ''
          var detailPicStr = ''
          var courseTypeStr = ''
          this.lessonForm.courseCover.map((val) => {
            courseCoverStr = val.url
          })
          this.lessonForm.detailPic.map((val, index) => {
            detailPicStr += val.url
            if (index < this.lessonForm.detailPic.length - 1) {
              detailPicStr += ','
            }
          })
          this.lessonForm.courseType.map((val, index) => {
            courseTypeStr += val
            if (index < this.lessonForm.courseType.length - 1) {
              courseTypeStr += ','
            }
          })
          const params = { ...this.lessonForm }
          params.detailPic = detailPicStr
          params.courseCover = courseCoverStr
          params.courseType = courseTypeStr
          params.status = '1'
          // params.sort = params.sort === '' ? '1000' : params.sort
          params.id = this.id === '' ? 0 : this.id
          const res = []
          this.lessonForm.detailContent.forEach(val => {
            const obj = Object.assign({}, val)
            res.push(obj)
          })
          params.detailContent = JSON.stringify(res)
          // this.lessonForm.detailContent = JSON.parse(this.lessonForm.detailContent)
          console.log(res, this.lessonForm)
          const loading = this.$loading({
            lock: true,
            text: '拼命加载中。。。',
            spinner: 'el-icon-loading',
            fullscreen: true,
            // background: 'rgba(0, 0, 0, 0.7)',
            target: document.querySelector('.side-dialog')
          })
          createCourse(params).then(res => {
            if (res.data.errorCode === 0) {
              loading.close()
              this.isVisible = false
              this.$parent.resetFieldHanle()
              this.$refs[formName].resetFields()
              this.courseCoverArr = []
              this.lessonForm.courseCover = []
              this.lessonForm.detailPic = []
              this.detailPicArr = []
              this.detailContent = [{ title: '', content: [{ contentDetail: '' }] }]
            } else {
              this.$message.error(res.errorMessage)
            }
          })
        }
      })
    },
    // 上传图片
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!')
      }
      return isLt2M
    },

    // 活动封面
    handleCourseCoverPreview(file) {
      this.previewImg = file.url
      this.courseCoverDialogVisible = true
    },
    handleCourseCoverSuccess(res, file, fileList) {
      this.courseCoverArr.push({ name: file.name, url: res.url })
      this.lessonForm.courseCover.push({ name: file.name, url: res.url })
      if (res.url !== '') {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      } else {
        this.$message.error('上传失败')
      }
    },
    handleCourseCoverRemove(file, fileList) {
      // console.log(file, fileList, this.lessonForm.shareCover)
      this.lessonForm.courseCover = []
      this.courseCoverArr.map((val, index) => {
        if (val.uid === file.uid) {
          this.courseCoverArr.splice(index, 1)
        }
      })
    },
    // banner上传成功函数
    handleBannerSuccess(res, file, fileList) {
      // console.log(file, fileList)
      this.lessonForm.detailPic.push({ name: file.name, url: res.url })
      this.detailPicArr.push({ name: file.name, url: res.url })
      if (res.url !== '') {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      } else {
        this.$message.error('上传失败')
      }
    },
    handleBannerRemove(file, fileList) {
      this.lessonForm.detailPic = []
      this.detailPicArr.map((val, index) => {
        if (val.uid === file.uid) {
          this.detailPicArr.splice(index, 1)
        }
      })
    },
    handlePreview(file, fileList) {
      this.previewImg = file.url
      this.dialogVisible = true
    },
    // 删除详情
    deleteDetailCont(val) {
      console.log('index', val)
      const addBtn = document.querySelector('.add_btn')
      addBtn.style.display = 'block'
      if (val === 0) {
        const deleBtn = document.querySelector('.delete_icon')
        deleBtn.style.display = 'none'
        // alert('教师消息至少保留一条')
      } else {
        this.lessonForm.detailContent.splice(val, 1)
      }
    },
    // 添加详情
    addDetailCont() {
      const addBtn = document.querySelector('.add_btn')
      const deleBtnArr = document.querySelectorAll('.delete_icon')
      // deleBtnArr.map((val) => {
      deleBtnArr[0].style.display = 'inline-block'
      // })
      console.log(this.lessonForm.detailContent.length, '----------', deleBtnArr)
      if (this.lessonForm.detailContent.length > 9) {
        addBtn.style.display = 'none'
      } else {
        addBtn.style.display = 'block'
        const data = {
          title: '', content: [{ contentDetail: '' }]
        }
        this.lessonForm.detailContent.push(data)
      }
      // if (this.lessonForm.detailContent.length < 10) {
      //   const data = {
      //     title: '', content: [{ contentDetail: '' }]
      //   }
      //   this.lessonForm.detailContent.push(data)
      // }
    }
  }
}
</script>
<style lang="scss" scoped>
.side-zhezhao {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0px;
  right: 0px;
  z-index: 2000;
}

.side-dialog {
  top: 0px;
  right: 0px;
  z-index: 1000;
  width: calc(100% - 150px);
  position: fixed;
  // margin-left: -20px;
  height: 100%;
  background-color: rgba(255, 255, 255, 1);
  -moz-box-shadow: 2px 2px 5px #333333;
  -webkit-box-shadow: 2px 2px 5px #333333;
  box-shadow: 2px 2px 5px #333333;
  // padding: 0 20px;
  // overflow-x: hidden;
  // overflow-y: auto;
  .top {
    // width: calc(100vw - 180px) !important;
    min-height: 40px;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    // padding: 20px 0 14px 0;
    padding: 20px;
    .top-left {
      display: flex;
      font-size: 16px;
      // margin-top: 10px;
    }
    .top-right {
      display: flex;
      .el-button {
        margin-left: 10px;
        // margin-bottom: 10px;
      }
    }
  }
  .body {
    display: flex;
    padding-top: 20px;
    height: calc(100vh - 100px);
    overflow-y: auto;
    .body-left-box {
      // min-height: calc(100vh - 83px);
      height: calc(100vh - 83px);
      width: 460px;
      padding: 0 30px;
      padding-top: 30px;
      background: rgba(240, 242, 245, 0.8);
      margin-left: 20px;
      overflow-y: auto;
    }
    .body-left {
      width: 100%;
      // border: 1px solid #000;
      position: relative;
      .body-left-header {
        width: 100%;
        height: 64px;
        display: flex;
        flex-direction: column;
        img {
          width: 100%;
        }
      }
      .body-left-cont {
        background: rgb(240, 241, 243);
        height: 662px;
        // overflow-x: hidden;
        // overflow-y: auto;

        img {
          width: 100%;
          height: 150px;
        }
        .tubiao {
          display: inline-block;
          width: 10px;
          height: 18px;
          background: #3b72b7;
          margin-right: 3px;
          // margin-top: 5px;
        }
        .course-title {
          // display: flex;
          // flex-wrap: wrap;
          min-height: 30px;
          line-height: 20px;
          font-size: 16px;
          // margin-top: 5px;
          padding-bottom: 5px;
          word-break: break-all;
          background: #fff;
        }
        .orgDetail {
          background: #fff;
          margin-top: 10px;
          padding: 0 15px;
          .orgName {
            height: 35px;
            line-height: 35px;
            border-bottom: 1px solid #ddd;
          }
          .orgAdd {
            height: 35px;
            line-height: 35px;
            .el-icon-location {
              color: #e5466f;
              font-size: 24px;
              // display: inline-block;
              // margin-right: 5px;
              vertical-align: middle;
            }
            .el-icon-phone {
              font-size: 24px;
              color: #3b72b7;
              text-align: center;
              vertical-align: middle;
              display: inline-block;
              width: 15%;
            }
            span {
              display: inline-block;
              width: 70%;
              border-right: 1px solid #ddd;
              height: 24px;
              line-height: 24px;
            }
          }
        }
        .lessonDetail {
          background: #fff;
          margin-top: 10px;
          padding: 5px 0;
          .detailCont {
            padding: 0 15px;
            .detailCont-item {
              margin-top: 10px;
              font-size: 14px;
              .detailCont-item-title {
                .dian {
                  border-radius: 50%;
                  background: #3b72b7;
                  // content: "";
                  display: inline-block;
                  height: 7px;
                  margin-right: 7px;
                  width: 7px;
                }
              }
              .detailCont-item-cont {
                font-size: 12px;
                margin-top: 3px;
                margin-left: 14px;
              }
            }
          }
        }
      }
      .body-left-footer {
        width: 100%;
        .yuyue {
          width: 100%;
          position: absolute;
          left: 0;
          bottom: 0;
          height: 50px;
          text-align: center;
          line-height: 50px;
          color: #fff;
          background: rgb(59, 113, 183);
        }
        .btn {
          height: 50px;
          line-height: 50px;
          margin-left: 100px;
          i {
            display: inline-block;
            width: 80px;
            color: #ccc;
            font-size: 20px;
          }
          .el-icon-arrow-left {
            color: #000;
          }
        }
      }
    }
    .body-right {
      // height: 756px;
      // min-height: calc(100vh - 83px);
      height: calc(100vh - 83px);
      width: 640px;
      // background: rgb(242, 242, 242);
      margin-left: 20px;
      overflow: auto;
      padding-right: 20px;
      // padding-top: 20px;
      .tubiao {
        display: inline-block;
        vertical-align: middle;
        width: 14px;
        height: 20px;
        background: rgba(70, 182, 238, 1);
        border-radius: 3px;
        margin: 20px 10px 20px 20px;
      }
      .body-right-header {
        font-size: 14px;
      }
      .el-form-item__content .el-checkbox {
        margin-left: 0px !important;
        width: 100px;
      }
      .box-container {
        margin-top: 10px;
        display: flex;
        align-items: center;
        .el-icon-remove-outline {
          margin-left: 10px;
          font-size: 20px;
          color: #ccc;
          cursor: pointer;
        }
      }
      .box {
        width: 500px;
        border: 1px solid #ddd;
        padding: 20px 20px 20px 0px;
      }
      .tips {
        font-size: 12px;
        color: #999;
        line-height: 20px;
        margin-top: 6px;
      }
    }
  }
}

.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.5s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(1000px);
  opacity: 0;
}
.picDetail-container {
  // width: 100vw;
  // height: 100vh;
  // background: rgba(0, 0, 0, 0.5);
  // z-index: 10000;
  // position: fixed;
  // top: 0;
  // left: 0;

  // @keyframes enterAnamation {
  // 10% {
  // right: -100%;
  // }
  // 100% {
  // right: 0;
  // }
  // }
  // // .picDetailShow {
  // // animation: enterAnamation 1s linear;
  // // }
  // .picDetail {
  // animation: enterAnamation 1s linear;
  // }
}
</style>
<style lang="scss">
.tanchukuang {
  z-index: 20000 !important;

  p {
    font-size: 12px;
    color: #666;
  }
  .sortTip {
    z-index: 200001 !important;
  }
}
.previewImg {
  width: 600px;
  .el-dialog__body {
    padding: 20px 20px !important;
  }
  .el-dialog__header {
    padding-bottom: 37px;
  }
}
</style>

