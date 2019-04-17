<template>
  <div class="addLantentStuDialog_container">
    <el-dialog
      :visible.sync="addLantentDialogShow"
      :title="titleChangeDialog"
      :close-on-click-modal="false"
      @close="cancelDialog('addLantentForm')"
    >
      <el-form
        ref="addLantentForm"
        :model="addLantentData"
        :rules="rules"
        label-width="90px"
      >
        <div
          class="title"
          style="margin-top:0;margin-bottom:14px;"
        >
          <span class="form_txt" />
          <span class="block_title">基础信息</span>
        </div>
        <div
          v-if="isEditShowItemRecord"
          class="from_item_row from_row_frist"
        >
          <el-form-item
            v-if="isEditShowItemRecord"
            ref="statusForm"
            label="跟进状态:"
            prop="studentFollowState"
            style="width: 40%"
          >
            <el-select
              v-model="addLantentData.studentFollowState"
              placeholder="请选择跟进状态"
              clearable
            >
              <el-option
                v-for="item in followStatusList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label=""
            prop="addType"
            style="width: 58%"
          >
            <el-radio-group v-model="addLantentData.addType">
              <el-radio
                v-if="type == 'addSea'"
                label="1"
              >放入公海</el-radio>
              <el-radio
                v-if="type == 'add' || type=='edit'"
                label="2"
              >分配销售</el-radio>
            </el-radio-group>
            <el-select
              v-if="type == 'add' || type=='edit'"
              v-model="addLantentData.sellerId"
              placeholder=""
              clearable
              style="width: 89px;"
            >
              <el-option
                v-for="item in collectList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item
          v-if="!isEditShowItemRecord"
          label="负责销售:"
          prop="sellerNameId"
          style="width: 40%"
        >
          <el-select
            v-model="addLantentData.sellerNameId"
            placeholder="请选择跟进状态"
            clearable
            @change="sellerChange"
          >
            <el-option
              v-for="item in collectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div class="from_item_row">
          <el-form-item
            label="重要程度:"
            prop="importance"
          >
            <el-select
              v-model="addLantentData.importance"
              placeholder="请输入重要程度"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="(item,index) in importantList"
                :key="item.key+'_'+index"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="title">
          <span class="form_txt" />
          <span class="block_title">孩子信息</span>
        </div>
        <div class="from_item_row from_row_second">
          <el-form-item
            label="姓名:"
            prop="name"
            style="width: 45%"
          >
            <el-input
              v-model="addLantentData.name"
              clearable
              placeholder="请输入孩子姓名"
              @change="stuNameChange"
            />
            <div
              v-if="!nameAllow"
              class="from_name_tip"
              @click="openNameCheckDialog()"
            >该姓名已存在，点击查看</div>
          </el-form-item>
          <el-form-item
            label="性别:"
            prop="sex"
            style="width: 45%"
          >
            <el-radio-group v-model="addLantentData.sex">
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="from_item_row">
          <el-form-item
            label="生日:"
            prop="birthday"
            style="width: 45%"
            class="birthday"
          >
            <el-date-picker
              v-model="addLantentData.birthday"
              :picker-options="pickerOptions"
              clearable
              type="date"
              placeholder="请选择生日日期"
              style="width: 100%"
              value-format="yyyy-MM-dd"
              @change="birthdayChange"
            />
          </el-form-item>
          <el-form-item
            label="星座:"
            prop="constellation"
            style="width: 45%"
          >
            <el-select
              v-model="addLantentData.constellation"
              placeholder="生日选择后自动带出"
              disabled
              style="width:202px"
            >
              <el-option value="白羊座">白羊座</el-option>
              <el-option value="金牛座">金牛座</el-option>
              <el-option value="双子座">双子座</el-option>
              <el-option value="巨蟹座">巨蟹座</el-option>
              <el-option value="狮子座">狮子座</el-option>
              <el-option value="处女座">处女座</el-option>
              <el-option value="天秤座">天秤座</el-option>
              <el-option value="天蝎座">天蝎座</el-option>
              <el-option value="射手座">射手座</el-option>
              <el-option value="摩羯座">摩羯座</el-option>
              <el-option value="水瓶座">水瓶座</el-option>
              <el-option value="双鱼座">双鱼座</el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="from_item_row">
          <el-form-item
            label="昵称:"
            prop="nickName"
          >
            <el-input
              v-model="addLantentData.nickName"
              placeholder="请输入昵称"
            />
          </el-form-item>
          <el-form-item
            label="民族:"
            prop="nation"
          >
            <el-input
              v-model="addLantentData.nation"
              placeholder="请输入民族"
            />
          </el-form-item>
        </div>
        <div style="padding-left: 43px;margin-bottom: 20px;">
          <el-button
            type="text"
            @click="openMoreInfo(isMoreInfoText)"
          >{{ isMoreInfoText }}</el-button>
        </div>
        <div v-show="isMoreInfo">
          <div class="from_item_row">
            <el-form-item
              label="血型:"
              prop="bloodType"
            >
              <el-select
                v-model="addLantentData.bloodType"
                placeholder="请输入血型"
                style="width:202px"
              >
                <el-option value="A">A</el-option>
                <el-option value="B">B</el-option>
                <el-option value="AB">AB</el-option>
                <el-option value="O">O</el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="爱好:"
              prop="hobby"
            >
              <el-input
                v-model="addLantentData.hobby"
                placeholder="请输入爱好"
              />
            </el-form-item>
          </div>
          <div class="from_item_row">
            <el-form-item
              label="年级:"
              prop="grade"
            >
              <el-input
                v-model="addLantentData.grade"
                placeholder="请输入年级"
              />
            </el-form-item>
            <el-form-item
              label="特长:"
              prop="speciality"
            >
              <el-input
                v-model="addLantentData.speciality"
                placeholder="请输入特长"
              />
            </el-form-item>
          </div>
          <div class="from_item_row">
            <el-form-item
              label="学校:"
              prop="schaddress"
            >
              <el-input
                v-model="addLantentData.schaddress"
                placeholder="请输入学校"
              />
            </el-form-item>
            <el-form-item
              label="社保号码:"
              prop="socialSecurityNum"
            >
              <el-input
                v-model="addLantentData.socialSecurityNum"
                placeholder="请输入社保号码"
              />
            </el-form-item>
          </div>
          <div class="from_item_row">
            <el-form-item
              label="联系地址:"
              prop="conaddress"
            >
              <el-input
                v-model="addLantentData.conaddress"
                :autosize="{ minRows: 3, maxRows: 3}"
                placeholder="请输入联系地址"
                type="textarea"
              />
            </el-form-item>
            <el-form-item
              label="备注:"
              prop="remark"
            >
              <el-input
                v-model="addLantentData.remark"
                :autosize="{ minRows: 3, maxRows: 3}"
                placeholder="请输入备注"
                type="textarea"
              />
            </el-form-item>
          </div>
        </div>
        <div class="title">
          <span class="form_txt" />
          <span class="block_title">家长信息</span>
        </div>
        <div
          v-for="(child, index) of addLantentData.list"
          :key="index + 'list'"
          :class="type == 'add' || type == 'addSea' ?'parentInfo':''"
        >
          <div class="from_item_row from_row_second">
            <el-form-item
              :prop="'list.' + index +'.parentName'"
              :rules="{
                required: true, message: '请输入姓名', trigger: 'change'
              }"
              label="姓名:"
            >
              <el-input
                v-model="child.parentName"
                placeholder="请输入姓名"
              />
            </el-form-item>
            <el-form-item
              :prop="'list.' + index +'.parentMobile'"
              :rules="[
                {required: true, message: '请输入家长手机号码', trigger: 'change' },
                { validator: checkMobile }
              ]"
              label="手机号码:"
            >
              <el-input
                v-model="child.parentMobile"
                placeholder="请输入家长手机号码"
                @change="(val) => {parentMobileChange(val,child)}"
              />
              <div
                v-if="!child.mobileAllow"
                class="from_name_tip"
                @click="openParentPhone(index)"
              >该手机号已存在，点击查看</div>
            </el-form-item>
          </div>
          <div class="from_item_row">
            <el-form-item label="家长关系:">
              <el-select
                v-model="child.relation"
                placeholder="请输入家长关系"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in relationList"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="QQ:">
              <el-input
                v-model="child.qqNumber"
                placeholder="请输入QQ号码"
              />
            </el-form-item>
          </div>
          <div class="from_item_row">
            <el-form-item label="行业:">
              <el-input
                v-model="child.trade"
                placeholder="请输入行业"
              />
            </el-form-item>
            <el-form-item label="邮箱:">
              <el-input
                v-model="child.email"
                placeholder="请输入邮箱"
              />
            </el-form-item>
          </div>
          <div
            v-show="isEditShowItem && addLantentData.list.length > 1"
            class="from_delete_text"
            @click="deleteParentInfo(index)"
          >
            <img src="https://img.ishanshan.com/gimg/n/20190322/984dfaa82a40abdb012da66ea9dc5707">
            删除家长信息
          </div>
        </div>
        <div
          v-show="isEditShowItem"
          class="go_add_parent"
          @click="addMoreParent()"
        >
          <img src="https://img.ishanshan.com/gimg/n/20190322/e6c073e90ca20cf3ec74d6e580c35efb">
          继续添加家长
        </div>
        <div
          style="margin-top: 10px;"
          class="title"
        >
          <span class="form_txt" />
          <span class="block_title">来源</span>
        </div>
        <div class="from_item_row from_row_second">
          <el-form-item
            label="一级来源:"
            prop="channel"
          >
            <el-select
              v-model="addLantentData.channel"
              :disabled="isFirstChannelDisable"
              placeholder="请输入一级来源"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in firstChannelList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="二级来源:"
            prop="secondChannel"
          >
            <el-select
              :disabled="isSecondChannelDisable"
              v-model="addLantentData.secondChannel"
              placeholder="请输入二级来源"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in secondChannelList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="from_item_row">
          <el-form-item
            label="推荐人:"
            prop="recommender"
          >
            <el-select
              v-model="addLantentData.recommender"
              placeholder="请选择推荐人（家长）"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in parentList"
                :key="item.id"
                :label="item.name+' '+item.mobile"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="收集人:"
            prop="collecterId"
          >
            <el-select
              v-model="addLantentData.collecterId"
              placeholder="请输入收集人"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in collectList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('addLantentForm')"
        >取 消</el-button>
        <el-button
          v-if="type!='editSea' && type!='edit' && type!='editRead'"
          type="primary"
          style="float:right"
          @click="saveForm('addLantentForm','1')"
        >保存学员并报名</el-button>
        <el-button
          type="primary"
          style="float:right"
          @click="saveForm('addLantentForm')"
        >保 存</el-button>
      </span>
    </el-dialog>
    <!-- 孩子姓名查重弹框 -->
    <NameCheckDialog
      ref="nameCheckDialog"
      :data-source="nameList"
      @toCloseDialog="getCloseDialog"
      @toClearDialog="getClearDialog"
    />
    <!-- 家长手机号查重弹框 -->
    <PhoneCheckDialog
      v-if="isPhoneVisible"
      ref="phoneCheckDialog"
      :data-source="parentTelList"
      @toEditParent="getEditParent"
      @toClose="closePhoneDialog"
    />
  </div>
