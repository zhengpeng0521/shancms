<template>
  <div>
    <div class="attendance_container">
      <OrgSetBlock class="title">签到规则</OrgSetBlock>
      <div class="sign_rule">
        <i class="title_block" />
        <span class="title_text">当天约课未签到算</span>
        <el-popover
          placement="right"
          width="200"
          trigger="hover"
          content="对于存在排课但当天未签到学员，系统晚上12点自动标识为出勤还是旷课"
        >
          <i
            slot="reference"
            class="iconfont icon_ym_ts"
            style="color:#666"
          />
        </el-popover>
      </div>
      <el-radio-group
        v-model="signType"
        :style="{margin: '0 0 14px 58px'}"
      >
        <el-radio label="attendance">出勤</el-radio>
        <el-radio label="truant">旷课</el-radio>
      </el-radio-group>

      <div class="sign_rule">
        <i class="title_block" />
        <span class="title_text">允许家长远程签到</span>
        <el-popover
          placement="right"
          width="230"
          trigger="hover"
        >
          <div>
            <img
              :style="{width: '100%', height: 'auto'}"
              src="https://img.ishanshan.com/gimg/user/n///1558000142.png"
            >
            <p>开启后家校通的「扫码签到」页面显示「远程签到」按钮，并允许家长自主远程签到</p>
          </div>
          <i
            slot="reference"
            class="iconfont icon_ym_ts"
            style="color:#666"
          />
        </el-popover>
      </div>
      <el-switch
        v-model="allowSign[0].status"
        :style="{margin: '0 0 14px 58px'}"
        active-color="#46b6ee"
        active-value="1"
        inactive-value="0"
      />

      <OrgSetBlock class="title">考勤扣课规则</OrgSetBlock>

      <div class="text">
        <p><span>提示：</span></p>
        <p><span>1、扣除课时数量由课程设置决定</span></p>
        <p><span>2、若请假扣除课时，则补课不扣课时；相反，若请假不扣除课时，则补课扣课时。</span></p>

      </div>
      <table border="1">
        <tr>
          <th>考勤类型</th>
          <th>是否扣课时</th>
        </tr>
        <tr>
          <td>出勤</td>
          <td>
            <el-radio-group v-model="attendData[0].value">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>

          </td>
        </tr>
        <tr>
          <td>请假</td>
          <td>
            <el-radio-group v-model="attendData[1].value">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>

          </td>
        </tr>
        <tr>
          <td>旷课</td>
          <td>
            <el-radio-group v-model="attendData[2].value">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>

          </td>
        </tr>

      </table>

      <OrgSetBlock class="title title_two">托班请假设置</OrgSetBlock>

      <el-radio-group
        v-model="attendData[attendData.length - 1].value"
        class="radioBlock"
      >
        <el-radio label="1">一律不延期</el-radio>
        <el-radio label="0"> 假期天数大于等于
          <el-input
            v-model="attendData[attendData.length - 1].postpone"
            style="width:100px"
        />天,则将合同结束日期延长所请假天数</el-radio>
      </el-radio-group>

      <OrgSetBlock class="title title_two">考勤修改限制</OrgSetBlock>
      <div style="vertical-align:middele;color:#666">
        <el-switch
          v-model="attendSwitch"
          :style="{margin: '0 10px 6px 0'}"
          active-color="#46b6ee"
          active-value="1"
          inactive-value="0"
          @change="switchOff('first')"
        />
        <span class="time-picker-container">
          <span>每月</span>
          <el-input
            :disabled="attendSwitch ==='0' "
            v-model="attendTime"
            min="1"
            max="15"
            type="Number"
            maxlength="2"
            style="width:100px;margin-right:6px"
            @blur="checkAttendTime"
          />日
          <el-time-picker
            :disabled="attendSwitch ==='0' "
            v-model="initTime"
            placeholder="请选择时间点"
            format="HH:mm"
            value-format="HH:mm"
            style="margin:0 10px;width:120px;display:none"
          />
          <span>不可对上月及历史考勤做修改(默认时间为00:00)</span>
        </span>
      </div>

    </div>

    <div class="save_btn_box">

      <el-button
        :loading="btnLoading"
        type="primary"
        @click="saveRules"
      >
        保存
      </el-button>
    </div>
    <el-dialog
      :visible.sync="isOpen"
      title="签到考勤规则设置"
      @close="cancelDialog"
    >
      <div v-if="first">
        <p>
          确认{{ attendSwitch==='1'?'开启自定义修改限制':'禁止使用自定义规则' }}吗？
        </p>
        <p class="warn_text">
          {{ attendSwitch==='1'?'开启':'禁用' }}后，{{ attendSwitch==='1'?'将关闭系统规则':'将开启系统规则' }}（默认15天前考勤数据不可修改）
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
import { saveConf, queryByKey } from '@/api/orgSet/systemSet'
export default {
  components: { OrgSetBlock },

  data() {
    return {
      radio: 1,
      btnLoading: false,
      attendData: [
        { value: '1', text: '出勤' },
        { value: '1', text: '请假' },
        { value: '1', text: '旷课' },
        { value: '1', text: '托班请假设置' }
      ],
      attendTime: 3,
      initTime: '00:00',
      signRule: [
        { key: 'truant', status: '0', text: '旷课' },
        { key: 'attendance', status: '1', text: '出勤' }
      ],
      allowSign: [{ key: 'tabExit', status: '0', value: '是否开启H5签到按钮' }],
      allowAttendanceModif: [{ key: 'signUpdateSet', status: '0', value: '考勤修改限制' }],
      attendSwitch: '0', // 考勤修改开关
      switchName: '',
      isOpen: false
    }
  },

  computed: {
    signType: {
      get() {
        let type = 'attendance'
        this.signRule.forEach(item => {
          if (item.status === '1') {
            type = item.key
          }
        })
        return type
      },
      set(newValue) {
        this.signRule.forEach(item => {
          if (item.key === newValue) {
            item.status = '1'
          } else {
            item.status = '0'
          }
        })
      }
    },
    first() {
      if (this.switchName === 'first') {
        return true
      } else {
        return false
      }
    }
  },
  mounted() {
    this.getRules()
    this.getNoSign()
    this.getAllowSign()
    this.getAttendanceLimit()
  },
  methods: {
    switchOff(value) {
      if (value === 'first') {
        this.isOpen = true
        this.switchName = 'first'
      }
    },
    cancelDialog() {
      this.isOpen = false
      if (this.first) {
        this.attendSwitch = this.allowAttendanceModif[0].status
      }
    },
    submit() {
      this.isOpen = false
      this.saveAttendanceModfiy()
    },
    /** 约课未签到 */
    getNoSign() {
      const data = {
        confKey: 'SYSSIGNTYPE'
      }
      queryByKey(data).then(res => {
        if (res.data.errorCode === 0) {
          this.signRule = res.data.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    /** 远程签到 */
    getAllowSign() {
      const data = {
        confKey: 'PARENTSIGNSET'
      }
      queryByKey(data).then(res => {
        if (res.data.errorCode === 0) {
          this.allowSign = res.data.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    // 考勤修改限制
    getAttendanceLimit() {
      const data = {
        confKey: 'CPSIGNUPDATERULE'
      }
      queryByKey(data).then(res => {
        if (res.data.errorCode === 0) {
          this.allowAttendanceModif = res.data.data.results
          this.attendSwitch = this.allowAttendanceModif[0].status
          this.attendTime = this.allowAttendanceModif[0].value.split(' ')[0]
          this.initTime = this.allowAttendanceModif[0].value.split(' ')[1]
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    getRules() {
      const data = {
        confKey: 'DEDUCTCOST'
      }
      queryByKey(data).then(res => {
        if (res.data.errorCode === 0) {
          this.attendData = res.data.data.results
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    checkAttendTime() {
      if (this.attendTime < 1) this.attendTime = 1
      if (this.attendTime > 15) this.attendTime = 15
    },
    saveRules() {
      const data = {
        value: JSON.stringify(this.attendData),
        confKey: 'DEDUCTCOST'
      }
      this.btnLoading = true
      saveConf(data).then(res => {
        if (res.data.errorCode === 0) {
          this.saveNosign()
          this.saveAttendanceModfiy()
        } else {
          this.$message.error(res.data.errorMessage)
          this.btnLoading = false
        }
      })
    },
    /** 保存考勤修改限制 */
    saveAttendanceModfiy() {
      this.allowAttendanceModif[0].value = this.attendTime + ' ' + this.initTime
      this.allowAttendanceModif[0].status = this.attendSwitch
      const data = {
        value: JSON.stringify(this.allowAttendanceModif),
        confKey: 'CPSIGNUPDATERULE'
      }
      saveConf(data).then(res => {
        if (res.data.errorCode === 0) {
          this.getAttendanceLimit()
        } else {
          this.$message.error(res.data.errorMessage)
          this.btnLoading = false
        }
      })
    },
    /** 保存约课未签到 */
    saveNosign() {
      const data = {
        value: JSON.stringify(this.signRule),
        confKey: 'SYSSIGNTYPE'
      }
      saveConf(data).then(res => {
        if (res.data.errorCode === 0) {
          this.saveAllowSign()
        } else {
          this.$message.error(res.data.errorMessage)
          this.btnLoading = false
        }
      })
    },

    /** 保存远程签到 */
    saveAllowSign() {
      const data = {
        value: JSON.stringify(this.allowSign),
        confKey: 'PARENTSIGNSET'
      }

      saveConf(data).then(res => {
        if (res.data.errorCode === 0) {
          this.getRules()
          this.getNoSign()
          this.getAllowSign()
          this.$message.success(res.data.errorMessage)
        } else {
          this.$message.error(res.data.errorMessage)
        }
        this.btnLoading = false
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: 14px;
}
.title_two {
  margin-top: 20px;
}
.title_box {
  margin-bottom: 14px;
  color: #333333;
}
table {
  border-collapse: collapse;
}
.warn_text {
  margin: 10px 0 14px;
  color: #d0021b;
}
table,
td,
th {
  border: 1px solid #ccc;
}

table {
  width: 600px;
}
th {
  height: 40px;
}
td {
  height: 40px;
  text-align: center;
}

p {
  line-height: 22px;
  color: #666666;
}

.text {
  margin-bottom: 10px;
}
.radioBlock {
  margin-bottom: 10px;
  .el-radio,
  .el-radio__inner,
  .el-radio__input {
    display: block;
    line-height: 28px;
  }
  .el-radio + .el-radio {
    margin-left: 0;
  }
}

.attendance_container {
  height: calc(100vh - 204px);
  overflow: auto;
  border-bottom: 1px solid #ddd;
}

.save_btn_box {
  position: fixed;
  bottom: 20px;
  left: 190px;
}

.sign_rule {
  color: #666;
  display: flex;
  align-items: center;
  margin: 0 0 14px 50px;

  .title_block {
    display: block;
    width: 8px;
    height: 14px;
    background: #46b6ee;
    border-radius: 4px;
    margin-right: 6px;
  }

  .title_text {
    margin-right: 5px;
  }
}
</style>

