<template>
  <div>

    <div
      v-if="page === 'contract'"
      class="contract_rules"
    >
      <OrgSetBlock class="title">合同规则</OrgSetBlock>
      <p>
        <el-switch
          v-model="packageSta"
          active-color="#46b6ee"
          inactive-color="#dcdfe6"
          active-value="1"
          inactive-value="0"
          @change="switchOff('first',packageSta)"
        />
        <span>
          开合同时允许修改课时包实收规则
        </span>
      </p>
      <p>
        <el-switch
          v-model="materialSta"
          active-color="#46b6ee"
          inactive-color="#dcdfe6"
          active-value="1"
          inactive-value="0"
          @change="switchOff('second')"
        />
        <span>
          开合同时允许修改物资实收规则
        </span>
      </p>
      <p>

        <el-switch
          v-model="exportSta"
          active-color="#46b6ee"
          inactive-color="#dcdfe6"
          active-value="1"
          inactive-value="0"
          @change="switchOff('third')"
        />
        <span>
          合同列表页允许导出合同
        </span>
      </p>
      <p>

        <el-switch
          v-model="splitSta"
          active-color="#46b6ee"
          inactive-color="#dcdfe6"
          active-value="1"
          inactive-value="0"
          @change="switchOff('fourth')"
        />
        <span>
          拆分赠送合同
        </span>
      </p>

    </div>
    <div
      v-if="page === 'follow'"
      class="contract_rules"
    >

      <OrgSetBlock class="title">拥有学员规则</OrgSetBlock>
      <p>

        <el-switch
          v-model="backToClouePool[0].status"
          active-value="1"
          inactive-value="0"
          active-color="#46b6ee"
          inactive-color="#dcdfe6"
          @change="switchOff('backToClouePool',backToClouePool)"
        />
        <span>

          潜在学员超过
          <el-input
            v-model="backToClouePool[0].key"
            placeholder="请输入天数"
          >

            <span
              v-show="backToClouePool[0].key"
              slot="suffix"
              class="save_icon cp transition-box"
              @click="saveInputData('backToClouePool',backToClouePool)"
            />
            <span
              v-show="backToClouePool[0].key"
              slot="suffix"
              class="delete_icon cp transition-box"
              @click="clearInput('backToClouePool',backToClouePool)"
            />

          </el-input>
          天没有新增跟进记录，该学员自动退回公海池
        </span>
      </p>

      <!-- <p>

        <el-switch
          v-model="value5"
          active-color="#46b6ee"
          inactive-color="#dcdfe6"
        />
        <span>

          <el-input
            v-model="input22"
            placeholder="请输入天数"
          >

            <span
              v-show="input22"
              slot="suffix"
              class="save_icon cp transition-box"
              @click="saveInputData(input22)"
            />
            <span
              v-show="input22"
              slot="suffix"
              class="delete_icon cp transition-box"
              @click="clearInput(input22)"
            />

          </el-input>
          天没有新增跟进记录，该学员自动退回公海池
        </span>
      </p> -->
      <p>

        <el-switch
          v-model="sellMaxNum[0].status"
          active-color="#46b6ee"
          inactive-color="#dcdfe6"
          active-value="1"
          inactive-value="0"
          @change="switchOff('sellMaxNum',sellMaxNum)"
        />
        <span>
          每个销售拥有的最大潜在学员数为
          <el-input
            v-model="sellMaxNum[0].key"
            placeholder="请输入"
          >

            <span
              v-show="sellMaxNum[0].key"
              slot="suffix"
              class="save_icon cp transition-box"
              @click="saveInputData('sellMaxNum',sellMaxNum)"
            />
            <span
              v-show="sellMaxNum[0].key"
              slot="suffix"
              class="delete_icon cp transition-box"
              @click="clearInput('sellMaxNum',sellMaxNum)"
            />
          </el-input>
        </span>
      </p>

    </div>

    <div
      v-if="page === 'contract'"
      class="contract_rules"
    >

      <OrgSetBlock class="title">续费提醒</OrgSetBlock>
      <p>
        <span class="stystemRuleInput">
          课时小于（包括）
          <el-input
            v-model="courseHour[0].key"
            placeholder="请输入"
            type="Number"
            min="1"
            max="9999"
            @blur="courseHour[0].key < 1 ? courseHour[0].key = 1 : courseHour[0].key > 9999 ? courseHour[0].key = 9999 :''"
          >

            <span
              v-show="courseHour[0].key"
              slot="suffix"
              class="save_icon cp transition-box"
              @click="saveInputData('PERIODNUMREMIND',courseHour)"
            />
            <span
              v-show="courseHour[0].key"
              slot="suffix"
              class="delete_icon cp transition-box"
              @click="clearInput('PERIODNUMREMIND',courseHour)"
            />

          </el-input>
          进行提醒
        </span>
      </p>

      <p>

        <span class="stystemRuleInput">
          合同有效期小于（包括）

          <el-input
            v-model="validDate[0].key"
            placeholder="请输入"
            type="Number"
            min="1"
            max="9999"
            @blur="validDate[0].key < 1 ? validDate[0].key = 1 : validDate[0].key > 9999 ? validDate[0].key = 9999 :''"
          >

            <span
              v-show="validDate[0].key"
              slot="suffix"
              class="save_icon cp transition-box"
              @click="saveInputData('purExpireRemind',validDate)"
            />
            <span
              v-show="validDate[0].key"
              slot="suffix"
              class="delete_icon cp transition-box"
              @click="clearInput('purExpireRemind',validDate)"
            />
          </el-input>
          天进行提醒
        </span>
      </p>

    </div>
    <div
      v-if="page === 'contract'"
      class="contract_rules"
    >
      <OrgSetBlock class="title">续费规则</OrgSetBlock>
      <p>
        <el-switch
          v-model="renewalStatus"
          active-color="#46b6ee"
          inactive-color="#dcdfe6"
          active-value="1"
          inactive-value="0"
          @change="switchOff('fifth')"
        />
        <span class="stystemRuleInput">
          未退费学员付清合同金额超过
          <el-input
            :disabled="renewalStatus === '0'"
            v-model="renewalDate[0].value"
            placeholder="请输入"
            type="Number"
            min="1"
            max="9999"
            @blur="renewalDate[0].value < 1 ? renewalDate[0].value = 1 : renewalDate[0].value > 9999 ? renewalDate[0].value =9999 :''"
          >
            <span
              v-show="renewalDate[0].value && renewalStatus === '1'"
              slot="suffix"
              class="save_icon cp transition-box"
              @click="saveInputData('RENEWDAYAFTERPAYOFFF',renewalDate)"
            />
            <span
              v-show="renewalDate[0].value && renewalStatus === '1'"
              slot="suffix"
              class="delete_icon cp transition-box"
              @click="clearInput('RENEWDAYAFTERPAYOFFF',renewalDate)"
            />
          </el-input>
          天
        </span>
      </p>
    </div>

    <el-dialog
      :visible.sync="isOpen"
      title="合同规则设置"
      @close="cancelDialog"
    >

      <div v-if="first">
        <p>
          确认{{ packageSta==='1'?'开启':'禁用' }}修改课时包实收规则吗？
        </p>
        <p class="warn_text">
          {{ packageSta==='1'?'开启':'禁用' }}后，在签订合同时，员工{{ packageSta==='1'?'可':'不可' }}更改课时包实收价格
        </p>
      </div>
      <div v-if="second">
        <p>
          确认{{ materialSta==='1'?'开启':'禁用' }}修改物资实收规则吗？
        </p>
        <p class="warn_text">
          {{ materialSta==='1'?'开启':'禁用' }}后，在签订合同时，员工{{ materialSta==='1'?'可':'不可' }}更改物资实收价格
        </p>
      </div>
      <div v-if="third">
        <p>
          确认 {{ exportSta==='1'?'启用':'禁用' }}允许合同列表导出合同吗？
        </p>
        <p class="warn_text">
          {{ exportSta==='1'?'开启':'禁用' }}后，合同列表页面将显示导出按钮，员工{{ exportSta==='1'?'可':'不可' }}导出合同信息
        </p>
      </div>
      <div v-if="fourth">
        <p>
          确认 {{ splitSta==='1'?'启用允许':'禁用' }} 拆分赠送合同吗？
        </p>
        <p class="warn_text">
          {{ splitSta==='1'?'开启':'禁用' }}后，{{ splitSta==='1'?'赠送合同需要分开审核':'赠送内容和原合同统一审核' }}
        </p>
      </div>
      <div v-if="fifth">
        <p>
          确认 {{ renewalStatus==='1'?'启用允许':'禁用' }} 该续费规则吗？
        </p>
        <p class="warn_text">
          {{ renewalStatus==='1'?'开启':'禁用' }}后，{{ renewalStatus==='1'?'学员可续费条件须满足您设定的时间及合同状态':'学员续费条件不受该规则束缚' }}
        </p>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="cancel_btn"
          @click="cancelDialog()"
        >取消</el-button>
        <el-button
          type="primary"
          @click="submit()"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import OrgSetBlock from '@/components/MiniCommon/OrgSetBlock'
