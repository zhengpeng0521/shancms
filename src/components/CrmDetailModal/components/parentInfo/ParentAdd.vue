<template>
  <div>
    <el-dialog
      :visible.sync="addVisible"
      :append-to-body="true"
      title="添加关联家长"
      class="parentAdd_container"
      @close="closeAdd"
    >
      <el-form
        ref="parentAddForm"
        :model="parentAddForm"
        label-width="100px"
        label-suffix=":"
        class="detail-visite-form"
      >
        <el-form-item
          label="名单姓名"
          prop="stuId"
        >
          <span>{{ baseData.name }}</span>
        </el-form-item>
        <el-form-item
          :rules="[
            { required: true, message: '请输入家长信息', trigger: 'change'}
          ]"
          label="家长信息"
          prop="parentInfo"
        >
          <el-select
            v-model="parentAddForm.parentInfo"
            placeholder="请选择家长信息"
            style="width:100%"
            filterable
            @change="parentInfoChange(parentAddForm.parentInfo)"
          >
            <el-option
              v-for="item in allParentInfoList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="isParentListSelect"
          :rules="[
            { required: true, message: '请输入家长姓名', trigger: 'change'}
          ]"
          label="家长姓名"
          prop="parentName"
        >
          <el-select
            v-model="parentAddForm.parentName"
            placeholder="请选择家长关系"
            clearable
            filterable
            style="width:100%"
          >
            <el-option
              v-for="item in allParentNameList"
              :key="item.id"
              :label="item.name + '(' + item.mobile + ')'"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <div v-else>
          <el-form-item
            :rules="[
              { required: true, message: '请输入家长姓名', trigger: 'change'}
            ]"
            label="家长姓名"
            prop="parentName"
          >
            <el-input
              v-model="parentAddForm.parentName"
              placeholder="请输入家长姓名"
            />
          </el-form-item>
          <el-form-item
            :rules="[
              { required: true, message: '请输入手机号', trigger: 'change'},
              { pattern: /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|166|198|199|(147))+\d{8})$/,
                message: '请输入正确的手机号', trigger: 'change'}
            ]"
            label="手机号"
            prop="parentMobile"
          >
            <el-input
              v-model="parentAddForm.parentMobile"
              placeholder="请输入手机号"
              @keyup.native="mobileChangeCheck(parentAddForm.parentMobile)"
            />
            <!-- <span
            class="from_name_tip"
            @click="openParentPhone()"
          >查重</span> -->
          </el-form-item>
        </div>
        <el-form-item
          label="家长关系"
          prop="relation"
        >
          <el-select
            v-model="parentAddForm.relation"
            placeholder="请选择家长关系"
            clearable
            filterable
            style="width:100%"
          >
            <el-option
              v-for="item in allParentLinkList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="QQ"
          prop="qqNumber"
        >
          <el-input
            v-model="parentAddForm.qqNumber"
            placeholder="请输入QQ"
          />
        </el-form-item>
        <el-form-item
          label="行业"
          prop="trade"
        >
          <el-input
            v-model="parentAddForm.trade"
            placeholder="请输入行业"
          />
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
        >
          <el-input
            v-model="parentAddForm.email"
            placeholder="请输入邮箱"
          />
        </el-form-item>
        <el-form-item
          label="固定电话"
          prop="tel"
        >
          <el-input
            v-model="parentAddForm.tel"
            placeholder="请输入固定电话"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="closeAdd">取 消</el-button>
        <el-button
          type="primary"
          @click="add"
        >确 定</el-button>
      </span>
      <PhoneCheckDialog
        ref="phoneCheckDialog"
        :is-detail="true"
      />
    </el-dialog>
  </div>
</template>

<script>
import PhoneCheckDialog from '@/views/crm/studentInfo/lantentStu/components/phoneCheckDialog'
import {
  getParentDictGetByKey,
  parentSummary,
  summeryParentInfo
} from '@/api/crmDetail/crmDetail'

export default {
  components: {
    PhoneCheckDialog
  },

  props: {
    baseData: {
      type: Object,
      required: true
    },
    saveAdd: {
      type: Function,
      required: true
    },
    checkMobile: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      addVisible: false,
      parentAddForm: {
        stuId: this.baseData.stuId,
        parentInfo: '1',
        parentName: '',
        parentMobile: '',
        relation: '',
        qqNumber: '',
        trade: '',
        email: '',
        tel: ''
      },
      allParentInfoList: [
        {
          key: '1',
          value: '新建家长'
        },
        {
          key: '2',
          value: '从家长库中选择'
        }
      ],
      isParentListSelect: false, // 家长姓名是否从库中显示
      allParentNameList: [], // 获取家长姓名所有下拉数据
      allParentLinkList: [] // 获取家长关系下拉数据
    }
  },

  methods: {
    /** 编辑 */
    add() {
      this.$refs.parentAddForm.validate((valid) => {
        if (valid) {
          this.saveAdd(this.parentAddForm)
        } else {
          return false
        }
      })
    },

    /* 家长信息下拉值改变 */
    parentInfoChange(value) {
      if(value && value == '1') { //eslint-disable-line
        this.isParentListSelect = false
        this.parentAddForm.parentMobile = ''
        this.parentAddForm.parentName = ''
      } else {
        this.isParentListSelect = true
      }
    },

    /* 手机号查重 */
    mobileChangeCheck(value) {
      if (value && value.length > 10) {
        this.checkMobile(value)
      }
    },

    /* 获取学员家长信息下拉数据 */
    parentSummaryFun() {
      parentSummary().then(res => {
        if (res.data.errorCode === 0) {
          this.allParentNameList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    /* 获取名单家长信息下拉数据 */
    summeryParentInfoFun() {
      summeryParentInfo().then(res => {
        if (res.data.errorCode === 0) {
          this.allParentNameList = res.data.reults
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    /* 获取家长关系下拉数据 */
    getParentDictGetByKeyFun() {
      const params = {
        dictkey: 'parentRelationship'
      }
      getParentDictGetByKey(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allParentLinkList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    /** 关闭 */
    closeAdd() {
      this.$refs.parentAddForm.resetFields()
      this.addVisible = false
    }

    /* 家长手机号查重弹框 */
    // openParentPhone() {
    //   this.$refs.phoneCheckDialog.showDialog()
    // }
  }
}
</script>

<style lang="scss" scoped>
.parentAdd_container /deep/ {
  .el-dialog {
    width: 500px;
  }
}
.from_name_tip {
  position: absolute;
  top: 0;
  right: 10px;
  color: #46b6ee;
  cursor: pointer;
}
</style>
