/**
* 公用的日期搜索条件块
* commonDateOptions:
*   mainText: 主题名称
*   defaultDate: 初始日期数组, 传入[startTime, endTime], 格式为yyyy-MM-dd的字符串,例: ['2019-01-01', '2019-01-01']
*   options: 选项数组, 需要显示的选项, key值如下:
*       today: 今日
*       yesterday: 昨日
*       tomorrow: 明日
*       thisWeek: 本周
*       lastWeek: 上周
*       nextWeek: 下周
*       thisMonth: 本月
*       lastMonth: 上月
*       nextMonth: 下月
*   markText: 对象,属性名和options中的key对应, 显示项后的额外展示, 根据key值对应显示在option后面, 例: "今日(10)"
* commonDateReset: 重置成默认值事件
* @datePickerChange: 数组变更事件
*
*/
<template>
  <div class="time_picker_div">
    <span v-if="commonDateOptions.mainText">{{ commonDateOptions.mainText }}</span>
    <template v-for="(item, index) in commonDateOptions.options">
      <a
        v-if="item==='today'"
        :key="index"
        :class="[{active:checkedIndex === item},'common_date_search_daybtn']"
        alt=""
        @click="todayClick(item,index)"
      >
        今日
        <span
          v-if="commonDateOptions.markText.today >= 0"
          class="common_date_search_marktext"
        >({{ commonDateOptions.markText.today }})</span>
      </a>
      <a
        v-if="item==='yesterday'"
        :key="index"
        :class="[{active:checkedIndex === item},'common_date_search_daybtn']"
        alt=""
        @click="yesterdayClick(item,index)"
      >
        昨日
        <span
          v-if="commonDateOptions.markText.yesterday"
          class="common_date_search_marktext"
        >({{ commonDateOptions.markText.yesterday }})</span>
      </a>
      <a
        v-if="item==='tomorrow'"
        :key="index"
        :class="[{active:checkedIndex === item},'common_date_search_daybtn']"
        alt=""
        @click="tomorrowClick(item,index)"
      >
        明日
        <span
          v-if="commonDateOptions.markText.tomorrow"
          class="common_date_search_marktext"
        >({{ commonDateOptions.markText.tomorrow }})</span>
      </a>
      <a
        v-if="item==='thisWeek'"
        :key="index"
        :class="[{active:checkedIndex === item},'common_date_search_daybtn']"
        alt=""
        @click="thisWeekClick(item,index)"
      >
        本周
        <span
          v-if="commonDateOptions.markText.thisWeek"
          class="common_date_search_marktext"
        >({{ commonDateOptions.markText.thisWeek }})</span>
      </a>
      <a
        v-if="item==='lastWeek'"
        :key="index"
        :class="[{active:checkedIndex === item},'common_date_search_daybtn']"
        alt=""
        @click="lastWeekClick(item,index)"
      >
        上周
        <span
          v-if="commonDateOptions.markText.lastWeek"
          class="common_date_search_marktext"
        >({{ commonDateOptions.markText.lastWeek }})</span>
      </a>
      <a
        v-if="item==='nextWeek'"
        :key="index"
        :class="[{active:checkedIndex === item},'common_date_search_daybtn']"
        alt=""
        @click="nextWeekClick(item,index)"
      >
        下周
        <span
          v-if="commonDateOptions.markText.nextWeek"
          class="common_date_search_marktext"
        >({{ commonDateOptions.markText.nextWeek }})</span>
      </a>
      <a
        v-if="item==='thisMonth'"
        :key="index"
        :class="[{active:checkedIndex === item},'common_date_search_daybtn']"
        alt=""
        @click="thisMonthClick(item,index)"
      >
        本月
        <span
          v-if="commonDateOptions.markText.thisMonth >= 0"
          class="common_date_search_marktext"
        >({{ commonDateOptions.markText.thisMonth }})</span>
      </a>
      <a
        v-if="item==='lastMonth'"
        :key="index"
        :class="[{active:checkedIndex === item},'common_date_search_daybtn']"
        alt=""
        @click="lastMonthClick(item,index)"
      >
        上月
        <span
          v-if="commonDateOptions.markText.lastMonth"
          class="common_date_search_marktext"
        >({{ commonDateOptions.markText.lastMonth }})</span>
      </a>
      <a
        v-if="item==='nextMonth'"
        :key="index"
        :class="[{active:checkedIndex === item},'common_date_search_daybtn']"
        alt=""
        @click="nextMonthClick(item,index)"
      >
        下月
        <span
          v-if="commonDateOptions.markText.nextMonth"
          class="common_date_search_marktext"
        >({{ commonDateOptions.markText.nextMonth }})</span>
      </a>
    </template>
    <el-date-picker
      v-model="formSearch.date"
      :picker-options="pickerOptions"
      :clearable="false"
      type="daterange"
      unlink-panels
      value-format="yyyy-MM-dd"
      range-separator="~"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      class="report-date-picker"
      @change="timePickerChange"
    />
  </div>