import { queryPurchaseConf, setPurchaseConf, saveConf, queryByKey } from '@/api/orgSet/systemSet'
export default {
  components: { OrgSetBlock },

  props: {
    page: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      contractAll: {}, // 合同规则初始值
      packageSta: '',
      materialSta: '',
      exportSta: '',
      splitSta: '', //  拆分赠送合同状态
      renewalStatus: '', // 续费规则
      sellMaxNum: [{ status: '', key: '' }], // 每个销售拥有的最大潜在学员数
      isSellMaxNum: '',
      backToClouePool: [{ status: '', key: '' }], // 潜在学员超过X天没有新增跟进记录
      courseHour: [{ status: '', key: '' }], // 续费提醒课时
      validDate: [{ status: '', key: '' }], // 合同有效期提醒
      renewalDate: [{ status: '', key: 'renew', text: '续费规则' }], // 续费规则时间
      splitContract: [{ status: '', key: 'add' }], // 拆分赠送合同
      isBackToClouePool: '',
      value4: false,
      value5: false,
      value6: false,
      isOpen: false,
      input22: '',
      switchName: '',
      saveId: '',
      studentRules: ['BACKTOCLUEPOOLDAY', 'SELLMAXLISTNUM', 'PERIODNUMREMIND', 'purExpireRemind', 'EXTPURCHASESET', 'RENEWDAYAFTERPAYOFFF']
    }
  },
  computed: {
    first: function() {
      if (this.switchName === 'first') {
        return true
      } else {
        return false
      }
    },
    second: function() {
      if (this.switchName === 'second') {
        return true
      } else {
        return false
      }
    },
    third: function() {
      if (this.switchName === 'third') {
        return true
      } else {
        return false
      }
    },
    fourth: function() {
      if (this.switchName === 'fourth') {
        return true
      } else {
        return false
      }
    },
    fifth: function() {
      if (this.switchName === 'fifth') {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
    this.getPurchase()
    this.getSpu()
  },
  methods: {
    // 获取规则们
    getSpu() {
      this.studentRules.forEach(v => {
        const data = {
          confKey: v
        }
        queryByKey(data).then(res => {
          if (res.data.errorCode === 0) {
            if (res.data.data.confKey === 'SELLMAXLISTNUM') {
              this.sellMaxNum = res.data.data.results
            }
            if (res.data.data.confKey === 'BACKTOCLUEPOOLDAY') {
              this.backToClouePool = res.data.data.results
            }
            if (res.data.data.confKey === 'PERIODNUMREMIND') {
              this.courseHour = res.data.data.results
            }
            if (res.data.data.confKey === 'purExpireRemind') {
              this.validDate = res.data.data.results
            }
            if (res.data.data.confKey === 'EXTPURCHASESET') {
              this.splitContract = res.data.data.results
              this.splitSta = this.splitContract && this.splitContract[0].status
            }
            if (res.data.data.confKey === 'RENEWDAYAFTERPAYOFFF') {
              this.renewalDate = res.data.data.results
              this.renewalStatus = this.renewalDate && this.renewalDate[0].status
            }
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      })
    },
    saveInputData(val, value) {
      this.switchOff(val, value)
    },
    clearInput(val, value) {
      if (val === 'backToClouePool') {
        this.backToClouePool[0].key = ''
      } else if (val === 'sellMaxNum') {
        this.sellMaxNum[0].key = ''
      } else if (val === 'PERIODNUMREMIND') {
        this.courseHour[0].key = ''
      } else if (val === 'purExpireRemind') {
        this.validDate[0].key = ''
      } else if (val === 'RENEWDAYAFTERPAYOFFF') {
        this.renewalDate[0].value = ''
      }
    },
    // 获取合同规则
    getPurchase() {
      queryPurchaseConf().then(res => {
        if (res.data.errorCode === 0) {
          this.contractAll = res.data
          this.packageSta = res.data.packageSta
          this.materialSta = res.data.materialSta
          this.exportSta = res.data.exportSta
          this.saveId = res.data.id
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },

    switchOff(val, value) {
      if (val === 'sellMaxNum' || val === 'backToClouePool' || val === 'purExpireRemind' || val === 'PERIODNUMREMIND' || val === 'RENEWDAYAFTERPAYOFFF') {
        this.isOpen = false
        var numData = {}
        if (val === 'sellMaxNum') {
          numData.value = JSON.stringify(this.sellMaxNum)
          numData.confKey = 'SELLMAXLISTNUM'
        }

        if (val === 'backToClouePool') {
          numData.value = JSON.stringify(this.backToClouePool)
          numData.confKey = 'BACKTOCLUEPOOLDAY'
        }

        if (val === 'purExpireRemind') {
          numData.value = JSON.stringify(this.validDate)
          numData.confKey = 'purExpireRemind'
        }

        if (val === 'PERIODNUMREMIND') {
          numData.value = JSON.stringify(this.courseHour)
          numData.confKey = 'PERIODNUMREMIND'
        }
        if (val === 'RENEWDAYAFTERPAYOFFF') {
          numData.value = JSON.stringify(this.renewalDate)
          numData.confKey = 'RENEWDAYAFTERPAYOFFF'
        }
        saveConf(numData).then(res => {
          if (res.data.errorCode === 0) {
            this.getSpu()
            this.$message.success(res.data.errorMessage)
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      } else {
        this.isOpen = true
        this.switchName = val
      }
    },
    cancelDialog() {
      this.isOpen = false
      if (this.first) {
        this.packageSta = this.contractAll.packageSta
      }
      if (this.second) {
        this.materialSta = this.contractAll.materialSta
      }
      if (this.third) {
        this.exportSta = this.contractAll.exportSta
      }
      if (this.fourth) {
        // this.renewalDate
        this.splitSta = this.splitContract && this.splitContract[0].status
      }
      if (this.fifth) {
        this.renewalStatus = this.renewalDate && this.renewalDate[0].status
      }
    },
    submit() {
      this.isOpen = false
      if (this.switchName === 'fourth' || this.switchName === 'fifth') {
        var postData = {}
        if (this.switchName === 'fourth') {
          this.splitContract[0].status = this.splitSta
          postData.value = JSON.stringify(this.splitContract)
          postData.confKey = 'EXTPURCHASESET'
        } else {
          this.renewalDate[0].status = this.renewalStatus
          this.renewalDate[0].text = '续费规则'
          this.renewalDate[0].key = 'renew'
          postData.value = JSON.stringify(this.renewalDate)
          postData.confKey = 'RENEWDAYAFTERPAYOFFF'
        }
        saveConf(postData).then(res => {
          if (res.data.errorCode === 0) {
            this.getSpu()
            this.$message.success(res.data.errorMessage)
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      } else {
        const data = {
          id: this.saveId,
          packageSta: this.packageSta,
          materialSta: this.materialSta,
          exportSta: this.exportSta
        }
        setPurchaseConf(data).then(res => {
          if (res.data.errorCode === 0) {
            this.getPurchase()
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  margin-bottom: 14px;
}
.el-input--mini {
  width: 120px;
}

.warn_text {
  margin: 10px 0 14px;
  color: #d0021b;
}

.save_icon {
  width: 14px;
  height: 13px;
  transition: all 0.3s;

  margin-right: 5px;
  /* background-color: aliceblue; */
  display: inline-block;
  background-image: url("../../../../../static/systemSet/save_icon.png");
  background-repeat: no-repeat;
  &:active {
    background-image: url("../../../../../static/systemSet/blue_save.png");
    background-repeat: no-repeat;
  }
}

.delete_icon {
  width: 14px;
  height: 13px;
  /* background-color: aliceblue; */
  display: inline-block;
  background-image: url("../../../../../static/systemSet/delete_icon.png");
  background-repeat: no-repeat;
  &:active {
    background-image: url("../../../../../static/systemSet/blue_delete.png");
    background-repeat: no-repeat;
  }
}
.contract_rules {
  margin-bottom: 20px;

  p {
    margin-bottom: 14px;
    color: #666;
    span {
      margin-right: 2px;
    }
  }
}
.contract_rules /deep/ {
  .el-input__suffix-inner {
    line-height: 32px;
  }
  .save_icon {
    margin-right: 5px;
  }
}

.stystemRuleInput /deep/ {
  .el-input--suffix .el-input__inner {
    padding-right: 40px;
  }
}
</style>
