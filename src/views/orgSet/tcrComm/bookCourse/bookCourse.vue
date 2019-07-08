<template>
  <div class="book_course">
    <el-button
      type="primary"
      class="save_btn"
      @click="submitCourse('formData')"
    >
      保存
    </el-button>
    <el-form
      ref="formData"
      :model="formData"
      :rules="rules"
      label-width="160px"
    >
      <div class="line_title"><span class="form_txt" />
        家长自主约课时限</div>
      <el-form-item label-width="60px">
        <el-radio-group
          v-model="formData.bookConfig"
          @change="timeLimit"
        >
          <el-radio label="1">限制规则</el-radio>
          <el-radio label="2">不限制</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-if="formData.bookConfig=='1'">
        <el-form-item
          prop="bookDay"
          label-width="60px"
        >
          <span class="decs_input"> 家长可以约</span>
          <el-input
            v-model="formData.bookDay"
            class="cancel_times"
          />
          <span class="decs_input"> 天以内的课程
          </span>

        </el-form-item>

        <el-form-item
          prop="bookStop"
          label-width="60px"
        >
          <span class="decs_input"> 课程开始前
          </span>

          <el-input
            v-model="formData.bookStop"
            class="cancel_times"
          />
          <span class="decs_input"> 小时停止预约
          </span>

        </el-form-item>

      </div>

      <div
        :style="{marginTop: '6px'}"
        class="line_title"
      ><span class="form_txt" />
        家长自主约课是否允许取消</div>
      <el-form-item
        label-width="60px"
        prop="rollbackConf"
      >
        <el-radio-group
          v-model="formData.rollbackConf"
          @change="orderCancel"
        >
          <el-radio label="1">允许取消</el-radio>
          <el-radio label="2">不允许取消</el-radio>

        </el-radio-group>

      </el-form-item>
      <div v-if="formData.rollbackConf=='1'">
        <el-form-item
          prop="rollbackNum"
          label="可取消次数："
        >
          <span class="decs_input"> 每天可取消
          </span>

          <el-input
            v-model="formData.rollbackNum"
            class="cancel_times"
          />

          <span class="decs_input"> 次（请输入1-10范围内整数）
          </span>

        </el-form-item>

        <el-form-item
          prop="rollbackTime"
          label="可取消时间："
        > <span class="decs_input"> 上课前
        </span>

          <el-input
            v-model="formData.rollbackTime"
            class="cancel_times"
          />
          <el-select
            v-model="formData.rollbackTimeType"
            class="cancel_times select_times"
            placeholder="请选择"
            filterable
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <span class="decs_input"> 可取消约课
          </span>

        </el-form-item>
      </div>

    </el-form>
  </div>
</template>

<script>
import { changeBookCource, bookCourseConf } from '@/api/orgSet/tcrComm' //eslint-disable-line
export default {
  data() {
    return {
      formData: {
        bookDay: '7',
        bookStop: '12',
        bookConfig: '1',
        rollbackConf: '1',

        rollbackNum: '10',
        rollbackTime: '24',
        rollbackTimeType: 'hour'
      },
      rules: {
        bookDay: [{ required: true, message: '请输入可预约天数', trigger: 'change' }],
        bookStop: [{ required: true, message: '请输入停止预约时间', trigger: 'change' }],
        rollbackNum: [{ required: true, message: '请输入可取消次数', trigger: 'change' },
          { pattern: /^([1-9]|10)$/, message: '请输入1-10范围内的整数' }],
        rollbackTime: [{ required: true, message: '请输入可取时间', trigger: 'change' }]
      },

      options: [{
        value: 'hour',
        label: '小时'
      }, {
        value: 'day',
        label: '天'
      }],
      value: ''
    }
  },
  mounted() {
    this.getBookCourse()
  },
  methods: {
    /** 自主约课时限change */
    timeLimit(value) {
      if (value === '1') {
        this.formData.bookDay = this.formData.bookDay || '7'
        this.formData.bookStop = this.formData.bookStop || '12'
      }
    },

    /** 自主约课取消change */
    orderCancel(value) {
      if (value === '1') {
        this.formData.rollbackNum = this.formData.rollbackNum || '10'
        this.formData.rollbackTime = this.formData.rollbackTime || '24'
        this.formData.rollbackTimeType = this.formData.rollbackTimeType || 'hour'
      }
    },

    getBookCourse() {
      bookCourseConf().then(res => {
        if (res.data.errorCode === 0) {
          this.formData = {
            ...res.data.obj,
            bookConfig: res.data.obj.bookConfig || '1',
            rollbackConf: res.data.obj.rollbackConf || '1'
          }
          if (this.formData.bookDay === '' || !this.formData.bookDay) {
            this.formData.bookDay = '7'
          }
          if (this.formData.bookStop === '' || !this.formData.bookStop) {
            this.formData.bookStop = '12'
          }
          if (this.formData.rollbackNum === '' || !this.formData.rollbackNum) {
            this.formData.rollbackNum = '10'
          }
          if (this.formData.rollbackTime === '' || !this.formData.rollbackTime) {
            this.formData.rollbackTime = '24'
          }
          if (this.formData.rollbackTimeType === '' || !this.formData.rollbackTimeType) {
            this.formData.rollbackTimeType = 'hour'
          }
        } else {
          this.$message.error(res.data.errorMessage)
        }
      })
    },
    // 确认提交
    submitCourse(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          delete this.formData.confKey
          delete this.formData.results
          delete this.formData.value
          delete this.formData.data
          const formData = { ...this.formData }
          if (this.formData.bookConfig === '2') {
            delete formData.bookDay
            delete formData.bookStop
          }
          if (this.formData.rollbackConf === '2') {
            delete formData.rollbackNum
            delete formData.rollbackTime
            delete formData.rollbackTimeType
          }
          const data = {
            value: JSON.stringify(formData)
          }
          changeBookCource(data).then(res => {
            if (res.data.errorCode === 0) {
              this.$message.success('保存成功')
            } else {
              this.$message.error(res.data.errorMessage)
            }
          })
        } else {
          return false
        }
      })
    }

  }
}
</script>
<style lang="scss">
.book_course {
  .save_btn {
    position: fixed;
    bottom: 20px;
    left: 190px;
  }

  .decs_input {
    color: #666666 !important;
  }

  .el-form-item__label {
    font-weight: 400 !important;
  }

  .line_title {
    margin: 0 0 14px 50px;
  }
  .cancel_times {
    display: inline-block;
    width: 80px;
    padding: 0 2px;
  }
}
</style>
