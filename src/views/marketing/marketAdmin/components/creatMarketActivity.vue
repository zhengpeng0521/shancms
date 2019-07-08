<template>
  <div class="creatMarketActivityBox">
    <el-dialog
      :visible.sync="marketActivityDialogShow"
      :title="marketActivityDialogtitle"
      :append-to-body="true"
      width="700px"
      @close="cancelDialog('productForm')"
    >
      <div>
        <el-form
          ref="productForm"
          :model="productData"
          :rules="rules"
          label-width="90px"
        >
          <el-form-item
            label="活动名称:"
            prop="name"
          >
            <el-input
              v-model="productData.name"
              clearable
              placeholder="请输入活动名称,限30字"
            />
          </el-form-item>
          <el-form-item
            label="活动时间:"
            prop="activityTime"
          >

            <el-date-picker
              v-model="productData.activityTime"
              :default-time="['00:00:00', '23:59:59']"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
            <p>若不填写则默认活动时间不限</p>
          </el-form-item>
          <el-form-item
            label="采单人员:"
            prop="members"
            checked
          >
            <el-select
              v-model="productData.members"
              multiple
              placeholder="请选择采单人员"
              clearable
              filterable
              style="width:100%"
            >
              <el-option
                v-for="item in collectPersons"
                :key="item.userId"
                :label="item.userName"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="采集地点:"
            prop="place"
          >
            <el-select
              v-model="productData.place"
              placeholder="请选择采集地点"
              clearable
              filterable
              style="width:100%"
            >
              <el-option
                v-for="item in collectSites"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="活动成本:"
            prop="price"
          >
            <!-- <el-input> -->
            <el-input-number
              v-model="productData.price"
              :min="0"
              controls-position="right"
            />
            <!-- </el-input> -->
            元
          </el-form-item>
          <el-form-item
            label="收集信息:"
            prop="stuInfo"
            checked
          >
            <el-checkbox-group
              v-model="productData.stuInfo"
              :min="1"
            >
              <el-checkbox
                label="stuName"
                disabled
              >学员姓名</el-checkbox>
              <el-checkbox
                label="stuBirthday"
                disabled
              >学员生日</el-checkbox>
              <el-checkbox
                label="tel"
                disabled
              >联系方式</el-checkbox>
              <el-checkbox label="vcode">验证码</el-checkbox>
              <el-checkbox label="babySex">学员性别</el-checkbox>
              <el-checkbox
                label="parentRelate"
                style="margin-left:0"
              >家长关系</el-checkbox>
              <el-checkbox label="parentName">家长姓名</el-checkbox>
              <el-checkbox label="address">联系地址</el-checkbox>
              <el-checkbox label="neighbourhood">居住小区</el-checkbox>
              <el-checkbox label="school">学校</el-checkbox>
              <el-checkbox
                label="isVip"
                style="margin-left:0"
              >是否会员</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            label="表单标题:"
            prop="pageTitle"
            checked
          >
            <el-input
              v-model="productData.pageTitle"
              clearable
              placeholder="请输入表单标题,限20字"
            />
          </el-form-item>
          <el-form-item
            label="表单logo:"
            prop="pageLogo"
          >

            <!-- <el-upload
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              class="avatar-uploader"
              action="https://imgsrc.ishanshan.com/gimg/upload"
            >
              <img
                v-if="productData.pageLogo"
                :src="productData.pageLogo"
                class="avatar"
              >
              <i
                v-else
                class="el-icon-plus avatar-uploader-icon"
              />
            </el-upload> -->
            <el-upload
              :on-success="handleAvatarSuccess"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-upload="beforeAvatarUpload"
              :file-list="logoArr"
              class="logoClass"
              action="https://imgsrc.ishanshan.com/gimg/upload"
              list-type="picture-card"
            >
              <i class="el-icon-plus" />
              <span>选择图片</span>
            </el-upload>
            <el-dialog
              :visible.sync="imgDialogVisible"
              :append-to-body="true"
            >
              <div style="width:100%;height:100%;text-align:center">
                <img
                  :src="previewImg"
                  width="600px"
                  alt=""
                >
              </div>
            </el-dialog>
          </el-form-item>
          <el-form-item
            label="表单主题:"
            prop="topicCode"
            checked
          >
            <el-radio
              v-model="productData.topicCode"
              label="default"
            >默认</el-radio>
            <el-radio
              v-model="productData.topicCode"
              label="cartoon"
            >卡通</el-radio>
            <el-radio
              v-model="productData.topicCode"
              label="clear"
            >清晰</el-radio>
            <div>
              <img
                style="width:80px;height:130px"
                src="https://img.ishanshan.com/gimg/img/28d3dec2ed11f6604b0de03e83dbab2b"
                append-to-body
                @click="imgDialog"
              >
              <img
                style="width:80px;height:130px"
                src="https://img.ishanshan.com/gimg/img/8e8dfa142218d32e811fd8eb01606cee"
                @click="imgDialog1"
              >
              <img
                style="width:80px;height:130px"
                src="https://img.ishanshan.com/gimg/img/7e5b621ea6d3152b817c15f2b1094f3a"
                @click="imgDialog2"
              >
            </div>

          </el-form-item>
          <el-form-item
            label="备注:"
            prop="remark"
          >
            <el-input
              :rows="6"
              v-model="productData.remark"
              type="textarea"
              placeholder="请输入备注（最多100字）"
            />
          </el-form-item>
        </el-form>
      </div>
      <div
        slot="footer"
        class="footer"
      >
        <el-button @click="cancelDialog('productForm')">取消</el-button>
        <el-button
          v-if="changeFlag"
          type="primary"
          @click="submitForm('productForm')"
        >生成二维码</el-button>
        <el-button
          v-if="!changeFlag"
          type="primary"
          @click="submitForm('productForm')"
        >保存</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="imgDialogShow"
      class="imgDialog"
    >
      <img
        style="width:286px"
        src="https://img.ishanshan.com/gimg/img/28d3dec2ed11f6604b0de03e83dbab2b"
      >
    </el-dialog>
    <el-dialog
      :visible.sync="imgDialogShow1"
      class="imgDialog"
    >
      <img
        style="width:286px"
        src="https://img.ishanshan.com/gimg/img/8e8dfa142218d32e811fd8eb01606cee"
      >
    </el-dialog>
    <el-dialog
      :visible.sync="imgDialogShow2"
      class="imgDialog"
    >
      <img
        style="width:286px"
        src="https://img.ishanshan.com/gimg/img/7e5b621ea6d3152b817c15f2b1094f3a"
      >
    </el-dialog>
  </div>
