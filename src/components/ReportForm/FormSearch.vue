<template>
  <div class="export-box report-form-search">
    <el-form
      ref="formSearch"
      :model="formSearch"
      inline
    >
      <el-form-item prop="date">
        <el-date-picker
          v-if="!DateType"
          v-model="formSearch.date"
          :picker-options="pickerOptions"
          :clearable="false"
          type="daterange"
          unlink-panels
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="report-date-picker"
        />
        <el-date-picker
          v-else-if="DateType === 'month'"
          v-model="formSearch.date"
          :picker-options="monthOptions"
          :clearable="false"
          type="month"
          unlink-panels
          placeholder="选择月"
          class="report-month-picker"
        />
      </el-form-item>
      <el-form-item
        v-for="(field, index) in extraForm"
        :prop="field.key"
        :key="'report' + index"
        :style="field.type == 'input' && hidden !== field.key ? { marginRight: 0 } : {}"
      >
        <!-- 输入框 -->
        <el-input
          v-if="field.type == 'input' && hidden === field.key"
          v-model="ruleForm[field.key]"
          :placeholder="field.placeholder || '请输入'+field.label"
          :clearable="!!field.clearable ? field.clearable : true"
          class="common-form-width"
        />
        <!-- 选择框 -->
        <AsyncSelect
          v-else-if="field.type == 'select'"
          :field="field"
          :params="ruleForm"
          :select-change="selectChange"
          class="common-form-width"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          icon="el-icon-picture-outline"
          @click="onSearch"
        >{{ loading ? '统计中' : '更新报表' }}</el-button>
      </el-form-item>
    </el-form>
    <Media :query="{minWidth: mediaWidth}">
      <div>
        <el-button
          v-if="!!exportFile"
          class="media-right"
          type="primary"
          icon="el-icon-document"
          @click="exportFile"
        >按查询结果导出</el-button>
        <div
          v-else-if="monthExport"
          class="media-right"
        >
          <el-button
            type="primary"
            icon="el-icon-document"
            @click="exportCourse"
          >按课程维度导出</el-button>
          <el-button
            type="primary"
            icon="el-icon-document"
            @click="exportVip"
          >按会员卡导出</el-button>
        </div>
      </div>
    </Media>
    <Media :query="{maxWidth: mediaWidth}">
      <div>
        <el-button
          v-if="!!exportFile"
          type="primary"
          icon="el-icon-document"
          @click="exportFile"
        >按查询结果导出</el-button>
        <div v-else-if="monthExport">
          <el-button
            type="primary"
            icon="el-icon-document"
            @click="exportCourse"
          >按课程维度导出</el-button>
          <el-button
            type="primary"
            icon="el-icon-document"
            @click="exportVip"
          >按会员卡导出</el-button>
        </div>
      </div>
    </Media>
  </div>
</template>
<script>
import Media from 'vue-media'
import AsyncSelect from '../AdvancedSearch/AsyncSelect'
import { fmtDateFormat } from '@/utils/dateFormat'

export default {
  components: {
    Media,
    AsyncSelect
  },
  props: {
    // 加载状态
    loading: {
      type: Boolean,
      required: true
    },
    // 宽度
    mediaWidth: {
      type: Number,
      default: 900
    },
    // 日期默认值
    defaultDate: {
      type: Array,
      default: undefined
    },
    // 点击搜索
    searchHandle: {
      type: Function,
      required: true
    },
    // 额外表单
    extraForm: {
      type: Array,
      default: undefined
    },
    // 导出
    exportFile: {
      type: Function,
      default: undefined
    },
    // 日期选择器类型
    DateType: {
      type: String,
      default: undefined
    },
    // 课时月结表专用
    monthExport: {
      type: Boolean,
      default: false
    },
    // 课时月结表专用
    exportCourse: {
      type: Function,
      default: undefined
    },
    // 课时月结表专用
    exportVip: {
      type: Function,
      default: undefined
    }
  },
  data() {
    const now = new Date()
    const ruleForm = {}
    this.$props.extraForm && this.$props.extraForm.forEach((field) => {
      if (field.initValue) {
        ruleForm[field.key] = field.initValue
      }
      ruleForm[field.key] = undefined
    })
    return {
      hidden: undefined,
      monthOptions: {
        disabledDate(current) {
          if (current < now) {
            return false
          } else {
            return true
          }
        }
      },
      pickerOptions: {
        firstDayOfWeek: 1,
        shortcuts: [{
          text: '今日',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime())
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '昨日',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24)
            end.setTime(end.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '近7日',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '近30日',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '本周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            const num = start.getDay() - 1
            start.setTime(start.getTime() - 3600 * 1000 * 24 * num)
            end.setTime(start.getTime() + 3600 * 1000 * 24 * 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '本月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            const y = start.getFullYear()
            const m = start.getMonth()
            start.setTime(new Date(y, m, 1))
            end.setTime(new Date(y, m + 1, 0))
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '上月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            const y = start.getFullYear()
            const m = start.getMonth()
            start.setTime(new Date(y, m - 1, 1))
            end.setTime(new Date(y, m, 0))
            picker.$emit('pick', [start, end])
          }
        }]
      },
      formSearch: {
        date: this.DateType ? now : (this.$props.defaultDate || [now, now])
      },
      ruleForm
    }
  },

  mounted() {
    if (this.defaultDate) {
      this.formSearch.date = this.defaultDate
    }
  },

  methods: {
    onSearch() {
      this.$refs.formSearch.validate((valid) => {
        if (valid) {
          if (this.DateType) {
            const value = { ...this.formSearch }
            value.date = fmtDateFormat(value.date, 'yyyy-MM')
            this.$props.searchHandle(value, this.ruleForm)
          } else {
            // 深拷贝，防止源数据变动
            const values = { date: [...this.formSearch.date] }
            values.date[0] = fmtDateFormat(values.date[0], 'yyyy-MM-dd')
            values.date[1] = fmtDateFormat(values.date[1], 'yyyy-MM-dd')
            // params: 1.时间, 2.额外表单值
            this.$props.searchHandle(values, this.ruleForm)
          }
        } else {
          return false
        }
      })
    },
    selectChange(value, control) {
      if (control) {
        if (control.value === value) {
          this.hidden = control.key
        } else {
          this.hidden = undefined
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.report-date-picker {
  width: 240px;
}
.report-month-picker {
  width: 160px;
}
.report-all-width {
  width: 140px;
}
.export-box {
  position: relative;
}
.media-right {
  position: absolute;
  top: 0;
  right: 0;
}
.common-form-width {
  width: 140px;
}
</style>

<style lang="scss">
.report-month-picker .el-input__inner {
  padding-left: 15px;
}
.report-form-search {
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 20px;
  }
}
</style>
