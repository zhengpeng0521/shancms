<template>
  <div class="baseSeting-container">
    <div class="body-right-header">
      <span class="tubiao" />
      基本信息
    </div>
    <el-form
      ref="lessonForm"
      :model="lessonForm"
      :rules="rules"
      label-width="90px"
    >
      <el-form-item
        label="课程名称:"
        prop="lessonTitle"
        checked
      >
        <el-input
          v-model="lessonForm.lessonTitle"
          clearable
          placeholder="限20字"
        />
      </el-form-item>
      <el-form-item
        label="课程封面:"
        prop="formPic"
        checked
      >
        <el-upload
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :limit="limit"
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
        >
          <i class="el-icon-plus" />
          <span>选择图片</span>
        </el-upload>
        <!-- <el-dialog :visible.sync="dialogVisible">
                  <img
                    :src="lessonForm.dialogImageUrl"
                    width="90px"
                    height="90px"
                    alt=""
                  >
                </el-dialog> -->
        <p>课程首图, 支持png、jpeg、gif格式的图片, 建议宽高 350*350px; 图片大小小于2M</p>
      </el-form-item>
      <el-form-item
        label="详情图片:"
        prop="picDetail"
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
            :src="lessonForm.dialogImageUrl"
            width="90px"
            height="90px"
            alt=""
          >
        </el-dialog>
        <p>课程详情图, 最多5张; 支持png、jpeg、gif格式的图片, 建议宽高 750*400px; 图片大小小于2M</p>
      </el-form-item>
      <el-form-item
        prop="sort"
        checked
      >
        <template slot="label">
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
        </template>
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
        prop="lessonType"
        checked
      >
        <el-checkbox-group v-model="lessonForm.lessonTypeArray">
          <el-checkbox label="启蒙类">启蒙类</el-checkbox>
          <el-checkbox label="创意类">创意类</el-checkbox>
          <el-checkbox label="益智类">益智类</el-checkbox>
          <el-checkbox label="情商类">情商类</el-checkbox>
          <el-checkbox label="运动类">运动类</el-checkbox>
          <el-checkbox label="才艺类">才艺类</el-checkbox>
          <el-checkbox label="语言类">语言类</el-checkbox>
          <el-checkbox label="父母教育">父母教育</el-checkbox>
          <el-checkbox label="托班">托班</el-checkbox>
          <el-checkbox label="体能">体能</el-checkbox>
          <el-checkbox label="游泳">游泳</el-checkbox>
          <el-checkbox label="球类运动">球类运动</el-checkbox>
          <el-checkbox label="跆拳道">跆拳道</el-checkbox>
          <el-checkbox label="音乐">音乐</el-checkbox>
          <el-checkbox label="美术">美术</el-checkbox>
          <el-checkbox label="乐器">乐器</el-checkbox>
          <el-checkbox label="手工">手工</el-checkbox>
          <el-checkbox label="舞蹈">舞蹈</el-checkbox>
          <el-checkbox label="书法">书法</el-checkbox>
          <el-checkbox label="棋艺">棋艺</el-checkbox>
          <el-checkbox label="英语">英语</el-checkbox>
          <el-checkbox label="日语">日语</el-checkbox>
          <el-checkbox label="韩语">韩语</el-checkbox>
          <el-checkbox label="西班牙语">西班牙语</el-checkbox>
          <el-checkbox label="其他语种">其他语种</el-checkbox>
          <el-checkbox label="语数外">语数外</el-checkbox>
          <el-checkbox label="中小学教辅">中小学教辅</el-checkbox>
          <el-checkbox label="编程">编程</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="适合年龄:"
        prop="age"
        checked
      >
        <el-input
          v-model="lessonForm.age"
          clearable
          placeholder="限20字"
        />
      </el-form-item>
      <el-form-item
        label="每节时长:"
        prop="time"
        checked
      >
        <el-input
          v-model="lessonForm.time"
          clearable
          placeholder="限20字"
        />
      </el-form-item>
      <el-form-item
        label="详情内容:"
        prop="detailCont"
        checked
      >
        <div
          v-for="(itm,index) in lessonForm.detailCont"
          :key="index"
          class="box-container"
        >
          <div class="box">
            <el-form-item
              :prop="'detailCont.' + index + '.title'"
              :rules="[{ required: true, message: '请填写内容', trigger: 'change' },
                       { max:15, message: '最多可输入15字', trigger: 'blur' }]"
              label="标题"
              checked
            >
              <el-input
                v-model="itm.title"
                clearable
                placeholder="限15字"
              />
            </el-form-item>
            <el-form-item
              :prop="'detailCont.' + index + '.cont'"
              :rules="[{ max: 500, message: '最多可输入500字', trigger: 'blur' },
                       { required: true, message: '请填写内容', trigger: 'change' }]"
              label="内容"
            >
              <el-input
                v-model="itm.cont"
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
    <button @click="pay">不明白</button>
  </div>
