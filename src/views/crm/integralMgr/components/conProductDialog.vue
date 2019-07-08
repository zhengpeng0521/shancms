<template>
  <div>
    <el-dialog
      :visible.sync="productDialogShow"
      title="积分变动"
      @close="cancelDialog('changeForm')"
    >
      <el-form
        ref="changeForm"
        :model="accountData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item
          label="学员:"
          prop="stuId"
        >
          <el-select
            v-model="accountData.stuId"
            clearable
            filterable
            placeholder="请选择学员"
            style="width: 85%"
            @change="stuNameChange"
          >
            <el-option
              v-for="item in allCrmStuList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <span
            style="color: #46b6ee; cursor: pointer"
            @click="preciseFindDialog(accountData.stuId)"
          >精确查找</span>
        </el-form-item>
        <el-form-item
          label="会员卡号:"
          prop="cardId"
        >
          <span>{{ accountData.cardId || '暂无会员卡' }}</span>
        </el-form-item>
        <el-form-item
          label="可用积分:"
          prop="userInter"
        >
          <span>{{ accountData.userInter || '0' }}</span>
        </el-form-item>
        <el-form-item
          label="变动类型:"
          prop="type"
        >
          <el-radio-group
            v-model="accountData.type"
            @change="typeChangeValue(accountData.type)"
          >
            <el-radio label="1">手动增加</el-radio>
            <el-radio label="2">手动扣减</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="变动原因:"
          prop="ruleId"
        >
          <el-select
            v-model="accountData.ruleId"
            clearable
            filterable
            placeholder="请输入变动原因"
            style="width: 100%"
            @change="changeRuleValue"
          >
            <el-option
              v-for="item in allTypeRulesList"
              :key="item.ruleId"
              :label="item.name"
              :value="item.ruleId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="isIntegralInput"
          label="积分变动:"
          prop="integralNum"
        >
          <el-input
            v-model="accountData.integralNum"
            clearable
            placeholder="请输入积分数量"
          />
        </el-form-item>
        <el-form-item
          label="备注:"
          prop="remark"
        >
          <el-input
            v-model="accountData.remark"
            clearable
            type="textarea"
            placeholder="请输入备注,200字以内"
            maxlength="200"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('changeForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitFrom('changeForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 精确查找弹框组件 -->
    <ExactSearchDialog
      ref="exactSearchDialog"
      @toStudentName="getStudentName"
    />
  </div>
</template>

<script>
import { queryCRMStuList, summaryQueryRules, addIntegralFlow } from '@/api/crm/Integral/accountMgr'
import ExactSearchDialog from './exactSearchDialog.vue'
export default {
  components: {
    ExactSearchDialog
  },
  data() {
    return {
      productDialogShow: false,
      accountData: {
        stuId: '', // 学员
        cardId: '', // 会员卡号
        userInter: '', // 可用积分
        type: '1', // 变动类型
        ruleId: '', // 变动原因
        integralNum: '', // 积分数量
        remark: '' // 备注
      },
      rules: {
        stuId: [
          { required: true, message: '请选择学员', trigger: 'change' }
        ],
        cardId: [{ required: true, message: '', trigger: 'change' }],
        userInter: [{ required: true, message: '', trigger: 'change' }],
        integralNum: [
          { required: true, message: '请输入积分数量', trigger: 'change' },
          { pattern: /^\+?[1-9][0-9]*$/, message: '请正确输入大于零的正整数', trigger: 'change' }
        ],
        type: [{ required: true, message: '', trigger: 'change' }],
        ruleId: [
          { required: true, message: '请输入变动原因', trigger: 'change' }
        ]
      },
      selectStuRow: {}, // 被选的学员信息
      isIntegralInput: false, // 积分数量变动输入框
      allCrmStuList: [], // 学员下拉列表数据
      allTypeRulesList: [] // 变动原因规则下拉数据
    }
  },
  methods: {
    /* 学员下拉列表数据 */
    queryCRMStuListFun() {
      const params = {
        pageSize: 99999,
        pageIndex: 0
      }
      queryCRMStuList(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allCrmStuList = res.data.results
          this.productDialogShow = !this.productDialogShow
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 学员值改变 */
    stuNameChange(value) {
      this.allCrmStuList.map((item, index) => {
        if(value == item.id) { //eslint-disable-line
          this.selectStuRow = item
          this.accountData.cardId = item.stuCardId
          this.accountData.userInter = item.integral
        }
      })
    },
    /* 变动原因值改变 */
    typeChangeValue(value) {
      this.summaryQueryRulesFun(value)
      if(value == '1'){ //eslint-disable-line
        this.accountData.ruleId = ''
        this.isIntegralInput = false
      }
      if(value == '2') { //eslint-disable-line
        this.accountData.ruleId = ''
        this.isIntegralInput = false
      }
    },
    /* 变动原因规则下拉列表 */
    summaryQueryRulesFun(type) {
      const params = {
        incType: type,
        pageSize: 99999,
        pageIndex: 0
      }
      summaryQueryRules(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allTypeRulesList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 积分变动原因值改变 */
    changeRuleValue(value) {
      this.allTypeRulesList.map((item, index) => {
        if(value == item.ruleId){ //eslint-disable-line
          this.isIntegralInput = true
          this.accountData.integralNum = item.value
        }
      })
    },
    /* 显示弹框 */
    showDialog() {
      this.queryCRMStuListFun()
      this.summaryQueryRulesFun('1')
      this.isIntegralInput = false
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.productDialogShow = false
      this.$refs[formName].resetFields()
    },
    /* 提交弹框 */
    submitFrom(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            stuId: this.accountData.stuId, // 学员
            cardId: this.accountData.cardId, // 会员卡号
            type: this.accountData.type, // 变动类型
            ruleId: this.accountData.ruleId, // 变动原因
            integralNum: this.accountData.integralNum, // 积分数量
            remark: this.accountData.remark || '' // 备注
          }
          addIntegralFlow(params).then(res => {
            if (res.data.errorCode === 0) {
              this.productDialogShow = false
              this.$message.success(res.data.errorMessage)
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        }
      })
    },
    /* 精确查找弹框显示 */
    preciseFindDialog(name) {
      this.$refs.exactSearchDialog.showDialog(this.selectStuRow)
    },
    /* 关闭精确查找弹框 */
    cancelFindDialog() {
      this.$refs.exactSearchDialog.closeDialog()
    },
    /* 确认提交精确查找 */
    submitFindForm() {
      this.$refs.exactSearchDialog.submitDialog()
    },
    /* 获取精确查找传的学员信息 */
    getStudentName(value) {
      this.allCrmStuList.map(item => {
        if(value == item.name) { //eslint-disable-line
          this.accountData.stuId = item.id
          this.accountData.cardId = item.stuCardId
          this.accountData.userInter = item.integral
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

