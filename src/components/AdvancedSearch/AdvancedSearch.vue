/**
 * 高级搜索
 * props:
 *   onSearch           点击搜索    Func
 *   onClear            点击清除    Func
 *   fields:            搜索表单    Array
 *     [{
 *        type          类型        Str       值：input 输入/select 选择/datePicker 日期/timePicker 时间/dateTimePicker 日期时间
 *        key           表单id      Str
 *        name          表单提交Name Aarray|str 默认是key值, 数组为[ 'startTime' , 'endTime' ]形式
 *        label         表单标题    Str
 *        clearable     清空        Bool
 *        placeholder   占位        Str       当为日期范围时，设置startPlaceholder和endPlaceholder
 *        options       子选项      Array     当type='select'时使用 [{ [value]: 值, [label]: 显示的选项 }]
 *        optionValue   选项value   Str       当前的value, 默认为value
 *        optionLabel   选项label   Str       当前的label, 默认为label
 *        isAsync       选择框是否异步 Bool    当type='select'时使用
 *        url           异步地址     Str       当isAsync=true时必须
 *        asyncParams   异步参数     Obj
 *        format        日期格式     Str       当type='datePicker'时使用,默认yyyy-MM-dd
 *        valueFormat   日期值的格式 Str       同format
 *        pickerOptions 日期特有选项 Obj       当type='datePicker'时使用  比如：禁选日期
 *        isRange       是否时间范围 Bool      当type='timePicker'或者'dateTimePicker'时使用
 *        defaultTime   默认时间     Str/Array 当type='dateTimePicker'时使用
 *     }]
 */
<template>
  <div class="super-search">
    <transition
      name="el-fade-in-linear"
      mode="out-in"
    >
      <a
        v-if="!isVisible"
        key="show"
        @click="showTiggerSuper"
      >高级搜索</a>
      <a
        v-else
        key="close"
        @click="(e)=>closeTiggerSuper"
      >关闭高级搜索</a>
    </transition>
    <transition name="slide-fade">
      <div
        v-show="isVisible"
        ref="superModal"
        class="side-dialog"
        @click="clikFun"
      >
        <div class="search">
          <div class="search-head">高级搜索</div>
          <i
            class="el-icon-close"
            @click="closeTiggerSuper"
          />
        </div>
        <div>
          <el-form
            ref="superSearch"
            :model="ruleForm"
            label-position="top"
            label-width="260px"
          >
            <div class="super-form">
              <el-form-item
                v-for="(field, index) in fields"
                :label="field.label"
                :prop="field.key"
                :key="'super' + index"
                class="form-item"
              >
                <!-- 输入框 -->
                <el-input
                  v-if="field.type == 'input'"
                  v-model="ruleForm[field.key]"
                  :placeholder="field.placeholder || '请输入'+field.label"
                  :clearable="field.clearable !== undefined ? field.clearable : true"
                />
                <!-- 选择框 -->
                <AsyncSelect
                  v-else-if="field.type == 'select'"
                  :field="field"
                  :params="ruleForm"
                  :class-name="'super-all-width'"
                  :pop-class="'super-select-popover'"
                />
                <!-- 日期选择 -->
                <el-date-picker
                  v-else-if="field.type == 'datePicker'"
                  v-model="ruleForm[field.key]"
                  :placeholder="field.placeholder || '请选择'+field.label"
                  :start-placeholder="field.startPlaceholder || '开始日期'"
                  :end-placeholder="field.endPlaceholder || '结束日期'"
                  :clearable="field.clearable === undefined ? true : field.clearable"
                  :format="field.format || 'yyyy-MM-dd'"
                  :value-format="field.valueFormat || 'yyyy-MM-dd'"
                  :picker-options="field.pickerOptions"
                  :type="field.dateType || 'date'"
                  unlink-panels
                  align="right"
                  range-separator="~"
                  popper-class="super-date-picker"
                  class="super-all-width"
                />
                <!-- 时间选择 -->
                <el-time-picker
                  v-else-if="field.type == 'timePicker'"
                  v-model="ruleForm[field.key]"
                  :picker-options="field.pickerOptions"
                  :clearable="field.clearable === undefined ? true : field.clearable"
                  :placeholder="field.placeholder || '请选择'+field.label"
                  :start-placeholder="field.startPlaceholder || '开始时间'"
                  :end-placeholder="field.endPlaceholder || '结束时间'"
                  :value-format="field.valueFormat || 'HH:mm:ss'"
                  :format="field.format || 'HH:mm:ss'"
                  :is-range="field.isRange"
                  align="right"
                  range-separator="~"
                  popper-class="super-date-picker"
                  class="super-all-width"
                  unlink-panels
                />
                <!-- 日期时间选择 -->
                <el-date-picker
                  v-else-if="field.type == 'dateTimePicker'"
                  v-model="ruleForm[field.key]"
                  :placeholder="field.placeholder || '请选择'+field.label"
                  :start-placeholder="field.startPlaceholder || '开始日期'"
                  :end-placeholder="field.endPlaceholder || '结束日期'"
                  :clearable="field.clearable === undefined ? true : field.clearable"
                  :format="field.format || 'yyyy-MM-dd HH:mm:ss'"
                  :value-format="field.valueFormat || 'yyyy-MM-dd HH:mm:ss'"
                  :picker-options="field.pickerOptions"
                  :type="field.isRange ? 'datetimerange' : 'datetime'"
                  :default-time="field.defaultTime"
                  unlink-panels
                  align="right"
                  range-separator="~"
                  popper-class="super-date-picker"
                  class="super-all-width"
                />
              </el-form-item>
            </div>
            <el-form-item class="form-btn">
              <el-button
                type="primary"
                @click="submitForm"
              >搜索</el-button>
              <el-button @click="resetForm">清除</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import AsyncSelect from './AsyncSelect'

