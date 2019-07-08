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
              style="margin-right:5px;"
            />
            <Confirm
              :text="'保存'"
              :placement="'top'"
              :content="'确认保存么?'"
              :confirm="()=>{submitForm('campusData')}"
              :is-button="true"
              :btn-type="'primary'"
              style="margin-right:15px;"
            />
          </div>
        </div>
        <div class="body">
          <div class="body-leftBox">
            <div class="body-left">
              <div class="body-left-header">
                <img src="https://img.ishanshan.com/gimg/user/n///1557127683.png">
              </div>
              <div class="body-left-cont">
                <div style="width:100%;height:150px">
                  <img
                    src=""
                    alt=""
                  >
                </div>
                <div class="nav">
                  <ul>
                    <li
                      v-if="nav.homeTabShow === 1"
                      class="firstNav"
                    >{{ nav.homeTab }}</li>
                    <li v-show="nav.courseTabShow === 1">{{ nav.courseTab }}</li>
                    <li v-show="nav.activityTabShow === 1">{{ nav.activityTab }}</li>
                    <li v-show="nav.gameTabShow === 1">{{ nav.gameTab }}</li>
                    <li v-show="nav.otherTabShow === 1">{{ nav.otherTab }}</li>
                  </ul>
                </div>
                <div class="orgInfo">
                  <div class="orgAddress">
                    <i class="el-icon-location" />{{ typeChange(campusData.addrColumn) }}
                  </div>
                  <div class="orgTime">
                    <div> <i class="el-icon-time" /><span>营业时间：{{ campusData.serverTime }}</span></div>
                    <i class="el-icon-phone" />
                  </div>
                </div>
                <div
                  v-show="radioData.ageRange === '1'"
                  class="orgItem"
                >
                  <div class="tit"><i />适合年龄</div>
                  <span class="age">
                    {{ campusData.ageTag }}
                  </span>
                </div>
                <div
                  v-show="radioData.busnessRange === '1'"
                  class="orgItem"
                >
                  <div class="tit"><i />业务范围</div>
                  <span
                    v-for="(item,index) in typeLabel(campusData.categoryTag)"
                    :key="index"
                    class="workType"
                    style="margin:5px 2px;line-height:20px"
                  >
                    {{ item }}
                  </span>
                </div>
                <div
                  v-if="radioData.orgAlbum === '1'"
                  class="orgItem"
                >
                  <div class="tit"><i />环境相册</div>
                  <div class="albumBox">
                    <div
                      v-for="(item,index) in campusData.images"
                      :key="index"
                      class="album"
                    >
                      <img :src="item">
                    </div>
                  </div>
                </div>
                <div
                  v-if="radioData.orgIntro === '1'"
                  class="orgItem"
                >
                  <div class="tit"><i />机构简介</div>
                  <p class="intro">
                    {{ campusData.intro }}
                  </p>
                </div>
                <div
                  v-if="radioData.orgFaculty === '1'"
                  class="orgItem"
                >
                  <div class="tit"><i />师资力量</div>
                  <div
                    v-for="(data,index) in campusData.teachers"
                    :key="index"
                    class="teachItem"
                  >
                    <div class="teachImg">
                      <img
                        :src="data.teacherImg"
                        alt=""
                      >
                    </div>
                    <div class="teachName">{{ data.teacherName }}</div>
                    <div class="rank">{{ data.teacherIntro }}</div>
                  </div>
                </div>

                <div
                  v-if="radioData.orgFacility === '1'"
                  class="orgItem"
                >
                  <div class="tit"><i />机构设施
                  </div>
                  <span
                    v-for="(item,index) in utilityLabel(campusData.utilityTag)"
                    :key="index"
                    class="facility"
                  >
                    <div class="facilityBacground"><img :src="item.img"></div>
                    <div class="facilityName">{{ item.text }}</div>
                  </span>
                </div>

              </div>
            </div>
          </div>
          <div class="body-right">
            <el-form
              ref="campusData"
              :model="campusData"
              :rules="rules"
              label-width="90px"
            >
              <el-form-item
                label="营业时间:"
                prop="serverTime"
              >
                <el-input
                  v-model="campusData.serverTime"
                  clearable
                  placeholder="限30字"
                />
              </el-form-item>
              <el-form-item
                label="适用年龄:"
                prop="ageTag"
              >
                <el-radio-group v-model="radioData.ageRange">
                  <el-radio label="1">显示</el-radio>
                  <el-radio label="0">隐藏</el-radio>
                </el-radio-group>
                <el-input
                  v-model="campusData.ageTag"
                  clearable
                  placeholder="限40字"
                />
              </el-form-item>
              <el-form-item
                label="业务范围:"
                prop="categoryTag"
                class="categoryTag"
                label-width="90px"
              >
                <el-radio-group v-model="radioData.busnessRange">
                  <el-radio label="1">显示</el-radio>
                  <el-radio label="0">隐藏</el-radio>
                </el-radio-group>
                <el-checkbox-group v-model="campusData.categoryTag">
                  <el-checkbox
                    v-for="(item,index) in organCategory"
                    :label="item.value"
                    :key="index"
                  >{{ item.text }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item
                label="环境相册:"
                prop="images"
              >
                <el-radio-group v-model="radioData.orgAlbum">
                  <el-radio label="1">显示</el-radio>
                  <el-radio label="0">隐藏</el-radio>
                </el-radio-group>
                <el-upload
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  :on-success="handleCardPicSuccess"
                  :file-list="imageFileList"
                  action="https://imgsrc.ishanshan.com/gimg/upload"
                  list-type="picture-card"
                > <i class="el-icon-plus" />
                  <span>上传照片</span>
                </el-upload>
                <el-dialog
                  :visible.sync="dialogVisible"
                  :append-to-body="true"
                  custom-class="previewImg"
                >
                  <div style="width:100%;height:100%;text-align:center">

                    <img
                      :src="pictureCard"
                      style="width:560px;height:360px"
                      alt=""
                    >
                  </div>
                </el-dialog>
              </el-form-item>
              <el-form-item
                label="机构简介:"
                prop="intro"
              >
                <el-radio-group v-model="radioData.orgIntro">
                  <el-radio label="1">显示</el-radio>
                  <el-radio label="0">隐藏</el-radio>
                </el-radio-group>
                <el-input
                  v-model="campusData.intro"
                  :rows="5"
                  type="textarea"
                  clearable
                  placeholder="限2000字"
                />
              </el-form-item>
              <el-form-item
                label="师资力量:"
                prop="teachers"
                checked
              >
                <el-radio-group v-model="radioData.orgFaculty">
                  <el-radio label="1">显示</el-radio>
                  <el-radio label="0">隐藏</el-radio>
                </el-radio-group>
                <div v-if="radioData.orgFaculty === '1'">
                  <div
                    v-for=" (item,index) in campusData.teachers"
                    :key="index"
                    class="teach_box"
                  >
                    <div class="teach_box_title">
                      <span>老师信息</span>
                      <el-button
                        type="text"
                        class="delete_icon"
                        @click="deleteTeachData(index)"
                      >删除</el-button>
                    </div>
                    <div class="teach_box_body">
                      <el-form-item
                        :prop="'teachers.' + index + '.teacherName'"
                        :rules="[{
                          required: true, message: '老师姓名不能为空', trigger: 'change'
                        },{ max:10, message: '限10字', trigger: 'blur' }]"
                        label="老师姓名："
                      >
                        <el-input
                          v-model="item.teacherName"
                          size="mini"
                        />
                      </el-form-item>
                      <el-form-item
                        :prop="'teachers.' + index + '.teacherIntro'"
                        :rules="[{
                          required: true, message: '老师简介不能为空', trigger: 'change'
                        },{ max:40, message: '限40字', trigger: 'blur' }]"
                        label="老师简介："
                      >
                        <el-input
                          v-model="item.teacherIntro"
                          size="mini"
                        />
                      </el-form-item>
                      <el-form-item
                        :prop="'teachers.' + index + '.teacherImg'"
                        label="老师图片："
                      >
                        <el-upload
                          :show-file-list="false"
                          :on-success="handleAvatarSuccess"
                          :before-upload="beforeAvatarUpload"
                          class="avatar-uploader"
                          action="https://imgsrc.ishanshan.com/gimg/upload"
                          @click="getTeacherIndex(index)"
                        >

                          <img
                            v-if="item.teacherImg"
                            :src="item.teacherImg"
                            class="avatar"
                            @click="getTeacherIndex(index)"
                          >
                          <i
                            v-else
                            class="el-icon-plus"
                            @click="getTeacherIndex(index)"
                          />
                          <span
                            v-if="!item.teacherImg"
                            style="color:#666"
                            @click="getTeacherIndex(index)"
                          >上传图片</span>
                        </el-upload>
                        <p>上传老师图片, 支持png、jpeg、gif格式的图片,图片大小小于2M!</p>
                      </el-form-item>
                      <!-- <i
                      class="el-icon-remove-outline delete_icon"
                      @click="deleteTeachData(index)"
                    /> -->
                    </div>
                  </div>
                  <el-button
                    type="primary"
                    class="add_btn"
                    style="display:block"
                    @click="addTeachData()"
                  >添加师资展示</el-button>
                </div>
              </el-form-item>
              <el-form-item
                label="机构设施:"
                prop="utilityTag"
                class="categoryTag"
                label-width="90px"
              >
                <el-radio-group v-model="radioData.orgFacility">
                  <el-radio label="1">显示</el-radio>
                  <el-radio label="0">隐藏</el-radio>
                </el-radio-group>
                <el-checkbox-group
                  v-if="radioData.orgFacility === '1'"
                  v-model="campusData.utilityTag"
                >
                  <el-checkbox
                    v-for="(item,index) in utilityCategory"
                    :label="item.value"
                    :key="index"
                  >{{ item.text }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="机构地址:">
                <div class="organ_box">

                  <el-form-item
                    label="门店地址"
                    prop="addrColumn"
                  >
                    <el-cascader
                      v-model="campusData.addrColumn"
                      :options="areaList"
                      :props="areaProp"
                      style="width:200px"
                      popper-class="store_address_style"
                      clearable
                      @change="handleItemChange"
                    />
                  </el-form-item>
                  <el-form-item
                    label="详细地址"
                    prop="addr"
                  >
                    <el-input
                      v-model="campusData.addr"
                      clearable
                      @blur="searchDetailAddress(campusData.addr)"
                    />
                  </el-form-item>

                  <baiduMap
                    :location-data="choiceLocation"
                    @show-lng="lngData=$event"
                  />
                </div>
              </el-form-item>
              <el-form-item
                label="联系电话:"
                prop="tel"
                checked
              >
                <el-input
                  v-model="campusData.tel"
                  size="mini"
                  clearable
                  placeholder="请填写联系方式"
                  checked
                />
              </el-form-item>
            </el-form>

          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { getOrgan, dictOrgan, updateOrgan, queryConfig, changeConfig } from '@/api/microWeb/webPreview'
import area from '@/utils/area'
import baiduMap from '@/views/orgSet/campusSet/baiduMap'
import Confirm from '@/components/MiniCommon/Confirm'
export default {
  components: {
    baiduMap,
    Confirm
  },
  props: {
    'visible': {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible2: false,
      visible3: false,
      isVisible: this.visible,
      img: 'https://img.ishanshan.com/gimg/n/20190116/e8a4dcec601a9f23ef2c97826cee671a',
      nav: { homeTab: '',
        courseTab: '',
        activityTab: '',
        gameTab: '',
        otherTab: '' },
      addLessonDialogTitlt: '设置首页',
      radioData: {
        ageRange: '1',
        busnessRange: '1',
        orgAlbum: '1',
        orgIntro: '1',
        orgFaculty: '1',
        orgFacility: '1'
      },

      lngData: '',
      choiceLocation: '北京',
      areaList: area,
      // cities: cityOptions,
      areaProp: {
        value: 'name',
        label: 'name'
      },
      saveLocation: '',
      dialogVisible: false,
      pictureCard: '',
      organCategory: [], // 业务范围
      utilityCategory: [], // 机构设施
      teachersIndex: '',
      imageFileList: [],
      campusData: {
        name: '',
        serverTime: '',
        ageTag: '',
        addrColumn: [],
        address: '',
        province: '',
        city: '',
        area: '',
        categoryTag: [],
        utilityTag: [],
        images: [],
        teachers: [],
        intro: ''

      },
      rules: {
        serverTime: [
          { required: true, message: '请填写营业时间' },
          { max: 30, message: '限制30个字符', trigger: 'change' }
        ],
        images: [
          { required: true, message: '未上传图片：请上传图片', trigger: 'change' }
        ],
        addrColumn: [{ required: true, message: '请选择机构地址', trigger: 'change' }],
        addr: [{ required: true, message: '请输入详细机构地址', trigger: 'change' }],
        // picDetail: [
        //   { required: true, message: '支持png、jpeg、gif格式的图片，建议宽高 750*400px，图片大小不大于2M！', trigger: 'change' }
        // ],
        categoryTag: [{ required: true, message: '请勾选业务范围', trigger: ['blur', 'change'] }],
        utilityTag: [{ required: true, message: '请勾选机构设施', trigger: ['blur', 'change'] }],
        ageTag: [{ max: 40, message: '限40字', trigger: 'change' },
          { required: true, message: '请输入适用年龄', trigger: 'blur' }],
        intro: [{ required: true, max: 2000, message: '不能超过2000字', trigger: 'blur' }],
        teachers: [{ required: true, trigger: 'change', message: '请添加师资展示' }],
        tel: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '手机号格式错误', trigger: 'blur' }
        ]
      }
    }
  },

  watch: {
    'visible'(val) {
      this.isVisible = val
    },
    'isVisible'(val) {
      this.$emit('update:visible', val)
    }
  },
  mounted() {
    this.getDictOrgan()
    this.getOrganList()
    this.queryConfig()
  },
  methods: {
    // 业务范围
    getDictOrgan() {
      dictOrgan().then(res => {
        if (res.data.errorCode === 0) {
          let organCategory = []
          let utilityCategory = []
          res.data.dictItemList.forEach(v => {
            if (v.code === 'organcategory') {
              organCategory = v.items
            }
            if (v.code === 'utilitytag') {
              utilityCategory = v.items
            }
          })
          this.organCategory = organCategory
          this.utilityCategory = utilityCategory
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    // 初始化信息
    getOrganList() {
      getOrgan().then(res => {
        if (res.data.errorCode === 0) {
          this.campusData = res.data
          this.campusData.serverTime = res.data.serverTime || ''
          // this.campusData.teachers = Object.assign([], JSON.parse(res.data.teachers))
          const teacherData = JSON.parse(res.data.teachers)
          this.campusData.teachers = teacherData ? Object.assign([], teacherData) : Object.assign([], [{ teacherName: '', teacherImg: '', teacherIntro: '' }])
          this.campusData.addrColumn = Object.assign([], JSON.parse(res.data.addrColumn))
          this.campusData.categoryTag = res.data.categoryTag ? res.data.categoryTag.split(',') : []
          this.campusData.utilityTag = res.data.utilityTag ? res.data.utilityTag.split(',') : []
          if (!res.data.images) {
            this.campusData.images = []
          } else {
            this.imageFileList = []
            this.campusData.images = Object.assign([], res.data.images.split(','))

            this.campusData.images.forEach((v, index) => {
              const data = {
                name: index,
                url: v
              }
              this.imageFileList.push(data)
            })
          }
          this.choiceLocation = res.data.addrColumn.join(',') + res.data.addr
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    // 初始化隐藏与否数据
    queryConfig() {
      queryConfig().then(res => {
        if (res.data.errorCode === 0) {
          res.data.results.menuConfig.map((val) => {
            this.radioData[val.name] = String(val.show)
            for (var index in this.nav) {
              if (index === val.name) {
                this.nav[val.name] = val.title
                this.nav[val.name + 'Show'] = val.show
              }
            }
          })
        } else {
          this.$message.error(res.errorMessage)
        }
      })
    },
    close() {
      this.isVisible = false
      this.visible2 = false
      this.visible3 = false
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            id: this.campusData.id,
            orgName: this.campusData.orgName,
            tel: this.campusData.tel,
            intro: this.campusData.intro,
            serverTime: this.campusData.serverTime,
            ageTag: this.campusData.ageTag,
            addrColumn: JSON.stringify(this.campusData.addrColumn),

            province: this.campusData.province,
            city: this.campusData.city,
            area: this.campusData.area,
            addr: this.campusData.addr,
            // schoolLogo: this.campusData.schoolLogo,
            categoryTag: this.campusData.categoryTag.join(','),
            utilityTag: this.campusData.utilityTag.join(','),
            images: this.campusData.images.join(','),
            teachers: JSON.stringify(this.campusData.teachers),
            lng: this.lngData.lng,
            lat: this.lngData.lat,

            contacts: this.campusData.contacts,
            schoolLogo: this.campusData.schoolLogo
          }
          updateOrgan(data).then(res => {
            if (res.data.errorCode === 0) {
              this.visible3 = false
              this.isVisible = false
              // this.getOrganList()
              this.$emit('refreshPage')
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
          const radioObj = { ...this.radioData }
          changeConfig({ tabsAndStatus: JSON.stringify(radioObj), id: this.$parent.id }).then(res => {
            if (res.data.errorCode === 0) {
              this.queryConfig()
            } else {
              this.$message.error(res.errorMessage)
            }
          })
        } else {
          return false
        }
      })
    },
    // 上传图片
    handleAvatarSuccess(index, res, file) {
      this.campusData.teachers[this.teachersIndex].teacherImg = res.response.url
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
    // 上传图片删除
    handleRemove(file, fileList) {
      this.campusData.images.map((val, index) => {
        if (val === file.url) {
          this.campusData.images.splice(index, 1)
        }
      })
    },
    // 预览
    handlePictureCardPreview(file) {
      this.pictureCard = file.url
      this.dialogVisible = true
    },
    handleCardPicSuccess(res, file) {
      this.campusData.images.push(res.url)
    },
    // 上传成功
    handleSuccess(file, fileList) {
    },
    handleBeforeUpload(file) {
    },
    getTeacherIndex(index) {
      this.teachersIndex = index
    },
    // 添加详情
    addTeachData() {
      // if (this.campusData.teachers.length > 9) {
      //   this.$message.warning('教师消息至多十条')
      // } else {
      // const deleBtnArr = document.querySelectorAll('.delete_icon')
      // deleBtnArr[0].style.display = 'inline-block'
      const data = {
        teacherName: '',
        teacherIntro: '',
        teacherImg: ''
      }
      this.campusData.teachers.push(data)
      // }
    },
    // 删除详情
    deleteTeachData(val) {
      if (this.campusData.teachers.length <= 1) {
        // const deleBtn = document.querySelector('.delete_icon')
        // deleBtn.style.display = 'none'
        this.$message.warning('教师消息至少保留一条')
      } else {
        this.campusData.teachers.splice(val, 1)
      }
      // this.campusData.teachers.splice(val, 1)
    },
    // 地图
    handleItemChange(val) {
      if (val && val.length > 0) {
        this.campusData.province = val[0]
        this.campusData.city = val[1]
        this.campusData.area = val[2]
      }
      this.saveLocation = val.join('')
      this.choiceLocation = val.join('')
    },
    searchDetailAddress(val) {
      this.choiceLocation = this.saveLocation + val
    },
    // 机构设施处理处理
    utilityLabel(values) {
      const items = []
      this.utilityCategory.forEach(item => {
        if (values.indexOf(item.value) > -1) {
          switch (item.value) {
            case '101':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/6c1735716d135a51f7d5472c1d3c41c6'
              break
            case '102':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/f2e7d2e414bfa11d1619f68799ca39bc'
              break
            case '103':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/2128bf4b593cd125480ee36728fcf206'
              break
            case '104':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/2349ceb503ad2256627c0d8ec178bee7'
              break
            case '105':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/2e93d8aaef852f00c06e7b313f72114d'
              break
            case '106':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/cbea5c12d83e76c9393a669f285bcced'
              break
            case '107':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/db145dae09819d8c4193f423da1e4cf4'
              break
            case '108':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/8584d4c9e5474c212dec463d3c7aaded'
              break
            case '109':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/351ebb07a76dc5a8f9200e124af3f70c'
              break
            case '110':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/30d13c63d90cd251e992cd0338f8ea16'
              break
            case '111':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/2b54b4f601f66d3446cb0a98f68c3e94'
              break
            case '112':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/61a60e294b9662b130904123458b5c2c'
              break
            case '113':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/cfa4cbbff5a207a9466047a005ad96b6'
              break
            case '114':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/04edca4320cf1160a1073ddaea70a391'
              break
            case '115':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/085367478a5825d4d0891077f4181727'
              break
            case '116':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/8621a39fedc4b245b01fb397227079e3'
              break
            case '117':
              item.img = 'https://img.ishanshan.com/gimg/n/20190531/5fe7a0e7c8928f483a7dcd98490b32cf'
              break
            default:
              item.img = ''
              break
          }

          items.push(item)
        }
      })
      return items
    },
    // 业务范围label显示处理
    typeLabel(values) {
      const labels = []
      this.organCategory.forEach(item => {
        const index = values.indexOf(item.value)
        if (index > -1) {
          labels.push(item.text)
        }
      })
      return labels
    },
    typeChange(val) {
      const str = val.length > 0 ? val.join('') : ''
      return str
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
  // z-index: 10000;
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
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    padding: 20px 0 14px 0;
    margin-left: 20px;
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
    padding: 20px 0;
    height: calc(100vh - 64px);
    overflow: auto;

    // -------------左侧手机预览 start----------------------------------------
    .body-leftBox {
      min-width: 436px;
      padding: 30px 30px 0;
      background: rgba(240, 242, 245, 0.8);
      margin-left: 20px;
      overflow-y: auto;
    }
    .body-left {
      width: 375px;
      height: 667px;
      margin-bottom: 30px;
      position: relative;
      box-shadow: 0 2px 7px rgba(0, 0, 0, 0.2);

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
        background: rgba(240, 242, 245, 0.6);
        height: calc(100% - 64px);
        overflow: auto;
        -ms-overflow-style: none;
        &::-webkit-scrollbar {
          display: none;
        }
        .nav {
          width: 100%;
          height: 35px;

          ul {
            background: #3b71b7;
            white-space: nowrap;
            text-align: center;
            overflow: auto;
            // overflow-y: hidden;
            display: flex;
            flex-wrap: nowrap;
          }
          li {
            // color: #fdee03;
            // float: left;
            // width: 70px;
            padding: 0 30px;
            height: 32px;
            line-height: 32px;
            text-align: center;
            color: #fff;
            font-size: 14px;
            background: #3b71b7;
          }
          .firstNav {
            border-bottom: 3px solid #fdee03;
            color: #fdee03;
          }
        }
        .orgInfo {
          background: #fff;
          margin: 10px 0 0 0;
          padding: 0 20px;
          .orgAddress {
            border-bottom: 1px solid #ddd;
            height: 35px;
            line-height: 35px;
            .el-icon-location {
              margin-right: 2px;
              font-size: 16px;
              color: rgb(229, 70, 111);
            }
          }
          .orgTime {
            height: 35px;
            line-height: 35px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            div span {
              border-right: 1px solid #ccc;
              padding-right: 10px;
              padding-left: 2px;
            }
            .el-icon-time {
              font-size: 16px;
              color: #3f479b;
            }
            .el-icon-phone {
              font-size: 16px;
              color: #3b72b7;
              margin-left: 10px;
            }
          }
        }
        .orgItem {
          background: #fff;
          margin: 10px 0 0 0;
          padding: 10px 20px;
          .tit {
            height: 25px;
            i {
              display: inline-block;
              vertical-align: top;
              width: 10px;
              height: 18px;
              margin-right: 10px;
              background: #3b72b7;
              margin-left: -20px;
            }
          }
          .workType {
            display: inline-block;
            padding: 2px 15px;
            background: #c4d4e9;
            color: #fff;
            margin-right: 10px;
            border-radius: 4px;
          }
          .age {
            color: #3b72b7;
            margin-right: 10px;
          }
          .albumBox {
            display: flex;

            flex-wrap: wrap;
          }
          .album {
            height: 80px;
            width: 120px;
            margin-right: 10px;
            margin-top: 3px;
            img {
              width: 100%;
              height: 100%;
              border-radius: 5px;
            }
          }
          .teachItem {
            display: inline-block;
            // height: 140px;
            width: 80px;
            margin-right: 10px;
            div {
              width: 78px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .teachImg {
              width: 80px;
              height: 80px;
              img {
                width: 100%;
                height: 100%;
                border-radius: 5px;
              }
            }
            .teachName {
              text-align: center;
              font-size: 14px;
            }
            .rank {
              text-align: center;
              color: rgb(153, 153, 153);
            }
          }
          .facility {
            display: inline-block;
            text-align: center;
            // margin-right: 12px;
            width: calc(100% / 6);
            .facilityBacground {
              border-radius: 50%;
              background: #c4d4e9;
              overflow: hidden;
              width: 36px;
              height: 36px;
              margin: 0 auto 4px;
              img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
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
        }
        .course-title {
          margin-top: 10px;
          min-height: 30px;
          line-height: 20px;
          font-size: 16px;
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
    }
    .facilityName {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    // -------------左侧手机预览 end----------------------------------------

    // -------------右侧表单 start----------------------------------------
    .body-right {
      width: calc(100% - 436px);
      min-width: 508px;
      margin: 0 20px;
      overflow: auto;
      padding-right: 20px;

      .el-form {
        margin-top: 10px;
      }
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
      .organ_box {
        width: 400px;
        margin-bottom: 20px;
        border-radius: 5px;
        border: 1px solid rgba(221, 221, 221, 1);
        padding: 20px;
        background: #fff;
      }
      .teach_box {
        width: 400px;
        margin-bottom: 20px;
        border-radius: 5px;
        border: 1px solid rgba(221, 221, 221, 1);
        padding-top: 0;
        position: relative;
        background: #fff;
        .teach_box_title {
          height: 32px;
          width: 400px;
          line-height: 32px;
          background: rgba(240, 242, 245, 1);
          border-radius: 5px 5px 0px 0px;
          border: 1px solid rgba(221, 221, 221, 1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 20px;
          span {
            height: 12px;
            font-size: 14px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
            line-height: 12px;
          }
        }
        .teach_box_body {
          padding: 20px;
        }
        p {
          font-size: 12px;
          color: #999;
          line-height: 20px;
          margin-top: 6px;
        }
        .el-input--mini {
          width: 200px;
        }
      }
      .delete_icon {
        cursor: pointer;
      }
    }
    // -------------右侧表单 end----------------------------------------
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
</style>
<style lang="scss">
.teach_box .el-form-item .el-form-item__label {
  width: 97px !important;
}
.categoryTag .el-form-item__label {
  width: 90px !important;
}
.utilityTag .el-form-item__label {
  width: 90px !important;
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

