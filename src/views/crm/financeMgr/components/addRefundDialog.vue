<template>
  <div class="addRefundDialog_container">
    <el-dialog
      :visible.sync="addRefundDialogShow"
      title="新建退款单"
      @close="cancelDialog('addRefundForm')"
    >
      <el-form
        ref="addRefundForm"
        :model="addRefundData"
        :rules="rules"
        label-width="90px"
      >
        <el-form-item
          label="退款类型:"
          prop="refundType"
        >
          <el-select
            v-model="addRefundData.refundType"
            placeholder="请选择退款类型"
            style="width:100%"
            filterable
            @change="refundTypeValue(addRefundData.refundType)"
          >
            <el-option
              v-for="item in refundTypeSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="isStudentInput"
          label="选择学员:"
          prop="student"
        >
          <el-select
            v-model="addRefundData.student"
            placeholder="请选择学员"
            clearable
            filterable
            style="width:100%"
            @change="selectStuChange(addRefundData.student)"
          >
            <el-option
              v-for="item in allStudentList"
              :key="item.stuId"
              :label="item.stuName"
              :value="item.stuId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="isCardIdInput"
          :rules="{
            required: addRefundData.refundType == '2', message: '请选择会员卡号', trigger: 'change'
          }"
          label="会员卡号:"
          prop="cardNum"
        >
          <el-select
            v-model="addRefundData.cardNum"
            placeholder="请选择会员卡号"
            clearable
            filterable
            style="width:100%"
            @change="cardIdChange(addRefundData.cardNum)"
          >
            <el-option
              v-for="item in allCardIdList"
              :key="item.id"
              :label="item.id"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="isContractInput"
          label="合同编号:"
          prop="number"
        >
          <el-select
            v-model="addRefundData.number"
            placeholder="请选择合同编号"
            clearable
            filterable
            style="width:100%"
            @change="contractIdChange(addRefundData.number)"
          >
            <el-option
              v-for="item in allContractIdList"
              :key="item.purchaseId"
              :label="item.orderNum"
              :value="item.purchaseId"
            />
          </el-select>
        </el-form-item>
        <div v-if="isClassTimeShow">
          <el-form-item
            :rules="{
              required: true, message: '请选择退课', trigger: 'change'
            }"
            label="选择退课:"
            prop="classRefund"
          >
            <el-select
              v-model="addRefundData.classRefund"
              multiple
              placeholder="请选择退课"
              clearable
              filterable
              style="width:100%"
              @change="selectClassChange"
            >
              <el-option
                v-for="item in allRefundClassList"
                :key="item.courseId"
                :label="item.courseName"
                :value="item.courseId"
              />
            </el-select>
          </el-form-item>
        </div>
        <div v-if="isMoveInput">
          <el-form-item
            v-for="(child, index) in selectClassList"
            :key="index + 'allRefundClassList'"
            :show-message="false"
            :label="renderProp(child)"
            :prop="addRefundData[child]"
            :rules="{
              required: true, message: '可精确到小数点后2位', trigger: 'change'
            }"
          >
            <el-input
              v-model="addRefundData[child]"
              clearable
              placeholder="可精确到小数点后2位"
              @keyup.native="returnClassValueChange(addRefundData[child], allRefundClassListNew[index].refundableNum, allRefundClassListNew[index])"
            />
            <div
              v-if="isBigNumReturn"
              style="color: #f04134"
            >{{ allRefundClassListNew[index].tipText || '' }}</div>
            <span class="user_class_tip">可退{{ allRefundClassListNew[index].refundableNum || '0' }}课时，已锁定{{ allRefundClassListNew[index].lockNum || '0' }}课时</span>
          </el-form-item>
        </div>
        <div v-if="isClassNumInfo">
          <el-form-item
            label="套餐详情:"
            prop="info"
          >
            <div>{{ allSetDetailList.proName || '--' }}</div>
            <div>合同截止日期:{{ allSetDetailList.endTime + '(含赠送)' || '--' }}</div>
            <div>赠送天数:{{ allSetDetailList.extNursery + '天' || '--' }}</div>
            <div>合同期限:{{ allSetDetailList.startTime + '~' + allSetDetailList.realEndTime + '(不含赠送)' || '--' }}</div>
          </el-form-item>
          <el-form-item
            :rules="{
              required: true, message: '请选择日期', trigger: 'change'
            }"
            label="退款周期:"
            prop="dataTime"
          >
            <el-date-picker
              v-model="addRefundData.dataTime"
              :picker-options="options3"
              value-format="yyyy-MM-dd"
              type="date"
              clearable
              placeholder="请选择日期"
              style="width: 40%"
              @change="selectDataInput"
            />
            <span value-format="yyyy-MM-dd">~ {{ allSetDetailList.realEndTime || '--' }}</span>
            <div>{{ countNum || '总计' }}</div>
          </el-form-item>
          <el-form-item
            :rules="{
              required: true, message: '请输入金额', trigger: 'change'
            }"
            label="退款金额:"
            prop="defundPrice"
          >
            <el-input
              v-model="addRefundData.defundPrice"
              clearable
              placeholder="请输入退款金额"
            />
          </el-form-item>
          <el-form-item
            label="退款备注:"
            prop="detail"
          >
            <el-input
              v-model="addRefundData.detail"
              clearable
              type="textarea"
              placeholder="请输入退款备注"
            />
          </el-form-item>
        </div>
        <el-form-item
          v-if="isRefundDetail"
          label="退款备注:"
          prop="detail"
        >
          <el-input
            v-model="addRefundData.detail"
            clearable
            type="textarea"
            placeholder="请输入退款备注"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog('addRefundForm')"
        >取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm('addRefundForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  summaryQuery, // 学员下拉数据
  stuCardSummary, // 会员卡下拉列表数据
  purSummByCardId, // 合同编号下拉数据
  getRefundInfo, // 选择退课下拉数据
  getNurRefundInfo, // 可退时长信息数据
  queryNurPackList, // 退时长 合同编号数据
  createRefundOrder // 确定创建退款单
} from '@/api/crm/financeMgr/financeMgr.js'
import moment from 'moment'
export default {
  components: {

  },
  data() {
    return {
      addRefundDialogShow: false,
      // dataDisable: false,
      addRefundData: {
        refundType: '', // 退款类型
        student: '', // 学员id
        cardNum: '', // 会员卡号
        number: '', // 合同编号
        classRefund: [], // 选择退课
        detail: '', // 备注
        dataTime: '', // 退款周期
        defundPrice: '0.00' // 退款金额
      },
      refundTypeSelect: [ // 退款类型下拉框
        {
          value: '3',
          label: '退时长'
        },
        {
          value: '2',
          label: '退课时'
        }
      ],
      allStudentList: [], // 学员下拉数据
      allCardIdList: [], // 会员卡号下拉数据
      allContractIdList: [], // 合同编号下拉数据
      allRefundClassList: [], // 选择退课下拉数据
      selectClassList: [], // 被选择的课程
      allSetDetailList: {}, // 套餐详情数据
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
        refundType: [
          { required: true, message: '请选择退款类型', trigger: 'change' }
        ],
        student: [
          { required: true, message: '请选择学员', trigger: 'change' }
        ],
        number: [
          { required: true, message: '请选择合同编号', trigger: 'change' }
        ]
      },
      cardIdSelect: '', // 被选的会员卡号
      isStudentInput: false, // 选择学员显隐
      isCardIdInput: false, // 会员卡号显隐
      isContractInput: false, // 合同编号显隐
      isRefundDetail: false, // 退款备注显隐
      isMoveInput: false, // 动态课程输入框显隐
      isClassNumInfo: false, // 套餐详情部分显隐
      isClassTimeShow: false, // 选择课时部分显隐
      options3: {
        disabledDate: this.disabledDate
      },
      isBigNumReturn: false, // 可退课时是否大于剩余课时
      allRefundClassListNew: [], // 新的动态被选择课程数据
      days: '',
      months: '',
      countNum: ''
    }
  },
  methods: {
    renderProp(id) {
      let name = ''
      this.allRefundClassList.forEach(item => {
        if (item.courseId === id) {
          name = item.courseName
        }
      })
      return name
    },
    /* 显示弹框 */
    showDialog() {
      this.addRefundData.classRefund = []
      this.isStudentInput = false
      this.isCardIdInput = false
      this.isContractInput = false
      this.isRefundDetail = false
      this.isMoveInput = false
      this.isClassNumInfo = false
      this.isClassTimeShow = false
      this.addRefundData = {
        refundType: '', // 退款类型
        student: '', // 学员id
        cardNum: '', // 会员卡号
        number: '', // 合同编号
        classRefund: [], // 选择退课
        detail: '', // 备注
        dataTime: '', // 退款周期
        defundPrice: '0.00' // 退款金额
      }
      this.addRefundDialogShow = !this.addRefundDialogShow
      this.summaryQueryFun()
    },
    /* 关闭弹框 */
    cancelDialog(formName) {
      this.addRefundDialogShow = false
      this.$refs[formName].resetFields()
      this.addRefundData = {
        refundType: '', // 退款类型
        student: '', // 学员id
        cardNum: '', // 会员卡号
        number: '', // 合同编号
        classRefund: [], // 选择退课
        detail: '', // 备注
        dataTime: '', // 退款周期
        defundPrice: '0.00' // 退款金额
      }
    },
    /* 确定提交弹框表单内容 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const periodInfo = []
          this.selectClassList.map((item, index) => {
            periodInfo.push({ courseId: item, periodNum: this.addRefundData[item] })
          })
          let params = {}
          if(this.addRefundData.refundType && this.addRefundData.refundType == '3') {//eslint-disable-line
            params = {
              refundType: this.addRefundData.refundType,
              stuId: this.addRefundData.student,
              purchaseId: this.addRefundData.number,
              startTime: this.addRefundData.dataTime,
              endTime: this.allSetDetailList.realEndTime,
              money: this.addRefundData.defundPrice,
              days: this.days | '0',
              months: this.months || '0',
              remark: this.addRefundData.detail
            }
          }
          if(this.addRefundData.refundType && this.addRefundData.refundType == '2') {//eslint-disable-line
            params = {
              refundType: this.addRefundData.refundType,
              stuId: this.addRefundData.student,
              cardId: this.addRefundData.cardNum,
              purchaseId: this.addRefundData.number,
              periodInfo: JSON.stringify(periodInfo),
              remark: this.addRefundData.detail
            }
          }
          createRefundOrder(params).then(res => {
            if (res.data.errorCode === 0) {
              this.addRefundDialogShow = false
              this.$emit('refeshRefun')
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        }
      })
    },
    /* 退款类型选择下拉框 */
    refundTypeValue(value) {
      // 退时长
      if (value == '3') { //eslint-disable-line
        this.isStudentInput = true
        this.isCardIdInput = false
        this.isContractInput = false
        this.isRefundDetail = false
        this.isMoveInput = false
        this.isClassNumInfo = false
        this.isClassTimeShow = false
      }
      // 退课时
      if(value == '2') { //eslint-disable-line
        this.isStudentInput = true
        this.isContractInput = false
        this.isClassNumInfo = false
      }
    },
    /* 学员下拉数据 */
    summaryQueryFun() {
      summaryQuery().then(res => {
        if (res.data.errorCode === 0) {
          this.allStudentList = res.data.results
        } else {
          this.$message.error(res.data.errorCode)
        }
      })
    },
    /* 学员数据值改变 */
    selectStuChange(value) {
      if(value == '') { //eslint-disable-line
        this.isCardIdInput = false
        this.isContractInput = false
        this.isClassTimeShow = false
      } else {
        // 退课时
        if(this.addRefundData.refundType == '2') { //eslint-disable-line
          this.isCardIdInput = true
          this.stuCardSummaryFun(value)
        }
        // 退时长
        if(this.addRefundData.refundType == '3') { //eslint-disable-line
          this.isContractInput = true
          this.queryNurPackListFun(value)
        }
      }
    },
    /* 会员卡下拉数据 */
    stuCardSummaryFun(stuId) {
      const params = {
        stuId: stuId
      }
      stuCardSummary(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allCardIdList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 会员卡号值改变 */
    cardIdChange(value) {
      this.purSummByCardIdFun(value)
      this.cardIdSelect = value
       if(value == '') { //eslint-disable-line
        this.isContractInput = false
        this.isClassTimeShow = false
      } else {
        this.isContractInput = true
      }
    },
    /* 合同编号下拉列表 */
    purSummByCardIdFun(cardId) {
      const params = {
        cardId: cardId
      }
      purSummByCardId(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allContractIdList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 合同编号值改变 */
    contractIdChange(value) {
      if(value == '') { //eslint-disable-line
        if(this.addRefundData.refundType == '2') { //eslint-disable-line
          this.isClassTimeShow = false
        }
        // 退时长
        if(this.addRefundData.refundType == '3') { //eslint-disable-line
          this.isClassNumInfo = false
        }
      } else {
        // 退课时
        if(this.addRefundData.refundType == '2') { //eslint-disable-line
          this.isClassTimeShow = true
          this.isClassNumInfo = false
          this.getRefundInfoFun(value)
        }
        // 退时长
        if(this.addRefundData.refundType == '3') { //eslint-disable-line
          this.isClassNumInfo = true
          this.getNurRefundInfoFun(value)
        }
      }
    },
    /* 退时长合同编号数据 */
    queryNurPackListFun(stuId) {
      const params = {
        stuId: stuId
      }
      queryNurPackList(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allContractIdList = res.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 选择退课下拉列表 */
    getRefundInfoFun(purchaseId) {
      const params = {
        purchaseId: purchaseId,
        refundType: '2',
        cardId: this.cardIdSelect
      }
      getRefundInfo(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allRefundClassList = res.data.courseInfo
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 可退课程输入值改变 */
    returnClassValueChange(value, returnNum, index) {
      if (value && value > returnNum) {
        this.allRefundClassListNew && this.allRefundClassListNew.length > 0 && this.allRefundClassListNew.map(item => {
          if (index.courseId == item.courseId) { //eslint-disable-line
            item.tipText = '已超过最大可退数'
            this.isBigNumReturn = true
          } else {
            item.tipText = ''
          }
        })
      } else {
        this.isBigNumReturn = false
      }
    },
    /* 选择课程值改变 */
    selectClassChange(value) {
      this.selectClassList = value
      this.allRefundClassListNew = []
      this.allRefundClassList && this.allRefundClassList.length > 0 && this.allRefundClassList.map(item => {
        value.forEach(itemValue => {
        if(itemValue == item.courseId) { //eslint-disable-line
            this.allRefundClassListNew.push(item)
          }
        })
      })
      value.forEach(item => {
        this.addRefundData[item] = ''
      })
      if(value == '') { //eslint-disable-line
        this.isRefundDetail = false
        this.isMoveInput = false
      } else {
        this.isRefundDetail = true
        this.isMoveInput = true
      }
    },
    /* 可退时长信息数据 */
    getNurRefundInfoFun(purchaseId) {
      const params = {
        purchaseId: purchaseId,
        stuId: this.addRefundData.student
      }
      getNurRefundInfo(params).then(res => {
        if (res.data.errorCode === 0) {
          this.allSetDetailList = res.data
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /* 当今日期 */
    disabledDate(current) {
      if (!!current && !!this.allSetDetailList.realEndTime && !!this.allSetDetailList.startTime) {
        return moment(this.allSetDetailList.realEndTime).isBefore(current, 'day') || moment(this.allSetDetailList.startTime).isAfter(current, 'day')
      } else {
        return false
      }
    },
    /* 退款周期值改变 */
    selectDataInput(value) {
      if (value) {
        const dataAllNum = this.dateDiffIncludeToday(value, this.allSetDetailList.realEndTime)
        const moneyAll = (dataAllNum - 1) * this.allSetDetailList.dayPrice
        this.addRefundData.defundPrice = moneyAll.toFixed(2)
        const valueMonent = moment(value + ' 23:59:59')
        this.changeCount(valueMonent)
      } else {
        this.addRefundData.defundPrice = '0.00'
        this.countNum = '共计'
      }
    },
    // 获取总数
    getCoountNum(type, date, end, months, years) {
      let countNum = ''
      // 差值
      let rise = end.date() - date.date()
      if (rise > 0) {
        // eslint-disable-next-line
        countNum = type == 'year' ? `共计${years}年${months}个月${rise}天` : `共计${months}个月${rise}天`
        // eslint-disable-next-line
        } else if (rise == 0) {
        // eslint-disable-next-line
        countNum = type == 'year' ? `共计${years}年${months}个月` : `共计${months}个月`
      } else {
        const surplus = date.daysInMonth() - date.date()
        rise = surplus + end.date()
        // eslint-disable-next-line
        countNum = type == 'year' ? `共计${years}年${months}个月${rise}天` : `共计${months}个月${rise}天`
      }
      this.days = rise
      this.months = months
      return countNum
    },
    // 退款周期onChange
    changeCount(date) {
      if (this.allSetDetailList.realEndTime) {
        const end = moment(this.allSetDetailList.realEndTime + ' 23:59:59')
        const years = end.diff(date, 'years')
        let months = 0
        let days = 0
        let countNum = ''
        if (years == 0) { //eslint-disable-line
          // 月数
          months = end.diff(date, 'months')
          if (months == 0) { //eslint-disable-line
            // 天数
            days = end.diff(date, 'days')
            countNum = `共计${days}天`
            this.days = days
            this.months = months
          } else {
            // 有月数时
            countNum = this.getCoountNum('month', date, end, months)
          }
        } else {
          // 月份差值
          const monthRise = end.month() - date.month()
          if (monthRise > 0) {
            // 有年数时
            countNum = this.getCoountNum('year', date, end, monthRise, years)
          } else if (monthRise == 0) { //eslint-disable-line
            days = end.date() - date.date()
            countNum = `共计${years}年${monthRise}个月${days}天`
          } else {
            const monthSurplus = 11 - date.month() + end.month()
            // 有年数时
            countNum = this.getCoountNum('year', date, end, monthSurplus, years)
          }
        }
        this.countNum = countNum
      } else {
        this.$message.error('合同周期获取失败')
      }
    },
    /* 计算总计天月日 */
    dateDiffIncludeToday(startDateString, endDateString) {
      const separator = '-' // 日期分隔符
      const startDates = startDateString.split(separator)
      const endDates = endDateString.split(separator)
      const startDate = new Date(startDates[0], startDates[1] - 1, startDates[2])
      const endDate = new Date(endDates[0], endDates[1] - 1, endDates[2])
      return parseInt(Math.abs(endDate - startDate) / 1000 / 60 / 60 / 24) + 1// 把相差的毫秒数转换为天数
    }
  }
}
</script>

<style lang="scss" scoped>
.addRefundDialog_container /deep/ {
  .el-dialog {
    width: 550px;
  }
}
</style>