</template>
<script>
export default{
  props: {
    commonDateOptions: {
      type: Object, // eslint-disable-line
      default: {} // eslint-disable-line
    }
  },
  data() {
    const shortcuts = []
    const dateOptions = this.commonDateOptions.options
    const myself = this
    for (var i in this.commonDateOptions.options) {
      if (dateOptions[i] === 'today') {
        shortcuts.push({
          text: '今日',
          onClick(e) {
            console.info(e)
            myself.todayClick(e)
          }
        })
      } else if (dateOptions[i] === 'yesterday') {
        shortcuts.push({
          text: '昨日',
          onClick(e) {
            myself.yesterdayClick(e)
          }
        })
      } else if (dateOptions[i] === 'tomorrow') {
        shortcuts.push({
          text: '明日',
          onClick(e) {
            myself.tomorrowClick(e)
          }
        })
      } else if (dateOptions[i] === 'thisWeek') {
        shortcuts.push({
          text: '本周',
          onClick(e) {
            myself.thisWeekClick(e)
          }
        })
      } else if (dateOptions[i] === 'lastWeek') {
        shortcuts.push({
          text: '上周',
          onClick(e) {
            myself.lastWeekClick(e)
          }
        })
      } else if (dateOptions[i] === 'nextWeek') {
        shortcuts.push({
          text: '下周',
          onClick(e) {
            myself.nextWeekClick(e)
          }
        })
      } else if (dateOptions[i] === 'thisMonth') {
        shortcuts.push({
          text: '本月',
          onClick(e) {
            myself.thisMonthClick(e)
          }
        })
      } else if (dateOptions[i] === 'lastMonth') {
        shortcuts.push({
          text: '上月',
          onClick(e) {
            myself.lastMonthClick(e)
          }
        })
      } else if (dateOptions[i] === 'nextMonth') {
        shortcuts.push({
          text: '下月',
          onClick(e) {
            myself.nextMonthClick(e)
          }
        })
      }
    }
    const defaultDate = this.commonDateOptions.defaultDate || []
    return {
      pickerOptions: {
        firstDayOfWeek: 1,
        shortcuts: shortcuts
      },
      formSearch: {
        date: defaultDate
      },
      checkedIndex: 0
    }
  },
  mounted() {
    console.info('commonDateOptions', this.commonDateOptions)
  },
  methods: {
    commonDateReset() {
      this.checkedIndex = this.commonDateOptions.clickIndex
      this.formSearch.date = this.commonDateOptions.defaultDate || []
      this.datePickerChange(this.commonDateOptions.defaultDate || [])
    },
    timePickerChange(e) {
      this.datePickerChange(this.formSearch.date)
    },
    datePickerChange(arr) {
      this.$emit('datePickerChange', arr)
    },
    todayClick(e, item, index) {
      this.checkedIndex = e
      const end = new Date()
      const start = new Date()
      this.formSearch.date = [start, end]
      this.datePickerChange([this.fmtDate(start), this.fmtDate(end)])
    },
    yesterdayClick(e, item, index) {
      this.checkedIndex = e
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24)
      end.setTime(end.getTime() - 3600 * 1000 * 24)
      this.formSearch.date = [start, end]
      this.datePickerChange([this.fmtDate(start), this.fmtDate(end)])
    },
    tomorrowClick(e, item, index) {
      this.checkedIndex = e
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() + 3600 * 1000 * 24)
      end.setTime(end.getTime() + 3600 * 1000 * 24)
      this.formSearch.date = [start, end]
      this.datePickerChange([this.fmtDate(start), this.fmtDate(end)])
    },
    thisWeekClick(e) {
      this.checkedIndex = e
      const end = new Date()
      const start = new Date()
      const num = start.getDay() - 1
      start.setTime(start.getTime() - 3600 * 1000 * 24 * num)
      end.setTime(start.getTime() + 3600 * 1000 * 24 * 6)
      this.formSearch.date = [start, end]
      this.datePickerChange([this.fmtDate(start), this.fmtDate(end)])
    },
    lastWeekClick(e) {
      this.checkedIndex = e
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      const num = start.getDay() - 1
      start.setTime(start.getTime() - 3600 * 1000 * 24 * num)
      end.setTime(start.getTime() + 3600 * 1000 * 24 * 6)
      this.formSearch.date = [start, end]
      this.datePickerChange([this.fmtDate(start), this.fmtDate(end)])
    },
    nextWeekClick(e) {
      this.checkedIndex = e
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() + 3600 * 1000 * 24 * 7)
      const num = start.getDay() - 1
      start.setTime(start.getTime() - 3600 * 1000 * 24 * num)
      end.setTime(start.getTime() + 3600 * 1000 * 24 * 6)
      this.formSearch.date = [start, end]
      this.datePickerChange([this.fmtDate(start), this.fmtDate(end)])
    },
    thisMonthClick(e) {
      this.checkedIndex = e
      const end = new Date()
      const start = new Date()
      const y = start.getFullYear()
      const m = start.getMonth()
      start.setTime(new Date(y, m, 1))
      end.setTime(new Date(y, m + 1, 0))
      this.formSearch.date = [start, end]
      this.datePickerChange([this.fmtDate(start), this.fmtDate(end)])
    },
    lastMonthClick(e) {
      this.checkedIndex = e
      const end = new Date()
      const start = new Date()
      const y = start.getFullYear()
      const m = start.getMonth()
      start.setTime(new Date(y, m - 1, 1))
      end.setTime(new Date(y, m, 0))
      this.formSearch.date = [start, end]
      this.datePickerChange([this.fmtDate(start), this.fmtDate(end)])
    },
    nextMonthClick(e) {
      this.checkedIndex = e
      const end = new Date()
      const start = new Date()
      const y = start.getFullYear()
      const m = start.getMonth()
      start.setTime(new Date(y, m + 1, 1))
      end.setTime(new Date(y, m + 2, 0))
      this.formSearch.date = [start, end]
      this.datePickerChange([this.fmtDate(start), this.fmtDate(end)])
    },
    fmtDate(date) {
      var y = 1900 + date.getYear()
      var m = '0' + (date.getMonth() + 1)
      var d = '0' + date.getDate()
      return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length)
    }
  }
}
</script>

<style lang="scss" scoped>
.active {
  color: #46b6ee !important;
  text-decoration: underline;
}
.report-date-picker {
  width: 240px;
  margin-left: 10px;
}
.common_date_search_daybtn {
  margin-left: 10px;
  color: #666;
  font-weight: 400;
  &:hover {
    color: #46b6ee;
  }
}
.common_date_search_marktext {
  color: rgba(70, 182, 238, 1);
}
</style>
