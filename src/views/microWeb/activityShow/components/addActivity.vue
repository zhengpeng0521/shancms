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
            <span v-if="lessonForm.name!=''">{{ lessonForm.name }}</span>
            <span v-if="lessonForm.name===''">标题</span>
          </div>
          <div class="top-right">
            <Confirm
              :text="'关闭'"
              :placement="'top'"
              :content="'确认关闭么?'"
              :confirm="()=>{close('lessonForm')}"
              :is-button="true"
              :btn-type="'plain'"
            />
            <Confirm
              :text="'保存'"
              :placement="'top'"
              :content="'确认保存么?'"
              :confirm="()=>{submitForm('lessonForm')}"
              :is-button="true"
              :btn-type="'primary'"
            />
          </div>
        </div>
        <div class="body">
          <div class="body-left">
            <div class="body-left-container">
              <div class="body-left-header">
                <img
                  src="https://img.ishanshan.com/gimg/n/20190320/7520a62ea0b5b3eb8af55fefc2a8779c"
                  alt=""
                >
              </div>
              <div class="body-left-cont">
                <el-carousel
                  height="150px"
                  arrow="never"
                >
                  <el-carousel-item
                    v-for="(item,index) in Banner"
                    :key="index"
                  >
                    <img
                      :src="item.url"
                      alt=""
                    >
                  </el-carousel-item>
                </el-carousel>
                <div class="course-title">
                  <p><span v-if="lessonForm.activityType === '1'">[会员专属]</span>
                    <span
                      v-if="lessonForm.name === ''"
                      style="color:#333"
                  >活动名称</span> {{ lessonForm.name }}</p>
                  <p>距报名结束：1天20小时20分</p>
                </div>
                <div class="border" />
                <div class="orgDetail">
                  <div class="orgAdd">
                    <i class="el-icon-location" />
                    <span>校区地址</span>
                    <i class="el-icon-phone" />
                  </div>
                </div>
                <div class="orgInfo">
                  <p><span class="el-icon-time" />所属校区：</p>
                  <p>活动地址：<span v-if="lessonForm.address === ''">暂无地址</span>{{ lessonForm.address }}</p>
                  <p>活动时间：<span v-if="lessonForm.activityTime && lessonForm.activityTime.length <= 0">{{ nowTime }}至{{ nowTime }}</span>
                  <span v-if="lessonForm.activityTime && lessonForm.activityTime.length > 0">{{ lessonForm.activityTime[0] }}至{{ lessonForm.activityTime[1] }}</span></p>
                  <p v-if="lessonForm.enablePay === '1'"><span class="el-icon-time" />活动费用：{{ lessonForm.payAmount }}元</p>
                  <p v-if="lessonForm.activityNum !== 0"><span class="el-icon-time" />活动人数：{{ lessonForm.activityNum }}</p>
                  <p v-if="lessonForm.target !== ''"><span class="el-icon-time" />活动对象：{{ lessonForm.target }}</p>
                  <p><span class="el-icon-time" />报名缴费：<span v-if="lessonForm.applyType === '4'||lessonForm.applyType===''">免费</span>
                    <span v-if="lessonForm.applyType === '1'||lessonForm.applyType === '2'">消费课时:{{ lessonForm.classCus }}</span>
                  <span v-if="lessonForm.applyType === '1'||lessonForm.applyType === '3'">物料费:{{ lessonForm.materialFee }}</span></p>
                </div>
                <div
                  v-if="iptCont !== ''"
                  style="background:#fff"
                >
                  <div class="border" />
                  <p class="biaoti"><i />活动内容</p>
                  <div class="conentSetting">
                    <div v-html="iptCont">{{ iptCont }}</div>
                  </div>
                </div>
                <div v-if="lessonForm.participate === '1'">
                  <div class="border" />
                  <p class="biaoti"><i />已报名<span>10</span>人</p>
                  <div class="waitImg">
                    <div class="imgCont">
                      <div class="imgBox">
                        <img src="https://img.ishanshan.com/gimg/n/20190222/399617689dacccfacc0237c023c9a91a">
                      </div>
                      <p>宝宝</p>
                    </div>
                    <div class="imgCont">
                      <div class="imgBox">
                        <img src="https://img.ishanshan.com/gimg/n/20190222/285625ae39f8fdebff131c3bee1b4953">
                      </div>
                      <p>宝宝</p>
                    </div>
                    <div class="imgCont">
                      <div class="imgBox">
                        <img src="https://img.ishanshan.com/gimg/n/20190222/285625ae39f8fdebff131c3bee1b4953">
                      </div>
                      <p>宝宝</p>
                    </div>
                    <div class="imgCont">
                      <div class="imgBox">
                        <img src="https://img.ishanshan.com/gimg/n/20190222/399617689dacccfacc0237c023c9a91a">
                      </div>
                      <p>宝宝</p>
                    </div>
                    <div class="imgCont">
                      <div class="imgBox">
                        <img src="https://img.ishanshan.com/gimg/n/20190222/399617689dacccfacc0237c023c9a91a">
                      </div>
                      <p>宝宝</p>
                    </div>
                    <div class="imgCont">
                      <div class="imgBox">
                        <img src="https://img.ishanshan.com/gimg/n/20190222/399617689dacccfacc0237c023c9a91a">
                      </div>
                      <p>宝宝</p>
                    </div>
                    <div class="imgCont">
                      <div class="imgBox">
                        <img src="https://img.ishanshan.com/gimg/n/20190222/399617689dacccfacc0237c023c9a91a">
                      </div>
                      <p>宝宝</p>
                    </div>
                    <div class="imgCont">
                      <div class="imgBox">
                        <img src="https://img.ishanshan.com/gimg/n/20190222/399617689dacccfacc0237c023c9a91a">
                      </div>
                      <p>宝宝</p>
                    </div>
                    <div class="imgCont">
                      <div class="imgBox">
                        <img src="https://img.ishanshan.com/gimg/n/20190222/399617689dacccfacc0237c023c9a91a">
                      </div>
                      <p>宝宝</p>
                    </div>
                    <div class="imgCont">
                      <div class="imgBox">
                        <img src="https://img.ishanshan.com/gimg/n/20190222/399617689dacccfacc0237c023c9a91a">
                      </div>
                      <p>宝宝</p>
                    </div>
                  </div>
                </div>
                <div v-if="lessonForm.waiting === '1'">
                  <div class="border" />
                  <p class="biaoti"><i />已等位<span>10</span>人</p>
                  <div class="waitImg">
                    <div class="imgCont">
                      <div class="imgBox">
                        <img src="https://img.ishanshan.com/gimg/n/20190222/399617689dacccfacc0237c023c9a91a">
                      </div>
                      <p>宝宝</p>
                    </div>
                    <div class="imgCont">
                      <div class="imgBox">
                        <img src="https://img.ishanshan.com/gimg/n/20190222/285625ae39f8fdebff131c3bee1b4953">
                      </div>
                      <p>宝宝</p>
                    </div>
                    <div class="imgCont">
                      <div class="imgBox">
                        <img src="https://img.ishanshan.com/gimg/n/20190222/285625ae39f8fdebff131c3bee1b4953">
                      </div>
                      <p>宝宝</p>
                    </div>
                    <div class="imgCont">
                      <div class="imgBox">
                        <img src="https://img.ishanshan.com/gimg/n/20190222/399617689dacccfacc0237c023c9a91a">
                      </div>
                      <p>宝宝</p>
                    </div>
                    <div class="imgCont">
                      <div class="imgBox">
                        <img src="https://img.ishanshan.com/gimg/n/20190222/399617689dacccfacc0237c023c9a91a">
                      </div>
                      <p>宝宝</p>
                    </div>
                    <div class="imgCont">
                      <div class="imgBox">
                        <img src="https://img.ishanshan.com/gimg/n/20190222/399617689dacccfacc0237c023c9a91a">
                      </div>
                      <p>宝宝</p>
                    </div>
                    <div class="imgCont">
                      <div class="imgBox">
                        <img src="https://img.ishanshan.com/gimg/n/20190222/399617689dacccfacc0237c023c9a91a">
                      </div>
                      <p>宝宝</p>
                    </div>
                    <div class="imgCont">
                      <div class="imgBox">
                        <img src="https://img.ishanshan.com/gimg/n/20190222/399617689dacccfacc0237c023c9a91a">
                      </div>
                      <p>宝宝</p>
                    </div>
                    <div class="imgCont">
                      <div class="imgBox">
                        <img src="https://img.ishanshan.com/gimg/n/20190222/399617689dacccfacc0237c023c9a91a">
                      </div>
                      <p>宝宝</p>
                    </div>
                    <div class="imgCont">
                      <div class="imgBox">
                        <img src="https://img.ishanshan.com/gimg/n/20190222/399617689dacccfacc0237c023c9a91a">
                      </div>
                      <p>宝宝</p>
                    </div>
                  </div>
                </div>
                <div class="creatBTn">我也要创建活动</div>
                <div style="width:200px;height:50px" />
              </div>
              <div class="body-left-footer">
                <div class="creatAct"><i class="el-icon-plus" /><span>创建活动</span></div>
                <div class="yuyue">我要报名</div>
              </div>
              <!-- <div style="width:200px;height:100px" /> -->
            </div>
          </div>
          <div class="body-right">
            <div class="tab">
              <el-radio-group v-model="radioTabs">
                <el-radio-button label="基础设置" />
                <el-radio-button label="内容设置" />
                <el-radio-button label="分享设置" />
              </el-radio-group>
            </div>
            <div v-show="radioTabs === '内容设置'">
              <quill-editor
                ref="myTextEditor"
                v-model="iptCont"
                @change="transferAddact($event)"
              />
            </div>
            <el-form
              ref="lessonForm"
              :model="lessonForm"
              :rules="rules"
              label-width="140px"
            >
              <div v-show="radioTabs === '分享设置'">
                <el-form-item
                  label="分享标题:"
                  prop="shareTitle"
                >
                  <el-input
                    v-model="lessonForm.shareTitle"
                    clearable
                    placeholder="请输入分享标题（1-40个字）"
                  />
                </el-form-item>
                <el-form-item
                  label="分享简介:"
                  prop="shareInfo"
                >
                  <el-input
                    v-model="lessonForm.shareInfo"
                    clearable
                    placeholder="请输入分享简介（1-80个字）"
                  />
                </el-form-item>
                <el-form-item
                  label="分享图片:"
                  prop="shareCover"
                  checked
                >
                  <el-upload
                    :on-success="handleShareCoverSuccess"
                    :on-preview="handleShareCoverPreview"
                    :on-remove="handleRemove"
                    :before-upload="beforeAvatarUpload"
                    :file-list="shareCoverArr"
                    prop="shareCover"
                    class="shareCover"
                    action="https://imgsrc.ishanshan.com/gimg/upload"
                    list-type="picture-card"
                  >
                    <i class="el-icon-plus" />
                    <span>选择图片</span>
                  </el-upload>
                  <el-dialog
                    :visible.sync="ShareCoverDialogVisible"
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
                </el-form-item>
              </div>
              <div v-show="radioTabs === '基础设置'">
                <el-form-item
                  label="活动名称:"
                  prop="name"
                >
                  <el-input
                    v-model="lessonForm.name"
                    clearable
                    placeholder="限20字"
                  />
                </el-form-item>
                <el-form-item
                  label="活动封面:"
                  prop="activityCover"
                >
                  <el-upload
                    :is-activity-cover-show="isActivityCoverShow"
                    :on-success="handleActivityCoverSuccess"
                    :on-preview="handleActivityCoverPreview"
                    :on-remove="handleActivityCoverRemove"
                    :before-upload="beforeAvatarUpload"
                    :file-list="activityCoverArr"
                    class="activityCover"
                    action="https://imgsrc.ishanshan.com/gimg/upload"
                    list-type="picture-card"
                  >
                    <i class="el-icon-plus" />
                    <span>选择图片</span>
                  </el-upload>
                  <el-dialog
                    :visible.sync="activityCoverDialogVisible"
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
                  label="轮播图:"
                  prop="actBanner"
                >
                  <el-upload
                    :on-preview="handleBannerPreview"
                    :on-success="handleBannerSuccess"
                    :on-remove="handleBannerRemove"
                    :before-upload="beforeAvatarUpload"
                    :limit="limit"
                    :file-list="Banner"
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
                <el-form-item
                  label="报名时间"
                  prop="enrollTime"
                >
                  <el-date-picker
                    v-model="lessonForm.enrollTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    range-separator="~"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                  <p class="tips">允许用户报名的时间</p>
                </el-form-item>
                <el-form-item
                  label="活动时间"
                  prop="activityTime"
                >
                  <el-date-picker
                    v-model="lessonForm.activityTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetimerange"
                    range-separator="~"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
                <el-form-item
                  label="活动地点"
                  prop="address"
                >
                  <el-input
                    v-model="lessonForm.address"
                    clearable
                    placeholder="请输入活动地址"
                  />
                </el-form-item>
                <el-form-item
                  label="活动人数"
                  prop="number"
                >
                  <el-input-number
                    v-model="lessonForm.number"
                    :min="0"
                    :disabled="editObj.id !== undefined"
                    controls-position="right"
                  />
                  <p class="tips">必填项，创建之后无法修改</p>
                </el-form-item>
                <el-form-item
                  label="活动类型:"
                  prop="activityType"
                >
                  <el-select
                    v-model="lessonForm.activityType"
                    :disabled="editObj.id !== undefined"
                    placeholder="请选择活动类型"
                    clearable
                    style="width:100%"
                  >
                    <el-option
                      v-for="item in activityTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <p class="tips">必填项，创建之后无法修改</p>
                </el-form-item>
                <el-form-item
                  label="报名缴费:"
                  prop="applyType"
                >
                  <el-select
                    v-model="lessonForm.applyType"
                    placeholder="请选择报名缴费类型"
                    clearable
                    style="width:100%"
                  >
                    <el-option
                      v-for="item in pays"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-if="lessonForm.applyType === '1'||lessonForm.applyType === '2'"
                  label="消耗课时"
                  prop="classCus"
                >
                  <el-input-number
                    v-model="lessonForm.classCus"
                    :min="0"
                    controls-position="right"
                    placeholder="请输入消耗课时"
                  />
                </el-form-item>
                <el-form-item
                  v-if="lessonForm.applyType === '1'||lessonForm.applyType === '3'"
                  label="物料费"
                  prop="materialFee"
                >
                  <el-input-number
                    v-model="lessonForm.materialFee"
                    :min="0"
                    controls-position="right"
                    placeholder="请输入物料费, 单位元"
                  />
                </el-form-item>
                <el-form-item
                  label="活动对象"
                  prop="target"
                >
                  <el-input
                    v-model="lessonForm.target"
                    clearable
                    placeholder="请输入活动对象"
                  />
                </el-form-item>
                <el-form-item
                  label="取消报名"
                  prop="cancelTime"
                >
                  <el-date-picker
                    v-model="lessonForm.cancelTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="允许用户取消报名的最晚时间"
                  />
                </el-form-item>
                <el-form-item prop="sort">
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
                    size="mini"
                    clearable
                    placeholder="设置为0-9999的某个数字，用户浏览列表是排序值大的在前"
                  />
                </el-form-item>
                <el-form-item
                  label="是否显示报名名单"
                  prop="participate"
                  class="radioSwitch"
                  checked
                >
                  <el-radio-group v-model="lessonForm.participate">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item
                  label="是否等位名单"
                  prop="waiting"
                  class="radioSwitch"
                  checked
                >
                  <el-radio-group v-model="lessonForm.waiting">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item
                  label="是否允许用户自主标记学员"
                  prop="vipSet"
                  class="radioSwitch"
                  checked
                >
                  <template slot="label">
                    <span>
                      <el-tooltip
                        effect="dark"
                        content="是否允许用户自主标记学员"
                        placement="top"
                        popper-class="sortTip"
                      >
                        <i
                          class="el-icon-warning"
                          style="margin-right:2px"
                        />
                      </el-tooltip>
                      是否允许用户自主标记学员
                    </span>
                  </template>
                  <el-radio-group v-model="lessonForm.vipSet">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item
                  label="是否设置支付金额"
                  prop="enablePay"
                  class="radioSwitch"
                  checked
                >
                  <el-radio-group v-model="lessonForm.enablePay">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  v-if="lessonForm.enablePay === '1'"
                  label="支付金额"
                  prop="payAmount"
                  checked
                >
                  <el-input-number
                    v-model="lessonForm.payAmount"
                    :min="0"
                    controls-position="right"
                  />
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import shareSetting from './shareSetting'
import { createActivity } from '@/api/microWeb/activityShow'
import Confirm from '@/components/MiniCommon/Confirm'
export default {
  components: {
    shareSetting,
    Confirm
  },
  props: {
    'visible': {
      type: Boolean,
      default: true
    },
    'editObj': {
      type: Object,
      default: undefined
    }
  },
  data() {
    return {
      visible2: false,
      visible3: false,
      isVisible: this.visible,
      address: 'https://img.ishanshan.com/gimg/n/20190116/e8a4dcec601a9f23ef2c97826cee671a',
      radioTabs: '基础设置',
      // 表格参数
      addLessonDialogTitlt: '新建课程',
      nowTime: '',
      Banner: [],
      shareCoverArr: [],
      activityCoverArr: [],
      previewImg: '',
      limit: 5,
      isActivityCoverShow: true,
      lessonForm: {
        name: '',
        activityCover: [],
        actBanner: [],
        shareCover: [],
        enrollTime: [],
        activityTime: [],
        address: '',
        number: '0',
        activityType: '',
        applyType: '',
        target: '',
        cancelTime: '',
        sort: '0',
        participate: '1',
        waiting: '1',
        vipSet: '1',
        enablePay: '0',
        payAmount: '0.01',
        classCus: '',
        materialFee: '',
        shareTitle: '',
        shareInfo: ''
      },
      activityTypes: [{ value: '1', label: '会员专属活动' }, { value: '2', label: '通用活动' }],
      pays: [{ value: '1', label: '消费课时 + 物料费' }, { value: '2', label: '消耗课时' }, { value: '3', label: '物料费' }, { value: '4', label: '免费' }],
      dialogImageUrl: '',
      dialogVisible: false,
      ShareCoverDialogVisible: false,
      activityCoverDialogVisible: false,
      rules: {
        name: [{ max: 20, message: '不能超过20字', trigger: 'blur' },
          { required: true, message: '请填写内容', trigger: 'change' }],
        activityCover: [
          { required: true, message: '支持png、jpeg、gif格式的图片，建议宽高 750*400px，图片大小不大于2M！', trigger: 'change' }
        ],
        actBanner: [
          { required: true, message: '支持png、jpeg、gif格式的图片，建议宽高 750*400px，图片大小不大于2M！', trigger: 'change' }
        ],
        enrollTime: [{ required: true, message: '请填写报名时间', trigger: 'change' }],
        activityTime: [{ required: true, message: '请选择活动时间', trigger: 'change' }],
        address: [{ required: true, message: '请输入活动地址', trigger: 'change' }],
        number: { required: true, message: '必填项, 创建之后无法修改', trigger: 'change' },
        activityType: [
          { required: true, message: '必填项, 创建之后无法修改', trigger: 'change' }
        ],
        applyType: [
          { required: true, message: '请选择报名缴费类型', trigger: 'change' }
        ],
        classCus: [{ required: true, message: '请输入消耗课时', trigger: 'blur' }],
        materialFee: [{ required: true, message: '请输入物料费, 单位元', trigger: 'blur' }],
        target: [{ required: true, message: '请输入活动对象', trigger: 'change' }],
        sort: [{ validator: /^\+?[1-9]\d{0,3}(\.\d*)?$/, trigger: 'change' }],
        participate: [{ required: true, message: ' ', trigger: 'change' }],
        waiting: [{ required: true, message: ' ', trigger: 'change' }],
        vipSet: [{ required: true, message: ' ', trigger: 'change' }],
        enablePay: [{ required: true, message: ' ', trigger: 'change' }],
        payAmount: [{ required: true, message: '填写大于0的金额', trigger: 'change' }],
        shareTitle: [{ max: 40, min: 1, message: '分享标题为1-40个字', trigger: 'blur' },
          { required: true, message: '请填写内容', trigger: 'change' }],
        shareInfo: [{ max: 80, min: 1, message: '分享简介为1-80个字', trigger: 'blur' },
          { required: true, message: '请填写内容', trigger: 'change' }],
        shareCover: [
          { required: true, message: '支持png、jpeg、gif格式的图片，建议宽高 750*400px，图片大小不大于2M！', trigger: 'change' }
        ]
      },
      // 内容设置参数
      iptCont: ''
    }
  },
  watch: {
    'visible'(val) {
      this.isVisible = val
    },
    'isVisible'(val) {
      this.$emit('update:visible', val)
    },
    Banner(prop) {
      const uploadBox = document.querySelector('.banner .el-upload--picture-card')
      if (this.Banner.length > 4) {
        uploadBox.style.display = 'none'
      } else if (this.Banner.length <= 4) {
        uploadBox.style.display = 'inline-block'
      }
    },
    shareCoverArr() {
      const shareCoverBox = document.querySelector('.shareCover .el-upload--picture-card')
      if (this.shareCoverArr && this.shareCoverArr.length > 0) {
        shareCoverBox.style.display = 'none'
      } else {
        shareCoverBox.style.display = 'inline-block'
      }
    },
    activityCoverArr() {
      const activityCoverBox = document.querySelector('.activityCover .el-upload--picture-card')
      if (this.activityCoverArr && this.activityCoverArr.length > 0) {
        activityCoverBox.style.display = 'none'
      } else {
        activityCoverBox.style.display = 'inline-block'
      }
    }

  },
  mounted() {
    var date = new Date()
    var Y = date.getFullYear() + '-'
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    var D = date.getDate() + ' '
    var h = date.getHours() + ':'
    var m = date.getMinutes() + ':'
    var s = date.getSeconds()
    this.nowTime = Y + M + D + h + m + s
  },
  methods: {
    close(formName) {
      this.isVisible = false
      this.visible2 = false
      this.visible3 = false
      this.$refs[formName].resetFields()
      this.lessonForm.activityCover = []
      this.lessonForm.shareCover = []
      this.lessonForm.actBanner = []
      this.iptCont = ''
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      const reset = this.$refs.lessonForm.resetFields
      this.$refs[formName].validate(valid => {
        this.visible3 = false
        if (this.iptCont === '') {
          this.$message.error('请输入内容')
        } else {
          if (valid) {
            this.isVisible = false
            var nid = ''
            var orgIds = ''
            if (this.editObj.id && this.editObj.orgIds.length > 0) {
              nid = this.editObj.id
              orgIds = this.editObj.orgIds[0]
            }
            const params = {
              id: nid,
              orgIds: orgIds,
              applyStartTime: this.lessonForm.enrollTime[0],
              applyEndTime: this.lessonForm.enrollTime[1],
              activityStartTime: this.lessonForm.activityTime[0],
              activityEndTime: this.lessonForm.activityTime[1],
              cancelTime: this.lessonForm.cancelTime,
              shareCover: this.transfor(this.shareCoverArr),
              activityCover: this.transfor(this.activityCoverArr),
              actBanner: this.transfor(this.Banner),
              name: this.lessonForm.name,
              actHtml: this.iptCont,
              sort: this.lessonForm.sort,
              address: this.lessonForm.address,
              targetPeople: this.lessonForm.target,
              materialFee: this.lessonForm.materialFee,
              applyType: this.lessonForm.applyType,
              classCus: this.lessonForm.classCus,
              activityType: this.lessonForm.activityType,
              vipSet: this.lessonForm.vipSet,
              number: this.lessonForm.number,
              enablePay: this.lessonForm.enablePay,
              payAmount: this.lessonForm.payAmount,
              shareTitle: this.lessonForm.shareTitle,
              shareInfo: this.lessonForm.shareInfo,
              waiting: this.lessonForm.waiting,
              participate: this.lessonForm.participate
            }
            const loading = this.$loading({
              lock: true,
              text: '拼命加载中。。。',
              // spinner: 'el-icon-loading',
              fullscreen: false,
              // background: 'rgba(0, 0, 0, 0.7)',
              target: document.querySelector('.side-dialog')
            })
            createActivity(params).then((res) => {
              if (res.data.errorCode === 0) {
                loading.close()
                this.$parent.resetFieldHanle()
                reset()
                this.lessonForm.activityCover = []
                this.lessonForm.shareCover = []
                this.lessonForm.actBanner = []
                this.iptCont = ''
              } else {
                this.$message.error(res.errorMessage)
              }
            })
          // })
          }
        }
      })
    },
    // 上传分享图片
    handleShareCoverSuccess(res, file, fileList) {
      this.shareCoverArr.push({ name: file.name, url: res.url })
      this.lessonForm.shareCover.push({ name: file.name, url: res.url })
      if (res.url !== '') {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      } else {
        this.$message.error('上传失败')
      }
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    handleShareCoverPreview(file) {
      this.previewImg = file.url
      this.ShareCoverDialogVisible = true
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList, this.lessonForm.shareCover)
      this.lessonForm.shareCover = []
      this.shareCoverArr.map((val, index) => {
        if (val.uid === file.uid) {
          this.Banner.splice(index, 1)
        }
      })
    },
    // 活动封面
    handleActivityCoverPreview(file) {
      this.previewImg = file.url
      this.activityCoverDialogVisible = true
    },
    handleActivityCoverSuccess(res, file, fileList) {
      this.activityCoverArr.push({ name: file.name, url: res.url })
      this.lessonForm.activityCover.push({ name: file.name, url: res.url })
      if (res.url !== '') {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      } else {
        this.$message.error('上传失败')
      }
    },
    handleActivityCoverRemove(file, fileList) {
      // console.log(file, fileList, this.lessonForm.shareCover)
      this.lessonForm.activityCover = []
      this.activityCoverArr.map((val, index) => {
        if (val.uid === file.uid) {
          this.activityCoverArr.splice(index, 1)
        }
      })
    },
    // banner上传成功函数
    handleBannerSuccess(res, file, fileList) {
      // console.log(file, fileList)
      this.lessonForm.actBanner.push({ name: file.name, url: res.url })
      this.Banner.push({ name: file.name, url: res.url })
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
      this.lessonForm.actBanner = []
      this.Banner.map((val, index) => {
        if (val.uid === file.uid) {
          this.Banner.splice(index, 1)
        }
      })
    },
    handleBannerPreview(file, fileList) {
      this.previewImg = file.url
      this.dialogVisible = true
    },
    // 数组转字符串
    transfor(arr) {
      var bannerList = ''
      arr.map((val, index) => {
        if (index < arr.length) {
          bannerList += val.url
          if (index < arr.length - 1) {
            bannerList += ','
          }
        }
      })
      return bannerList
    },
    // 时间戳转标准格式
    timeTransfer(date) {
      var Y = date.getFullYear() + '-'
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      var D = (date.getDate() + 1 < 10 ? '0' + (date.getDate() + 1) : date.getDate() + 1) + ' '
      var h = (date.getHours() + 1 < 10 ? '0' + (date.getHours() + 1) : date.getHours() + 1) + '-'
      var m = (date.getMinutes() + 1 < 10 ? '0' + (date.getMinutes() + 1) : date.getMinutes() + 1) + '-'
      var s = (date.getSeconds() + 1 < 10 ? '0' + (date.getSeconds() + 1) : date.getSeconds() + 1)

      const time = Y + M + D + ' ' + h + m + s
      return time
    },
    transferAddact({ quill, html, text }) {
      this.iptCont = html
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
  // z-index: 10000;
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
  padding: 0 20px;
  .quill-editor {
    height: 80vh;
  }
  .top {
    // width: calc(100vw - 180px) !important;
    min-height: 40px;
    justify-content: space-between;
    border-bottom: 1px solid #5d9cec;
    display: flex;
    justify-content: space-between;
    padding: 10px 0 10px 0;
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
    width: 100%;
    overflow: auto;
    .body-left {
      // width: 50%;
      // background: #f1f1f1;
      // display: flex;
      // justify-content: center;
      height: calc(100vh - 83px);
      width: 460px;
      padding: 0 30px;
      padding-top: 30px;
      background: rgba(240, 242, 245, 0.8);
      // overflow-y: auto;
      margin-left: 20px;
      .body-left-container {
        width: 100%;
        position: relative;
        // height: 726px;
      }
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
        // height: 480px;
        height: calc(100vh - 200px);
        overflow-y: auto;
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
          p:nth-of-type(1) {
            width: 100%;
            font-size: 15px;
            color: #333333;
            padding: 10px;
            background: white;
            line-height: 21px;
            overflow-wrap: break-word;
            span {
              font-size: 15px;
              color: #e5466f;
              line-height: 15px;
            }
          }
          p:nth-of-type(2) {
            width: 100%;
            font-size: 13px;
            color: #666666;
            line-height: 13px;
            padding: 0px 10px 10px;
            background: white;
          }
        }
        .border {
          height: 10px;
          background-color: #f1f1f1;
          border-top: 1px #ddd solid;
          border-bottom: 1px #ddd solid;
        }
        .biaoti {
          width: 100%;
          font-size: 13px;
          color: #333333;
          line-height: 13px;
          height: 44px;
          display: flex;
          align-items: center;
          padding: 10px 0px 0px 10px;
          border-bottom: 10px white solid;
          background: white;
          i {
            width: 4px;
            height: 60%;
            background: #3b72b7;
            margin-right: 5px;
          }
          span {
            // height: 30px;
            align-items: center;
            font-size: 13px;
            color: #2e5ca8;
            line-height: 13px;
          }
        }
        .waitImg {
          display: flex;
          flex-wrap: wrap;
          background: white;
          padding: 0px 10px 10px 10px;
          width: 100%;
          .imgCont {
            width: 17%;
            margin: 3px;
            .imgBox {
              width: 100%;
              height: 44px;
              img {
                width: 100%;
                height: 100%;
              }
            }
            p {
              width: 100%;
              text-align: center;
            }
          }
        }
        .creatBTn {
          width: 80%;
          height: 44px;
          border: 1px #3b72be solid;
          margin: 0 auto;
          margin-bottom: 20px;
          margin-top: 20px;
          text-align: center;
          font-size: 13px;
          color: #4a90e2;
          line-height: 44px;
        }
        .conentSetting {
          background: white;
        }
        .orgDetail {
          background: #fff;
          // margin-top: 10px;
          // padding: 0 15px;
          .orgName {
            height: 44px;
            line-height: 44px;
            border-bottom: 1px solid #ddd;
          }
          .orgAdd {
            height: 35px;
            line-height: 35px;
            .el-icon-location {
              // color: #ccc;
              font-size: 24px;
              vertical-align: middle;
            }
            .el-icon-phone {
              font-size: 24px;
              // color: #ccc;
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
        .orgInfo {
          background: white;
          padding: 5px 0px 5px 0px;
          p {
            width: 100%;
            font-size: 13px;
            color: #666666;
            display: flex;
            -webkit-box-align: center;
            align-items: center;
            padding: 0px 10px 0px 10px;
            min-height: 30px;
            line-height: 21px;
            overflow-wrap: break-word;
          }
        }
      }
      .body-left-footer {
        width: 100%;
        height: 44px;
        display: flex;
        background: #fff;
        position: absolute;
        left: 0;
        bottom: 0;
        .creatAct {
          width: 25%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .yuyue {
          width: 75%;

          // height: 50px;
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
      height: calc(100vh - 83px);
      width: 640px;
      margin-left: 20px;
      overflow: auto;
      padding-right: 20px;
      // padding-left: 20px;
      // padding-right: 50px;
      // padding-bottom: 100px;
      .tips {
        font-size: 12px;
        color: #999;
        line-height: 20px;
        margin-top: 6px;
      }
      .tab {
        margin-bottom: 20px;
      }
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
.radioSwitch .el-form-item__label {
  margin-left: 45px;
  width: 140px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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