</template>
<script>
export default {
  // props: {
  //   // 'visible': {
  //   //   type: Boolean,
  //   //   default: true
  //   // },
  //   'lessonForm': {
  //     type: Array,
  //     default: () => []
  //   }
  // },
  data() {
    var sortTest = (rule, value, callback) => {
      var Expression = /^\+?[1-9]\d{0,3}(\.\d*)?$/
      if (!Expression.test(value)) {
        callback('请输入数字')
        // callback(value)
      }
    }
    return {
      visible2: false,
      visible3: false,
      isVisible: this.visible,
      radioTabs: '基础设置',
      address: 'https://img.ishanshan.com/gimg/n/20190116/e8a4dcec601a9f23ef2c97826cee671a',
      // 表格参数
      // addLessonDialogTitlt: '新建课程',
      lessonForm: {
        lessonTitle: '',
        // formPic: '',
        dialogImageUrl: '',
        sort: '',
        lessonType: '',
        lessonTypeArray: [],
        age: '',
        time: '',
        detailCont: [{ title: '', cont: '' }]
        // title: '',
        // cont: ''
      },
      dialogImageUrl: '',
      dialogVisible: false,
      limit: 1,
      rules: {
        lessonTitle: [{ max: 20, message: '不能超过20字', trigger: 'blur' },
          { required: true, message: '请填写内容', trigger: 'change' }],
        formPic: [
          { required: true, message: '支持png、jpeg、gif格式的图片，建议宽高 750*400px，图片大小不大于2M！', trigger: 'change' }
        ],
        picDetail: [
          { required: true, message: '支持png、jpeg、gif格式的图片，建议宽高 750*400px，图片大小不大于2M！', trigger: 'change' }
        ],
        sort: [{ required: true, message: '请填写内容', trigger: 'blur' },
          { validator: sortTest, trigger: 'change' }],
        lessonType: [{ required: true, message: ' ', trigger: 'change' }],
        age: [{ max: 20, message: '不能超过20字', trigger: 'blur' },
          { required: true, message: '请填写内容', trigger: 'change' }],
        time: [{ max: 20, message: '不能超过20字', trigger: 'blur' },
          { required: true, message: '请填写内容', trigger: 'change' }],
        detailCont: [{ required: true, message: ' ', trigger: 'change' }]
      }
    }
  },
  methods: {
    pay() {
      this.$emit('transerLessonForm', 'lessonForm')
    },
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
    },
    // 删除详情
    deleteDetailCont(val) {
      if (val === 0) {
        // alert('教师消息至少保留一条')
      } else {
        this.lessonForm.detailCont.splice(val, 1)
      }
    },
    // 添加详情
    addDetailCont() {
      if (this.lessonForm.detailCont.length < 10) {
        const data = {
          title: '', cont: ''
        }
        this.lessonForm.detailCont.push(data)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// .body-right {
// height: 667px;
// width: 640px;
// background: rgb(242, 242, 242);
// margin-left: 20px;
// overflow: auto;
// padding-top: 20px;
.tubiao {
  display: inline-block;
  vertical-align: middle;
  background: #5d9cec;
  width: 12px;
  height: 28px;
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
// }
</style>

