<template>
  <div>
    <el-dialog
      :visible.sync="addGiveClassDialogShow"
      title="添加赠送课时"
      class="addGiveClassDialog_container"
      @close="cancelDialog('addGiveClassForm')"
    >
      <el-form
        ref="addGiveClassForm"
        :model="addGiveClassData"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item
          label="学员账户号:"
          prop="cardNum"
        >
          <span>{{ cardInfoData.id }}</span>
        </el-form-item>
        <el-form-item
          label="合同编号:"
          prop="cardID"
        >
          <el-select
            v-model="addGiveClassData.cardID"
            clearable
            filterable
            placeholder="请选择合同编号"
            style="width: 100%"
          >
            <el-option
              v-for="item in allContractList"
              :key="item.purchaseId"
              :label="item.orderNum"
              :value="item.purchaseId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="赠课类型:"
          prop="type"
        >
          <el-radio-group
            v-model="addGiveClassData.type"
            @change="radioChange(addGiveClassData.type)"
          >
            <el-radio label="1">通用课时</el-radio>
            <el-radio label="2">专用课时</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-show="isShowInput">
          <el-form-item
            label="选择课程:"
            prop="selectClass"
          >
            <el-select
              v-model="addGiveClassData.selectClass"
              clearable
              filterable
              placeholder="请选择课程"
              style="width: 100%"
            >
              <el-option
                v-for="item in allCourseList"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item
          label="课时数量:"
          prop="classNum"
        >
          <el-input
            v-model="addGiveClassData.classNum"
            clearable
            placeholder="请输入课时数量"
          />
          <span class="classNum_input_tip">非负数，可精确到小数点后2位</span>
        </el-form-item>
        <el-form-item
          label="赠课成本:"
          prop="givePrice"
        >
          <el-input
            v-model="addGiveClassData.givePrice"
            clearable
            placeholder="请输入赠课成本"
          />
          <span class="classNum_input_tip">(用于统计赠课消耗的成本，不计入合同总额，也不计入消课统计)</span>
        </el-form-item>
        <el-form-item
          label="赠课原因:"
          prop="because"
        >
          <el-input
            v-model="addGiveClassData.because"
            clearable
            placeholder="请输入赠课原因"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('addGiveClassForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitFrom('addGiveClassForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  purSummByCardId, // 合同编号下拉列表
  summaryQueryCourse, // 选择课时下拉列表
  addGivePeriod // 确定添加赠送课时
} from '@/api/crm/stuAccount/stuAccount.js'
export default {
  components: {
  },
  data() {
    const checkClass = (rule, value, callback) => {
      if (this.isShowInput) {
        if (value === '') {
          callback(new Error('请选择课程'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      addGiveClassDialogShow: false,
      addGiveClassData: {
        cardNum: '',
        cardID: '',
        type: '1',
        selectClass: '',
        classNum: '',
        givePrice: '0',
        because: ''
      },
      allCourseList: [], // 选择课程下拉列表
      allContractList: [], // 合同编号下拉列表

      rules: {
        cardID: [
          { required: true, message: '请选择合同编号', trigger: 'change' }
        ],
        type: [
          { required: true, trigger: 'change' }
        ],
        classNum: [
          // ([1-9]{1}\d*)|
          { required: true, message: '请输入课时数量,最多保留两位小数', pattern: /^(([1-9]{1}\d*)|(0{1}))((\.\d{1,2})|((\d*)))$/, trigger: 'change' }
        ],
        selectClass: [
          { required: true, validator: checkClass, trigger: 'change' }
        ],
        givePrice: [
          { required: true, message: '请输入赠课成本,最多保留两位小数', pattern: /^(([1-9]{1}\d*)|(0{1}))((\.\d{1,2})|((\d*)))$/, trigger: 'change' }
        ]
      },
      isShowInput: false, // 选择课时输入框显隐
      cardInfoData: {} // 获取每条会员卡信息
    }
  },
  methods: {
    /* 显示弹框 */
    showDialog(row) {
      this.cardInfoData = row
      this.addGiveClassDialogShow = !this.addGiveClassDialogShow
      this.getPurSummByCardId(row)
      this.getSummaryQueryCourse()
    },
    /* 获取合同编号下拉列表 */
    getPurSummByCardId(rowList) {
      const params = {
        cardId: rowList.id
      }
      purSummByCardId(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allContractList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 获取选择课时下拉列表 */
    getSummaryQueryCourse() {
      summaryQueryCourse().then(res => {
        if (res.data.errorCode === 0) {
          this.allCourseList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.addGiveClassDialogShow = false
      this.$refs[formName].resetFields()
    },
    /* 提交弹框 */
    submitFrom(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            cardId: this.cardInfoData.id || '',
            purchaseId: this.addGiveClassData.cardID || '',
            periodNum: this.addGiveClassData.classNum || '',
            creatorId: '',
            extPeriodMoney: this.addGiveClassData.givePrice || '0',
            extPeriodReason: this.addGiveClassData.because || '',
            extType: this.addGiveClassData.type || '1',
            courseId: this.addGiveClassData.selectClass || ''
          }
          if(this.addGiveClassData.type == '1') { //eslint-disable-line
            delete params.courseId
          }
          addGivePeriod(params).then(res => {
            if (res.data.errorCode === 0) {
              this.addGiveClassDialogShow = false
              this.$message.success(res.data.errorMessage)
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        }
      })
    },
    /* 单选框中的值改变 */
    radioChange(value) {
      if (value && value === '2') {
        this.isShowInput = true
      } else {
        this.isShowInput = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.addGiveClassDialog_container /deep/ {
  .el-dialog {
    width: 600px;
  }
  .classNum_input_tip {
    font-size: 10px;
    color: rgba(0, 0, 0, 0.43);
  }
}
</style>