</template>
<script>
import { createOrUpdate, summaryQuery, dictGetByKey, queryFormConfig, queryList } from '@/api/marketing/marketAdmin.js'
export default {
  // props: {
  //   actid: {
  //     type: String,
  //     default: undefined
  //   }
  // },
  data() {
    return {
      id: '',
      marketActivityDialogShow: false,
      marketActivityDialogtitle: '新增市场活动',
      changeFlag: true,
      // subFlag: false,
      productData: {
        name: '',
        activityTime: '',
        members: [],
        place: '',
        price: '',
        // stuInfo: [],
        stuInfo: ['stuName', 'stuBirthday', 'tel'],
        pageTitle: '',
        pageLogo: '',
        // formItem: '',
        topicCode: 'default',
        remark: '',
        dialogImageUrl: ''
      },
      logoArr: [],
      previewImg: '',
      imgDialogVisible: false,
      collectPersons: [{ value: '1', label: '张' }, { value: '2', label: '王' }],
      collectSites: [{
        value: 'yizhi',
        label: '一致'
      }],
      // stuInfo: [{ stuName: true }],
      dialogVisible: false,
      allShopsValue: '',
      allShops: [
        {
          value: 'yizhi',
          label: '一致'
        },
        {
          value: 'fankui',
          label: '反馈'
        },
        {
          value: 'xiaolv',
          label: '效率'
        },
        {
          value: 'kekong',
          label: '可控'
        }
      ],
      rules: {
        name: [
          { required: true, max: 30, message: '不能超过30字', trigger: 'change' }
        ],
        members: [
          { required: true, message: '请选择采单人员', trigger: 'blur' }
        ],
        pageTitle: [{ max: 20, required: true, message: '请输入表单标题', trigger: 'blur' }],
        stuInfo: [{ required: true, message: ' ', trigger: 'change' }],
        pageLogo: [
          { required: true, message: '请选择表单logo', trigger: 'blur' }
        ],
        topicCode: [
          { required: true, message: ' ', trigger: 'blur' }
        ],
        remark: [{ max: 100, trigger: 'blur', message: '不能超过100字 ' }]
      },
      // 图片放大
      imgDialogShow: false,
      imgDialogShow1: false,
      imgDialogShow2: false,
      // 后台数据
      defaultArr: []
    }
  },
  watch: {
    logoArr() {
      this.$nextTick(() => {
        const logoBox = document.querySelector('.logoClass .el-upload')
        if (this.logoArr.length === 1) {
          logoBox.style.visibility = 'hidden'
        } else {
          logoBox.style.visibility = 'visible'
        }
      })
    }

  },
  mounted() {
    // this.createOrUpdate()
    this.summaryQuery()
    this.dictGetByKey()
    this.queryFormConfig()
  },
  methods: {
    queryList() {
      const params = {
        startDate: '',
        endDate: '',
        name: '',
        place: '',
        sourceType: '',
        sourceId: ''
      }
      queryList(params).then(res => {
        if (res.data.errorCode === 0) {
          //eslint-disable-line
        } else {
          this.$message.error(res.errorMessage)
        }
        // loading.close()
      })
    },
    handleAvatarSuccess(res, file) {
      this.logoArr.push({ url: file.response.url })
      this.productData.pageLogo = file.response.url
      this.$message({
        message: `${file.name}上传成功`,
        type: 'success'
      })
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      // return isJPG && isLt2M
      return isLt2M
    },
    /* 显示弹框 */
    showDialog(val) {
      if (val === 'add') {
        this.marketActivityDialogtitle = '新增市场活动'
        this.changeFlag = true
        // this.$refs.productForm.resetFields()
        this.productData = {
          name: '',
          activityTime: '',
          members: [],
          place: '',
          price: '',
          // stuInfo: [],
          stuInfo: ['stuName', 'stuBirthday', 'tel'],
          pageTitle: '',
          pageLogo: '',
          // formItem: '',
          topicCode: 'default',
          remark: '',
          dialogImageUrl: ''
        }
        this.logoArr = []
        this.marketActivityDialogShow = !this.marketActivityDialogShow
      } else {
        this.changeFlag = false
        this.$nextTick(() => {
          this.id = val.id
          this.marketActivityDialogtitle = '修改市场活动'

          const arr1 = []
          val.pageLogo.split(',').map((val) => {
            arr1.push({ url: val })
          })
          const that = this.productData
          if (val.startDate && val.endDate) {
            that.activityTime = [val.startDate, val.endDate]
          }

          that.name = val.name
          that.price = val.price
          that.pageTitle = val.pageTitle
          that.pageLogo = val.pageLogo
          that.topicCode = val.topicCode
          that.remark = val.remark
          that.placeStr = val.place
          that.place = val.place
          this.logoArr = arr1
          // 收集信息
          const arr = JSON.parse(val.baseForm)
          const tempArr = []
          arr.map((val) => {
            if (val.hide === 0) {
              tempArr.push(val.name)
            }
          })

          that.stuInfo = tempArr

          // 采集地点

          // 菜单人员
          var membersArr = []
          val.members.map((item) => {
            membersArr.push(Number(item.source_id))
          })
          that.members = membersArr
        })
        this.marketActivityDialogShow = !this.marketActivityDialogShow
      }
    },
    /* 关闭弹框 */
    /* 商品弹框关闭 */
    cancelDialog(formName) {
      this.marketActivityDialogShow = false
      this.$refs[formName].resetFields()
      this.logoArr = []
      this.productData.pageLogo = ''
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        const reset = this.$refs.productForm.resetFields
        if (valid) {
          const arr = []
          this.defaultArr.map((item, index) => {
            this.productData.stuInfo.map((itm) => {
              if (itm !== 'stuName' && itm !== 'stuName' && itm !== 'stuName' && itm === item.name) {
                item.hide = 0
              }
            })
            arr.push(item)
          })
          var baseForm = JSON.stringify(arr)
          this.productData.baseForm = baseForm
          const params = {
            ...this.productData,
            startDate: '',
            endDate: ''
          }
          if (params.activityTime && params.activityTime !== []) {
            params.startDate = params.activityTime[0]
            params.endDate = params.activityTime[1]
          }
          const membersArr = []
          params.members.map((val) => {
            const obj = {
              sourceId: val,
              sourceType: '1'
            }
            membersArr.push(obj)
          })
          params.members = membersArr
          params.members = JSON.stringify(params.members)
          delete params.stuInfo
          delete params.activityTime
          delete params.dialogImageUrl
          params.id = this.id
          createOrUpdate(params).then(res => {
            if (res.data.errorCode === 0) {
              if (this.marketActivityDialogtitle !== '修改市场活动') {
                this.$parent.open(res.data.activityId)
              }
              this.$parent.resetFieldHanle()
              reset()
              this.logoArr = []
              this.productData.pageLogo = ''
            } else {
              this.$message.error(res.errorMessage)
            }
          })

          this.marketActivityDialogShow = false
        }
      })
    },
    // 上传图片删除
    handleRemove(file, fileList) {
      this.productData.pageLogo = ''
      this.logoArr.splice(0, 1)
    },
    // 预览
    handlePreview(file) {
      this.imgDialogVisible = true
      this.previewImg = file.url
      // this.productData.dialogImageUrl = file.url
      // this.dialogVisible = true
    },
    // 图片放大
    imgDialog() {
      this.imgDialogShow = true
    },
    imgDialog1() {
      this.imgDialogShow1 = true
    },
    imgDialog2() {
      this.imgDialogShow2 = true
    },
    queryFormConfig() {
      const params = { appCode: 'market_activity' }
      queryFormConfig(params).then(res => {
        if (res.data.errorCode === 0) {
          this.defaultArr = JSON.parse(res.data.results.base_form)
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    summaryQuery() {
      const params = {}
      summaryQuery(params).then(res => {
        if (res.data.errorCode === 0) {
          this.collectPersons = res.data.results
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    dictGetByKey() {
      const params = { dictkey: 'secondChannel' }
      dictGetByKey(params).then(res => {
        if (res.data.errorCode === 0) {
          this.collectSites = res.data.results
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    }
  }

}
</script>
<style lang="scss" scoped>
.footer {
  display: flex;
  justify-content: flex-end;
  // flex: 1;
}
.creatMarketActivityBox p {
  margin-top: 0px;
  margin-bottom: 0px;
}
</style>

<style lang="scss" >
.creatMarketActivityBox .el-dialog {
  width: 700px !important;
  max-width: 708px !important;
}
.creatMarketActivityBox .imgDialog .el-dialog {
  width: 520px !important;
  // height: 496px;
  display: flex;
  justify-content: center;
}
</style>