export default {
  components: {
    AsyncSelect
  },
  props: {
    fields: {
      type: Array,
      required: true
    },
    onClear: {
      type: Function,
      required: true
    },
    onSearch: {
      type: Function,
      required: true
    }
  },
  data() {
    const ruleForm = {}
    this.$props.fields.forEach((field) => {
      ruleForm[field.key] = undefined
    })
    return {
      clikTarget: {},
      isVisible: false,
      ruleForm
    }
  },
  mounted() {
    window.addEventListener('click', this.handleClik)
    const side = this.$refs.superModal
    document.body.appendChild(side)
  },
  beforeDestroy() {
    window.removeEventListener('click', this.handleClik)
    const child = this.$el
    const side = this.$refs.superModal
    side.style.cssText = 'display:none'
    child.parentNode && child.parentNode.removeChild(child)
  },
  methods: {
    clikFun(e) {
      this.clikTarget = e.target
    },
    handleClik(e) {
      if (this.isVisible && this.clikTarget !== e.target) {
        this.isVisible = false
        // this.isVisible = false
      }
    },
    /** 显示隐藏 */
    showTiggerSuper(e) {
      this.isVisible = true
      this.clikTarget = e.target
    },
    closeTiggerSuper(e) {
      this.isVisible = false
      this.clikTarget = e.target
    },
    /** 表单提交 */
    submitForm() {
      this.$refs.superSearch.validate((valid) => {
        if (valid) {
          const params = {}
          this.$props.fields.forEach(field => {
            const value = this.ruleForm[field.key]
            if (value) {
              const fieldName = field.name || field.key
              if (fieldName instanceof Array) {
                fieldName.forEach((name, index) => {
                  params[name] = value[index]
                })
              } else {
                params[fieldName] = value
              }
            }
          })
          this.$props.onSearch(params)
        } else {
          return false
        }
      })
    },
    /** 重置 */
    resetForm() {
      // this.$refs.superSearch.resetFields()
      const ruleForm = {}
      this.$props.fields.forEach((field) => {
        ruleForm[field.key] = undefined
      })
      this.ruleForm = ruleForm
      this.$props.onClear()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.super-search {
  display: inline-block;
  margin-left: 20px;
  line-height: 28px;
  vertical-align: top;
  a {
    color: #1d9df2;
    &:hover {
      color: #56c0f5;
    }
  }
}
.side-dialog {
  height: calc(100vh - 190px);
  border: 1px solid rgba(238, 238, 238, 1);
  bottom: 0;
  right: 0;
  z-index: 3000;
  width: 300px;
  position: absolute;
  margin-left: -20px;
  background-color: #ffffff;
  -moz-box-shadow: 2px 2px 5px #333333;
  -webkit-box-shadow: 2px 2px 5px #333333;
  box-shadow: 2px 2px 5px #333333;
  // 搜索主体
  .search {
    padding: 14px;
    font-size: 16px;
    color: #333;
    border-bottom: 1px solid #ddd;
    .search-head {
      display: inline-block;
    }
    .el-icon-close {
      margin-left: 0.3rem;
      line-height: 19px;
      transform: rotate(-90deg);
      transition: 0.5s;
      color: #666666;
      float: right;
      cursor: pointer;
    }
    .el-icon-close:hover {
      transform: rotate(90deg);
      transition: 0.5s;
    }
  }
}
.super-form {
  padding: 0 20px;
  max-height: calc(100vh - 316px);
  overflow: auto;
}
.form-item {
  margin-top: 30px;
}
.super-all-width {
  width: 100%;
}
.form-btn {
  margin-top: 36px;
  padding: 0 20px;
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 0.6s ease;
}
.slide-fade-leave-active {
  transition: all 0.6s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(1000px);
  opacity: 0;
}
</style>
<style rel="stylesheet/scss" lang="scss">
.super-select-popover {
  z-index: 4000 !important;
}
.super-date-picker {
  z-index: 4000 !important;
}
.form-item {
  .el-form-item__label {
    font-size: 14px;
    color: #666;
    font-weight: 400;
    line-height: 14px;
    padding-bottom: 6px;
  }
  .el-input--prefix .el-input__inner {
    padding: 0 15px;
  }
}
</style>
