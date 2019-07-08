<template>
  <el-dialog
    :visible.sync="visible"
    title="续费提醒"
    @close="close"
  >
    <div class="renew_container">
      <p>
        <span>

          课时小于（包括）
          <el-input
            v-model="courseHour[0].key"
            placeholder="请输入"
          >

            <!-- <span
              v-show="courseHour[0].key"
              slot="suffix"
              class="save_icon cp transition-box"
              @click="saveInputData('PERIODNUMREMIND',courseHour)"
            /> -->
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

        <span>
          合同有效期小于（包括）

          <el-input
            v-model="validDate[0].key"
            placeholder="请输入天数"
          >

            <!-- <span
              v-show="validDate[0].key"
              slot="suffix"
              class="save_icon cp transition-box"
              @click="saveInputData('purExpireRemind',validDate)"
            /> -->
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
    <span slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="saveRenew"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveConf, queryByKey } from '@/api/orgSet/systemSet'

export default {
  props: {
    isShow: {
      type: Boolean,
      required: true
    }
  },

  data() {
    return {
      visible: false,
      loading: false,
      courseHour: [{ status: '', key: '' }], // 续费提醒课时
      validDate: [{ status: '', key: '' }], // 合同有效期提醒
      isOpen: false,
      switchName: '',
      studentRules: ['BACKTOCLUEPOOLDAY', 'SELLMAXLISTNUM', 'PERIODNUMREMIND', 'purExpireRemind']
    }
  },

  mounted() {
    this.getSpu()
  },

  methods: {
    close() {
      this.visible = false
      this.$emit('close')
    },

    // 获取规则们
    getSpu() {
      this.studentRules.forEach(v => {
        const data = {
          confKey: v
        }
        queryByKey(data).then(res => {
          if (res.data.errorCode === 0) {
            if (res.data.data.confKey === 'PERIODNUMREMIND') {
              this.courseHour = res.data.data.results
            }
            if (res.data.data.confKey === 'purExpireRemind') {
              this.validDate = res.data.data.results
            }
          } else {
            this.$message.error(res.data.errorMessage)
          }
        })
      })
    },

    /** 保存 */
    saveRenew() {
      const timeData = {
        value: JSON.stringify(this.courseHour),
        confKey: 'PERIODNUMREMIND'
      }
      const purData = {
        value: JSON.stringify(this.validDate),
        confKey: 'purExpireRemind'
      }
      this.loading = true
      saveConf(timeData).then(res => {
        if (res.data.errorCode === 0) {
          saveConf(purData).then(ret => {
            if (ret.data && ret.data.errorCode === 0) {
              this.getSpu()
              this.$message.success('保存成功！')
              this.visible = false
              this.$emit('close')
            }
          })
        } else {
          this.$message.error(res.data && res.data.errorMessage || '保存失败')
        }
        this.loading = false
      })
    },

    clearInput(val, value) {
      if (val === 'PERIODNUMREMIND') {
        this.courseHour[0].key = ''
      } else if (val === 'purExpireRemind') {
        this.validDate[0].key = ''
      }
    },

    saveInputData(val, value) {
      this.switchOff(val, value)
    },

    switchOff(val, packageSta) {
      if (val === 'purExpireRemind' || val === 'PERIODNUMREMIND') {
        this.isOpen = false
        const numData = {}

        if (val === 'purExpireRemind') {
          numData.value = JSON.stringify(this.validDate)
          numData.confKey = 'purExpireRemind'
        }

        if (val === 'PERIODNUMREMIND') {
          numData.value = JSON.stringify(this.courseHour)
          numData.confKey = 'PERIODNUMREMIND'
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
    }
  }
}
</script>

<style lang="scss" scoped>
.renew_container {
  p {
    margin-bottom: 14px;
  }
}

.renew_container /deep/ {
  .el-input__suffix-inner {
    line-height: 28px;
  }
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
</style>