</template>

<script>
import NameCheckDialog from './nameCheckDialog.vue'
import PhoneCheckDialog from './phoneCheckDialog.vue'
import { JusConstellation } from '@/utils/dateFormat'
import {
  queryClueStuList,
  dictGetByKey,
  parentSummary,
  tenantUserSummaryQuery,
  addClueStu,
  excistForName,
  parentDupCheck
} from '@/api/crm/studentInfo/highSeas'
import {
  confChannelEditResult
} from '@/api/crm/studentInfo/lantentStu'
import {
  // summaryQueryUsers,
  createStu,
  getStuMsg // 学员详情
} from '@/api/crm/studentInfo/readingStu.js'
export default {
  components: {
    NameCheckDialog, // 孩子姓名查重弹框
    PhoneCheckDialog // 家长手机号查重弹框
  },
  props: {
    leadSource: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      addLantentDialogShow: false,
      isMoreInfo: false,
      isMoreInfoText: '展开更多信息',
      titleChangeDialog: '新建潜在学员',
      isEditShowItem: true,
      isPhoneVisible: false, // 手机号查重
      addLantentData: {
        studentFollowState: '', // 跟进状态
        sellerNameId: '', // 负责销售
        addType: '1',
        sellerId: '', // 销售id
        name: '', // 孩子姓名
        sex: '', // 性别
        birthday: '', // 生日
        constellation: '', // 星座
        importance: '', // 重要程度
        nickName: '', // 昵称
        nation: '', // 名族
        bloodType: '', // 血型
        hobby: '', // 爱好
        grade: '', // 年级
        speciality: '', // 特长
        schaddress: '', // 学校地址
        socialSecurityNum: '', // 社保号码
        conaddress: '', // 联系地址
        remark: '', // 备注
        channel: '', // 一级来源
        secondChannel: '', // 二级来源
        recommender: '', // 推荐人
        collecterId: '', // 收集人
        list: [
          {
            parentName: '', // 家长姓名
            parentMobile: '', // 家长手机号
            relation: '', // 家长关系
            qqNumber: '', // QQ
            trade: '', // 行业
            email: '', // 邮箱
            mobileAllow: true
          }
        ]
      },
      rules: {
        studentFollowState: [
          { required: true, message: '请选择跟进状态', triggle: 'change' }
        ],
        name: [
          { required: true, message: '请输入孩子姓名', triggle: 'change' }
        ],
        channel: [
          { required: true, message: '请选择一级来源', triggle: 'change' }
        ]
      },
      followStatusList: [], // 跟进状态列表
      firstChannelList: [], // 一级来源
      secondChannelList: [], // 二级来源
      importantList: [], // 重要程度
      relationList: [], // 家长关系
      parentList: [], // 家长列表
      collectList: [], // 收集列表
      detailContent: {}, // 编辑详细信息
      rowInfo: {}, // 该条信息
      type: '', // 编辑/公海池编辑/新增
      pickerOptions: {
        disabledDate(time) {
          return time && time.valueOf() > Date.now() - 24 * 60 * 60 * 100
        }
      },
      isEditShowItemRecord: true,
      nameAllow: true, // 学员姓名是否存在
      nameList: [], // 姓名重复列表
      parentTelList: [], // 家长手机号重复列表
      isFirstChannelDisable: false, // 一级来源是否可编辑
      isSecondChannelDisable: false // 二级来源是否可编辑
    }
  },
  methods: {
    /* 负责销售值改变 */
    sellerChange(value) {
      this.$forceUpdate()
    },
    checkMobile(rule, value, callback) {
      if (value == '' || value == undefined || value == null) { //eslint-disable-line
        callback()
      } else if (!(/^1[0-9]{10}$/.test(value))) {
        callback('请输入正确格式的手机号')
      } else {
        callback()
      }
    },
    /* 学员姓名查重 */
    stuNameChange(val) {
      excistForName({ name: val }).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          if (data.excist) {
            this.nameAllow = false
          } else {
            this.nameAllow = true
          }
          this.nameList = data.data
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 学员家长手机号查重 */
    parentMobileChange(val, child) {
      parentDupCheck({ parentMobile: child.parentMobile }).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          child.mobileAllow = data.allowedAdd
          this.parentTelList = data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 回填同一家长的姓名 */
    getEditParent(currentRow, index) {
      if (this.addLantentData.list && this.addLantentData.list.length > 0) {
        this.addLantentData.list[index].parentName = currentRow.parentName
        this.addLantentData.list[index].mobileAllow = true
      }
    },
    /* 关闭手机号查重 */
    closePhoneDialog() {
      this.isPhoneVisible = false
    },
    /* 关闭弹窗 */
    getCloseDialog() {
      this.addLantentDialogShow = false
    },
    /* 清空表单数据 */
    getClearDialog() {
      this.$refs['addLantentForm'].resetFields()
      this.mobileAllow = true
      this.nameAllow = true
      this.addLantentData.sellerId = ''
    },
    /* 控制展开更多信息 */
    openMoreInfo(text) {
      if (text === '展开更多信息') {
        this.isMoreInfo = true
        this.isMoreInfoText = '收起'
      } else {
        this.isMoreInfo = false
        this.isMoreInfoText = '展开更多信息'
      }
    },
    /* 添加更多家长表单 */
    addMoreParent() {
      const tempData = {
        parentName: '', // 家长姓名
        parentMobile: '', // 家长手机号
        relation: '', // 家长关系
        qqNumber: '', // QQ
        trade: '', // 行业
        email: '', // 邮箱
        mobileAllow: true
      }
      this.addLantentData.list.push(tempData)
    },
    /* 删除更多家长表单 */
    deleteParentInfo(index) {
      this.addLantentData.list.splice(index, 1)
    },
    /* 孩子姓名查重弹框 */
    openNameCheckDialog() {
      this.$refs.nameCheckDialog.showDialog()
    },
    /* 家长手机号查重弹框 */
    openParentPhone(index) {
      this.isPhoneVisible = true
      this.$nextTick(() => {
        this.$refs.phoneCheckDialog.showDialog(index)
      })
    },
    /* 显示弹框 */
    showDialog(type, row) {
      this.type = type
      if (type === 'edit') {
        this.rowInfo = row
        this.titleChangeDialog = '编辑学员'
        this.isEditShowItem = false
        this.getList()
        this.getFirstChannelEditResult()
        this.getSecondChannelEditResult()
      } else if (type === 'editSea') {
        this.rowInfo = row
        this.titleChangeDialog = '编辑学员'
        this.isEditShowItem = false
        this.getList()
        this.getFirstChannelEditResult()
        this.getSecondChannelEditResult()
      } else if (type === 'editRead') {
        this.rowInfo = row
        this.titleChangeDialog = '编辑学员'
        this.isEditShowItem = false
        this.isEditShowItemRecord = false
        this.getFirstChannelEditResult()
        this.getSecondChannelEditResult()
        // this.summaryQueryUsersFun()
        this.getStuList()
      } else if (type === 'add') {
        this.addLantentData.sellerId = ''
        this.addLantentData.addType = '2'
        this.titleChangeDialog = '新建潜在学员'
        this.isEditShowItem = true
        this.addLantentDialogShow = !this.addLantentDialogShow
        this.$nextTick(() => {
          this.$refs['addLantentForm'].clearValidate() // 清除跟进状态的验证
        })
      } else if (type === 'addSea') {
        this.addLantentData.addType = '1'
        this.titleChangeDialog = '新建名单'
        this.isEditShowItem = true
        this.addLantentDialogShow = !this.addLantentDialogShow
        this.$nextTick(() => {
          this.$refs['addLantentForm'].clearValidate() // 清除跟进状态的验证
        })
      }
      this.nameAllow = true
      this.addLantentData.list && this.addLantentData.list.map(item => {
        item.mobileAllow = true
      })
      this.addLantentData.list = []
      const tempData = {
        parentName: '', // 家长姓名
        parentMobile: '', // 家长手机号
        relation: '', // 家长关系
        qqNumber: '', // QQ
        trade: '', // 行业
        email: '', // 邮箱
        mobileAllow: true
      }
      this.addLantentData.list.push(tempData)
      this.getFollowStatus()
      this.getRecommender()
      this.getFirstChannel()
      this.getSecondChannel()
      this.getUserList()
      this.getImportant()
      this.getParentRelationship()
    },
    /* 查询1级来源是否可修改 */
    getFirstChannelEditResult() {
      const params = {
        confkey: 'FIRSTCHANNELEDIT'
      }
      confChannelEditResult(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          if (data.value == '1') { //eslint-disable-line
            this.isFirstChannelDisable = false
          } else {
            this.isFirstChannelDisable = true
          }
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 查询2级来源是否可修改 */
    getSecondChannelEditResult() {
      const params = {
        confkey: 'SECONDCHANNELEDIT '
      }
      confChannelEditResult(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          if (data.value == '1') { //eslint-disable-line
            this.isSecondChannelDisable = false
          } else {
            this.isSecondChannelDisable = true
          }
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 跟进状态 */
    getFollowStatus() {
      const params = {
        dictkey: 'studentFollowState'
      }
      dictGetByKey(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.followStatusList = data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 一级来源 */
    getFirstChannel() {
      const params = {
        dictkey: 'firstChannel'
      }
      dictGetByKey(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.firstChannelList = data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 二级来源 */
    getSecondChannel() {
      const params = {
        dictkey: 'secondChannel'
      }
      dictGetByKey(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.secondChannelList = data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 重要程度 */
    getImportant() {
      const params = {
        dictkey: 'importance'
      }
      dictGetByKey(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.importantList = data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 家长关系 */
    getParentRelationship() {
      const params = {
        dictkey: 'parentRelationship'
      }
      dictGetByKey(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.relationList = data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 家长 */
    getRecommender() {
      parentSummary().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.parentList = data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 员工列表 */
    getUserList() {
      tenantUserSummaryQuery().then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.collectList = data.results
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 获取编辑详情（公海池） */
    getList() {
      const params = {
        id: this.rowInfo.id
      }
      queryClueStuList(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.detailContent = data.results && data.results[0]
          if (this.detailContent.list && this.detailContent.list.length > 0) {
            this.detailContent.list.map(item => {
              item.mobileAllow = true
            })
            this.addLantentData = this.detailContent
          } else {
            const obj = {
              parentName: '',
              parentMobile: '',
              relation: '',
              qqNumber: '',
              trade: '',
              email: '',
              mobileAllow: true
            }
            this.detailContent.list.push(obj)
            this.addLantentData = this.detailContent
          }
          this.addLantentData.constellation = JusConstellation(this.detailContent.birthday)
          this.addLantentData.sellerId = this.detailContent.sellerId
          this.addLantentDialogShow = !this.addLantentDialogShow
          this.$nextTick(() => {
            this.$refs['statusForm'].clearValidate() // 清除跟进状态的验证
          })
          if (this.type == 'edit') { //eslint-disable-line
            this.$nextTick(() => {
              this.$forceUpdate()
              this.addLantentData.addType = '2'
            })
          }
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    },
    /* 获取在读学员编辑详情 */
    getStuList() {
      const params = {
        stuId: this.rowInfo.id
      }
      getStuMsg(params).then(res => {
        if (res.data.errorCode === 0) {
          this.detailContent = res.data.data
          if (this.detailContent.list && this.detailContent.list.length > 0) {
            this.detailContent.list.map(item => {
              item.mobileAllow = true
            })
            this.addLantentData = this.detailContent
            this.addLantentData.collecterId = this.detailContent.collecter || this.detailContent.collecterId
          } else {
            const obj = {
              parentName: '',
              parentMobile: '',
              relation: '',
              qqNumber: '',
              trade: '',
              email: '',
              mobileAllow: true
            }
            this.detailContent.list.push(obj)
            this.addLantentData = this.detailContent
          }
          this.addLantentData.constellation = JusConstellation(this.detailContent.birthday)
          this.addLantentData.sellerId = this.detailContent.sellerId
          this.addLantentData.sellerNameId = this.detailContent.seller
          this.addLantentDialogShow = !this.addLantentDialogShow
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 生日选择改变 */
    birthdayChange(val) {
      this.addLantentData.constellation = JusConstellation(val)
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.addLantentDialogShow = false
      // this.$refs[formName].resetFields()
      for (const i in this.addLantentData) {
        if (i !== 'addType' || i !== 'list') {
          this.addLantentData[i] = ''
        }
      }
    },
    /* 保存并报名 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addLantentDialogShow = false
        }
      })
    },
    /* 确定提交弹框表单内容 */
    saveForm(formName, type) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {}
          for (const i in this.addLantentData) {
            if (this.addLantentData[i] != '' && this.addLantentData[i] != null && this.addLantentData[i] != undefined) { //eslint-disable-line
              params[i] = this.addLantentData[i]
            } else {
              delete params[i]
            }
          }
          params.list && params.list.map(item => {
            delete item.openId
          })
          if (this.addLantentData.channel) {
            params.firstChannel = this.addLantentData.channel
            delete params.channel
          }
          if (this.type == 'add' || this.type == 'edit') { //eslint-disable-line
            params.addType = '2'
          }else if(this.type == 'addSea'){ //eslint-disable-line
            params.addType = '1'
          } else if (this.type == 'editSea' || this.type == 'editRead') { //eslint-disable-line
            params.addType = '1'
          }
          if (this.type == 'editSea') { //eslint-disable-line
            params.sellerId = this.rowInfo.sellerId
          } else {
            params.sellerId = this.addLantentData.sellerId
          }
          delete params.studentFollowStateName
          delete params.channelName
          delete params.recordNum
          delete params.recordStatus
          delete params.preSellerId
          delete params.preSellerName
          delete params.target
          delete params.sellerName
          delete params.orgName
          if (this.type == 'add') { //eslint-disable-line
            if (this.addLantentData.sellerId) {
              this.addOrEdit(params, type)
            } else {
              this.$message.error('请选择销售')
            }
          } else if (this.type == 'editSea' || this.type == 'addSea') { //eslint-disable-line
            this.addOrEdit(params)
          } else if (this.type == 'editRead') { //eslint-disable-line
            this.createStuFun(params)
          } else if(this.type == 'edit') { //eslint-disable-line
            this.addOrEdit(params)
          }
        }
      })
    },
    /* 在读学员确定编辑 */
    createStuFun(params, type) {
      // const paramsList = {
      //   stuId: params.id,
      //   list: params.list
      // }
      // updateStuParent(paramsList).then(res => {
      //   if (res.data.errorCode === 0) {
      //     console.log('res--->', res)
      //   } else {
      //     this.$message.error(res.data.errorMessage)
      //   }
      // })

      const paramses = {
        ...params
      }
      paramses.parentList = params.list
      paramses.seller = paramses.sellerNameId
      paramses.channel = paramses.firstChannel
      // delete paramses.firstChannel
      // delete paramses.list
      createStu(paramses).then(res => {
        if (res.data.errorCode === 0) {
          this.addLantentDialogShow = false
          this.$message.success(res.data.errorMessage)
          this.$emit('toUpdateDetailData', this.rowInfo)
          this.$emit('toUpdateFollow')
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 新增/编辑 */
    addOrEdit(params, type) {
      let flag = false
      if (this.addLantentData.list && this.addLantentData.list.length > 0) {
        this.addLantentData.list.map(item => {
          if (this.nameAllow == true || item.mobileAllow == true) { //eslint-disable-line
            flag = true
          } else if (this.nameAllow == false && this.mobileAllow == false) { //eslint-disable-line
            flag = false
          }
        })
        if (flag) {
          addClueStu(params).then(res => {
            const data = res.data
            if (data.errorCode === 0) {
              this.$message.success(data.errorMessage)
              // this.$refs['addLantentForm'].resetFields()
              for (const i in this.addLantentData) {
                if (i !== 'addType' || i !== 'list') {
                  this.addLantentData[i] = ''
                }
              }
              this.addLantentDialogShow = false
              if (this.type == 'edit' || this.type == 'editSea') { //eslint-disable-line
                this.$emit('toUpdateDetailData', this.rowInfo)
                this.$emit('toUpdateFollow', this.rowInfo) // 编辑更新侧边栏和表格数据
              } else if(this.type == 'addSea') { //eslint-disable-line
                this.$emit('toUpdateTable')
              }else if(this.type == 'add') { //eslint-disable-line
                this.$emit('toUpdateFollow') // 新增更新表格数据
              }
              if(type == '1') { //eslint-disable-line
                params.id = data.clueStudentId
                this.$emit('toOpenApply', params)
              }
            } else {
              this.$message.error(data.errorMessage)
            }
          })
        } else {
          this.$emit('toOpenTip')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.addLantentStuDialog_container /deep/ {
  .el-dialog {
    width: 700px;
  }
  .from_item_row {
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      width: 45%;
    }
    display: flex;
    justify-content: space-between;
    width: 100%;
    .from_name_tip {
      color: #ff5500;
      cursor: pointer;
      text-decoration: underline;
      line-height: 18px;
    }
  }
  .from_row_frist {
    .el-radio-group {
      width: 30%;
    }
    .el-radio + .el-radio {
      margin-left: 10px;
    }
  }
  .from_row_second {
    margin-top: 14px;
  }
  .go_add_parent {
    width: 100%;
    height: 40px;
    line-height: 40px;
    color: #46b6ee;
    padding-left: 7px;
    cursor: pointer;
    width: 130px;
    img {
      vertical-align: middle;
    }
  }
  .from_delete_text {
    color: rgba(208, 2, 27, 1);
    margin-left: 7px;
    margin-bottom: 14px;
    cursor: pointer;
    width: 130px;
    img {
      vertical-align: middle;
    }
  }
  .title {
    color: #333;
    margin-top: 6px;
    .block_title {
      font-size: 16px;
    }
  }
  .parentInfo {
    border-bottom: 1px solid #efefef;
  }
  .birthday {
    .el-input--prefix .el-input__inner {
      padding-left: 15px;
    }
  }
}
</style>

